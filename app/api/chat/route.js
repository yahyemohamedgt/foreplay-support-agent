import { supabase } from '../../../lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const rateLimitMap = new Map()

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000

  const entry = rateLimitMap.get(ip) ?? { count: 0, start: now }
  if (now - entry.start > windowMs) {
    entry.count = 0
    entry.start = now
  }
  entry.count += 1
  rateLimitMap.set(ip, entry)

  if (entry.count > 20) {
    return Response.json(
      { answer: 'Too many requests — please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
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
    })

    const context = chunks?.map(c => c.content).join('\n\n') || ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
content: `You are a helpful support agent for Foreplay, an ad intelligence platform.
Answer questions using the documentation context provided below.
Even if the context is partial or fragmented, do your best to synthesize a helpful answer from what is available.
Only say "I don't have enough information to answer that — let me connect you with the team." if the context contains absolutely nothing relevant.
Keep answers concise and clear.

Context:
${context}`
        },
        { role: 'user', content: question }
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

    await supabase.from('query_logs').insert({
      question,
      answer,
      escalated
    })

    if (escalated && process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `*Escalated support question*\n*Question:* ${question}\n*Answer:* ${answer}`,
          }),
        })
      } catch (_) {}
    }

    return Response.json({ answer })
  } catch (err) {
    return Response.json(
      { answer: 'Something went wrong — please try again or contact our team.' },
      { status: 500 }
    )
  }
}
