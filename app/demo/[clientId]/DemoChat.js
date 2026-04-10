'use client'
import { useState } from 'react'

export default function DemoChat({ clientId, company }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!question.trim()) return
    const userMessage = question
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setQuestion('')
    setLoading(true)

    try {
      const res = await fetch(`/api/chat/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      })

      const data = await res.json()
      const answer = data.answer || 'Something went wrong — please try again.'
      setMessages(prev => [...prev, { role: 'agent', content: answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', content: 'Something went wrong — please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {company} Support Agent
        </h1>
        <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>Powered by Triage · Ask anything about your product</p>
      </div>

      <div style={{ minHeight: '320px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Ask anything — I'm grounded to {company}'s docs.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '85%',
            lineHeight: '1.6',
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? '#63ffb4' : 'rgba(255,255,255,0.06)',
            color: m.role === 'user' ? '#07070f' : '#e5e7eb',
            fontWeight: m.role === 'user' ? '500' : '400',
          }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: '14px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: '#6b7280', alignSelf: 'flex-start' }}>
            Thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#f0f0f0', outline: 'none', opacity: loading ? 0.5 : 1 }}
          placeholder="Ask a question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: '#63ffb4', color: '#07070f', border: 'none', padding: '12px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#374151', textAlign: 'center', margin: 0 }}>
        Powered by <a href="https://triagehq.net" style={{ color: '#63ffb4', textDecoration: 'none' }}>Triage</a>
      </p>
    </div>
  )
}
