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
    if (docsText.length > 100000) {
      return Response.json({ error: 'Documentation is too long. Please keep it under 100,000 characters.' }, { status: 400 })
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
      .slice(0, 300)

    let indexed = 0
    for (const chunk of chunks) {
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk,
        })
        await supabase.from('documents').insert({
          content: chunk,
          embedding: embeddingResponse.data[0].embedding,
          metadata: { source: 'trial', company: companyName, email, client_id: clientId },
        })
        indexed++
      } catch (_) {}
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
        await resend.emails.send({
          from: 'Triage <onboarding@triagehq.net>',
          to: email,
          subject: 'Your Triage demo is ready',
          text: `Hey ${companyName},\n\nYour Triage agent is live. Ask it anything:\nhttps://triagehq.net/demo/${clientId}\n\nYour trial expires in 7 days. Reply to this email if you need help.\n\n— Mohamed`,
        })
      } catch (_) {}
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
