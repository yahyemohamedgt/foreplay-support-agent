import { supabase } from '../../../lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req) {
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
console.log('Chunks found:', chunks?.length, chunks?.[0]?.content?.slice(0, 100))
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
const escalated = answer.includes("let me connect you with the team")

await supabase.from('query_logs').insert({
  question,
  answer,
  escalated
})
  return Response.json({ answer })
}

