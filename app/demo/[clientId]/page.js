import { createClient } from '@supabase/supabase-js'
import DemoChat from './DemoChat'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export default async function DemoPage({ params }) {
  const { clientId } = await params
  const supabase = getSupabase()

  const { data: trial } = await supabase
    .from('trials')
    .select('*')
    .eq('client_id', clientId)
    .single()

  const font = <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  if (!trial) {
    return (
      <main style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {font}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>404</p>
          <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 12px' }}>Demo not found</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>This demo link doesn't exist or has been removed.</p>
          <a href="/onboard" style={{ background: '#63ffb4', color: '#07070f', textDecoration: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px' }}>Start your own free trial</a>
        </div>
      </main>
    )
  }

  const expired = new Date(trial.expires_at) < new Date()
  const limitReached = trial.query_count >= 500

  if (expired || limitReached) {
    return (
      <main style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {font}
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{expired ? '⏰' : '📊'}</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {expired ? 'Your 7-day trial has ended' : 'You\'ve reached your 500 question limit'}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            {expired
              ? 'Your trial for ' + trial.company + ' has expired. Book a call to get a full deployment.'
              : 'You\'ve used all 500 questions in your trial. Book a call to continue.'}
          </p>
          <a href="https://calendly.com/yahye-mohamed-gt/30min" target="_blank" rel="noopener noreferrer"
            style={{ background: '#63ffb4', color: '#07070f', textDecoration: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 20px rgba(99,255,180,0.2)', display: 'inline-block' }}>
            Book a call to continue →
          </a>
        </div>
      </main>
    )
  }

  const questionsLeft = 500 - trial.query_count

  return (
    <main style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      {font}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7,7,15,0.9)' }}>
        <div>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>triage<span style={{ color: '#63ffb4' }}>.</span></span>
          <span style={{ fontSize: '13px', color: '#4b5563', marginLeft: '12px' }}>{trial.company} demo</span>
        </div>
        <span style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'monospace' }}>{questionsLeft} questions left</span>
      </div>
      <DemoChat clientId={clientId} company={trial.company} />
    </main>
  )
}
