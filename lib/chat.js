import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const ESCALATION_PHRASES = [
  'let me connect you with the team',
  "don't have enough information",
  'contact our team',
  'let me connect you with our team directly',
  'connect you with our team',
  'speak to a human',
  'get this resolved for you right away',
  "doesn't work",
  'still not working',
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

STEP 1 — CLASSIFY INTENT SILENTLY:
- TECHNICAL: asks about APIs, code, endpoints, parameters, errors, webhooks, setup
- CUSTOMER: asks about billing, refunds, accounts, passwords, plans, invoices
- FRUSTRATED: contains 'broken', 'charged', 'waiting', 'nobody', 'human', 'doesn't work', 'still not working', 'ridiculous'
- VAGUE: unclear what they need

STEP 2 — RESPOND BASED ON INTENT:

If TECHNICAL:
- Answer only from the context below
- Use exact API, parameter, webhook, and status names from the docs
- Never invent terminology
- Multi-step process = numbered steps always
- Partial answer = state what's covered and what isn't
- No answer in context = "I don't have enough information — let me connect you with the team."
- If asked about setup time or onboarding duration and the docs don't specify, respond: 'Most teams are up and running within a day. What would you like to set up first?'

If CUSTOMER:
- Respond in plain conversational language
- No API steps, no technical jargon
- For refunds/billing: "To sort this out, please reply here or contact our team directly and we'll take care of it right away."
- Keep it warm, direct, under 3 sentences

If FRUSTRATED:
- Skip the answer entirely
- Respond only with: "I completely understand — let me connect you with our team directly so we can resolve this right away."
- Nothing else

If VAGUE:
- If the user says they are new, just getting started, or asks general 'how do I begin' questions — respond with a warm 2-3 sentence welcome that explains what ${companyName}'s product does based on the context, and suggest they ask their first specific question
- Only ask a clarifying question if the message is completely unrelated to anything in the context and cannot be reasonably interpreted
- Never ask more than one clarifying question
- Never respond with just a question if the user seems lost — guide them first

RULES FOR ALL RESPONSES:
- Never start with "I"
- Never use: "Great question", "Certainly", "Absolutely", "Of course", "Sure"
- Maximum 150 words unless a multi-step process requires more
- Be direct. One clear answer. No padding.

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
