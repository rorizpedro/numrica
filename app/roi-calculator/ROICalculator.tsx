'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Script from 'next/script'
import { TrendingUp, Home, CreditCard, ChevronDown, Share2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface YearRow { year: number; yours: number; sp500: number; real?: number }
interface CompBar { name: string; value: number; color: string }

// ─── AdSense placeholders ──────────────────────────────────────────────────────
const AD_SLOT_TOP    = '1111111111'
const AD_SLOT_MID    = '2222222222'
const AD_SLOT_SEO    = '3333333333'
const AD_SLOT_BOTTOM = '4444444444'
declare global { interface Window { adsbygoogle?: unknown[] } }

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const fmtPct = (v: number, decimals = 2) => v.toFixed(decimals) + '%'

const parseDollars = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0

const fmtNum = (s: string) => {
  const n = parseDollars(s)
  return n === 0 ? s : new Intl.NumberFormat('en-US').format(n)
}

const SP500_RATE = 0.10 // long-term historical proxy

// ─── Calculation engine ────────────────────────────────────────────────────────
function calcROI(params: {
  initial: number; final: number; years: number
  feePct: number; inflationPct: number; showInflation: boolean
}) {
  const { initial, final, years, feePct, showInflation, inflationPct } = params
  if (initial <= 0 || final <= 0 || years <= 0) return null

  const nominalGain = final - initial
  const roi = (nominalGain / initial) * 100
  const cagr = Math.pow(final / initial, 1 / years) - 1
  const simpleAnnualized = roi / years

  const sp500Final = initial * Math.pow(1 + SP500_RATE, years)
  const beatsSP500 = final >= sp500Final

  const realFinal = showInflation ? final / Math.pow(1 + inflationPct / 100, years) : null
  const realGain = realFinal !== null ? realFinal - initial : null
  const realROI = realFinal !== null ? ((realFinal - initial) / initial) * 100 : null
  const realCAGR = realFinal !== null && realFinal > 0 ? Math.pow(realFinal / initial, 1 / years) - 1 : null

  // Fee drag: what would FV be without feePct annual drag?
  const feeAdjCAGR = feePct > 0 ? cagr + feePct / 100 : null
  const feeAdjFinal = feeAdjCAGR !== null ? initial * Math.pow(1 + feeAdjCAGR, years) : null
  const feeDrag = feeAdjFinal !== null ? feeAdjFinal - final : null

  // Year-by-year data
  const yearRows: YearRow[] = []
  for (let yr = 0; yr <= Math.ceil(years); yr++) {
    const t = Math.min(yr, years)
    const yours = Math.round(initial * Math.pow(1 + cagr, t))
    const sp500 = Math.round(initial * Math.pow(1 + SP500_RATE, t))
    const real = showInflation ? Math.round(yours / Math.pow(1 + inflationPct / 100, t)) : undefined
    yearRows.push({ year: yr, yours, sp500, ...(real !== undefined ? { real } : {}) })
  }

  const compBars: CompBar[] = [
    { name: 'Yours', value: final, color: '#22c55e' },
    { name: 'S&P 500', value: sp500Final, color: '#64748b' },
    ...(realFinal !== null ? [{ name: 'Real value', value: realFinal, color: '#86efac' }] : []),
  ]

  return {
    nominalGain, roi, cagr, simpleAnnualized,
    sp500Final, beatsSP500,
    realFinal, realGain, realROI, realCAGR,
    feeDrag, feeAdjFinal,
    yearRows, compBars,
  }
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
const FAQ_ITEMS = [
  { q: 'What is ROI and how is it calculated?', a: 'ROI (Return on Investment) measures how much your investment gained or lost relative to its cost. The formula is ROI = (Final Value − Initial Investment) / Initial Investment × 100. A $10,000 investment that grows to $18,500 has an ROI of 85%. ROI tells you the total return over the entire period — it does not account for how long the investment was held.' },
  { q: 'What is CAGR and how is it different from ROI?', a: 'CAGR (Compound Annual Growth Rate) is the constant annual rate that would take your investment from its starting value to its ending value, accounting for compounding. The formula is CAGR = (Final/Initial)^(1/years) − 1. While ROI shows total return, CAGR shows annualized return with compounding — making it the right metric to compare investments held for different lengths of time.' },
  { q: 'What is a good ROI or CAGR?', a: 'The S&P 500 has returned approximately 10% per year on average (nominal) over the long term — roughly 7% after inflation. This is the most common benchmark for equity investors. A CAGR above 10% means you outperformed the market; below 10% means you underperformed. For real estate, a 6–8% CAGR is considered solid. For bonds, 3–5%. Context (risk, liquidity, time horizon) matters as much as the number itself.' },
  { q: 'How does the S&P 500 10% benchmark work?', a: 'The 10% figure is the long-run average annual total return (price appreciation plus dividends) of the S&P 500 index, approximately since 1926. It is used here as a passive benchmark — a proxy for "what you could have earned doing nothing but holding a broad index fund." It is not a prediction and is not guaranteed. Real S&P 500 returns after inflation average closer to 7% annually.' },
  { q: 'What is fee drag and how much does it cost?', a: 'Fee drag is the cumulative loss of returns caused by annual management fees. On a $10,000 investment at 8% CAGR for 20 years: with 0% fees you end with $46,610. With 1% annual fees (reducing effective CAGR to 7%), you end with $38,697 — a $7,913 fee drag. The impact compounds over time: a 1% annual fee can reduce the final balance by 15–20% over 20 years. Passive index funds typically charge 0.03–0.10%, while actively managed funds charge 0.5–1.5%.' },
  { q: 'How does inflation affect real investment returns?', a: 'Inflation erodes purchasing power. A nominal return of 8% with 3% inflation yields a real return of about 4.85% (exact: 1.08/1.03 − 1). Over 20 years, $46,610 nominal at 3% inflation is worth only $25,800 in today\'s dollars — a reduction of 45%. Toggle inflation adjustment on this calculator to see your real return. This is why the real return — not the nominal return — determines your actual increase in purchasing power.' },
  { q: 'What is the difference between nominal and real returns?', a: 'Nominal return is the raw percentage gain on your investment before adjusting for inflation. Real return subtracts the effect of inflation, expressing how much your purchasing power actually increased. If you earned 8% nominally and inflation was 3%, your real return is about 4.85%. Nominal returns look better but real returns tell the truth. For long-term planning, always compare real returns.' },
  { q: 'What is opportunity cost in investing?', a: 'Opportunity cost is the return you gave up by choosing one investment over another. If your real estate investment returned 6% CAGR while the S&P 500 returned 10% over the same period, your opportunity cost is 4% per year — meaning you paid a 4% annual "price" for choosing real estate over equities. This calculator shows your opportunity cost against the S&P 500 benchmark automatically in the results.' },
]

const GLOSSARY = [
  { term: 'ROI (Return on Investment)', def: 'Total percentage gain or loss on an investment relative to its original cost, over the entire holding period.' },
  { term: 'CAGR', def: 'Compound Annual Growth Rate — the constant annual rate that explains an investment\'s growth from start to end, accounting for compounding. The standard metric to compare investments.' },
  { term: 'Annualized ROI', def: 'Total ROI divided by the number of years held. A simpler approximation that does not account for compounding — less accurate than CAGR for multi-year returns.' },
  { term: 'Nominal Return', def: 'The raw percentage gain before adjusting for inflation. Reported by most brokerages and financial statements.' },
  { term: 'Real Return', def: 'Return after removing the effects of inflation, showing true growth in purchasing power. Real return ≈ nominal return − inflation rate.' },
  { term: 'Fee Drag', def: 'The cumulative reduction in final value caused by annual management fees. A 1% fee on a 20-year investment can reduce the ending balance by 15–20% due to compounding.' },
  { term: 'Benchmark', def: 'A reference index used to evaluate investment performance. The S&P 500 at ~10% annual return is the most common equity benchmark.' },
  { term: 'Opportunity Cost', def: 'The return foregone by choosing one investment over another. If you earned 6% CAGR while the S&P 500 earned 10%, your opportunity cost is ~4% per year.' },
]

const TOOLS_NEXT = [
  { slug: 'compound-interest', title: 'Compound Interest', desc: 'See how money grows over time with compound interest and monthly contributions.', Icon: TrendingUp },
  { slug: 'mortgage-calculator', title: 'Mortgage Calculator', desc: 'Full PITI payment with PMI, taxes, insurance, and amortization schedule.', Icon: Home },
]

// ─── Main component ─────────────────────────────────────────────────────────────
export default function ROICalculator() {
  const [rawInitial, setRawInitial] = useState('10000')
  const [initialDisplay, setInitialDisplay] = useState('10,000')
  const [rawFinal, setRawFinal] = useState('18500')
  const [finalDisplay, setFinalDisplay] = useState('18,500')
  const [years, setYears] = useState('5')
  const [fees, setFees] = useState('')
  const [showInflation, setShowInflation] = useState(false)
  const [inflationRate, setInflationRate] = useState('3.0')
  const [showTable, setShowTable] = useState(false)
  const [copied, setCopied] = useState(false)

  // Read URL params
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('init'))  { const v = p.get('init')!; setRawInitial(v); setInitialDisplay(fmtNum(v)) }
    if (p.get('final')) { const v = p.get('final')!; setRawFinal(v); setFinalDisplay(fmtNum(v)) }
    if (p.get('y'))     setYears(p.get('y')!)
    if (p.get('fees'))  setFees(p.get('fees')!)
    if (p.get('inf'))   { setShowInflation(true); setInflationRate(p.get('inf')!) }
  }, [])

  // Sync URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams()
    p.set('init', rawInitial)
    p.set('final', rawFinal)
    if (years !== '5') p.set('y', years)
    if (fees) p.set('fees', fees)
    if (showInflation) p.set('inf', inflationRate)
    window.history.replaceState(null, '', `?${p.toString()}`)
  }, [rawInitial, rawFinal, years, fees, showInflation, inflationRate])

  const initial = parseDollars(rawInitial)
  const finalVal = parseDollars(rawFinal)
  const numYears = parseFloat(years) || 0
  const feePct = parseFloat(fees) || 0

  const r = useMemo(() => calcROI({
    initial, final: finalVal, years: numYears,
    feePct, inflationPct: parseFloat(inflationRate) || 3,
    showInflation,
  }), [initial, finalVal, numYears, feePct, inflationRate, showInflation])

  function copyShareUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  })
  const howToSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'How to Calculate ROI and CAGR',
    description: 'Calculate your investment ROI, CAGR, inflation-adjusted real return, and compare against the S&P 500 benchmark.',
    step: [
      { '@type': 'HowToStep', name: 'Enter your initial investment', text: 'Type the amount you originally invested.' },
      { '@type': 'HowToStep', name: 'Enter the final value', text: 'Enter what your investment is worth today or what you sold it for.' },
      { '@type': 'HowToStep', name: 'Set the holding period', text: 'Enter the number of years you held the investment.' },
      { '@type': 'HowToStep', name: 'Add optional adjustments', text: 'Enter annual management fees and toggle inflation adjustment for a real-return view.' },
      { '@type': 'HowToStep', name: 'Review your results', text: 'See ROI, CAGR, real return, fee drag, and how your investment compared to the S&P 500.' },
    ],
  })

  const inputStyle: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
  const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px' }

  const isLoss = r ? r.nominalGain < 0 : false

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">{faqSchema}</Script>
      <Script id="howto-schema" type="application/ld+json">{howToSchema}</Script>

      <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>

          <div style={{ paddingTop: 20, paddingBottom: 20 }}>
            <AdUnit slot={AD_SLOT_TOP} label="leaderboard" minHeight={90} />
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.6px', lineHeight: 1.15, margin: '0 0 8px' }}>
            Free ROI Calculator — With CAGR & Inflation Adjustment
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 560 }}>
            Calculate your total ROI, annualized CAGR, inflation-adjusted real return, and see how your investment compares to the S&P 500. No signup required.
          </p>

          {/* ── Form card ──────────────────────────────────────────────────── */}
          <div style={cardStyle}>
            {/* Row 1: initial, final, years */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 14, marginBottom: 14 }}>

              <div>
                <label style={labelStyle}>Initial investment</label>
                <input
                  style={inputStyle} type="text" inputMode="numeric" placeholder="10,000"
                  value={initialDisplay}
                  onChange={e => { setRawInitial(e.target.value.replace(/,/g, '')); setInitialDisplay(e.target.value) }}
                  onBlur={() => { const n = parseDollars(rawInitial); if (n) { setRawInitial(String(n)); setInitialDisplay(fmtNum(String(n))) } }}
                  onFocus={() => setInitialDisplay(rawInitial)}
                />
              </div>

              <div>
                <label style={labelStyle}>Final value</label>
                <input
                  style={inputStyle} type="text" inputMode="numeric" placeholder="18,500"
                  value={finalDisplay}
                  onChange={e => { setRawFinal(e.target.value.replace(/,/g, '')); setFinalDisplay(e.target.value) }}
                  onBlur={() => { const n = parseDollars(rawFinal); if (n) { setRawFinal(String(n)); setFinalDisplay(fmtNum(String(n))) } }}
                  onFocus={() => setFinalDisplay(rawFinal)}
                />
              </div>

              <div>
                <label style={labelStyle}>Years held</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['3', '5', '10', '20'] as const).map(t => (
                    <button
                      key={t} onClick={() => setYears(t)}
                      style={{ width: 36, height: 40, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, padding: 0,
                        background: years === t ? '#1a1a2e' : '#f3f4f6',
                        color: years === t ? '#fff' : '#6b7280',
                        border: '1px solid ' + (years === t ? '#1a1a2e' : '#e5e7eb') }}
                    >{t}</button>
                  ))}
                  <input
                    type="text" inputMode="numeric" placeholder=""
                    value={['3','5','10','20'].includes(years) ? '' : years}
                    onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ''); setYears(v) }}
                    style={{ ...inputStyle, width: 44, padding: '0 6px', flexShrink: 0 }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Annual fees (%)</label>
                <input
                  style={inputStyle} type="text" inputMode="decimal" placeholder="0"
                  value={fees}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '')
                    setFees(raw)
                  }}
                  onBlur={() => {
                    const v = parseFloat(fees)
                    if (isNaN(v) || v < 0) setFees('')
                  }}
                />
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>Management / expense ratio</div>
              </div>
            </div>

            {/* Inflation toggle */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
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

              {/* Primary result */}
              <div style={{ ...cardStyle, background: isLoss ? '#fff1f2' : '#fff', border: '1px solid ' + (isLoss ? '#fecdd3' : '#e5e7eb') }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Total ROI', value: fmtPct(r.roi), highlight: true, loss: isLoss },
                    { label: `CAGR (${years} yr)`, value: fmtPct(r.cagr * 100), highlight: false },
                    { label: 'Nominal gain', value: fmt(r.nominalGain) },
                    { label: 'Final value', value: fmt(finalVal) },
                  ].map(card => (
                    <div key={card.label} style={{ background: card.highlight ? (isLoss ? '#fecdd3' : '#1a1a2e') : '#f8f9fb', borderRadius: 8, padding: '11px 13px' }}>
                      <div style={{ fontSize: 11, color: card.highlight ? (isLoss ? '#be123c' : '#86efac') : '#9ca3af', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                      <div style={{ fontSize: card.highlight ? 22 : 16, fontWeight: 700, color: card.highlight ? (isLoss ? '#be123c' : '#fff') : (isLoss ? '#be123c' : '#1a1a2e'), letterSpacing: '-0.3px' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* S&P 500 comparison callout */}
                <div style={{ padding: '12px 14px', borderRadius: 8, background: r.beatsSP500 ? '#dcfce7' : '#f8f9fb', border: '1px solid ' + (r.beatsSP500 ? '#86efac' : '#e5e7eb') }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: r.beatsSP500 ? '#15803d' : '#6b7280' }}>
                    {r.beatsSP500
                      ? `🏆 You beat the market — your CAGR of ${fmtPct(r.cagr * 100)} outperformed the S&P 500's 10.0% over ${years} years`
                      : `S&P 500 benchmark: ${fmt(r.sp500Final)} (10.0%/yr) — your investment returned ${fmt(finalVal)} (${fmtPct(r.cagr * 100)} CAGR)`}
                  </div>
                  {!r.beatsSP500 && (
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                      Opportunity cost: {fmt(r.sp500Final - finalVal)} over {years} years
                    </div>
                  )}
                </div>

                {/* Real return (inflation) */}
                {showInflation && r.realFinal !== null && r.realCAGR !== null && (
                  <div style={{ marginTop: 10, padding: '12px 14px', background: '#f8f9fb', borderRadius: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                      {[
                        { label: 'Real final value', value: fmt(r.realFinal) },
                        { label: 'Real gain', value: fmt(r.realGain ?? 0) },
                        { label: 'Real ROI', value: fmtPct(r.realROI ?? 0) },
                        { label: 'Real CAGR', value: fmtPct(r.realCAGR * 100) },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                      Inflation ({inflationRate}%/yr) reduces your {fmt(finalVal)} by {fmt(finalVal - (r.realFinal ?? 0))} in purchasing power over {years} years
                    </div>
                  </div>
                )}

                {/* Fee drag */}
                {r.feeDrag !== null && r.feeDrag > 0 && (
                  <div style={{ marginTop: 10, padding: '12px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#c2410c' }}>
                      Fee drag: {fmt(r.feeDrag)} lost to {fees}%/yr management fees over {years} years
                    </div>
                    <div style={{ fontSize: 12, color: '#9a3412', marginTop: 4 }}>
                      Without fees, your investment would be worth {fmt(r.feeAdjFinal ?? 0)}
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <div style={{ marginTop: 12 }}>
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
              Fill in the fields above to see your ROI.
            </div>
          )}

          {/* ── Charts ─────────────────────────────────────────────────────── */}
          {r && r.yearRows.length > 1 && (
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>

              {/* Area chart: growth over time */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Investment growth over time</div>
                <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 24, height: 2, background: '#22c55e', borderRadius: 1 }} /> Yours</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 24, height: 2, borderTop: '2px dashed #94a3b8' }} /> S&amp;P 500</div>
                  {showInflation && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 24, height: 2, background: '#86efac', borderRadius: 1 }} /> Real</div>}
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={r.yearRows} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <defs>
                      <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#86efac" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={v => `Yr ${v}`} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v, name) => [fmt(Number(v ?? 0)), name === 'yours' ? 'Yours' : name === 'sp500' ? 'S&P 500' : 'Real value']}
                      contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }}
                    />
                    <Area type="monotone" dataKey="yours" stroke="#22c55e" strokeWidth={2} fill="url(#roiGrad)" dot={false} />
                    <Area type="monotone" dataKey="sp500" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2" fill="none" dot={false} />
                    {showInflation && <Area type="monotone" dataKey="real" stroke="#86efac" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#realGrad)" dot={false} />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart: final value comparison */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Final value comparison</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={r.compBars} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={62} />
                    <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Value']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false} animationDuration={0}>
                      {r.compBars.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="insideRight"
                        formatter={(v: unknown) => fmt(Number(v ?? 0))}
                        style={{ fill: '#fff', fontWeight: 700, fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 8 }}>
                  * S&P 500 at 10%/yr historical average — not a guarantee
                </div>
              </div>
            </div>
          )}

          {/* ── Annual table ─────────────────────────────────────────────── */}
          {r && r.yearRows.length > 1 && (
            <div style={{ ...cardStyle, marginTop: 16 }}>
              <button
                onClick={() => setShowTable(s => !s)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22c55e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Year-by-year breakdown
                <ChevronDown size={14} style={{ transform: showTable ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showTable && (
                <div style={{ marginTop: 14, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                        {['Year', 'Your value', 'S&P 500', ...(showInflation ? ['Real value'] : [])].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.yearRows.map((row, i) => (
                        <tr key={row.year} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>{row.year}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#22c55e', fontWeight: 600 }}>{fmt(row.yours)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#94a3b8' }}>{fmt(row.sp500)}</td>
                          {showInflation && <td style={{ padding: '7px 10px', textAlign: 'right', color: '#86efac' }}>{fmt(row.real ?? 0)}</td>}
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
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 3 }}>{title}</div>
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

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>What is ROI and how is it calculated?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            ROI (Return on Investment) measures what you earned relative to what you put in: <strong>ROI = (Final Value − Initial Investment) / Initial Investment × 100</strong>. A $10,000 investment that becomes $18,500 has an ROI of 85%. This is the total return over the entire holding period — it says nothing about how long you held it.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            To compare investments held for different lengths of time, use <strong>CAGR</strong> — the compound annual growth rate. The formula is CAGR = (Final/Initial)^(1/years) − 1. An 85% ROI over 5 years equals a CAGR of 13.1%; over 10 years it equals 6.3%. Same total return, very different annualized performance.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>What is a good ROI? The S&P 500 benchmark</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            The S&P 500 has returned approximately 10% per year (nominal) over the long term — roughly 7% after inflation. This is the standard benchmark for equity investors. Any investment with a CAGR above 10% outperformed a passive index fund strategy; below 10% means you would have done better in an index fund.
          </p>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                  {['$10,000 invested', '5 years', '10 years', '20 years', '30 years'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['At 6% CAGR', '$13,382', '$17,908', '$32,071', '$57,435'],
                  ['At 8% CAGR', '$14,693', '$21,589', '$46,610', '$100,627'],
                  ['At 10% CAGR (S&P 500)', '$16,105', '$25,937', '$67,275', '$174,494'],
                  ['At 12% CAGR', '$17,623', '$31,058', '$96,463', '$299,600'],
                ].map(([label, ...values], i) => (
                  <tr key={label} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{label}</td>
                    {values.map(v => <td key={v} style={{ padding: '8px 12px', textAlign: 'right', color: '#6b7280' }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How much do management fees cost you?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            A 1% annual fee seems small but compounds aggressively. On $10,000 at 8% nominal for 20 years: with 0% fees → $46,610. With 1% fees → $38,697. The fee drag is $7,913 — the fees consumed 17% of your potential return. Over 30 years the drag is even larger. Passive index funds (0.03–0.10% expense ratios) versus actively managed funds (0.5–1.5%) represents a real performance difference that compounds for decades.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>Nominal vs real returns: what inflation takes from you</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            A 10% nominal return with 3% inflation yields a real return of about 6.8% (exact: 1.10/1.03 − 1 = 6.8%). Over 20 years, this means your $67,275 nominal final value is worth only $37,243 in today&apos;s purchasing power. The inflation toggle on this calculator shows exactly what inflation takes from any investment scenario.
          </p>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Frequently asked questions</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>ROI, CAGR, benchmarks, and real returns explained.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 20px' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* ── Glossary ────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Investment return terms explained</h2>
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>ROI and CAGR formulas</h2>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { label: 'Total ROI', formula: 'ROI = (Final − Initial) / Initial × 100' },
                { label: 'CAGR', formula: 'CAGR = (Final / Initial)^(1 / years) − 1' },
                { label: 'Real return', formula: 'Real CAGR = (1 + nominal) / (1 + inflation) − 1' },
              ].map(({ label, formula }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
                  <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 14, color: '#1a1a2e' }}>{formula}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 32px' }}>
          <AdUnit slot={AD_SLOT_BOTTOM} label="above footer" />
        </div>

        <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Results are illustrative only and do not constitute financial advice. Past performance does not guarantee future results. Consult a qualified financial advisor before making investment decisions.
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
