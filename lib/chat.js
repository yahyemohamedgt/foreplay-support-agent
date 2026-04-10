import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const ESCALATION_PHRASES = [
  'let me connect you with the team',
  "don't have enough information",
  'contact our team',
]

/**
 * Core chat handler shared by /api/chat and /api/chat/[clientId].
 *
 * @param {object} opts
 * @param {import('@supabase/supabase-js').SupabaseClient} opts.supabase
 * @param {string} opts.clientId
 * @param {string} opts.companyName
 * @param {string} opts.question
 * @param {string} opts.ip
 * @param {Function|null} opts.onSuccess - optional callback after answer is generated (e.g. to update trial query_count)
 * @returns {Promise<{ answer: string, escalated: boolean }>}
 */
export async function handleChat({ supabase, clientId, companyName, question, ip, onSuccess }) {
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
        content: `You are a support and onboarding agent for ${companyName}.

Answer the user using only the documentation context provided below.

Rules:
1. Use exact product, API, object, parameter, status, and webhook names from the docs whenever possible.
2. Do not invent generic names or umbrella terms. For example, say "Payment Intents API," not "Payment API."
3. If the docs support the answer, answer directly and specifically.
4. If the docs support only part of the answer, answer that part clearly and say what is not covered.
5. Only say "I don't have enough information to answer that — let me connect you with the team." if the context contains no relevant information at all.
6. Do not use outside knowledge.
7. If the user asks for a recommended flow or sequence, synthesize the steps clearly from the context.
8. Keep answers concise, clear, and implementation-oriented.
9. If relevant, mention exact parameters, statuses, or webhook event names from the docs.
10. Do not be vague if the docs are specific.
11. If the user's question is a multi-step process, always respond with numbered steps even if the docs present the information in prose form.

Context:
${context}`,
      },
      { role: 'user', content: question },
    ],
  })

  const answer = completion.choices[0].message.content
  const escalated = ESCALATION_PHRASES.some(phrase =>
    answer.toLowerCase().includes(phrase.toLowerCase())
  )

  const logInsert = supabase.from('query_logs').insert({ question, answer, escalated, client_id: clientId, ip })

  if (onSuccess) {
    await Promise.all([logInsert, onSuccess()])
  } else {
    await logInsert
  }

  return { answer, escalated }
}

/**
 * Supabase-based rate limit check. Returns true if the IP is over the limit.
 */
export async function isRateLimited(supabase, ip) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('query_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', oneHourAgo)
  return !error && count > 50
}
