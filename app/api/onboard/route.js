import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { Resend } from 'resend'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
}

function randomChars(n) {
  return Math.random().toString(36).slice(2, 2 + n)
}

export async function POST(req) {
  try {
    const { companyName, email, docsText } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!companyName || companyName.trim().length === 0) {
      return Response.json({ error: 'Please enter your company name.' }, { status: 400 })
    }
    if (!docsText || docsText.trim().length === 0) {
      return Response.json({ error: 'Please add some documentation to index.' }, { status: 400 })
    }
    if (docsText.length > 500000) {
      return Response.json({ error: 'Documentation is too long. Please keep it under 500,000 characters.' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Return existing trial if email already used
    const { data: existing } = await supabase
      .from('trials')
      .select('client_id')
      .eq('email', email)
      .single()

    if (existing) {
      return Response.json({
        clientId: existing.client_id,
        demoUrl: '/demo/' + existing.client_id,
        chunkCount: 0,
        existing: true,
      })
    }

    const clientId = slugify(companyName) + '-' + randomChars(6)

    const chunks = docsText
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 80)
      .slice(0, 1000)

    const BATCH = 100
    const batches = []
    for (let i = 0; i < chunks.length; i += BATCH) {
      batches.push({ start: i, items: chunks.slice(i, i + BATCH) })
    }

    const results = await Promise.all(
      batches.map(async ({ start, items }) => {
        try {
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: items,
          })
          const rows = items.map((content, j) => ({
            content,
            embedding: embeddingResponse.data[j].embedding,
            client_id: clientId,
            metadata: { source: 'trial', company: companyName, email, client_id: clientId },
          }))
          const { data: inserted, error } = await supabase.from('documents').insert(rows).select('id')
          if (error) {
            console.error(`[onboard] Insert failed batch ${start}-${start + items.length}:`, error.message, error.details, error.hint)
            return 0
          }
          console.log(`[onboard] Inserted ${inserted?.length ?? 0} rows (batch ${start}-${start + items.length})`)
          return inserted?.length ?? 0
        } catch (err) {
          console.error(`[onboard] Embedding failed for batch ${start}-${start + items.length}:`, err.message)
          return 0
        }
      })
    )

    const indexed = results.reduce((sum, n) => sum + n, 0)

    if (chunks.length > 0 && indexed < chunks.length * 0.5) {
      return Response.json({ error: 'Indexing failed — please try again.' }, { status: 500 })
    }

    await supabase.from('trials').insert({
      client_id: clientId,
      company: companyName,
      email,
      chunk_count: indexed,
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        console.log('Attempting to send email to:', email)
        const { data, error: resendError } = await resend.emails.send({
          from: 'Triage <hello@triagehq.net>',
          to: email,
          subject: 'Your Triage agent is ready',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #080810; color: #f0f0f0; padding: 40px; border-radius: 16px;">
              <h1 style="color: #63ffb4; font-size: 24px; margin-bottom: 8px;">Your agent is live.</h1>
              <p style="color: #aaa; margin-bottom: 24px;">Hey ${companyName} — Triage has indexed your docs and your agent is ready to answer questions.</p>
              <a href="https://triagehq.net/demo/${clientId}" style="background: #63ffb4; color: #080810; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Talk to your agent →</a>
              <p style="color: #555; font-size: 12px; margin-top: 32px;">Your trial expires in 7 days. Reply to this email if you need help.<br>— Mohamed, Triage</p>
            </div>
          `,
        })
        console.log('Resend response:', JSON.stringify(data), JSON.stringify(resendError))
      } catch (err) {
        console.log('Resend error caught:', err.message)
      }
    }

    return Response.json({
      clientId,
      demoUrl: '/demo/' + clientId,
      chunkCount: indexed,
    })
  } catch (err) {
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
