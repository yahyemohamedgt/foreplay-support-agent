import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(req) {
  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')

  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[stripe] Webhook signature verification failed:', err.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabase()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email ?? session.customer_email

    if (email) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const { error } = await supabase
        .from('trials')
        .update({ plan: 'paid', expires_at: expiresAt.toISOString() })
        .eq('email', email)

      if (error) {
        console.error('[stripe] Failed to upgrade trial for', email, ':', error.message)
      } else {
        console.log('[stripe] Upgraded trial to paid for', email)
      }
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const email = subscription.customer_email

    if (email) {
      const { error } = await supabase
        .from('trials')
        .update({ plan: 'free', expires_at: new Date().toISOString() })
        .eq('email', email)

      if (error) {
        console.error('[stripe] Failed to downgrade trial for', email, ':', error.message)
      } else {
        console.log('[stripe] Downgraded trial to free for', email)
      }
    }
  }

  return Response.json({ received: true })
}
