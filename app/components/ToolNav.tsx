'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TOOLS = [
  { label: 'Loan Calculator',   href: '/' },
  { label: 'Mortgage Calculator', href: '/mortgage-calculator' },
  { label: 'Compound Interest', href: '/compound-interest' },
  { label: 'Debt Payoff',       href: '/debt-payoff' },
  { label: 'ROI Calculator',    href: '/roi-calculator' },
]

export default function ToolNav() {
  const pathname = usePathname()
  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TOOLS.map(({ label, href }) => {
          const isActive = pathname === href
          return (
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
