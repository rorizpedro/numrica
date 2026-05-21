'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { TrendingUp, CreditCard, BarChart3, ChevronDown, Download, Share2, Target } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import * as XLSX from 'xlsx'

// ─── Types ─────────────────────────────────────────────────────────────────────
type CompFreq = 'daily' | 'monthly' | 'quarterly' | 'annually'

interface MonthRow { month: number; balance: number; cumContribs: number; cumInterest: number }
interface AnnualRow {
  year: number; startBalance: number; yearContribs: number; yearInterest: number
  endBalance: number; cumContribs: number; cumInterest: number
}

// ─── AdSense placeholders ──────────────────────────────────────────────────────
const AD_SLOT_TOP    = '1111111111'
const AD_SLOT_MID    = '2222222222'
const AD_SLOT_SEO    = '3333333333'
const AD_SLOT_BOTTOM = '4444444444'
declare global { interface Window { adsbygoogle?: unknown[] } }

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const fmtPct = (v: number) => (v * 100).toFixed(2) + '%'

const parseDollars = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0

const fmtNum = (s: string) => {
  const n = parseDollars(s)
  return n === 0 ? s : new Intl.NumberFormat('en-US').format(n)
}

const COMP_FREQ_N: Record<CompFreq, number> = { daily: 365, monthly: 12, quarterly: 4, annually: 1 }

// ─── Calculation engine ────────────────────────────────────────────────────────
function simulate(
  principal: number,
  monthlyContrib: number,
  annualRate: number,
  years: number,
  compFreq: CompFreq,
  atStart: boolean,
): { finalBalance: number; totalInvested: number; totalInterest: number; monthRows: MonthRow[]; annualRows: AnnualRow[] } | null {
  if (principal < 0 || annualRate <= 0 || years <= 0) return null
  const n = COMP_FREQ_N[compFreq]
  const m = Math.pow(1 + annualRate / n, n / 12) - 1
  const N = Math.round(years * 12)

  let balance = principal
  let cumContribs = principal
  let cumInterest = 0
  const monthRows: MonthRow[] = []

  for (let mo = 1; mo <= N; mo++) {
    if (atStart) { balance += monthlyContrib; cumContribs += monthlyContrib }
    const interest = balance * m
    balance += interest
    cumInterest += interest
    if (!atStart) { balance += monthlyContrib; cumContribs += monthlyContrib }
    monthRows.push({ month: mo, balance, cumContribs, cumInterest })
  }

  const annualRows: AnnualRow[] = []
  for (let yr = 1; yr <= Math.ceil(years); yr++) {
    const endIdx = Math.min(yr * 12 - 1, monthRows.length - 1)
    const startIdx = (yr - 1) * 12 - 1
    const endRow = monthRows[endIdx]
    const prevRow = startIdx >= 0 ? monthRows[startIdx] : null
    annualRows.push({
      year: yr,
      startBalance: prevRow ? prevRow.balance : principal,
      yearContribs: endRow.cumContribs - (prevRow ? prevRow.cumContribs : principal),
      yearInterest: endRow.cumInterest - (prevRow ? prevRow.cumInterest : 0),
      endBalance: endRow.balance,
      cumContribs: endRow.cumContribs,
      cumInterest: endRow.cumInterest,
    })
  }

  return { finalBalance: balance, totalInvested: cumContribs, totalInterest: cumInterest, monthRows, annualRows }
}

function calcRequiredMonthly(
  target: number, principal: number, annualRate: number, years: number,
  compFreq: CompFreq, atStart: boolean,
): number {
  if (target <= principal || annualRate <= 0 || years <= 0) return 0
  const n = COMP_FREQ_N[compFreq]
  const m = Math.pow(1 + annualRate / n, n / 12) - 1
  const N = Math.round(years * 12)
  const fvPrincipal = principal * Math.pow(1 + m, N)
  if (fvPrincipal >= target) return 0
  const annuityFactor = (Math.pow(1 + m, N) - 1) / m
  const adjusted = atStart ? annuityFactor * (1 + m) : annuityFactor
  return Math.max(0, (target - fvPrincipal) / adjusted)
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────
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

// ─── Content ───────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: 'Retirement · 30yr', principal: 10000, monthly: 500, rate: '7.00', years: '30' },
  { label: 'College Fund · 18yr', principal: 5000, monthly: 300, rate: '6.00', years: '18' },
  { label: '5-Year Growth', principal: 20000, monthly: 200, rate: '8.00', years: '5' },
]

