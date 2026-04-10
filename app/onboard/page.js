'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

async function extractTextFromFile(file) {
  if (file.type === 'application/pdf') {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(item => item.str).join(' ') + '\n'
    }
    return text
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export default function Onboard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [tab, setTab] = useState('paste')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [docsText, setDocsText] = useState('')
  const [fileError, setFileError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef(null)

  async function handleFileChange(e) {
    setFileError('')
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['text/plain', 'text/markdown', 'application/pdf']
    const allowedExt = ['.txt', '.md', '.pdf']
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(file.type) && !allowedExt.includes(ext)) {
      setFileError('Only .txt, .md, and .pdf files are supported.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File must be under 5MB.')
      return
    }
    try {
      const text = await extractTextFromFile(file)
      setDocsText(text)
    } catch {
      setFileError('Could not read file. Please try pasting the text instead.')
    }
  }

  async function handleLaunch() {
    setError('')
    if (!docsText.trim()) {
      setError('Please add some documentation to index.')
      return
    }
    setLoading(true)

    // Animate progress bar
    let p = 0
    const interval = setInterval(() => {
      p = Math.min(p + Math.random() * 8, 85)
      setProgress(Math.round(p))
    }, 400)

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, docsText }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        setProgress(0)
        return
      }
      setProgress(100)
      setTimeout(() => router.push(data.demoUrl), 600)
    } catch {
      clearInterval(interval)
      setError('Something went wrong. Please try again.')
      setLoading(false)
      setProgress(0)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '13px 16px',
    fontSize: '15px',
    color: '#f0f0f0',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07070f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        input::placeholder, textarea::placeholder { color: #4b5563; }
        input:focus, textarea:focus { border-color: rgba(99,255,180,0.3) !important; }
      `}</style>

      <a href="/" style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.03em', textDecoration: 'none', color: '#f0f0f0', marginBottom: '40px' }}>
        triage<span style={{ color: '#63ffb4' }}>.</span>
      </a>

      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ height: '3px', flex: 1, borderRadius: '3px', background: step >= s ? '#63ffb4' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s ease' }} />
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>⚡</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Indexing your docs...</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 28px' }}>
              {progress < 40 ? 'Reading your documentation...' : progress < 75 ? 'Creating embeddings...' : progress < 95 ? 'Almost there...' : 'Launching your agent!'}
            </p>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #63ffb4, #3b82f6)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
            </div>
            <p style={{ color: '#374151', fontSize: '12px', marginTop: '12px' }}>{progress}%</p>
          </div>
        )}

        {/* Step 1 */}
        {!loading && step === 1 && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Start your free trial</h1>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 32px' }}>Set up your AI support agent in minutes.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Company name</label>
                <input
                  style={inputStyle}
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && companyName && email && setStep(2)}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Work email</label>
                <input
                  type="email"
                  style={inputStyle}
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && companyName && email && setStep(2)}
                />
              </div>
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

            <button
              onClick={() => {
                if (!companyName.trim()) { setError('Please enter your company name.'); return }
                if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return }
                setError('')
                setStep(2)
              }}
              style={{ width: '100%', marginTop: '24px', background: '#63ffb4', color: '#07070f', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.01em' }}
            >
              Continue →
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#374151', marginTop: '16px' }}>
              7-day free trial · up to 500 questions · no credit card required
            </p>
          </div>
        )}

        {/* Step 2 */}
        {!loading && step === 2 && (
          <div>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '13px', cursor: 'pointer', padding: '0 0 20px', marginLeft: '-4px' }}>← Back</button>
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Add your docs</h1>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 24px' }}>Paste help articles, FAQs, API docs — anything you want your agent to know.</p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
              {['paste', 'upload'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === t ? '#f0f0f0' : '#6b7280', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textTransform: 'capitalize', fontFamily: "'DM Sans', sans-serif" }}>
                  {t === 'paste' ? 'Paste text' : 'Upload file'}
                </button>
              ))}
            </div>

            {tab === 'paste' && (
              <textarea
                style={{ ...inputStyle, minHeight: '220px', resize: 'vertical', lineHeight: '1.6' }}
                placeholder="Paste your help center articles, API docs, FAQs..."
                value={docsText}
                onChange={e => setDocsText(e.target.value)}
              />
            )}

            {tab === 'upload' && (
              <div>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,255,180,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <p style={{ fontSize: '24px', margin: '0 0 8px' }}>📄</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px' }}>
                    {docsText ? '✓ File loaded — click to replace' : 'Click to upload'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>.txt, .md, .pdf · max 5MB</p>
                </div>
                <input ref={fileRef} type="file" accept=".txt,.md,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
                {fileError && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '8px' }}>{fileError}</p>}
                {docsText && !fileError && <p style={{ color: '#63ffb4', fontSize: '13px', marginTop: '8px' }}>✓ {docsText.length.toLocaleString()} characters loaded</p>}
              </div>
            )}

            {error && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

            <button
              onClick={handleLaunch}
              disabled={loading}
              style={{ width: '100%', marginTop: '20px', background: '#63ffb4', color: '#07070f', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              Launch my agent →
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#374151', marginTop: '16px' }}>
              7-day free trial · up to 500 questions · no credit card required
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
