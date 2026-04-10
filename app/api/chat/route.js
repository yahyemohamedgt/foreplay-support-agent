import { supabase, CLIENT_ID } from '../../../lib/supabase'
import { handleChat, isRateLimited } from '../../../lib/chat'

const COMPANY_NAME = 'Foreplay'

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

  if (await isRateLimited(supabase, ip)) {
    return Response.json(
      { answer: 'Too many requests — please wait before trying again.' },
      { status: 429 }
    )
  }

  try {
    const { question } = await req.json()

    const { answer, escalated } = await handleChat({
      supabase,
      clientId: CLIENT_ID,
      companyName: COMPANY_NAME,
      question,
      ip,
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
  } catch {
    return Response.json(
      { answer: 'Something went wrong — please try again or contact our team.' },
      { status: 500 }
    )
  }
}
