'use client'
import { useState } from 'react'
import { Code, Copy, Check } from 'lucide-react'

export default function EmbedButton({ tool, title }: { tool: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const src = `https://numrica.com/${tool}?embed=1`
  const code = `<iframe\n  src="${src}"\n  width="100%"\n  height="680"\n  frameborder="0"\n  style="border:none;border-radius:12px;"\n  title="${title} — Numrica"\n></iframe>`

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}
      >
        <Code size={13} /> Embed
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Embed this calculator</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.6 }}>
              Copy the code below and paste it into any webpage. The calculator will load inside an iframe with a link back to Numrica.
            </p>
            <pre style={{ background: '#f8f9fb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14, fontSize: 12, color: '#1a1a2e', overflowX: 'auto', margin: '0 0 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {code}
            </pre>
            <button
              onClick={copy}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: copied ? '#22c55e' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy embed code'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
