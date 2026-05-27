'use client'

import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return
    setLoading(true)
    setReply('')
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '오류 발생')
      setReply(data.reply)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🤖 Claude API 테스트</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>메시지를 입력하면 AI가 한국어로 답해줘요.</p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) sendMessage() }}
        placeholder="메시지를 입력하세요... (Ctrl+Enter로 전송)"
        rows={4}
        style={{
          width: '100%', padding: 12, fontSize: 15, borderRadius: 8,
          border: '1px solid #ddd', resize: 'vertical', boxSizing: 'border-box',
        }}
      />

      <button
        onClick={sendMessage}
        disabled={loading || !message.trim()}
        style={{
          marginTop: 10, padding: '10px 24px', fontSize: 15, borderRadius: 8,
          background: loading ? '#aaa' : '#2563eb', color: '#fff', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
        }}
      >
        {loading ? '⏳ 응답 중...' : '전송'}
      </button>

      {error && (
        <div style={{ marginTop: 20, padding: 16, background: '#fee2e2', borderRadius: 8, color: '#dc2626' }}>
          ❌ {error}
        </div>
      )}

      {reply && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f9ff', borderRadius: 8, lineHeight: 1.7 }}>
          <strong style={{ display: 'block', marginBottom: 8, color: '#2563eb' }}>AI 응답</strong>
          {reply}
        </div>
      )}
    </div>
  )
}
