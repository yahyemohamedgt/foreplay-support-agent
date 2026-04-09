'use client'
import { useState } from 'react'

export default function Chat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!question.trim()) return
    const userMessage = question
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setQuestion('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userMessage }),
    })

    const { answer } = await res.json()
    setMessages(prev => [...prev, { role: 'agent', content: answer }])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-white">Foreplay Support Agent</h1>
        <div className="flex flex-col gap-3 min-h-64 bg-gray-900 rounded-xl p-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-sm">Ask anything about the Foreplay API...</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`text-sm px-4 py-3 rounded-lg max-w-xl ${
              m.role === 'user'
                ? 'bg-blue-600 self-end'
                : 'bg-gray-800 self-start'
            }`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="text-sm px-4 py-3 rounded-lg bg-gray-800 self-start text-gray-400">
              Thinking...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-sm outline-none"
            placeholder="e.g. Why did I get a 402 error?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}
