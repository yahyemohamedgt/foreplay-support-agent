'use client'
import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export default function Landing() {
  const integrationsRef = useRef(null)
  const ingestRef = useRef(null)

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
    if (integrationsRef.current) observer.observe(integrationsRef.current)
    if (ingestRef.current) observer.observe(ingestRef.current)
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
        .feature-card:hover { border-color: rgba(139,92,246,0.35) !important; transform: translateY(-2px); }
        .feature-card { transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease !important; }
        .stat-item:hover { color: #a0a0a0 !important; }
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
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '110px 40px 90px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '40px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 65%)', animation: 'pulseGlow2 5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '80px', right: '-100px', width: '450px', height: '450px', background: 'radial-gradient(ellipse at center, rgba(99,255,180,0.13) 0%, transparent 65%)', animation: 'pulseGlow 4.5s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '200px', background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '6px 18px', fontSize: '12px', letterSpacing: '0.1em', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '32px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
          AI Support Infrastructure
        </div>

        <h1 className="fade-up-2" style={{ fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: '800', lineHeight: '1.03', letterSpacing: '-0.04em', margin: '0 0 28px', color: '#ffffff' }}>
          Stop support tickets<br />
          <span style={{ background: 'linear-gradient(135deg, #63ffb4 0%, #3b82f6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>from reaching your team</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: '20px', color: '#6b7280', lineHeight: '1.65', margin: '0 auto 44px', maxWidth: '560px', fontWeight: '400' }}>
          Triage is an AI support agent grounded to your docs.<br />It answers the 80%, escalates the 20%.
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
          <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>No credit card required · 7-day free trial</p>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 40px', display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)' }}>
        {[
          { value: '626', label: 'docs indexed' },
          { value: '70%', label: 'deflection rate' },
          { value: '🇨🇦', label: 'Built in Toronto' },
        ].map((stat, i) => (
          <span key={i} className="stat-item" style={{ fontSize: '13px', color: '#555', fontFamily: "'DM Mono', monospace", letterSpacing: '0.02em', transition: 'color 0.15s', cursor: 'default' }}>
            <span style={{ color: '#63ffb4', fontWeight: '600' }}>{stat.value}</span>{' '}{stat.label}
          </span>
        ))}
      </div>

      {/* Features */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '96px 40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Everything your team needs</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Instant answers', body: 'Grounded to your actual documentation. No hallucinations, no generic responses — just accurate answers drawn from your knowledge base.', accent: 'rgba(99,255,180,0.08)', border: 'rgba(99,255,180,0.12)', iconBg: 'rgba(99,255,180,0.1)' },
            { icon: '🔀', title: 'Real escalation', body: "When the agent doesn't know, it says so and routes to your team — with full context. No dead ends, no frustrated users.", accent: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)', iconBg: 'rgba(139,92,246,0.12)' },
            { icon: '📊', title: 'Analytics dashboard', body: 'See every question asked, every escalation triggered, deflection rates over time. Know exactly where your docs have gaps.', accent: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', iconBg: 'rgba(59,130,246,0.12)' },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ background: f.accent, border: `1px solid ${f.border}`, borderRadius: '18px', padding: '36px 32px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '24px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '-0.02em', color: '#f9fafb' }}>{f.title}</h3>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section ref={integrationsRef} data-section="integrations" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px 96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>Integrations</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Works with your existing stack</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: '500' }}>Escalates to your team via</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { icon: '💬', name: 'Slack', live: true },
                { icon: '📧', name: 'Gmail', live: false },
                { icon: '🟦', name: 'Microsoft Teams', live: false },
                { icon: '🎮', name: 'Discord', live: false },
              ].map((item) => (
                <div key={item.name} className="integration-card"
                  onMouseEnter={() => posthog.capture('integration_viewed', { name: item.name })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.live ? 'rgba(99,255,180,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '100px', background: item.live ? 'rgba(99,255,180,0.12)' : 'rgba(255,255,255,0.05)', color: item.live ? '#63ffb4' : '#4b5563', border: `1px solid ${item.live ? 'rgba(99,255,180,0.2)' : 'rgba(255,255,255,0.06)'}`, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{item.live ? 'Live' : 'Soon'}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: '500' }}>Ingests docs from</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { icon: '📄', name: 'Help Center Articles', live: true },
                { icon: '🔌', name: 'API Documentation', live: true },
                { icon: '🔲', name: 'Notion', live: false },
                { icon: '🅲', name: 'Confluence', live: false },
                { icon: '🐙', name: 'GitHub', live: false },
                { icon: '🎫', name: 'Zendesk', live: false },
                { icon: '💬', name: 'Intercom', live: false },
                { icon: '🟠', name: 'HubSpot', live: false },
              ].map((item) => (
                <div key={item.name} className="integration-card"
                  onMouseEnter={() => posthog.capture('integration_viewed', { name: item.name })}
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.live ? 'rgba(99,255,180,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '100px', background: item.live ? 'rgba(99,255,180,0.12)' : 'rgba(255,255,255,0.05)', color: item.live ? '#63ffb4' : '#4b5563', border: `1px solid ${item.live ? 'rgba(99,255,180,0.2)' : 'rgba(255,255,255,0.06)'}`, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{item.live ? 'Live' : 'Soon'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feed it your knowledge */}
      <section ref={ingestRef} data-section="ingest_sources" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px 96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>Knowledge base</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f9fafb' }}>Feed it your knowledge</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {[
            { icon: '📋', title: 'Help center articles', body: 'Every guide and tutorial your team has written' },
            { icon: '🔌', title: 'API documentation', body: 'Full API reference, endpoints, error codes, examples' },
            { icon: '📣', title: 'Product updates & changelogs', body: 'Keep users informed on what changed and when' },
            { icon: '❓', title: 'Support FAQs', body: 'The questions your team answers over and over' },
            { icon: '🚀', title: 'Onboarding guides', body: 'Step by step flows for new users' },
            { icon: '🗂️', title: 'Internal wikis', body: 'Notion, Confluence, or any text-based knowledge base' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px 26px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,255,180,0.08)', border: '1px solid rgba(99,255,180,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 6px', color: '#f9fafb', letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 40px 110px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,255,180,0.06) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.06) 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '24px', padding: '64px 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: '34px', fontWeight: '800', letterSpacing: '-0.03em', margin: '0 0 14px', color: '#ffffff' }}>Ready to deploy?</h2>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 36px', lineHeight: '1.65' }}>Takes a day to set up. Works with any documentation.</p>
          <a href="/onboard"
            className="btn-primary"
            onClick={() => posthog.capture('hero_cta_clicked', { button: 'start_trial' })}
            style={{ display: 'inline-block', background: '#63ffb4', color: '#07070f', textDecoration: 'none', padding: '15px 36px', borderRadius: '11px', fontSize: '15px', fontWeight: '700', transition: 'transform 0.15s ease, box-shadow 0.15s ease', boxShadow: '0 4px 20px rgba(99,255,180,0.25)' }}>
            Start free trial →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>Built by Mohamed · triagehq.net</p>
      </footer>
    </main>
  )
}