const FAQ_ITEMS = [
  { q: 'What is compound interest?', a: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest — which only earns on the original principal — compound interest causes your money to grow exponentially over time. The longer the period and the higher the rate, the more dramatic the compounding effect.' },
  { q: 'How is compound interest calculated?', a: 'The formula is FV = P(1 + r/n)^(nt), where P is the principal, r is the annual rate, n is the number of compounding periods per year, and t is the time in years. When adding monthly contributions (PMT), the full formula becomes FV = P(1+r/n)^(nt) + PMT × [(1+r/n)^(nt) − 1] / (r/n). This calculator handles both and accounts for contribution timing.' },
  { q: 'What is the Rule of 72?', a: 'The Rule of 72 is a quick shortcut: divide 72 by the annual interest rate to estimate how many years it takes to double your money. At 6%, your money doubles in about 12 years. At 9%, about 8 years. At 12%, about 6 years. It\'s an approximation — the exact doubling time uses the formula t = ln(2) / ln(1 + r) — but Rule of 72 is accurate to within 1% for rates between 2% and 15%.' },
  { q: 'What is APY, and how is it different from APR?', a: 'APR (Annual Percentage Rate) is the nominal annual rate stated before compounding. APY (Annual Percentage Yield) is the effective annual return after accounting for how often interest compounds. If your APR is 6% compounded monthly, your APY is (1 + 0.06/12)^12 − 1 = 6.168%. The more frequently interest compounds, the higher the APY relative to APR. This calculator shows both.' },
  { q: 'Does compounding frequency make a real difference?', a: 'Yes, but less than most people think at moderate rates. On $10,000 at 7% for 30 years: annual compounding → $76,123; monthly compounding → $81,745; daily compounding → $81,822. The difference between monthly and daily is only $77 over 30 years. The bigger lever is the rate itself and the time invested. Monthly compounding is standard for most savings accounts and investments.' },
  { q: 'How much do monthly contributions matter?', a: '$10,000 invested at 7% for 30 years grows to $76,123 with no contributions. Add $500/month and the result is $613,543 — 8× more. The extra $174,000 in contributions earned $363,420 in compound interest. This is the power of consistent contributions: each new dollar immediately starts earning compound interest, and the earlier contributions compound for the longest time.' },
  { q: 'How does starting earlier affect compound interest?', a: 'Starting early is the single biggest lever in compound interest. $5,000 invested at 25 with 7% annual growth reaches $106,000 by age 65 — with no additional contributions. Waiting until 35 to start gives you only $52,000. That 10-year head start more than doubles the outcome. This is why advisors say "time in the market" matters more than timing the market.' },
  { q: 'What is the difference between compound and simple interest?', a: 'Simple interest only earns on the original principal: $10,000 at 7% for 30 years = $10,000 + ($10,000 × 0.07 × 30) = $31,000. Compound interest earns on principal plus accumulated interest: the same inputs grow to $76,123 monthly compounded — 2.5× more. The gap widens dramatically with time. Simple interest is rare in practice; most savings accounts, bonds, and investment accounts use compound interest.' },
  { q: 'How does inflation affect investment returns?', a: 'Inflation erodes the purchasing power of your nominal returns. If your investment grows 7% annually but inflation runs at 3%, your real return is about 4% (the exact formula is (1.07/1.03) − 1 = 3.88%). Toggle the inflation adjustment on this calculator to see your future balance in today\'s dollars. Over 30 years at 3% inflation, $154,000 nominal is equivalent to about $63,000 in today\'s purchasing power.' },
]

const GLOSSARY = [
  { term: 'Principal', def: 'The initial amount of money invested or deposited before any interest is added.' },
  { term: 'Compound Interest', def: 'Interest calculated on both the initial principal and all accumulated interest from prior periods — causing exponential rather than linear growth.' },
  { term: 'APY (Annual Percentage Yield)', def: 'The effective annual return after accounting for compounding frequency. Always higher than APR when compounding more than once per year.' },
  { term: 'APR (Annual Percentage Rate)', def: 'The nominal annual interest rate stated before compounding. The rate used in the compound interest formula as the base input.' },
  { term: 'Compounding Frequency', def: 'How often interest is calculated and added to the balance. Daily compounding earns slightly more than monthly, which earns slightly more than annual.' },
  { term: 'CAGR (Compound Annual Growth Rate)', def: 'The constant annual rate that would take an investment from its starting value to its ending value over a given period, accounting for compounding.' },
  { term: 'Rule of 72', def: 'A quick approximation: divide 72 by the annual interest rate to estimate years required to double your money. At 6%: ~12 years. At 9%: ~8 years.' },
  { term: 'Future Value (FV)', def: 'The projected value of an investment at a specific date in the future, given an assumed rate of return and compounding schedule.' },
]

const TOOLS_NEXT = [
  { slug: 'debt-payoff', title: 'Debt Payoff Planner', desc: 'Avalanche vs snowball — the fastest, cheapest path to debt-free.', Icon: CreditCard },
  { slug: 'roi-calculator', title: 'ROI Calculator', desc: 'Return on investment — simple, annualized, or inflation-adjusted.', Icon: BarChart3 },
]

const COMP_FREQ_LABELS: { value: CompFreq; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]

// ─── Main component ─────────────────────────────────────────────────────────────
export default function CompoundInterestCalculator() {
  const [rawPrincipal, setRawPrincipal] = useState('10000')
  const [principalDisplay, setPrincipalDisplay] = useState('10,000')
  const [rawMonthly, setRawMonthly] = useState('500')
  const [monthlyDisplay, setMonthlyDisplay] = useState('500')
  const [rate, setRate] = useState('7.00')
  const [years, setYears] = useState('30')
  const [compFreq, setCompFreq] = useState<CompFreq>('monthly')
  const [atStart, setAtStart] = useState(false)
  const [goalMode, setGoalMode] = useState(false)
  const [rawGoal, setRawGoal] = useState('500000')
  const [goalDisplay, setGoalDisplay] = useState('500,000')
  const [showInflation, setShowInflation] = useState(false)
  const [inflationRate, setInflationRate] = useState('3.0')
  const [showTable, setShowTable] = useState(false)
  const [copied, setCopied] = useState(false)

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('p'))    { const v = p.get('p')!; setRawPrincipal(v); setPrincipalDisplay(fmtNum(v)) }
    if (p.get('mo'))   { const v = p.get('mo')!; setRawMonthly(v); setMonthlyDisplay(fmtNum(v)) }
    if (p.get('r'))    setRate(p.get('r')!)
    if (p.get('y'))    setYears(p.get('y')!)
    if (p.get('n'))    setCompFreq(p.get('n') as CompFreq)
    if (p.get('t'))    setAtStart(p.get('t') === 'begin')
    if (p.get('inf'))  { setShowInflation(true); setInflationRate(p.get('inf')!) }
    if (p.get('goal')) { const v = p.get('goal')!; setGoalMode(true); setRawGoal(v); setGoalDisplay(fmtNum(v)) }
  }, [])

  // Sync URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams()
    p.set('p', rawPrincipal)
    if (rawMonthly && rawMonthly !== '0' && !goalMode) p.set('mo', rawMonthly)
    p.set('r', rate)
    if (years !== '30') p.set('y', years)
    if (compFreq !== 'monthly') p.set('n', compFreq)
    if (atStart) p.set('t', 'begin')
    if (showInflation) p.set('inf', inflationRate)
    if (goalMode) p.set('goal', rawGoal)
    window.history.replaceState(null, '', `?${p.toString()}`)
  }, [rawPrincipal, rawMonthly, rate, years, compFreq, atStart, showInflation, inflationRate, goalMode, rawGoal])

  const principal = parseDollars(rawPrincipal)
  const monthlyContrib = parseDollars(rawMonthly)
  const annualRate = parseFloat(rate) / 100 || 0
  const numYears = parseFloat(years) || 0
  const goalTarget = parseDollars(rawGoal)

  const requiredMonthly = useMemo(() => {
    if (!goalMode || !goalTarget || !principal || !annualRate || !numYears) return 0
    return calcRequiredMonthly(goalTarget, principal, annualRate, numYears, compFreq, atStart)
  }, [goalMode, goalTarget, principal, annualRate, numYears, compFreq, atStart])

  const effectiveMonthly = goalMode ? requiredMonthly : monthlyContrib

  const r = useMemo(() =>
    simulate(principal, effectiveMonthly, annualRate, numYears, compFreq, atStart),
    [principal, effectiveMonthly, annualRate, numYears, compFreq, atStart]
  )

  const apy = useMemo(() => {
    const n = COMP_FREQ_N[compFreq]
    return annualRate > 0 ? Math.pow(1 + annualRate / n, n) - 1 : 0
  }, [annualRate, compFreq])

  const doublingYears = annualRate > 0 ? (72 / (annualRate * 100)).toFixed(1) : null

  const realValue = useMemo(() => {
    if (!r || !showInflation || !numYears) return null
    const inf = parseFloat(inflationRate) / 100 || 0.03
    return r.finalBalance / Math.pow(1 + inf, numYears)
  }, [r, showInflation, inflationRate, numYears])

  const rateCompare = useMemo(() => {
    if (!r || !annualRate) return []
    return [-2, 0, 2].map(delta => {
      const adjustedRate = annualRate + delta / 100
      if (adjustedRate <= 0) return null
      const res = simulate(principal, effectiveMonthly, adjustedRate, numYears, compFreq, atStart)
      return res ? { rate: (adjustedRate * 100).toFixed(0), value: res.finalBalance, isCurrent: delta === 0 } : null
    }).filter(Boolean) as { rate: string; value: number; isCurrent: boolean }[]
  }, [r, principal, effectiveMonthly, annualRate, numYears, compFreq, atStart])

  const chartData = useMemo(() => {
    if (!r) return []
    const rows = r.monthRows
    const step = Math.max(1, Math.ceil(rows.length / 60))
    return rows
      .filter((_, i) => i % step === 0 || i === rows.length - 1)
      .map(row => ({ month: row.month, balance: Math.round(row.balance) }))
  }, [r])

  const barData = useMemo(() => {
    if (!r) return []
    return r.annualRows.map(row => ({
      year: row.year,
      principal: Math.round(principal),
      contributions: Math.round(row.cumContribs - principal),
      interest: Math.round(row.cumInterest),
    }))
  }, [r, principal])

  function applyPreset(preset: typeof PRESETS[0]) {
    setRawPrincipal(String(preset.principal))
    setPrincipalDisplay(fmtNum(String(preset.principal)))
    setRawMonthly(String(preset.monthly))
    setMonthlyDisplay(fmtNum(String(preset.monthly)))
    setRate(preset.rate)
    setYears(preset.years)
    setGoalMode(false)
    setCompFreq('monthly')
    setAtStart(false)
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function exportCSV() {
    if (!r) return
    const headers = ['Year', 'Starting Balance', 'Contributions', 'Interest Earned', 'Ending Balance', 'Total Invested', 'Total Interest']
    const rows = r.annualRows.map(row => [row.year, row.startBalance.toFixed(2), row.yearContribs.toFixed(2), row.yearInterest.toFixed(2), row.endBalance.toFixed(2), row.cumContribs.toFixed(2), row.cumInterest.toFixed(2)])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'compound-interest-schedule.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function exportExcel() {
    if (!r) return
    const data = r.annualRows.map(row => ({
      'Year': row.year, 'Starting Balance': row.startBalance, 'Contributions': row.yearContribs,
      'Interest Earned': row.yearInterest, 'Ending Balance': row.endBalance,
      'Total Invested': row.cumContribs, 'Total Interest': row.cumInterest,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Compound Interest')
    XLSX.writeFile(wb, 'compound-interest-schedule.xlsx')
  }

  const inputStyle: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
  const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px' }

  return (
    <>
      <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>

          <div style={{ paddingTop: 20, paddingBottom: 20 }}>
            <AdUnit slot={AD_SLOT_TOP} label="leaderboard" minHeight={90} />
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.6px', lineHeight: 1.15, margin: '0 0 8px' }}>
            Free Compound Interest Calculator
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 540 }}>
            See how your money grows with compound interest and monthly contributions. No signup, no ads tracking.
          </p>

          {/* ── Form card ──────────────────────────────────────────────────── */}
          <div style={cardStyle}>

            {/* Presets */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid #e5e7eb', background: '#f3f4f6', color: '#6b7280', whiteSpace: 'nowrap' }}
                >
                  {preset.label}
                </button>
              ))}
              <span style={{ fontSize: 11, color: '#d1d5db', alignSelf: 'center', marginLeft: 2 }}>Quick start</span>
            </div>

            {/* Row 1: principal, monthly/goal, rate, years */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 14, marginBottom: 14 }}>

              <div>
                <label style={labelStyle}>Starting amount</label>
                <input
                  style={inputStyle} type="text" inputMode="numeric" placeholder="10,000"
                  value={principalDisplay}
                  onChange={e => { setRawPrincipal(e.target.value.replace(/,/g, '')); setPrincipalDisplay(e.target.value) }}
                  onBlur={() => { const n = parseDollars(rawPrincipal); if (n) { setRawPrincipal(String(n)); setPrincipalDisplay(fmtNum(String(n))) } }}
                  onFocus={() => setPrincipalDisplay(rawPrincipal)}
                />
              </div>

              <div>
                <label style={labelStyle}>{goalMode ? 'Target amount' : 'Monthly contribution'}</label>
                {goalMode ? (
                  <input
                    style={inputStyle} type="text" inputMode="numeric" placeholder="500,000"
                    value={goalDisplay}
                    onChange={e => { setRawGoal(e.target.value.replace(/,/g, '')); setGoalDisplay(e.target.value) }}
                    onBlur={() => { const n = parseDollars(rawGoal); if (n) { setRawGoal(String(n)); setGoalDisplay(fmtNum(String(n))) } }}
                    onFocus={() => setGoalDisplay(rawGoal)}
                  />
                ) : (
                  <input
                    style={inputStyle} type="text" inputMode="numeric" placeholder="500"
                    value={monthlyDisplay}
                    onChange={e => { setRawMonthly(e.target.value.replace(/,/g, '')); setMonthlyDisplay(e.target.value) }}
                    onBlur={() => { const n = parseDollars(rawMonthly); if (n) { setRawMonthly(String(n)); setMonthlyDisplay(fmtNum(String(n))) } }}
                    onFocus={() => setMonthlyDisplay(rawMonthly)}
                  />
                )}
              </div>

              <div>
                <label style={labelStyle}>Annual rate (%)</label>
                <input style={inputStyle} type="number" placeholder="7.00" value={rate} onChange={e => setRate(e.target.value)} step="0.1" min="0.01" />
              </div>

              <div>
                <label style={labelStyle}>Years</label>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {(['5', '10', '20', '30'] as const).map(t => (
                    <button
                      key={t} onClick={() => setYears(t)}
                      style={{ width: 34, height: 40, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, padding: 0,
                        background: years === t ? '#1a1a2e' : '#f3f4f6',
                        color: years === t ? '#fff' : '#6b7280',
                        border: '1px solid ' + (years === t ? '#1a1a2e' : '#e5e7eb') }}
                    >{t}</button>
                  ))}
                  <input
                    type="number" placeholder="yr"
                    value={['5','10','20','30'].includes(years) ? '' : years}
                    onChange={e => setYears(e.target.value)}
                    style={{ ...inputStyle, width: 44, padding: '0 6px', flexShrink: 0 }}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: compounding frequency + contribution timing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, marginBottom: 14, alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Compounding frequency</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {COMP_FREQ_LABELS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setCompFreq(f.value)}
                      style={{ padding: '7px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: compFreq === f.value ? 600 : 400,
                        background: compFreq === f.value ? '#1a1a2e' : '#f3f4f6',
                        color: compFreq === f.value ? '#fff' : '#6b7280',
                        border: '1px solid ' + (compFreq === f.value ? '#1a1a2e' : '#e5e7eb') }}
                    >{f.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Contribution timing</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ v: false, l: 'End' }, { v: true, l: 'Begin' }].map(({ v, l }) => (
                    <button
                      key={l} onClick={() => setAtStart(v)}
                      style={{ flex: 1, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: atStart === v ? 600 : 400,
                        background: atStart === v ? '#1a1a2e' : '#f3f4f6',
                        color: atStart === v ? '#fff' : '#6b7280',
                        border: '1px solid ' + (atStart === v ? '#1a1a2e' : '#e5e7eb') }}
                    >{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggles: goal mode + inflation */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setGoalMode(g => !g)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid ' + (goalMode ? '#22c55e' : '#e5e7eb'), background: goalMode ? '#dcfce7' : '#f3f4f6', color: goalMode ? '#15803d' : '#6b7280' }}
              >
                <Target size={12} />
                {goalMode ? 'Goal mode on' : 'I have a goal'}
              </button>
              <button
                onClick={() => setShowInflation(i => !i)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid ' + (showInflation ? '#22c55e' : '#e5e7eb'), background: showInflation ? '#dcfce7' : '#f3f4f6', color: showInflation ? '#15803d' : '#6b7280' }}
              >
                {showInflation ? 'Inflation on' : 'Adjust for inflation'}
              </button>
              {showInflation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>Rate:</span>
                  <input
                    type="number" value={inflationRate} onChange={e => setInflationRate(e.target.value)}
                    step="0.5" min="0" max="20" placeholder="3.0"
                    style={{ ...inputStyle, width: 64, padding: '0 8px' }}
                  />
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>%/yr</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Results ────────────────────────────────────────────────────── */}
          {r ? (
            <div style={{ marginTop: 16 }}>

              {/* Goal mode: required monthly */}
              {goalMode && requiredMonthly > 0 && (
                <div style={{ ...cardStyle, marginBottom: 12, background: '#1a1a2e' }}>
                  <div style={{ fontSize: 11, color: '#86efac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Required monthly contribution</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.8px' }}>{fmt(requiredMonthly)}<span style={{ fontSize: 16, fontWeight: 400, color: '#86efac' }}>/mo</span></div>
                  <div style={{ fontSize: 12, color: '#86efac', marginTop: 6 }}>to reach {fmt(goalTarget)} in {years} years at {rate}% — starting with {fmt(principal)}</div>
                </div>
              )}
              {goalMode && requiredMonthly === 0 && goalTarget > 0 && (
                <div style={{ ...cardStyle, marginBottom: 12, background: '#dcfce7', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>Your initial investment alone will reach {fmt(goalTarget)}!</div>
                  <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>No monthly contributions needed at {rate}% for {years} years.</div>
                </div>
              )}

              {/* Main results card */}
              <div style={cardStyle}>
                {!goalMode && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Future value</div>
                    <div style={{ fontSize: 40, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px', marginBottom: 4 }}>{fmt(r.finalBalance)}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>after {years} years</div>
                  </>
                )}

                {/* Proportion bar */}
                <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 10, border: '1px solid #e5e7eb' }}>
                  <div style={{ width: `${(principal / r.finalBalance * 100).toFixed(1)}%`, background: '#15803d' }} title="Principal" />
                  <div style={{ width: `${((r.totalInvested - principal) / r.finalBalance * 100).toFixed(1)}%`, background: '#22c55e' }} title="Contributions" />
                  <div style={{ width: `${(r.totalInterest / r.finalBalance * 100).toFixed(1)}%`, background: '#86efac' }} title="Interest" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginBottom: 16 }}>
                  {[
                    { label: 'Principal', value: principal, color: '#15803d' },
                    { label: 'Contributions', value: r.totalInvested - principal, color: '#22c55e' },
                    { label: 'Interest earned', value: r.totalInterest, color: '#86efac' },
                  ].map(p => (
                    <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{p.label}</span> {fmt(p.value)} · {(p.value / r.finalBalance * 100).toFixed(0)}%
                    </div>
                  ))}
                </div>

                {/* Key stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {[
                    { label: 'Total invested', value: fmt(r.totalInvested) },
                    { label: 'Interest earned', value: fmt(r.totalInterest) },
                    { label: 'APY', value: fmtPct(apy) },
                    { label: 'Doubles every', value: doublingYears ? `${doublingYears} yrs` : '—' },
                  ].map(card => (
                    <div key={card.label} style={{ background: '#f8f9fb', borderRadius: 8, padding: '11px 13px' }}>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.3px' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Rule of 72 callout */}
                {doublingYears && (
                  <div style={{ marginTop: 12, padding: '8px 12px', background: '#f8f9fb', borderRadius: 8, fontSize: 12, color: '#6b7280' }}>
                    <strong style={{ color: '#1a1a2e' }}>Rule of 72:</strong> at {rate}%, your money doubles roughly every <strong style={{ color: '#15803d' }}>{doublingYears} years</strong>
                  </div>
                )}

                {/* Inflation adjusted */}
                {showInflation && realValue !== null && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#15803d', marginBottom: 3 }}>
                      In today&apos;s dollars: <span style={{ fontSize: 16 }}>{fmt(realValue)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#166534' }}>
                      Inflation ({inflationRate}%/yr over {years} years) reduces your {fmt(r.finalBalance)} by {fmt(r.finalBalance - realValue)} in purchasing power
                    </div>
                  </div>
                )}

                {/* Rate comparison */}
                {rateCompare.length === 3 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>What if the rate changes?</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {rateCompare.map(item => (
                        <div key={item.rate} style={{ position: 'relative', borderRadius: 8, padding: '10px 12px', background: item.isCurrent ? '#1a1a2e' : '#f8f9fb', border: '1px solid ' + (item.isCurrent ? '#1a1a2e' : '#e5e7eb'), textAlign: 'center' }}>
                          {item.isCurrent && (
                            <span style={{ position: 'absolute', top: 7, right: 8, fontSize: 9, fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5 }}>your rate</span>
                          )}
                          <div style={{ fontSize: 20, fontWeight: 700, color: item.isCurrent ? '#fff' : '#1a1a2e', lineHeight: 1.1 }}>
                            {item.rate}%
                            <span style={{ fontSize: 11, fontWeight: 400, color: item.isCurrent ? '#86efac' : '#9ca3af', marginLeft: 4 }}>per year</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: item.isCurrent ? '#86efac' : '#1a1a2e', marginTop: 6 }}>{fmt(item.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  onClick={copyShareUrl}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: copied ? '#22c55e' : '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}
                >
                  <Share2 size={13} />
                  {copied ? 'Link copied!' : 'Share this scenario'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ ...cardStyle, marginTop: 16, fontSize: 13, color: '#d1d5db' }}>
              Fill in the fields above to see your results.
            </div>
          )}

          {/* ── Charts ─────────────────────────────────────────────────────── */}
          {r && chartData.length > 1 && (
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Balance over time</div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <defs>
                      <linearGradient id="ciBalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Balance']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Area type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} fill="url(#ciBalGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Annual composition</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barSize={barData.length > 20 ? 6 : barData.length > 12 ? 10 : 16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis hide />
                    <Tooltip formatter={(v, name) => [fmt(Number(v ?? 0)), name === 'principal' ? 'Principal' : name === 'contributions' ? 'Contributions' : 'Interest']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="principal" stackId="a" fill="#15803d" name="principal" isAnimationActive={false} animationDuration={0} />
                    <Bar dataKey="contributions" stackId="a" fill="#22c55e" name="contributions" isAnimationActive={false} animationDuration={0} />
                    <Bar dataKey="interest" stackId="a" fill="#86efac" name="interest" radius={[2, 2, 0, 0]} isAnimationActive={false} animationDuration={0} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#15803d' }} /> Principal</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e' }} /> Contributions</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#86efac' }} /> Interest</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Annual table ─────────────────────────────────────────────── */}
          {r && (
            <div style={{ ...cardStyle, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <button
                  onClick={() => setShowTable(s => !s)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22c55e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Annual growth schedule
                  <ChevronDown size={14} style={{ transform: showTable ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {showTable && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[{ label: 'CSV', fn: exportCSV }, { label: 'Excel', fn: exportExcel }].map(({ label, fn }) => (
                      <button key={label} onClick={fn} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                        <Download size={11} /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {showTable && (
                <div style={{ marginTop: 14, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                        {['Year', 'Contributions', 'Interest', 'Ending Balance', 'Total Invested', 'Total Interest'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.annualRows.map((row, i) => (
                        <tr key={row.year} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>{row.year}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#22c55e' }}>{fmt(row.yearContribs)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#6b7280' }}>{fmt(row.yearInterest)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#1a1a2e', fontWeight: 600 }}>{fmt(row.endBalance)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af' }}>{fmt(row.cumContribs)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af' }}>{fmt(row.cumInterest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <AdUnit slot={AD_SLOT_MID} label="after results" />
          </div>
        </section>

        {/* ── Try these next ─────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 12px' }}>Try these next</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {TOOLS_NEXT.map(({ slug, title, desc, Icon }) => (
              <div key={slug} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#9ca3af" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{title}</span>
                    <span style={{ fontSize: 9, background: '#f3f4f6', color: '#9ca3af', padding: '2px 4px', borderRadius: 3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>soon</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <AdUnit slot={AD_SLOT_SEO} label="mid content" />
        </div>

        {/* ── SEO content ─────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How compound interest works</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            Compound interest means earning interest on your interest. When interest is added to your balance, that larger balance earns more interest in the next period — creating a self-reinforcing growth cycle. The formula is <strong>FV = P(1 + r/n)^(nt)</strong>, where P is principal, r is the annual rate, n is compounding frequency, and t is years.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            Monthly contributions dramatically amplify this effect. Each new dollar you add immediately begins compounding. The earlier you start contributing — even small amounts — the more time each dollar has to compound, producing results that can seem almost magical over long time horizons.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>What does $10,000 grow to at different rates?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 12px' }}>
            With no additional contributions, monthly compounding, over 20 years:
          </p>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                  {['Rate', '5 years', '10 years', '20 years', '30 years'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['4%', '$12,210', '$14,888', '$22,167', '$33,024'],
                  ['6%', '$13,488', '$18,194', '$33,102', '$60,226'],
                  ['8%', '$14,898', '$22,196', '$49,268', '$109,357'],
                  ['10%', '$16,453', '$27,070', '$73,281', '$198,374'],
                ].map(([rate, ...values], i) => (
                  <tr key={rate} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{rate}</td>
                    {values.map(v => <td key={v} style={{ padding: '8px 12px', textAlign: 'right', color: '#6b7280' }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How compound interest with monthly contributions works</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            Adding $500/month to a $10,000 initial investment at 7% for 30 years: without contributions, the $10,000 grows to $76,123. With $500/month contributions, the balance reaches $613,543 — your $10,000 plus $180,000 in contributions earned $423,543 in compound interest.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            The key insight: even though the total contributions ($180,000) are almost 2× the initial investment ($10,000), the interest earned ($423,543) dwarfs both. This is because every new contribution immediately starts compounding alongside the original principal.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>The Rule of 72 — how fast does your money double?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            Divide 72 by your annual interest rate to estimate the doubling time. At 6% → 12 years. At 8% → 9 years. At 10% → 7.2 years. This rule is accurate within 1% for rates between 2% and 15%. The exact formula is t = ln(2) / ln(1+r). This calculator shows your doubling time automatically in the results panel.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>Daily vs monthly vs annual compounding: does it matter?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            On $10,000 at 7% over 30 years: annual compounding → $76,123. Monthly compounding → $81,745. Daily compounding → $81,822. The difference between monthly and daily is just $77 over 30 years — negligible. The compounding frequency matters far less than the rate itself and how long you stay invested. Monthly compounding is standard for most savings and investment accounts.
          </p>

        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Frequently asked questions</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Everything you need to know about compound interest.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 20px' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* ── Glossary ────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Compound interest terms explained</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, margin: 0, padding: 0 }}>
            {GLOSSARY.map(({ term, def }) => (
              <div key={term} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '14px 16px' }}>
                <dt style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{term}</dt>
                <dd style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Formula block ───────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 48px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>The compound interest formula</h2>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
            <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '16px 20px', fontFamily: 'monospace', fontSize: 14, color: '#1a1a2e', marginBottom: 14, textAlign: 'center', letterSpacing: 0.5 }}>
              FV = P(1 + r/n)^(nt) + PMT × [(1 + r/n)^(nt) − 1] / (r/n)
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '6px 16px', fontSize: 13, margin: 0, padding: 0 }}>
              {[
                ['FV', 'Future value — the ending balance'],
                ['P', 'Principal — the starting amount'],
                ['r', 'Annual interest rate (as a decimal, e.g. 0.07 for 7%)'],
                ['n', 'Compounding frequency per year (12 for monthly, 365 for daily)'],
                ['t', 'Time in years'],
                ['PMT', 'Periodic contribution amount (monthly deposit)'],
              ].map(([sym, desc]) => (
                <React.Fragment key={sym}>
                  <dt style={{ fontWeight: 700, color: '#1a1a2e', fontFamily: 'monospace', margin: 0 }}>{sym}</dt>
                  <dd style={{ color: '#6b7280', margin: 0 }}>{desc}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </section>

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 32px' }}>
          <AdUnit slot={AD_SLOT_BOTTOM} label="above footer" />
        </div>

        <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Results are illustrative only and do not constitute financial advice. Actual investment returns vary and are not guaranteed. Consult a qualified financial advisor before making investment decisions.
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
