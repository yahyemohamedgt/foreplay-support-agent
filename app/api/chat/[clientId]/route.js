import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

const rateLimitMap = new Map()

export async function POST(req, { params }) {
  const { clientId } = await params

  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const entry = rateLimitMap.get(ip) ?? { count: 0, start: now }
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now }
  entry.count += 1
  rateLimitMap.set(ip, entry)
  if (entry.count > 20) {
    return Response.json({ answer: 'Too many requests — please wait before trying again.' }, { status: 429 })
  }

  try {
    const supabase = getSupabase()

    const { data: trial } = await supabase
      .from('trials')
      .select('*')
      .eq('client_id', clientId)
      .single()

    if (!trial) {
      return Response.json({ answer: 'Demo not found.' }, { status: 404 })
    }
    if (new Date(trial.expires_at) < new Date()) {
      return Response.json({ answer: 'Your 7-day trial has ended. Book a call to continue: https://calendly.com/yahye-mohamed-gt/30min' }, { status: 403 })
    }
    if (trial.query_count >= 500) {
      return Response.json({ answer: 'You\'ve reached the 500 question limit for this trial. Book a call to continue: https://calendly.com/yahye-mohamed-gt/30min' }, { status: 429 })
    }

    const { question } = await req.json()

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
    })
    const embedding = embeddingResponse.data[0].embedding

    const { data: chunks } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.2,
      match_count: 10,
      client_id: clientId,
    })

    const context = chunks?.map(c => c.content).join('\n\n') || ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful support agent for ${trial.company}.
Answer questions using the documentation context provided below.
Even if the context is partial or fragmented, do your best to synthesize a helpful answer from what is available.
Only say "I don't have enough information to answer that — let me connect you with the team." if the context contains absolutely nothing relevant.
Keep answers concise and clear.

Context:
${context}`,
        },
        { role: 'user', content: question },
      ],
    })

    const answer = completion.choices[0].message.content

    const escalationPhrases = [
      'let me connect you with the team',
      "don't have enough information",
      'contact our team',
    ]
    const escalated = escalationPhrases.some(phrase =>
      answer.toLowerCase().includes(phrase.toLowerCase())
    )

    await Promise.all([
      supabase.from('query_logs').insert({ question, answer, escalated, client_id: clientId }),
      supabase.from('trials').update({ query_count: trial.query_count + 1 }).eq('client_id', clientId),
    ])

    return Response.json({ answer })
  } catch (err) {
    return Response.json({ answer: 'Something went wrong — please try again.' }, { status: 500 })
  }
}
