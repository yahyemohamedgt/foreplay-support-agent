import { createClient } from '@supabase/supabase-js'
import { handleChat, isRateLimited } from '../../../../lib/chat'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(req, { params }) {
  const { clientId } = await params
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

  try {
    const supabase = getSupabase()

    if (await isRateLimited(supabase, ip)) {
      return Response.json({ answer: 'Too many requests — please wait before trying again.' }, { status: 429 })
    }

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
      return Response.json({ answer: "You've reached the 500 question limit for this trial. Book a call to continue: https://calendly.com/yahye-mohamed-gt/30min" }, { status: 429 })
    }

    const { question } = await req.json()

    const { answer } = await handleChat({
      supabase,
      clientId,
      companyName: trial.company,
      question,
      ip,
      onSuccess: () =>
        supabase.from('trials').update({ query_count: trial.query_count + 1 }).eq('client_id', clientId),
    })

    return Response.json({ answer })
  } catch {
    return Response.json({ answer: 'Something went wrong — please try again.' }, { status: 500 })
  }
}
