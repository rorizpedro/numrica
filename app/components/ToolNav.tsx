'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TOOLS = [
  { label: 'Loan Calculator', href: '/' },
  { label: 'Mortgage Calculator', href: '/mortgage-calculator', coming: true },
  { label: 'Compound Interest', href: '/compound-interest', coming: true },
  { label: 'Debt Payoff', href: '/debt-payoff', coming: true },
  { label: 'ROI Calculator', href: '/roi-calculator', coming: true },
]

export default function ToolNav() {
  const pathname = usePathname()
  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TOOLS.map(({ label, href, coming }) => {
          const isActive = pathname === href
          return coming ? (
            <span
              key={href}
              style={{ padding: '9px 10px', fontSize: 13, color: '#d1d5db', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
            >
              {label}
              <span style={{ fontSize: 9, background: '#f3f4f6', color: '#9ca3af', padding: '2px 4px', borderRadius: 3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                soon
              </span>
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              style={{
                padding: '9px 10px',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#22c55e' : '#6b7280',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #22c55e' : '2px solid transparent',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
