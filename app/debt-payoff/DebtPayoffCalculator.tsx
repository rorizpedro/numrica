'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Script from 'next/script'
import { TrendingUp, Home, BarChart3, ChevronDown, Plus, Trash2, Share2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Debt { id: string; name: string; balance: string; rate: string; minimum: string }
interface DebtInput { id: string; name: string; balance: number; annualRate: number; minimum: number }
interface DebtResult { id: string; name: string; originalBalance: number; interestPaid: number; payoffMonth: number }
interface SimResult {
  months: number; totalInterest: number; totalPaid: number
  debtResults: DebtResult[]
  monthlyData: { month: number; totalBalance: number }[]
}

// ── Constants ─────────────────────────────────────────────────────────────────
const AD_SLOT_TOP    = '1111111111'
const AD_SLOT_MID    = '2222222222'
const AD_SLOT_SEO    = '3333333333'
const AD_SLOT_BOTTOM = '4444444444'
declare global { interface Window { adsbygoogle?: unknown[] } }

const DEBT_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const DEFAULT_DEBTS: Debt[] = [
  { id: '1', name: 'Credit Card',   balance: '5400',  rate: '24.99', minimum: '130' },
  { id: '2', name: 'Car Loan',      balance: '12000', rate: '7.50',  minimum: '280' },
  { id: '3', name: 'Personal Loan', balance: '3200',  rate: '15.00', minimum: '90'  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const parseMoney = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0

function monthsToDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// ── Engine ────────────────────────────────────────────────────────────────────
function simulate(inputs: DebtInput[], extra: number, strategy: 'avalanche' | 'snowball'): SimResult {
  if (!inputs.length) return { months: 0, totalInterest: 0, totalPaid: 0, debtResults: [], monthlyData: [] }

  const balances  = new Map(inputs.map(d => [d.id, d.balance]))
  const intAcc    = new Map(inputs.map(d => [d.id, 0]))
  const payoffMos = new Map<string, number>()

  const priority = (strategy === 'avalanche'
    ? [...inputs].sort((a, b) => b.annualRate - a.annualRate)
    : [...inputs].sort((a, b) => a.balance - b.balance)
  ).map(d => d.id)

  // Fixed monthly budget — freed minimums cascade automatically
  const totalBudget = extra + inputs.reduce((s, d) => s + d.minimum, 0)
  const totalStart  = inputs.reduce((s, d) => s + d.balance, 0)
  const monthlyData = [{ month: 0, totalBalance: Math.round(totalStart) }]
  let totalIntPaid = 0
  let month = 0

  while (month < 600) {
    month++

    // Interest
    for (const d of inputs) {
      const bal = balances.get(d.id)!
      if (bal < 0.01) continue
      const int = bal * (d.annualRate / 100 / 12)
      balances.set(d.id, bal + int)
      intAcc.set(d.id, intAcc.get(d.id)! + int)
      totalIntPaid += int
    }

    // Pay minimums — inactive debts leave their minimum in pool (cascade)
    let pool = totalBudget
    for (const d of inputs) {
      const bal = balances.get(d.id)!
      if (bal < 0.01) continue
      const pay = Math.min(d.minimum, bal)
      balances.set(d.id, bal - pay)
      pool -= pay
      if (balances.get(d.id)! < 0.01) {
        balances.set(d.id, 0)
        if (!payoffMos.has(d.id)) payoffMos.set(d.id, month)
      }
    }

    // Apply pool to priority debts
    for (const id of priority) {
      if (pool < 0.01) break
      const bal = balances.get(id)!
      if (bal < 0.01) continue
      const pay = Math.min(pool, bal)
      balances.set(id, bal - pay)
      pool -= pay
      if (balances.get(id)! < 0.01) {
        balances.set(id, 0)
        if (!payoffMos.has(id)) payoffMos.set(id, month)
      }
    }

    const total = [...balances.values()].reduce((s, b) => s + b, 0)
    monthlyData.push({ month, totalBalance: Math.max(0, Math.round(total)) })
    if (total < 0.01) break
  }

  return {
    months: month,
    totalInterest: Math.round(totalIntPaid),
    totalPaid: Math.round(totalStart + totalIntPaid),
    debtResults: inputs.map(d => ({
      id: d.id, name: d.name, originalBalance: d.balance,
      interestPaid: Math.round(intAcc.get(d.id)!),
      payoffMonth: payoffMos.get(d.id) ?? month,
    })),
    monthlyData,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────
function AdUnit({ slot, label, minHeight = 90 }: { slot: string; label: string; minHeight?: number }) {
  void slot
  return (
    <div style={{ width: '100%', minHeight, background: '#f3f4f6', border: '1px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
      Ad · {label}
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={16} color="#9ca3af" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 14px', paddingRight: 24 }}>{a}</p>}
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'What is the debt avalanche method?', a: 'The debt avalanche targets the highest interest rate first while making minimum payments on all others. Once the top debt is paid off, its payment cascades to the next highest-rate debt. This is mathematically optimal — it minimizes the total interest you pay over the full payoff period.' },
  { q: 'What is the debt snowball method?', a: 'The debt snowball focuses on the smallest balance first, regardless of interest rate. The psychological wins of eliminating debts quickly help people stay motivated. Total interest paid is usually higher than with the avalanche, but completion rates tend to be better for people who need behavioral reinforcement.' },
  { q: 'Which method saves more money: avalanche or snowball?', a: 'Avalanche almost always saves more in total interest — because you eliminate high-rate balances faster. The gap between the two methods depends on the rate spread across your debts. On $20,000 across three debts with rates of 25%, 15%, and 8%, the avalanche can save $400–$1,000 vs. the snowball. If you can stay disciplined, always choose avalanche for cost savings.' },
  { q: 'What is the debt cascade?', a: 'The cascade is the core mechanic of both methods: when you pay off a debt, you don\'t reduce your monthly payment — you redirect it to the next priority debt. A $130/month credit card payment, once freed, adds to your next target. Each time you eliminate a debt, your focused payment grows, accelerating payoff.' },
  { q: 'How much does extra monthly payment help?', a: 'Significantly. On $10,000 in credit card debt at 20% APR with a $250 minimum, paying $100 extra per month reduces payoff from 67 months to 42 — 25 months faster — and saves over $2,100 in interest. Extra payments work best directed at the highest-rate debt first (avalanche).' },
  { q: 'Should I pay off debt or invest?', a: 'General rule: debt above 6–7% interest beats uncertain market returns — pay it off first. High-interest debt (credit cards at 18–25%) should almost always be paid before investing. For low-rate debt (mortgage at 3–5%), investing in equities historically wins. Always contribute to a 401(k) up to any employer match first — that\'s a guaranteed 50–100% return.' },
  { q: 'What is a minimum payment trap?', a: 'Paying only the required minimum keeps your balance high and maximizes interest charges. On $5,000 at 24% APR with a $125 minimum, minimum-only payments take 7+ years and result in over $4,000 in interest — nearly doubling the original balance. It\'s the most expensive way to carry debt.' },
  { q: 'What order should I pay off my debts?', a: 'For minimum cost: highest interest rate first (avalanche). For motivation: smallest balance first (snowball). Always continue minimums on all other debts — missed minimums trigger late fees and penalty APRs. If you have a 0% introductory APR card, use that window aggressively before the rate resets.' },
]

const GLOSSARY = [
  { term: 'Debt Avalanche', def: 'Paying highest interest rate first. Minimizes total interest paid — the mathematically optimal approach.' },
  { term: 'Debt Snowball', def: 'Paying smallest balance first. Provides quick psychological wins; usually costs more in total interest.' },
  { term: 'Debt Cascade', def: 'When a debt is eliminated, its payment is redirected to the next priority debt, accelerating payoff speed.' },
  { term: 'Minimum Payment', def: 'The smallest required monthly payment. Paying only the minimum maximizes interest costs and extends payoff dramatically.' },
  { term: 'APR', def: 'Annual Percentage Rate — the yearly interest rate on outstanding balances. Credit cards typically range 15–30% APR.' },
  { term: 'Extra Payment', def: 'Any amount above the minimum. Extra payments go entirely to principal, directly reducing future interest charges.' },
  { term: 'Principal', def: 'The original balance owed before interest. Each payment covers interest first, then reduces principal.' },
  { term: 'Payoff Date', def: 'The month and year when a debt reaches zero balance, calculated from your current payment plan.' },
]

const TOOLS_NEXT = [
  { slug: 'compound-interest', title: 'Compound Interest', desc: 'See how money grows with compound interest and regular contributions.', Icon: TrendingUp },
  { slug: 'mortgage-calculator', title: 'Mortgage Calculator', desc: 'Full PITI breakdown with PMI, taxes, insurance, and amortization.', Icon: Home },
  { slug: 'roi-calculator', title: 'ROI Calculator', desc: 'Calculate investment return, CAGR, and S&P 500 comparison.', Icon: BarChart3 },
]

// ── Main component ─────────────────────────────────────────────────────────────
export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>(DEFAULT_DEBTS)
  const [extra, setExtra] = useState('')
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche')
  const [showTable, setShowTable] = useState(false)
  const [copied, setCopied] = useState(false)
  const nextId = useRef(DEFAULT_DEBTS.length + 1)

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('extra')) setExtra(p.get('extra')!)
    if (p.get('s') === 'snowball') setStrategy('snowball')
    const d = p.get('d')
    if (d) {
      const parsed = d.split('|').map((seg, i) => {
        const parts = seg.split(',')
        return { id: String(i + 1), name: parts[0] ?? '', balance: parts[1] ?? '', rate: parts[2] ?? '', minimum: parts[3] ?? '' }
      })
      if (parsed.length > 0) { setDebts(parsed); nextId.current = parsed.length + 1 }
    }
  }, [])

  // Sync URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams()
    if (extra) p.set('extra', extra)
    if (strategy !== 'avalanche') p.set('s', strategy)
    p.set('d', debts.map(d => [d.name, d.balance, d.rate, d.minimum].join(',')).join('|'))
    window.history.replaceState(null, '', `?${p.toString()}`)
  }, [debts, extra, strategy])

  const debtInputs = useMemo<DebtInput[]>(() =>
    debts
      .map(d => ({ id: d.id, name: d.name || 'Debt', balance: parseMoney(d.balance), annualRate: parseFloat(d.rate) || 0, minimum: parseMoney(d.minimum) }))
      .filter(d => d.balance > 0 && d.minimum > 0 && d.annualRate >= 0)
  , [debts])

  const extraNum = parseMoney(extra)

  const rAvalanche = useMemo(() => debtInputs.length ? simulate(debtInputs, extraNum, 'avalanche') : null, [debtInputs, extraNum])
  const rSnowball  = useMemo(() => debtInputs.length ? simulate(debtInputs, extraNum, 'snowball')  : null, [debtInputs, extraNum])
  const rMinOnly   = useMemo(() => debtInputs.length ? simulate(debtInputs, 0, 'avalanche') : null, [debtInputs])

  const r      = strategy === 'avalanche' ? rAvalanche : rSnowball
  const thisLabel  = strategy === 'avalanche' ? 'Avalanche' : 'Snowball'

  const compBars = useMemo(() => {
    if (!rAvalanche || !rSnowball || !rMinOnly) return []
    return [
      { name: 'Min. only', value: rMinOnly.totalInterest,   color: '#94a3b8' },
      { name: 'Snowball',  value: rSnowball.totalInterest,  color: '#3b82f6' },
      { name: 'Avalanche', value: rAvalanche.totalInterest, color: '#22c55e' },
    ]
  }, [rAvalanche, rSnowball, rMinOnly])

  function addDebt() {
    if (debts.length >= 8) return
    setDebts(d => [...d, { id: String(nextId.current++), name: '', balance: '', rate: '', minimum: '' }])
  }

  function removeDebt(id: string) { setDebts(d => d.filter(x => x.id !== id)) }

  function updateDebt(id: string, field: keyof Debt, value: string) {
    setDebts(d => d.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 36, border: '1px solid #e5e7eb', borderRadius: 8,
    padding: '0 10px', fontSize: 13, color: '#1a1a2e', background: '#fff',
    outline: 'none', boxSizing: 'border-box',
  }

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  })

  const interestSaved = rAvalanche && rSnowball ? rSnowball.totalInterest - rAvalanche.totalInterest : 0
  const monthsSaved   = rAvalanche && rSnowball ? rSnowball.months - rAvalanche.months : 0

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">{faqSchema}</Script>
      <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>

        {/* Ad top */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '20px 24px 0' }}>
          <AdUnit slot={AD_SLOT_TOP} label="leaderboard" />
        </section>

        <section style={{ maxWidth: 840, margin: '0 auto', padding: '28px 24px 24px' }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.6px', lineHeight: 1.15, margin: '0 0 8px' }}>
            Free Debt Payoff Calculator — Avalanche vs. Snowball
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 560 }}>
            Enter your debts and find the fastest, cheapest path to debt-free. Compare avalanche and snowball side by side. No signup required.
          </p>

          {/* ── Debt input card ───────────────────────────────────────────── */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px' }}>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 86px 100px 32px', gap: 8, marginBottom: 8 }}>
              {['Debt name', 'Balance ($)', 'APR (%)', 'Min/mo ($)', ''].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>

            {/* Debt rows */}
            <div style={{ overflowX: 'auto' }}>
              {debts.map((debt, i) => (
                <div key={debt.id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 86px 100px 32px', gap: 8, marginBottom: 8, alignItems: 'center', minWidth: 420 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: DEBT_COLORS[i % DEBT_COLORS.length], flexShrink: 0 }} />
                    <input
                      type="text" placeholder="Credit Card" value={debt.name}
                      onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <input type="text" inputMode="numeric" placeholder="5,400" value={debt.balance}
                    onChange={e => updateDebt(debt.id, 'balance', e.target.value.replace(/[^0-9.]/g, ''))}
                    style={inputStyle} />
                  <input type="text" inputMode="decimal" placeholder="24.99" value={debt.rate}
                    onChange={e => updateDebt(debt.id, 'rate', e.target.value.replace(/[^0-9.]/g, ''))}
                    style={inputStyle} />
                  <input type="text" inputMode="numeric" placeholder="130" value={debt.minimum}
                    onChange={e => updateDebt(debt.id, 'minimum', e.target.value.replace(/[^0-9.]/g, ''))}
                    style={inputStyle} />
                  {debts.length > 1
                    ? <button onClick={() => removeDebt(debt.id)} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#d1d5db' }}><Trash2 size={14} /></button>
                    : <div />}
                </div>
              ))}
            </div>

            {/* Controls: add debt | extra payment | strategy toggle */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
              {debts.length < 8 && (
                <button onClick={addDebt} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#22c55e', background: 'none', border: '1px solid #86efac', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  <Plus size={12} /> Add debt
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>Extra/mo:</span>
                <input type="text" inputMode="numeric" placeholder="0" value={extra}
                  onChange={e => setExtra(e.target.value.replace(/[^0-9.]/g, ''))}
                  style={{ ...inputStyle, width: 80 }} />
              </div>
              <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb', marginLeft: 'auto' }}>
                {(['avalanche', 'snowball'] as const).map(s => (
                  <button key={s} onClick={() => setStrategy(s)} style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: strategy === s ? '#1a1a2e' : '#f8f9fb', color: strategy === s ? '#fff' : '#6b7280' }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results ────────────────────────────────────────────────────── */}
          {r ? (
            <div style={{ marginTop: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px' }}>
                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
                  {[
                    { label: 'Debt-free by',    value: monthsToDate(r.months), highlight: true },
                    { label: 'Total interest',  value: fmt(r.totalInterest) },
                    { label: 'Total paid',      value: fmt(r.totalPaid) },
                    { label: 'Months left',     value: String(r.months) },
                  ].map(card => (
                    <div key={card.label} style={{ background: card.highlight ? '#1a1a2e' : '#f8f9fb', borderRadius: 8, padding: '11px 13px' }}>
                      <div style={{ fontSize: 11, color: card.highlight ? '#86efac' : '#9ca3af', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                      <div style={{ fontSize: card.highlight ? 18 : 16, fontWeight: 700, color: card.highlight ? '#fff' : '#1a1a2e', letterSpacing: '-0.3px' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Avalanche vs Snowball callout */}
                {rAvalanche && rSnowball && interestSaved !== 0 && (
                  <div style={{ padding: '12px 14px', borderRadius: 8, background: strategy === 'avalanche' ? '#dcfce7' : '#f8f9fb', border: '1px solid ' + (strategy === 'avalanche' ? '#86efac' : '#e5e7eb'), marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: strategy === 'avalanche' ? '#15803d' : '#6b7280' }}>
                      {interestSaved > 0
                        ? `💡 Avalanche saves ${fmt(interestSaved)} in interest${monthsSaved > 0 ? ` and ${monthsSaved} month${monthsSaved > 1 ? 's' : ''}` : ''} vs. Snowball`
                        : `Snowball and Avalanche have similar costs — rate spread is small`}
                    </div>
                    {strategy === 'snowball' && interestSaved > 0 && (
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Switch to Avalanche to save {fmt(interestSaved)} in total interest</div>
                    )}
                  </div>
                )}

                {/* Extra payment impact */}
                {rMinOnly && extraNum > 0 && (
                  <div style={{ padding: '12px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>
                      Extra {fmt(extraNum)}/mo saves {fmt(rMinOnly.totalInterest - r.totalInterest)} in interest and {rMinOnly.months - r.months} months vs. minimums only
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <div style={{ marginTop: 12 }}>
                <button onClick={copyShareUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: copied ? '#22c55e' : '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
                  <Share2 size={13} />
                  {copied ? 'Link copied!' : 'Share this plan'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px', marginTop: 16, fontSize: 13, color: '#d1d5db' }}>
              Fill in all debt fields above (balance, APR, minimum) to see your payoff plan.
            </div>
          )}
        </section>

        {/* ── Charts ─────────────────────────────────────────────────────────── */}
        {r && compBars.length > 0 && (
          <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>

              {/* Balance over time */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Total balance — {thisLabel}
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={r.monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <defs>
                      <linearGradient id="dpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={v => `Mo ${v}`} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Balance']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Area type="monotone" dataKey="totalBalance" stroke="#22c55e" strokeWidth={2} fill="url(#dpGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Interest comparison */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Total interest comparison
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={compBars} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={72} />
                    <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Total interest']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false} animationDuration={0}>
                      {compBars.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      <LabelList dataKey="value" position="insideRight" formatter={(v: unknown) => fmt(Number(v ?? 0))} style={{ fill: '#fff', fontWeight: 700, fontSize: 12 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* ── Per-debt breakdown ──────────────────────────────────────────────── */}
        {r && r.debtResults.length > 0 && (
          <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Per-debt breakdown — {thisLabel}</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                      {['Debt', 'Balance', 'Interest paid', 'Payoff date'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.debtResults.map((dr, i) => (
                      <tr key={dr.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: DEBT_COLORS[i % DEBT_COLORS.length] }} />
                            <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{dr.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#6b7280' }}>{fmt(dr.originalBalance)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#ef4444' }}>{fmt(dr.interestPaid)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#22c55e', fontWeight: 600 }}>{monthsToDate(dr.payoffMonth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── Month-by-month table ────────────────────────────────────────────── */}
        {r && r.monthlyData.length > 1 && (
          <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 22px' }}>
              <button onClick={() => setShowTable(s => !s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22c55e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Month-by-month breakdown
                <ChevronDown size={14} style={{ transform: showTable ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showTable && (
                <div style={{ marginTop: 14, overflowX: 'auto', maxHeight: 320, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#f8f9fb' }}>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>Month</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>Remaining balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.monthlyData.map((row, i) => (
                        <tr key={row.month} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>{row.month}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#22c55e', fontWeight: 600 }}>{fmt(row.totalBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <AdUnit slot={AD_SLOT_MID} label="after results" />
        </div>

        {/* ── Try these next ──────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 12px' }}>Try these next</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {TOOLS_NEXT.map(({ slug, title, desc, Icon }) => (
              <a key={slug} href={`/${slug}`} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#9ca3af" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <AdUnit slot={AD_SLOT_SEO} label="mid content" />
        </div>

        {/* ── SEO content ─────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>Avalanche vs. Snowball: which method is better?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            The <strong>debt avalanche</strong> targets the highest interest rate first — mathematically optimal, minimizing total interest paid. The <strong>debt snowball</strong> targets the smallest balance first — psychologically effective, with quick wins that keep you motivated. For most people with discipline, avalanche wins on cost. For people who need behavioral reinforcement, snowball wins on completion rate.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            The dollar difference between the two methods is usually smaller than you expect — a few hundred to a few thousand dollars, depending on the rate spread across your debts. The most important factor is consistency: picking one method and making extra payments every month matters far more than which method you choose.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How the debt cascade works</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            The cascade is the most powerful mechanic in debt payoff. When you eliminate a debt, you don&apos;t reduce your total monthly payment — you redirect it to the next priority debt. A $130/month credit card payment, once freed, adds directly to your attack on the next debt. Each time you eliminate a debt, your focused payment grows, and payoff accelerates. Most people are debt-free months sooner than they expect once the cascade kicks in.
          </p>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Frequently asked questions</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Avalanche, snowball, and the math behind debt payoff.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 20px' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* ── Glossary ────────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 48px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Debt payoff terms explained</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, margin: 0, padding: 0 }}>
            {GLOSSARY.map(({ term, def }) => (
              <div key={term} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '14px 16px' }}>
                <dt style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{term}</dt>
                <dd style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 32px' }}>
          <AdUnit slot={AD_SLOT_BOTTOM} label="above footer" />
        </div>

        <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Results are illustrative only and do not constitute financial advice. Consult a qualified financial advisor before making debt management decisions.
            </span>
          </div>
        </div>
        <footer style={{ background: '#fff' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Numrica" width={17} height={20} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>numrica.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href="/privacy-policy" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} Numrica</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
