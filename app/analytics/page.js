import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function categorize(question) {
  const q = question.toLowerCase()
  if (q.includes('billing') || q.includes('plan') || q.includes('credit') || q.includes('payment') || q.includes('subscription') || q.includes('invoice') || q.includes('trial')) return 'Billing'
  if (q.includes('api') || q.includes('endpoint') || q.includes('auth') || q.includes('token') || q.includes('key') || q.includes('401') || q.includes('403') || q.includes('rate limit')) return 'API & Auth'
  if (q.includes('setup') || q.includes('install') || q.includes('getting started') || q.includes('onboard') || q.includes('integrate') || q.includes('connect')) return 'Setup & Onboarding'
  if (q.includes('error') || q.includes('bug') || q.includes('broken') || q.includes('fail') || q.includes('not work') || q.includes('issue') || q.includes('problem')) return 'Errors & Bugs'
  if (q.includes('export') || q.includes('import') || q.includes('upload') || q.includes('download') || q.includes('csv') || q.includes('file')) return 'Data & Files'
  if (q.includes('user') || q.includes('team') || q.includes('member') || q.includes('invite') || q.includes('account') || q.includes('permission')) return 'Account & Team'
  if (q.includes('search') || q.includes('filter') || q.includes('find') || q.includes('discover')) return 'Search & Discovery'
  return 'General'
}

export default async function Analytics({ searchParams }) {
  const params = await searchParams
  const analyticsPassword = process.env.ANALYTICS_PASSWORD
  if (analyticsPassword && params?.password !== analyticsPassword) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#07070f',
        color: '#f0f0f0',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <form method="GET" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: '320px',
        }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', letterSpacing: '-0.01em' }}>Analytics</p>
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#f0f0f0', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" style={{ background: 'rgba(99,255,180,0.1)', border: '1px solid rgba(99,255,180,0.2)', borderRadius: '8px', padding: '10px', color: '#63ffb4', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            Enter
          </button>
        </form>
      </main>
    )
  }

  const supabase = getSupabase()

  const [{ data: logs }, { data: trials }] = await Promise.all([
    supabase.from('query_logs').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('trials').select('*').order('created_at', { ascending: false }),
  ])

  const total = logs?.length || 0
  const escalated = logs?.filter(l => l.escalated).length || 0
  const answered = total - escalated
  const deflectionRate = total > 0 ? Math.round((answered / total) * 100) : 0

  const now = new Date()
  const activeTrials = trials?.filter(t => new Date(t.expires_at) > now) || []
  const totalTrials = trials?.length || 0

  const categoryCounts = {}
  logs?.forEach(log => {
    const cat = categorize(log.question)
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // Unique clients in query logs
  const clientCounts = {}
  logs?.forEach(log => {
    const id = log.client_id || 'foreplay'
    clientCounts[id] = (clientCounts[id] || 0) + 1
  })

  return (
    <main style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", padding: '48px 40px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,255,180,0.08)', border: '1px solid rgba(99,255,180,0.2)', borderRadius: '100px', padding: '4px 14px', fontSize: '11px', letterSpacing: '0.1em', color: '#63ffb4', textTransform: 'uppercase', marginBottom: '14px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#63ffb4', display: 'inline-block' }} />
              Live
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.03em' }}>TriageHQ Analytics</h1>
            <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>Query intelligence · all clients</p>
          </div>
          <a href="/" style={{ fontSize: '13px', color: '#4b5563', textDecoration: 'none', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>← Home</a>
        </div>

        {/* Top stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '40px' }}>
          {[
            { label: 'Total queries', value: total, color: '#f0f0f0', sub: 'all time' },
            { label: 'Deflection rate', value: `${deflectionRate}%`, color: '#63ffb4', sub: 'auto-resolved' },
            { label: 'Escalated', value: escalated, color: '#f87171', sub: 'needed human' },
            { label: 'Active trials', value: activeTrials.length, color: '#a78bfa', sub: `${totalTrials} total` },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px 20px' }}>
              <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</p>
              <p style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 4px', color: stat.color, letterSpacing: '-0.03em', fontFamily: "'DM Mono', monospace" }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Trials table */}
        {trials && trials.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trial customers</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#374151' }}>{totalTrials} total · {activeTrials.length} active</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Company', 'Email', 'Client ID', 'Queries', 'Docs', 'Expires', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: '#4b5563', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trials.map((trial, i) => {
                    const expired = new Date(trial.expires_at) < now
                    const limitHit = trial.query_count >= 500
                    const status = expired ? 'Expired' : limitHit ? 'Limit hit' : 'Active'
                    const statusColor = expired || limitHit ? '#f87171' : '#63ffb4'
                    const statusBg = expired || limitHit ? 'rgba(248,113,113,0.1)' : 'rgba(99,255,180,0.1)'
                    return (
                      <tr key={trial.id} style={{ borderBottom: i < trials.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#e5e7eb' }}>{trial.company}</td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280', fontFamily: "'DM Mono', monospace" }}>{trial.email}</td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', color: '#4b5563', fontFamily: "'DM Mono', monospace" }}>{trial.client_id}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9ca3af', fontFamily: "'DM Mono', monospace" }}>{trial.query_count}/500</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9ca3af', fontFamily: "'DM Mono', monospace" }}>{trial.chunk_count}</td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', color: '#4b5563', fontFamily: "'DM Mono', monospace" }}>{new Date(trial.expires_at).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '600', padding: '3px 9px', borderRadius: '100px', color: statusColor, background: statusBg, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories + client breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Top categories */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top question categories</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topCategories.length === 0 && <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>No data yet.</p>}
              {topCategories.map(([cat, count], i) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: '#d1d5db' }}>{cat}</span>
                      <span style={{ fontSize: '11px', color: '#4b5563', fontFamily: "'DM Mono', monospace" }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? '#63ffb4' : 'rgba(99,255,180,0.35)', borderRadius: '3px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Queries by client */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Queries by client</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(clientCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([clientId, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={clientId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#d1d5db', fontFamily: "'DM Mono', monospace" }}>{clientId}</span>
                      <span style={{ fontSize: '11px', color: '#4b5563', fontFamily: "'DM Mono', monospace" }}>{count}</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(167,139,250,0.5)', borderRadius: '3px' }} />
                    </div>
                  </div>
                )
              })}
              {Object.keys(clientCounts).length === 0 && <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>No data yet.</p>}
            </div>
          </div>
        </div>

        {/* Recent queries */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent queries</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#374151' }}>Last {total}</p>
          </div>
          {logs?.length === 0 && (
            <p style={{ padding: '24px', fontSize: '13px', color: '#374151', margin: 0 }}>No queries yet.</p>
          )}
          {logs?.map((log, i) => (
            <div key={log.id} style={{ padding: '16px 24px', borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#e0e0e0' }}>{log.question}</p>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: '#4b5563', flexShrink: 0 }}>{categorize(log.question)}</span>
                  {log.client_id && log.client_id !== 'foreplay' && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)', flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{log.client_id}</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.answer?.slice(0, 120)}…</p>
              </div>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontWeight: '500', letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0, background: log.escalated ? 'rgba(248,113,113,0.1)' : 'rgba(99,255,180,0.08)', color: log.escalated ? '#f87171' : '#63ffb4', border: `1px solid ${log.escalated ? 'rgba(248,113,113,0.2)' : 'rgba(99,255,180,0.15)'}` }}>
                {log.escalated ? 'Escalated' : 'Answered'}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#1f2937', marginTop: '32px' }}>
          TriageHQ · triagehq.net
        </p>

      </div>
    </main>
  )
}
