import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function categorize(question) {
  const q = question.toLowerCase()
  if (q.includes('402') || q.includes('credit') || q.includes('billing') || q.includes('plan') || q.includes('trial') || q.includes('cancel') || q.includes('subscription')) return 'Billing & Credits'
  if (q.includes('transcription') || q.includes('transcript')) return 'Transcriptions'
  if (q.includes('spyder') || q.includes('competitor') || q.includes('track')) return 'Spyder'
  if (q.includes('api') || q.includes('endpoint') || q.includes('authentication') || q.includes('key') || q.includes('401') || q.includes('403')) return 'API & Auth'
  if (q.includes('pagination') || q.includes('cursor') || q.includes('offset')) return 'Pagination'
  if (q.includes('discovery') || q.includes('search') || q.includes('filter')) return 'Discovery'
  if (q.includes('lens') || q.includes('report') || q.includes('analytics')) return 'Lens'
  if (q.includes('team') || q.includes('member') || q.includes('invite') || q.includes('account')) return 'Account & Team'
  if (q.includes('swipe') || q.includes('board') || q.includes('folder') || q.includes('save')) return 'Swipe File'
  if (q.includes('brief')) return 'Briefs'
  return 'General'
}

export default async function Analytics({ searchParams }) {
  const params = await searchParams
  const analyticsPassword = process.env.ANALYTICS_PASSWORD
  if (analyticsPassword && params?.password !== analyticsPassword) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#080810',
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
          <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>Enter password to access dashboard</p>
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f0f0f0',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: 'rgba(99,255,180,0.1)',
            border: '1px solid rgba(99,255,180,0.2)',
            borderRadius: '8px',
            padding: '10px',
            color: '#63ffb4',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            Enter
          </button>
        </form>
      </main>
    )
  }

  const { data: logs } = await supabase
    .from('query_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const total = logs?.length || 0
  const escalated = logs?.filter(l => l.escalated).length || 0
  const answered = total - escalated
  const deflectionRate = total > 0 ? Math.round((answered / total) * 100) : 0

  const categoryCounts = {}
  logs?.forEach(log => {
    const cat = categorize(log.question)
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080810',
      color: '#f0f0f0',
      fontFamily: "'DM Sans', sans-serif",
      padding: '48px 40px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(99,255,180,0.08)',
            border: '1px solid rgba(99,255,180,0.2)',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: '#63ffb4',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>Live</div>
          <h1 style={{ fontSize: '28px', fontWeight: '500', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Support Agent
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Foreplay · Query intelligence dashboard</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total queries', value: total, color: '#f0f0f0', sub: 'all time' },
            { label: 'Deflection rate', value: `${deflectionRate}%`, color: '#63ffb4', sub: 'auto-resolved' },
            { label: 'Escalated', value: escalated, color: '#ff6b6b', sub: 'needed human' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '28px 24px',
            }}>
              <p style={{ fontSize: '12px', color: '#555', margin: '0 0 12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</p>
              <p style={{ fontSize: '42px', fontWeight: '600', margin: '0 0 4px', color: stat.color, letterSpacing: '-0.03em', fontFamily: "'DM Mono', monospace" }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <p style={{ margin: '0 0 20px', fontSize: '13px', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top question categories</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCategories.map(([cat, count], i) => {
              const pct = Math.round((count / total) * 100)
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#ccc' }}>{cat}</span>
                    <span style={{ fontSize: '12px', color: '#555', fontFamily: "'DM Mono', monospace" }}>{count} · {pct}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: i === 0 ? '#63ffb4' : 'rgba(99,255,180,0.4)',
                      borderRadius: '4px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#aaa' }}>Recent queries</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#444' }}>Last {total} interactions</p>
          </div>

          {logs?.map((log, i) => (
            <div key={log.id} style={{
              padding: '18px 24px',
              borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#e0e0e0' }}>{log.question}</p>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#555',
                    flexShrink: 0
                  }}>{categorize(log.question)}</span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#555',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{log.answer?.slice(0, 100)}...</p>
              </div>
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '100px',
                fontWeight: '500',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: log.escalated ? 'rgba(255,107,107,0.1)' : 'rgba(99,255,180,0.08)',
                color: log.escalated ? '#ff6b6b' : '#63ffb4',
                border: `1px solid ${log.escalated ? 'rgba(255,107,107,0.2)' : 'rgba(99,255,180,0.15)'}`,
              }}>
                {log.escalated ? 'Escalated' : 'Answered'}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#333', marginTop: '32px' }}>
          Built by Mohamed · Foreplay Support Agent v1
        </p>

      </div>
    </main>
  )
}