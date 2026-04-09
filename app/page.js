export default function Landing() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#080810',
      color: '#f0f0f0',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s 0.45s ease forwards; opacity: 0; }
        .btn-primary:hover { background: #4eeea0 !important; }
        .btn-outline:hover { background: rgba(99,255,180,0.08) !important; }
        .feature-card:hover { border-color: rgba(99,255,180,0.2) !important; background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '-0.02em' }}>
          triage<span style={{ color: '#63ffb4' }}>.</span>
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/chat" style={{
            fontSize: '13px',
            color: '#666',
            textDecoration: 'none',
            padding: '8px 16px',
          }}>Demo</a>
          <a href="https://calendly.com/yahye-mohamed-gt/30min" target="_blank" rel="noopener noreferrer" style={{
            fontSize: '13px',
            background: '#63ffb4',
            color: '#080810',
            textDecoration: 'none',
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: '600',
          }}>Book a call</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '100px 40px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(99,255,180,0.12) 0%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div className="fade-up" style={{
          display: 'inline-block',
          background: 'rgba(99,255,180,0.08)',
          border: '1px solid rgba(99,255,180,0.2)',
          borderRadius: '100px',
          padding: '5px 16px',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#63ffb4',
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>AI Support Infrastructure</div>

        <h1 className="fade-up-2" style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: '700',
          lineHeight: '1.05',
          letterSpacing: '-0.04em',
          margin: '0 0 24px',
          color: '#ffffff',
        }}>
          Stop support tickets from<br />
          <span style={{ color: '#63ffb4' }}>reaching your dev team</span>
        </h1>

        <p className="fade-up-3" style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          margin: '0 auto 40px',
          maxWidth: '540px',
          fontWeight: '400',
        }}>
          Triage is an AI support agent grounded to your docs. It answers the 80%, escalates the 20%.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://calendly.com/yahye-mohamed-gt/30min" target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{
              background: '#63ffb4',
              color: '#080810',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background 0.15s ease',
              letterSpacing: '-0.01em',
            }}>
            Book a call
          </a>
          <a href="/chat"
            className="btn-outline"
            style={{
              background: 'transparent',
              color: '#f0f0f0',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'background 0.15s ease',
              letterSpacing: '-0.01em',
            }}>
            See the demo →
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        flexWrap: 'wrap',
      }}>
        {[
          '626 docs indexed',
          '70% deflection rate',
          'Built in Toronto',
        ].map((stat, i) => (
          <span key={i} style={{
            fontSize: '12px',
            color: '#444',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.04em',
          }}>
            <span style={{ color: '#63ffb4', marginRight: '8px' }}>·</span>{stat}
          </span>
        ))}
      </div>

      {/* Features */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        <p style={{
          fontSize: '11px',
          color: '#444',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '40px',
          textAlign: 'center',
        }}>How it works</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {[
            {
              label: '01',
              title: 'Instant answers',
              body: 'Grounded to your actual documentation. No hallucinations, no generic responses — just accurate answers drawn from your knowledge base.',
            },
            {
              label: '02',
              title: 'Real escalation',
              body: 'When the agent doesn\'t know, it says so and routes to your team — with full context. No dead ends, no frustrated users.',
            },
            {
              label: '03',
              title: 'Analytics dashboard',
              body: 'See every question asked, every escalation triggered, deflection rates over time. Know exactly where your docs have gaps.',
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '32px 28px',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}>
              <span style={{
                fontSize: '11px',
                color: '#333',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '16px',
              }}>{f.label}</span>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
                color: '#f0f0f0',
              }}>{f.title}</h3>
              <p style={{
                fontSize: '13px',
                color: '#555',
                lineHeight: '1.7',
                margin: 0,
              }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 40px 100px',
        textAlign: 'center',
      }}>
        <div style={{
          background: 'rgba(99,255,180,0.04)',
          border: '1px solid rgba(99,255,180,0.1)',
          borderRadius: '20px',
          padding: '56px 48px',
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
          }}>Ready to deploy?</h2>
          <p style={{ fontSize: '14px', color: '#555', margin: '0 0 32px', lineHeight: '1.6' }}>
            Takes a day to set up. Works with any documentation.
          </p>
          <a href="https://calendly.com/yahye-mohamed-gt/30min" target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-block',
              background: '#63ffb4',
              color: '#080810',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background 0.15s ease',
            }}>
            Book a call
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '24px 40px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', color: '#333', margin: 0 }}>
          Built by Mohamed · triagehq.net
        </p>
      </footer>
    </main>
  )
}
