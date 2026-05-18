'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Script from 'next/script'
import { TrendingUp, CreditCard, BarChart3, ChevronDown, Download, Share2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import * as XLSX from 'xlsx'

// ─── Types ─────────────────────────────────────────────────────────────────────
type LoanType = 'conventional' | 'fha' | 'va' | 'usda'

interface MonthRow { month: number; principal: number; interest: number; pmi: number; balance: number }
interface AnnualRow { year: number; principalPaid: number; interestPaid: number; pmiPaid: number; endBalance: number; cumInterest: number }

// ─── AdSense placeholders ──────────────────────────────────────────────────────
const AD_SLOT_TOP    = '1111111111'
const AD_SLOT_MID    = '2222222222'
const AD_SLOT_SEO    = '3333333333'
const AD_SLOT_BOTTOM = '4444444444'
declare global { interface Window { adsbygoogle?: unknown[] } }

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const parseDollars = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0

const fmtNum = (s: string) => {
  const n = parseDollars(s)
  return n === 0 ? s : new Intl.NumberFormat('en-US').format(n)
}

const addMonths = (n: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() + n)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const monthYears = (months: number) => {
  const y = Math.floor(Math.abs(months) / 12)
  const m = Math.abs(months) % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y} yr`
  return `${y} yr ${m} mo`
}

// ─── Amortization engine ───────────────────────────────────────────────────────
function amortize(
  principal: number, monthlyRate: number, termMonths: number,
  extra = 0, monthlyPMI = 0, homePrice = 0, dropPMI = false,
): { rows: MonthRow[]; totalInterest: number; pmiDropMonth: number | null } {
  if (principal <= 0 || monthlyRate <= 0 || termMonths <= 0)
    return { rows: [], totalInterest: 0, pmiDropMonth: null }
  const pmt = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  let balance = principal, totalInterest = 0, pmiDropMonth: number | null = null
  const rows: MonthRow[] = []
  for (let m = 1; m <= termMonths && balance > 0.01; m++) {
    const interest = balance * monthlyRate
    const principalPmt = Math.min(pmt - interest + extra, balance)
    balance = Math.max(0, balance - principalPmt)
    let pmi = 0
    if (monthlyPMI > 0) {
      if (!dropPMI) {
        pmi = monthlyPMI
      } else if (homePrice > 0) {
        if (balance / homePrice > 0.80) pmi = monthlyPMI
        else if (pmiDropMonth === null) pmiDropMonth = m
      }
    }
    totalInterest += interest
    rows.push({ month: m, principal: principalPmt, interest, pmi, balance })
  }
  return { rows, totalInterest, pmiDropMonth }
}

// ─── Full PITI calculation ─────────────────────────────────────────────────────
function calcAll(params: {
  homePrice: number; downPayment: number; annualRate: number; termYears: number
  propTaxRate: number; insuranceAnnual: number; pmiRateAnnual: number; hoaMonthly: number
  loanType: LoanType; extraPayment: number
}) {
  const { homePrice, downPayment, annualRate, termYears, propTaxRate, insuranceAnnual, pmiRateAnnual, hoaMonthly, loanType, extraPayment } = params
  if (!homePrice || !annualRate || !termYears || homePrice <= 0 || annualRate <= 0 || termYears <= 0) return null

  const dp = Math.min(downPayment, homePrice)
  const baseLoan = homePrice - dp
  if (baseLoan <= 0) return null

  const monthlyRate = annualRate / 100 / 12
  const termMonths = Math.round(termYears * 12)

  // Upfront fees and loan type adjustments
  let loanAmount = baseLoan, upfrontFee = 0, monthlyMIP = 0, dropPMI = false
  if (loanType === 'fha') {
    upfrontFee = baseLoan * 0.0175
    loanAmount = baseLoan + upfrontFee
    monthlyMIP = (loanAmount * 0.0055) / 12 // typical annual MIP 0.55%
  } else if (loanType === 'va') {
    upfrontFee = baseLoan * 0.0215
    loanAmount = baseLoan + upfrontFee
  } else if (loanType === 'usda') {
    upfrontFee = baseLoan * 0.01
    loanAmount = baseLoan + upfrontFee
    monthlyMIP = (loanAmount * 0.0035) / 12
  } else {
    // Conventional
    dropPMI = true
  }

  const ltv = baseLoan / homePrice
  let monthlyPMI = 0
  if (loanType === 'conventional' && ltv > 0.80) {
    monthlyPMI = (loanAmount * pmiRateAnnual / 100) / 12
  } else if (loanType === 'fha' || loanType === 'usda') {
    monthlyPMI = monthlyMIP
  }

  // Main amortization
  const { rows, totalInterest, pmiDropMonth } = amortize(loanAmount, monthlyRate, termMonths, 0, monthlyPMI, homePrice, dropPMI)
  if (rows.length === 0) return null

  const monthlyPI = rows[0].principal + rows[0].interest
  const monthlyTax = (homePrice * propTaxRate / 100) / 12
  const monthlyInsurance = insuranceAnnual / 12
  const monthlyHOA = hoaMonthly
  const monthlyTotal = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA
  const requiredIncome = monthlyTotal / 0.28
  const payoffMonths = rows.length
  const payoffDate = addMonths(payoffMonths)
  const totalPaid = rows.reduce((s, r) => s + r.principal + r.interest + r.pmi, 0) + (monthlyTax + monthlyInsurance + monthlyHOA) * payoffMonths + upfrontFee
  const pmiDropDate = pmiDropMonth ? addMonths(pmiDropMonth) : null

  // Annual rows
  const annualRows: AnnualRow[] = []
  let cumInterest = 0
  for (let yr = 1; yr <= Math.ceil(rows.length / 12); yr++) {
    const slice = rows.slice((yr - 1) * 12, yr * 12)
    const principalPaid = slice.reduce((s, r) => s + r.principal, 0)
    const interestPaid = slice.reduce((s, r) => s + r.interest, 0)
    const pmiPaid = slice.reduce((s, r) => s + r.pmi, 0)
    cumInterest += interestPaid
    annualRows.push({ year: yr, principalPaid, interestPaid, pmiPaid, endBalance: slice[slice.length - 1]?.balance ?? 0, cumInterest })
  }

  // Biweekly comparison (extra = monthlyPI/12)
  const biExtra = monthlyPI / 12
  const bi = amortize(loanAmount, monthlyRate, termMonths, biExtra)
  const biMonthsSaved = payoffMonths - bi.rows.length
  const biInterestSaved = totalInterest - bi.totalInterest
  const biPayoffDate = addMonths(bi.rows.length)

  // Extra payment comparison — also build chart/table rows for this scenario
  let exResult: { interestSaved: number; monthsSaved: number; payoffDate: string } | null = null
  let exMonthRows: MonthRow[] = []
  let exAnnualRows: AnnualRow[] = []
  if (extraPayment > 0) {
    const ex = amortize(loanAmount, monthlyRate, termMonths, extraPayment)
    exMonthRows = ex.rows
    let exCum = 0
    for (let yr = 1; yr <= Math.ceil(ex.rows.length / 12); yr++) {
      const sl = ex.rows.slice((yr - 1) * 12, yr * 12)
      const pp = sl.reduce((s, r) => s + r.principal, 0)
      const ip = sl.reduce((s, r) => s + r.interest, 0)
      const mp = sl.reduce((s, r) => s + r.pmi, 0)
      exCum += ip
      exAnnualRows.push({ year: yr, principalPaid: pp, interestPaid: ip, pmiPaid: mp, endBalance: sl[sl.length - 1]?.balance ?? 0, cumInterest: exCum })
    }
    exResult = {
      interestSaved: totalInterest - ex.totalInterest,
      monthsSaved: payoffMonths - ex.rows.length,
      payoffDate: addMonths(ex.rows.length),
    }
  }

  return {
    loanAmount, monthlyPI, monthlyTax, monthlyInsurance, monthlyPMI, monthlyHOA,
    monthlyTotal, totalInterest, totalPaid, payoffMonths, payoffDate,
    pmiDropMonth, pmiDropDate, upfrontFee, requiredIncome, annualRows,
    monthRows: rows, exMonthRows, exAnnualRows,
    bi: { monthsSaved: biMonthsSaved, interestSaved: biInterestSaved, payoffDate: biPayoffDate },
    extra: exResult,
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
  { q: 'What is PITI in a mortgage payment?', a: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a complete monthly mortgage payment. Principal reduces your loan balance. Interest is the cost of borrowing. Taxes are your property taxes collected monthly in escrow. Insurance covers homeowners insurance plus PMI or MIP if applicable. Lenders use total PITI to determine whether you qualify.' },
  { q: 'How is a monthly mortgage payment calculated?', a: 'The principal and interest (P&I) portion uses the PMT formula: M = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual ÷ 12), and n is the number of monthly payments. Property taxes, insurance, PMI, and HOA are then added to reach the full PITI payment.' },
  { q: 'What is PMI and when can I remove it?', a: 'Private Mortgage Insurance (PMI) is required on conventional loans when your down payment is below 20% of the home price (LTV above 80%). It protects the lender if you default. PMI typically costs 0.5%–1.5% of the loan annually. On conventional loans, PMI cancels automatically once your loan balance reaches 80% of the original home value — often 7–10 years into a 30-year loan.' },
  { q: 'How do biweekly mortgage payments save money?', a: 'Instead of 12 monthly payments per year, biweekly payments result in 26 half-payments — equivalent to 13 full monthly payments per year. That extra annual payment goes entirely to principal, reducing your balance faster, cutting total interest paid, and shortening the loan term by several years. On a $400,000 30-year loan at 7%, this can save over $50,000 in interest.' },
  { q: 'What income do I need to qualify for this mortgage?', a: 'Lenders use the 28% front-end rule: your monthly PITI payment should not exceed 28% of your gross monthly income. If your PITI is $2,800/month, you need at least $10,000/month (or $120,000/year) gross income. Some lenders allow up to 31%–33% for well-qualified borrowers. This calculator shows your required income in the results panel.' },
  { q: 'What is the difference between FHA, VA, USDA, and conventional loans?', a: 'Conventional loans are not government-backed and require PMI with down payments below 20%. FHA loans allow down payments as low as 3.5% but require mortgage insurance premium (MIP) — 1.75% upfront plus ~0.55% annually. VA loans serve veterans and active military with no down payment or monthly insurance, but a 2.15% upfront funding fee. USDA loans cover rural areas with zero down payment and a 1.0% upfront plus 0.35% annual guarantee fee.' },
  { q: 'Should I choose a 15-year or 30-year mortgage?', a: 'A 30-year mortgage has lower monthly payments but costs significantly more in total interest. A 15-year mortgage builds equity faster and saves tens of thousands in interest, but payments are roughly 40–50% higher. The right choice depends on your cash flow, other financial goals, and the rate spread between terms. Use this calculator to compare both terms side by side.' },
  { q: 'What is an escrow account?', a: 'An escrow account is managed by your lender to collect and pay property taxes and homeowners insurance. Instead of paying these large bills once or twice a year, you pay 1/12 of the annual total with each mortgage payment. The lender pays the bills when due. Most loans with less than 20% down require escrow.' },
  { q: 'How does extra principal payment reduce my mortgage?', a: 'Any amount beyond your regular PITI goes directly to reducing the loan principal. Because your balance drops faster, you accumulate less interest — compounding savings with each extra payment. Even $100–$200 per month extra can save $20,000–$40,000 in interest on a typical 30-year mortgage and shorten payoff by 3–5 years. Use the extra payment slider above to see your specific savings.' },
]

const GLOSSARY = [
  { term: 'PITI', def: 'Principal, Interest, Taxes, Insurance — the four components of a complete monthly mortgage payment.' },
  { term: 'LTV (Loan-to-Value)', def: 'Your loan balance divided by the home\'s value. LTV of 80% means you owe 80% and own 20% equity. Lenders use LTV to price risk.' },
  { term: 'PMI', def: 'Private Mortgage Insurance — required on conventional loans when LTV exceeds 80%. Protects the lender, not the borrower.' },
  { term: 'MIP', def: 'Mortgage Insurance Premium — the FHA equivalent of PMI. Includes a 1.75% upfront fee plus an annual premium (~0.55%).' },
  { term: 'DTI', def: 'Debt-to-Income ratio — total monthly debt payments divided by gross monthly income. Lenders use DTI to qualify borrowers (front-end and back-end).' },
  { term: 'Amortization', def: 'The schedule of fixed payments that gradually pay off both principal and interest. Early payments are mostly interest; later payments are mostly principal.' },
  { term: 'Escrow', def: 'An account managed by the lender to collect and pay property taxes and homeowners insurance on your behalf.' },
  { term: 'HOA', def: 'Homeowners Association fee — monthly or annual payment for shared building or neighborhood amenities and maintenance.' },
]

const TOOLS = [
  { slug: 'debt-payoff', title: 'Debt Payoff Planner', desc: 'Avalanche vs. snowball — the fastest, cheapest path to debt-free.', Icon: CreditCard },
  { slug: 'compound-interest', title: 'Compound Interest', desc: 'How money grows over time with compound interest and contributions.', Icon: TrendingUp },
  { slug: 'roi-calculator', title: 'ROI Calculator', desc: 'Return on investment — simple, annualized, or inflation-adjusted.', Icon: BarChart3 },
]

const LOAN_TYPES: { value: LoanType; label: string; sub: string }[] = [
  { value: 'conventional', label: 'Conventional', sub: 'PMI if <20% down' },
  { value: 'fha', label: 'FHA', sub: '3.5% min down' },
  { value: 'va', label: 'VA', sub: '0% down, veterans' },
  { value: 'usda', label: 'USDA', sub: '0% down, rural' },
]

// ─── Main component ─────────────────────────────────────────────────────────────
export default function MortgageCalculator() {
  const [rawPrice, setRawPrice]       = useState('400000')
  const [priceDisplay, setPriceDisp]  = useState('400,000')
  const [rawDP, setRawDP]             = useState('80000')
  const [dpDisplay, setDpDisp]        = useState('80,000')
  const [dpMode, setDpMode]           = useState<'$' | '%'>('$')
  const [rate, setRate]               = useState('7.00')
  const [termYears, setTermYears]     = useState('30')
  const [loanType, setLoanType]       = useState<LoanType>('conventional')
  const [propTax, setPropTax]         = useState('')
  const [insurance, setInsurance]     = useState('')
  const [pmiRate, setPmiRate]         = useState('')
  const [hoa, setHoa]                 = useState('')
  const [biweekly, setBiweekly]       = useState(false)
  const [extraPayment, setExtraPayment] = useState(0)
  const [showAmort, setShowAmort]     = useState(false)
  const [copied, setCopied]           = useState(false)

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('price')) { const v = p.get('price')!; setRawPrice(v); setPriceDisp(fmtNum(v)) }
    if (p.get('dp'))    { const v = p.get('dp')!;    setRawDP(v);    setDpDisp(fmtNum(v)) }
    if (p.get('rate'))  setRate(p.get('rate')!)
    if (p.get('term'))  setTermYears(p.get('term')!)
    if (p.get('type'))  setLoanType(p.get('type') as LoanType)
    if (p.get('tax'))   setPropTax(p.get('tax')!)
    if (p.get('ins'))   setInsurance(p.get('ins')!)
    if (p.get('pmi'))   setPmiRate(p.get('pmi')!)
    if (p.get('hoa'))   setHoa(p.get('hoa')!)
  }, [])

  // Sync URL on input change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams()
    if (rawPrice) p.set('price', rawPrice)
    if (rawDP)    p.set('dp', rawDP)
    if (rate)     p.set('rate', rate)
    if (termYears !== '30') p.set('term', termYears)
    if (loanType !== 'conventional') p.set('type', loanType)
    if (propTax)    p.set('tax', propTax)
    if (insurance)  p.set('ins', insurance)
    if (pmiRate)    p.set('pmi', pmiRate)
    if (hoa)        p.set('hoa', hoa)
    const qs = p.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [rawPrice, rawDP, rate, termYears, loanType, propTax, insurance, pmiRate, hoa])

  const homePrice = parseDollars(rawPrice)
  const dp$       = parseDollars(rawDP)
  const dpPctDisplay = homePrice > 0 ? (dp$ / homePrice * 100).toFixed(1) : '20.0'

  const computed = useMemo(() => calcAll({
    homePrice,
    downPayment: dp$,
    annualRate: parseFloat(rate) || 0,
    termYears: parseFloat(termYears) || 0,
    propTaxRate: parseFloat(propTax) || 1.2,
    insuranceAnnual: parseDollars(insurance) || 1200,
    pmiRateAnnual: parseFloat(pmiRate) || 0.8,
    hoaMonthly: parseDollars(hoa) || 0,
    loanType,
    extraPayment,
  }), [homePrice, dp$, rate, termYears, propTax, insurance, pmiRate, hoa, loanType, extraPayment])

  const r = computed

  const chartData = useMemo(() => {
    if (!r) return []
    const rows = r.exMonthRows.length > 0 ? r.exMonthRows : r.monthRows
    const step = Math.max(1, Math.ceil(rows.length / 60))
    return rows
      .filter((_, i) => i % step === 0 || i === rows.length - 1)
      .map(m => ({ month: m.month, balance: Math.round(m.balance), principal: Math.round(m.principal), interest: Math.round(m.interest) }))
  }, [r])

  function handleDpModeToggle() {
    if (dpMode === '$') {
      setDpMode('%')
    } else {
      // switching back to $ — rawDP already stores $ value, just update display
      setDpDisp(fmtNum(rawDP))
      setDpMode('$')
    }
  }

  function handleDpPctChange(val: string) {
    const pct = parseFloat(val) || 0
    if (homePrice > 0) {
      const dollars = Math.round(homePrice * pct / 100)
      setRawDP(String(dollars))
    }
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function exportCSV() {
    if (!r) return
    const headers = ['Year', 'Principal Paid', 'Interest Paid', 'PMI Paid', 'Ending Balance', 'Total Interest Paid']
    const src = r.exAnnualRows.length > 0 ? r.exAnnualRows : r.annualRows
    const rows = src.map(row => [row.year, row.principalPaid.toFixed(2), row.interestPaid.toFixed(2), row.pmiPaid.toFixed(2), row.endBalance.toFixed(2), row.cumInterest.toFixed(2)])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'mortgage-schedule.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function exportExcel() {
    if (!r) return
    const src = r.exAnnualRows.length > 0 ? r.exAnnualRows : r.annualRows
    const data = src.map(row => ({
      'Year': row.year, 'Principal Paid': row.principalPaid, 'Interest Paid': row.interestPaid,
      'PMI/MIP Paid': row.pmiPaid, 'Ending Balance': row.endBalance, 'Total Interest Paid': row.cumInterest,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Amortization')
    XLSX.writeFile(wb, 'mortgage-schedule.xlsx')
  }

  // JSON-LD schemas
  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  })
  const howToSchema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'How to Calculate a Mortgage Payment',
    description: 'Calculate your complete PITI mortgage payment including principal, interest, property taxes, insurance, and PMI.',
    step: [
      { '@type': 'HowToStep', name: 'Enter home price and down payment', text: 'Type the home purchase price and your down payment (in dollars or percent). The calculator shows LTV instantly.' },
      { '@type': 'HowToStep', name: 'Set interest rate and loan term', text: 'Enter the annual interest rate as a percentage. Select 15, 20, or 30 years, or type a custom term.' },
      { '@type': 'HowToStep', name: 'Choose your loan type', text: 'Select Conventional, FHA, VA, or USDA. The calculator applies the correct insurance and fee rules for each type.' },
      { '@type': 'HowToStep', name: 'Review your PITI breakdown', text: 'Results show your full monthly payment broken down into principal, interest, taxes, insurance, and PMI.' },
      { '@type': 'HowToStep', name: 'Explore savings options', text: 'Toggle biweekly payments or use the extra payment slider to see how much you can save in interest and time.' },
    ],
  })

  // Shared styles
  const inputStyle: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 10px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }
  const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px' }

  // PITI proportion bar data
  const pitiParts = r ? [
    { label: 'P&I', value: r.monthlyPI, color: '#15803d' },
    { label: 'Taxes', value: r.monthlyTax, color: '#22c55e' },
    { label: 'Insurance', value: r.monthlyInsurance, color: '#4ade80' },
    ...(r.monthlyPMI > 0 ? [{ label: loanType === 'conventional' ? 'PMI' : 'MIP', value: r.monthlyPMI, color: '#86efac' }] : []),
    ...(r.monthlyHOA > 0 ? [{ label: 'HOA', value: r.monthlyHOA, color: '#bbf7d0' }] : []),
  ] : []

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">{faqSchema}</Script>
      <Script id="howto-schema" type="application/ld+json">{howToSchema}</Script>

      <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>

          {/* Ad slot 1 — above fold */}
          <div style={{ paddingTop: 20, paddingBottom: 20 }}>
            <AdUnit slot={AD_SLOT_TOP} label="leaderboard" minHeight={90} />
          </div>

          {/* Hero */}
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.6px', lineHeight: 1.15, margin: '0 0 8px' }}>
            Free Mortgage Calculator with PMI and Taxes
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 540 }}>
            Calculate your full PITI payment — principal, interest, taxes, and insurance — for any loan type. No signup, no ads tracking.
          </p>

          {/* ── Form card ──────────────────────────────────────────────────── */}
          <div style={cardStyle}>
            {/* Row 1: price, down payment, rate, term */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 14, marginBottom: 14 }}>

              <div>
                <label style={labelStyle}>Home price</label>
                <input
                  style={inputStyle} type="text" inputMode="numeric" placeholder="400,000"
                  value={priceDisplay}
                  onChange={e => { setRawPrice(e.target.value.replace(/,/g, '')); setPriceDisp(e.target.value) }}
                  onBlur={() => { const n = parseDollars(rawPrice); if (n) { setRawPrice(String(n)); setPriceDisp(fmtNum(String(n))) } }}
                  onFocus={() => setPriceDisp(rawPrice)}
                />
              </div>

              <div>
                <label style={labelStyle}>Down payment</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {dpMode === '$' ? (
                    <input
                      style={{ ...inputStyle, flex: 1 }} type="text" inputMode="numeric" placeholder="80,000"
                      value={dpDisplay}
                      onChange={e => { setRawDP(e.target.value.replace(/,/g, '')); setDpDisp(e.target.value) }}
                      onBlur={() => { const n = parseDollars(rawDP); if (n) { setRawDP(String(n)); setDpDisp(fmtNum(String(n))) } }}
                      onFocus={() => setDpDisp(rawDP)}
                    />
                  ) : (
                    <input
                      style={{ ...inputStyle, flex: 1 }} type="number" placeholder="20" step="0.5" min="0" max="100"
                      value={dpPctDisplay}
                      onChange={e => handleDpPctChange(e.target.value)}
                    />
                  )}
                  <button
                    onClick={handleDpModeToggle}
                    style={{ width: 36, height: 40, border: '1px solid #e5e7eb', borderRadius: 8, background: '#f3f4f6', fontSize: 12, fontWeight: 700, color: '#6b7280', cursor: 'pointer', flexShrink: 0 }}
                  >
                    {dpMode === '$' ? '%' : '$'}
                  </button>
                </div>
                {homePrice > 0 && (
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    {dpMode === '$' ? `${dpPctDisplay}% down` : `${fmt(dp$)} down`}
                    {dp$ / homePrice < 0.20 && loanType === 'conventional' && <span style={{ color: '#f87171', marginLeft: 6 }}>PMI applies</span>}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Interest rate (%)</label>
                <input style={inputStyle} type="number" placeholder="7.00" value={rate} onChange={e => setRate(e.target.value)} step="0.01" min="0.01" />
              </div>

              <div>
                <label style={labelStyle}>Loan term</label>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {(['15', '20', '30'] as const).map(t => (
                    <button
                      key={t} onClick={() => setTermYears(t)}
                      style={{ width: 40, height: 40, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, padding: 0,
                        background: termYears === t ? '#1a1a2e' : '#f3f4f6',
                        color: termYears === t ? '#fff' : '#6b7280',
                        border: '1px solid ' + (termYears === t ? '#1a1a2e' : '#e5e7eb') }}
                    >{t}yr</button>
                  ))}
                  <input
                    type="number" placeholder="yr"
                    value={['15','20','30'].includes(termYears) ? '' : termYears}
                    onChange={e => setTermYears(e.target.value)}
                    style={{ ...inputStyle, width: 44, padding: '0 6px', flexShrink: 0 }}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: tax, insurance, pmi, hoa */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Property tax (%/yr)</label>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>Annual property tax rate — varies by county, typically 0.5%–2.5%</div>
                </div>
                <input style={inputStyle} type="number" placeholder="1.2" value={propTax} onChange={e => setPropTax(e.target.value)} step="0.1" min="0" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Home insurance ($/yr)</label>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>Annual homeowners insurance premium — typically $800–$2,000/yr</div>
                </div>
                <input style={inputStyle} type="number" placeholder="1,200" value={insurance} onChange={e => setInsurance(e.target.value)} step="100" min="0" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PMI rate (%/yr)</label>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>Private Mortgage Insurance — lender protection when LTV &gt; 80%</div>
                </div>
                <input
                  style={{ ...inputStyle, color: (loanType !== 'conventional' || dp$ / homePrice >= 0.20) ? '#d1d5db' : '#1a1a2e' }}
                  type="number" placeholder="0.8" value={pmiRate} onChange={e => setPmiRate(e.target.value)} step="0.1" min="0"
                  disabled={loanType !== 'conventional'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>HOA ($/mo)</label>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 5 }}>Homeowners Association fee — enter 0 if your community has none</div>
                </div>
                <input style={inputStyle} type="number" placeholder="0" value={hoa} onChange={e => setHoa(e.target.value)} step="50" min="0" />
              </div>
            </div>

            {/* Loan type selector */}
            <div>
              <label style={labelStyle}>Loan type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {LOAN_TYPES.map(lt => (
                  <button
                    key={lt.value}
                    onClick={() => setLoanType(lt.value)}
                    style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: loanType === lt.value ? '#1a1a2e' : '#f3f4f6',
                      border: '1px solid ' + (loanType === lt.value ? '#1a1a2e' : '#e5e7eb') }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: loanType === lt.value ? '#fff' : '#1a1a2e' }}>{lt.label}</div>
                    <div style={{ fontSize: 10, color: loanType === lt.value ? '#86efac' : '#9ca3af', marginTop: 1 }}>{lt.sub}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0', minHeight: '2.8em' }}>
                {loanType === 'fha'  ? 'FHA: 1.75% upfront MIP added to loan + ~0.55%/yr annual MIP. Best for buyers with lower credit scores or limited down payment.' :
                 loanType === 'va'   ? 'VA: 2.15% one-time funding fee added to loan (first-use, regular military). No down payment or monthly PMI required.' :
                 loanType === 'usda' ? 'USDA: 1.0% upfront guarantee fee + 0.35%/yr annual fee. Zero down payment for eligible rural and suburban areas.' :
                 'Conventional: PMI required when down payment is below 20% of the home price. PMI cancels automatically once LTV reaches 80%.'}
              </p>
            </div>
          </div>

          {/* ── Results ────────────────────────────────────────────────────── */}
          {r ? (
            <div style={{ marginTop: 16 }}>

              {/* PITI proportion bar */}
              <div style={cardStyle}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Monthly PITI breakdown</div>
                <div style={{ height: 14, borderRadius: 7, overflow: 'hidden', display: 'flex', marginBottom: 12, border: '1px solid #e5e7eb' }}>
                  {pitiParts.map(p => (
                    <div key={p.label} style={{ width: `${(p.value / r.monthlyTotal * 100).toFixed(1)}%`, background: p.color }} title={`${p.label}: ${fmt(p.value)}`} />
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
                  {pitiParts.map(p => (
                    <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{p.label}</span> {fmt(p.value)}/mo · {(p.value / r.monthlyTotal * 100).toFixed(0)}%
                    </div>
                  ))}
                </div>

                {/* Key stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginTop: 16 }}>
                  {[
                    { label: 'Monthly PITI', value: fmt(r.monthlyTotal), highlight: true },
                    { label: 'Total interest', value: fmt(r.totalInterest) },
                    { label: 'Payoff date', value: r.payoffDate },
                    { label: 'Total paid', value: fmt(r.totalPaid) },
                  ].map(card => (
                    <div key={card.label} style={{ background: card.highlight ? '#1a1a2e' : '#f8f9fb', borderRadius: 8, padding: '11px 13px' }}>
                      <div style={{ fontSize: 11, color: card.highlight ? '#86efac' : '#9ca3af', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                      <div style={{ fontSize: card.highlight ? 20 : 16, fontWeight: 700, color: card.highlight ? '#fff' : '#1a1a2e', letterSpacing: '-0.3px' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Upfront fee notice (FHA/VA/USDA) */}
                {r.upfrontFee > 0 && (
                  <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', background: '#f8f9fb', borderRadius: 8, padding: '8px 12px' }}>
                    {loanType === 'fha' && `FHA upfront MIP: ${fmt(r.upfrontFee)} added to loan balance`}
                    {loanType === 'va' && `VA funding fee: ${fmt(r.upfrontFee)} added to loan balance`}
                    {loanType === 'usda' && `USDA guarantee fee: ${fmt(r.upfrontFee)} added to loan balance`}
                  </div>
                )}
              </div>

              {/* Biweekly toggle */}
              <div style={{ ...cardStyle, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Biweekly payments</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Pay half your monthly payment every 2 weeks (26 payments/yr)</div>
                  </div>
                  <button
                    onClick={() => setBiweekly(b => !b)}
                    style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
                      background: biweekly ? '#22c55e' : '#e5e7eb', transition: 'background 0.2s' }}
                  >
                    <div style={{ position: 'absolute', top: 3, left: biweekly ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: '#fff', transition: 'left 0.2s' }} />
                  </button>
                </div>
                {biweekly && r.bi.interestSaved > 0 && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#15803d', fontWeight: 500 }}>
                    Pay biweekly → save <strong>{fmt(r.bi.interestSaved)}</strong> in interest, pay off <strong>{monthYears(r.bi.monthsSaved)}</strong> early (by {r.bi.payoffDate})
                  </div>
                )}
              </div>

              {/* Extra payment slider */}
              <div style={{ ...cardStyle, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Extra monthly payment</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Applied directly to principal each month</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', minWidth: 60, textAlign: 'right' }}>{fmt(extraPayment)}</div>
                </div>
                <input
                  type="range" min="0" max="1000" step="50" value={extraPayment}
                  onChange={e => setExtraPayment(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#d1d5db', marginTop: 2 }}>
                  <span>$0</span><span>$500</span><span>$1,000</span>
                </div>
                {extraPayment > 0 && r.extra && (
                  <div style={{ marginTop: 10, padding: '10px 14px', background: '#dcfce7', borderRadius: 8, fontSize: 13, color: '#15803d', fontWeight: 500 }}>
                    Pay {fmt(extraPayment)}/mo extra → save <strong>{fmt(r.extra.interestSaved)}</strong> in interest, finish <strong>{monthYears(r.extra.monthsSaved)}</strong> early (by {r.extra.payoffDate})
                  </div>
                )}
              </div>

              {/* PMI callout */}
              {r.pmiDropMonth && loanType === 'conventional' && (
                <div style={{ marginTop: 12, padding: '14px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>PMI drops off: {r.pmiDropDate}</div>
                    <div style={{ fontSize: 12, color: '#166534', marginTop: 3 }}>
                      You save <strong>{fmt(r.monthlyPMI)}/month</strong> after that — <strong>{fmt(r.monthlyPMI * 12)}/year</strong>. Your LTV reaches 80% and PMI cancels automatically.
                    </div>
                  </div>
                </div>
              )}

              {/* Income qualifier */}
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
                To qualify for this payment, you typically need <strong style={{ color: '#1a1a2e' }}>~{fmt(r.requiredIncome)}/month gross income</strong> ({fmt(r.requiredIncome * 12)}/year) — based on the 28% front-end rule.
              </div>

              {/* Share button */}
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
              Fill in the fields above to see your PITI payment.
            </div>
          )}

          {/* ── Charts ─────────────────────────────────────────────────────── */}
          {r && chartData.length > 1 && (
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Outstanding balance</div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <defs>
                      <linearGradient id="mortBalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [fmt(Number(v ?? 0)), 'Balance']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Area type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} fill="url(#mortBalGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Principal vs Interest per payment</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barSize={chartData.length > 36 ? 3 : chartData.length > 18 ? 6 : 10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis hide />
                    <Tooltip formatter={(v, name) => [fmt(Number(v ?? 0)), name === 'principal' ? 'Principal' : 'Interest']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="principal" stackId="a" fill="#15803d" name="principal" isAnimationActive={false} animationDuration={0} />
                    <Bar dataKey="interest" stackId="a" fill="#86efac" name="interest" radius={[2, 2, 0, 0]} isAnimationActive={false} animationDuration={0} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#15803d' }} /> Principal</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#86efac' }} /> Interest</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Amortization table ──────────────────────────────────────── */}
          {r && (
            <div style={{ ...cardStyle, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <button
                  onClick={() => setShowAmort(s => !s)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22c55e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Annual amortization schedule
                  <ChevronDown size={14} style={{ transform: showAmort ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {showAmort && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[{ label: 'CSV', fn: exportCSV }, { label: 'Excel', fn: exportExcel }].map(({ label, fn }) => (
                      <button key={label} onClick={fn} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                        <Download size={11} /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {showAmort && (
                <div style={{ marginTop: 14, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                        {['Year', 'Principal', 'Interest', r.monthlyPMI > 0 ? 'PMI/MIP' : null, 'Balance', 'Total Interest'].filter(Boolean).map(h => (
                          <th key={h!} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(r.exAnnualRows.length > 0 ? r.exAnnualRows : r.annualRows).map((row, i) => (
                        <tr key={row.year} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>{row.year}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#22c55e' }}>{fmt(row.principalPaid)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#6b7280' }}>{fmt(row.interestPaid)}</td>
                          {r.monthlyPMI > 0 && <td style={{ padding: '7px 10px', textAlign: 'right', color: '#f87171' }}>{fmt(row.pmiPaid)}</td>}
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#1a1a2e' }}>{fmt(row.endBalance)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af' }}>{fmt(row.cumInterest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Ad slot 2 — after calculator */}
          <div style={{ marginTop: 24 }}>
            <AdUnit slot={AD_SLOT_MID} label="after results" />
          </div>
        </section>

        {/* ── Try these next ──────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 12px' }}>Try these next</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {TOOLS.slice(0, 2).map(({ slug, title, desc, Icon }) => (
              <div key={slug} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#22c55e" />
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

        {/* Ad slot 3 — SEO section */}
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
          <AdUnit slot={AD_SLOT_SEO} label="mid content" />
        </div>

        {/* ── SEO content ─────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>What is a PITI mortgage payment?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            PITI represents the four parts of a complete monthly mortgage payment: <strong>Principal</strong> (the portion that reduces your loan balance), <strong>Interest</strong> (the cost of borrowing), <strong>Taxes</strong> (property taxes escrowed monthly), and <strong>Insurance</strong> (homeowners insurance plus PMI if required).
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            Lenders use your total PITI payment to determine whether you qualify. The standard guideline is that your PITI should not exceed 28% of your gross monthly income — the front-end debt-to-income ratio.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How to use this mortgage calculator</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            Enter your <strong>home price</strong>, <strong>down payment</strong> (in dollars or click % to switch), <strong>interest rate</strong>, and <strong>loan term</strong>. Select your loan type — Conventional, FHA, VA, or USDA — and the calculator applies the correct insurance rules automatically.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            Results update instantly. Use the <strong>biweekly toggle</strong> to see interest savings from accelerated payments, or drag the <strong>extra payment slider</strong> to find how much time and money you save by adding principal each month.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>How much mortgage can I afford? (28% rule)</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            The 28% front-end rule says your total PITI payment should not exceed 28% of your gross monthly income. If you earn $7,000/month gross, your maximum PITI is $1,960/month. Lenders also look at your back-end DTI (all debt payments / income), which should generally stay below 43%.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            This calculator shows your required income automatically in the results panel. Keep in mind that qualifying income and comfortable income are different — many financial planners suggest keeping housing costs below 25% to leave room for savings and emergencies.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>Understanding PMI: when you need it and when it drops off</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 10px' }}>
            PMI (Private Mortgage Insurance) is required on <strong>conventional loans</strong> when your down payment is less than 20% — meaning your LTV exceeds 80%. PMI protects the lender and typically costs 0.5%–1.5% of the loan amount annually, added to your monthly payment.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            The good news: on conventional loans, PMI cancels automatically when your loan balance reaches 80% of the <em>original</em> home value through normal amortization. This calculator highlights the exact month PMI drops and how much you save. With FHA loans, MIP is permanent on most loans — another reason to consider refinancing once you hit 20% equity.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>Biweekly vs monthly payments: how much can you save?</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 32px' }}>
            Biweekly mortgage payments mean you pay half your monthly payment every two weeks. Because there are 52 weeks in a year, you end up making 26 half-payments — the equivalent of <strong>13 full monthly payments</strong> instead of 12. That one extra payment per year goes entirely to principal, reducing your balance faster and compounding interest savings over the life of the loan. Toggle the biweekly switch above to see your exact savings.
          </p>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Frequently asked questions</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Everything you need to know about mortgage calculations.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 20px' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* ── Glossary ────────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Mortgage terms explained</h2>
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>The mortgage payment formula</h2>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
            <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '16px 20px', fontFamily: 'monospace', fontSize: 15, color: '#1a1a2e', marginBottom: 14, textAlign: 'center', letterSpacing: 0.5 }}>
              M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '6px 16px', fontSize: 13, margin: 0, padding: 0 }}>
              {[['M', 'Monthly principal & interest payment'], ['P', 'Loan amount (home price minus down payment, plus any upfront fees)'], ['r', 'Monthly interest rate (annual rate ÷ 12)'], ['n', 'Total number of monthly payments (loan term in years × 12)']].map(([sym, desc]) => (
                <React.Fragment key={sym}>
                  <dt style={{ fontWeight: 700, color: '#1a1a2e', fontFamily: 'monospace', margin: 0 }}>{sym}</dt>
                  <dd style={{ color: '#6b7280', margin: 0 }}>{desc}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </section>

        {/* Ad slot 4 — above footer */}
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 32px' }}>
          <AdUnit slot={AD_SLOT_BOTTOM} label="above footer" />
        </div>

        {/* ── All tools ───────────────────────────────────────────────────── */}
        <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 14px' }}>All tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {TOOLS.map(({ slug, title, desc, Icon }) => (
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

        {/* ── Disclaimer + footer ─────────────────────────────────────────── */}
        <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', padding: '10px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Results are illustrative only and do not constitute financial advice. Actual mortgage terms, rates, and insurance costs vary by lender, location, and borrower profile. Always consult a qualified mortgage professional.
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
