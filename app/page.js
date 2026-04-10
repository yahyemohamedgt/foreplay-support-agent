'use client'
import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export default function Landing() {
  const workflowRef = useRef(null)
  const outcomesRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            posthog.capture('section_viewed', { section: entry.target.dataset.section })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    if (workflowRef.current) observer.observe(workflowRef.current)
    if (outcomesRef.current) observer.observe(outcomesRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      background: '#07070f',
      color: '#f0f0f0',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes pulseGlow2 {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up  { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s 0.12s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s 0.24s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s 0.36s ease forwards; opacity: 0; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(99,255,180,0.35) !important; }
        .btn-outline:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.2) !important; }
        .outcome-card:hover { border-color: rgba(139,92,246,0.3) !important; transform: translateY(-2px); }
        .outcome-card { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease; }
        .integration-card:hover { border-color: rgba(99,255,180,0.25) !important; background: rgba(255,255,255,0.05) !important; }
        .integration-card { transition: border-color 0.2s ease, background 0.2s ease; }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7,7,15,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.03em' }}>
          triage<span style={{ color: '#63ffb4' }}>.</span>
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/chat" style={{ fontSize: '14px', color: '#777', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px' }}>Demo</a>
          <a href="/onboard"
            className="btn-primary"
            onClick={() => posthog.capture('hero_cta_clicked', { button: 'start_trial' })}
            style={{
              fontSize: '14px', background: '#63ffb4', color: '#07070f', textDecoration: 'none',
              padding: '9px 20px', borderRadius: '9px', fontWeight: '700',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease', letterSpacing: '-0.01em',
            }}>Start free trial</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '110px 40px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40px', left: '-80px', width: '500px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 65%)', animation: 'pulseGlow2 5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '80px', right: '-80px', width: '450px', height: '450px', background: 'radial-gradient(ellipse at center, rgba(99,255,180,0.1) 0%, transparent 65%)', animation: 'pulseGlow 4.5s ease-in-out infinite', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,255,180,0.07)', border: '1px solid rgba(99,255,180,0.18)', borderRadius: '100px', padding: '6px 18px', fontSize: '12px', letterSpacing: '0.08em', color: '#63ffb4', textTransform: 'uppercase', marginBottom: '32px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#63ffb4', display: 'inline-block' }} />
          For docs-heavy SaaS teams
        </div>

        <h1 className="fade-up-2" style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.04em', margin: '0 0 28px', color: '#ffffff' }}>
          Deflect repetitive support<br />
          <span style={{ background: 'linear-gradient(135deg, #63ffb4 0%, #3b82f6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>and setup questions</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: '19px', color: '#6b7280', lineHeight: '1.7', margin: '0 auto 16px', maxWidth: '580px', fontWeight: '400' }}>
          Triage ingests your help center and API docs, handles repetitive support and onboarding questions with grounded answers, and escalates edge cases with full context — so lean teams scale without adding headcount.
        </p>

        <p className="fade-up-3" style={{ fontSize: '14px', color: '#4b5563', margin: '0 auto 40px', fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em' }}>
          Live in one day. No engineering required.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/onboard"
              className="btn-primary"
              onClick={() => posthog.capture('hero_cta_clicked', { button: 'start_trial' })}
              style={{ background: '#63ffb4', color: '#07070f', textDecoration: 'none', padding: '15px 32px', borderRadius: '11px', fontSize: '15px', fontWeight: '700', transition: 'transform 0.15s ease, box-shadow 0.15s ease', letterSpacing: '-0.01em', boxShadow: '0 4px 20px rgba(99,255,180,0.2)' }}>
              Start free trial →
            </a>
            <a href="/chat"
              className="btn-outline"
              onClick={() => posthog.capture('hero_cta_clicked', { button: 'see_demo' })}
              style={{ background: 'rgba(255,255,255,0.04)', color: '#d1d5db', textDecoration: 'none', padding: '15px 32px', borderRadius: '11px', fontSize: '15px', fontWeight: '500', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.15s ease, border-color 0.15s ease', letterSpacing: '-0.01em' }}>
              See the demo
            </a>
          </div>
          <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>No credit card required · 7-day free trial</p>
        </div>
      </section>

      {/* Proof bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 40px', display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.015)' }}>
        {[
          { value: 'Up to 70%', label: 'deflection in early pilots' },
          { value: '< 1 day', label: 'to go live' },
          { value: 'Zero', label: 'extra headcount needed' },
        ].map((stat, i) => (
          <span key={i} style={{ fontSize: '13px', color: '#555', fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em', cursor: 'default' }}>
            <span style={{ color: '#63ffb4', fontWeight: '600' }}>{stat.value}</span>{' '}{stat.label}
          </span>
        ))}
      </div>

      {/* How it works */}
      <section ref={workflowRef} data-section="workflow" style={{ maxWidth: '960px', margin: '0 auto', padding: '96px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Three steps. No ramp-up.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px', position: 'relative' }}>
          {[
            {
              step: '01',
              title: 'Connect your docs',
              body: 'Paste your help center articles, API reference, or onboarding guides. Triage reads, chunks, and indexes them. Takes under an hour.',
              accent: 'rgba(99,255,180,0.06)',
              border: 'rgba(99,255,180,0.1)',
              stepColor: '#63ffb4',
            },
            {
              step: '02',
              title: 'Handle questions before they reach your team',
              body: 'Your agent answers repetitive support and setup questions with responses grounded in your actual documentation — not hallucinated generalities.',
              accent: 'rgba(139,92,246,0.06)',
              border: 'rgba(139,92,246,0.12)',
              stepColor: '#a78bfa',
            },
            {
              step: '03',
              title: 'Escalate edge cases with context',
              body: 'When the agent reaches its limit, it routes to your team via Slack — with the question, the answer it gave, and what it couldn\'t resolve.',
              accent: 'rgba(59,130,246,0.06)',
              border: 'rgba(59,130,246,0.12)',
              stepColor: '#60a5fa',
            },
          ].map((s, i) => (
            <div key={i} style={{ background: s.accent, border: `1px solid ${s.border}`, borderRadius: '18px', padding: '40px 36px', position: 'relative' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: s.stepColor, fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', display: 'block', marginBottom: '20px' }}>{s.step}</span>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 14px', letterSpacing: '-0.02em', color: '#f9fafb', lineHeight: '1.3' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.75', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section ref={outcomesRef} data-section="outcomes" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px 96px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>What changes</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Built for lean teams that move fast</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: '📉',
              title: 'Fewer repetitive tickets',
              body: 'Your team stops answering the same setup, integration, and "how do I" questions. The agent handles them — accurately, immediately.',
              accent: 'rgba(99,255,180,0.06)',
              border: 'rgba(99,255,180,0.1)',
              iconBg: 'rgba(99,255,180,0.08)',
            },
            {
              icon: '🚀',
              title: 'Onboarding that doesn\'t stall',
              body: 'New users get instant, doc-grounded answers during setup instead of waiting 48 hours for a reply. Fewer dropoffs. Faster activation.',
              accent: 'rgba(139,92,246,0.06)',
              border: 'rgba(139,92,246,0.12)',
              iconBg: 'rgba(139,92,246,0.1)',
            },
            {
              icon: '🎯',
              title: 'Escalations your team can act on',
              body: 'When something needs a human, it arrives with full context — the question, what the agent attempted, and what it couldn\'t resolve.',
              accent: 'rgba(59,130,246,0.06)',
              border: 'rgba(59,130,246,0.12)',
              iconBg: 'rgba(59,130,246,0.08)',
            },
          ].map((f, i) => (
            <div key={i} className="outcome-card" style={{ background: f.accent, border: `1px solid ${f.border}`, borderRadius: '18px', padding: '36px 32px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '24px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '-0.02em', color: '#f9fafb', lineHeight: '1.3' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.75', margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations — trimmed */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px 96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>Integrations</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Fits into how your team already works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px 48px', maxWidth: '640px', margin: '0 auto' }}>
          {[
            {
              label: 'Escalates to your team via',
              items: [
                { icon: '💬', name: 'Slack', live: true },
                { icon: '📧', name: 'Email', live: false },
              ],
            },
            {
              label: 'Ingests docs from',
              items: [
                { icon: '📄', name: 'Help Center', live: true },
                { icon: '🔌', name: 'API Docs', live: true },
                { icon: '🔲', name: 'Notion', live: false },
                { icon: '🅲', name: 'Confluence', live: false },
              ],
            },
          ].map((group, gi) => (
            <div key={gi}>
              <p style={{ fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', fontWeight: '500' }}>{group.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.items.map((item) => (
                  <div key={item.name} className="integration-card"
                    onMouseEnter={() => posthog.capture('integration_viewed', { name: item.name })}
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.live ? 'rgba(99,255,180,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 9px', borderRadius: '100px', background: item.live ? 'rgba(99,255,180,0.1)' : 'rgba(255,255,255,0.04)', color: item.live ? '#63ffb4' : '#4b5563', border: `1px solid ${item.live ? 'rgba(99,255,180,0.18)' : 'rgba(255,255,255,0.05)'}`, textTransform: 'uppercase' }}>
                      {item.live ? 'Live' : 'Soon'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '620px', margin: '0 auto', padding: '20px 40px 110px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,255,180,0.05) 0%, rgba(139,92,246,0.07) 50%, rgba(59,130,246,0.05) 100%)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '24px', padding: '64px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 12px', color: '#ffffff', lineHeight: '1.15' }}>
            Reduce repetitive support load<br />in days, not months.
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px', lineHeight: '1.65' }}>
            Paste your docs. Your agent is live in under a day.<br />No engineering work. No long implementation.
          </p>
          <a href="/onboard"
            className="btn-primary"
            onClick={() => posthog.capture('hero_cta_clicked', { button: 'start_trial' })}
            style={{ display: 'inline-block', background: '#63ffb4', color: '#07070f', textDecoration: 'none', padding: '15px 36px', borderRadius: '11px', fontSize: '15px', fontWeight: '700', transition: 'transform 0.15s ease, box-shadow 0.15s ease', boxShadow: '0 4px 20px rgba(99,255,180,0.22)' }}>
            Start free trial →
          </a>
          <p style={{ fontSize: '13px', color: '#374151', marginTop: '16px', marginBottom: 0 }}>No credit card required · 7-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>Built by Mohamed · triagehq.net</p>
      </footer>
    </main>
  )
}
