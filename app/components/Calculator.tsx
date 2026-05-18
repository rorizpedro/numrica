'use client'

import { useState, useMemo } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { HomeIcon, TrendingUp, CreditCard, BarChart3, ChevronDown, Download } from 'lucide-react'
import { calculate, annualToMonthly } from '@/app/lib/calculator'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'

// ─── GEO: FAQ & HowTo schemas ─────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'What is a loan calculator?',
    a: 'A loan calculator is a tool that computes your monthly loan payment, total interest paid, and full amortization schedule based on three inputs: loan amount (principal), interest rate, and loan term. It uses the standard PMT (Payment) formula to give you exact figures before you sign any agreement.',
  },
  {
    q: 'How is a monthly loan payment calculated?',
    a: 'Monthly payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the principal, r is the monthly interest rate (annual rate ÷ 12), and n is the number of monthly payments. This formula assumes a fixed-rate, fully amortizing loan with equal payments throughout the term.',
  },
  {
    q: 'What is an amortization schedule?',
    a: 'An amortization schedule is a complete table of every loan payment, showing how each installment splits between principal repayment and interest. Early payments are mostly interest; later payments are mostly principal. The schedule also shows the remaining balance after each payment.',
  },
  {
    q: 'What is the difference between interest rate and APR?',
    a: 'The interest rate is the cost of borrowing the principal, expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus any fees, points, or other costs — making it a broader measure of the true annual cost of a loan. Always compare APRs when evaluating loan offers.',
  },
  {
    q: 'What is a grace period on a loan?',
    a: 'A grace period is a set number of months at the start of a loan during which the borrower makes reduced or no principal payments. In a partial grace period, you pay only interest. In a total grace period, interest is capitalized — added to the principal — and you pay nothing until it ends. Grace periods increase the total cost of the loan.',
  },
  {
    q: 'How do I reduce the total interest I pay on a loan?',
    a: 'Four strategies reduce total loan interest: (1) make a larger down payment to reduce the principal; (2) choose a shorter loan term — fewer periods mean less accumulated interest; (3) negotiate or shop for a lower interest rate; (4) make extra principal payments when possible, reducing the outstanding balance faster.',
  },
  {
    q: 'What is the SAC vs. Price (constant installment) difference?',
    a: 'SAC (Constant Amortization) keeps the principal portion the same each month, so installments decrease over time — total interest is lower. Price (Constant Installment) keeps the payment the same every month, which simplifies budgeting but results in higher total interest. Use SAC to minimize cost; use Price for predictable cash flow.',
  },
  {
    q: 'Is this loan calculator free?',
    a: 'Yes. Numrica\'s loan calculator is completely free. No account required, no personal data collected, no hidden fees. You get instant results including monthly payment, total interest, and a full amortization schedule.',
  },
]

const GLOSSARY = [
  { term: 'Principal', def: 'The original amount borrowed, before interest is applied.' },
  { term: 'Interest rate', def: 'The percentage charged on the outstanding balance per period (monthly or annual).' },
  { term: 'Loan term', def: 'The number of periods (usually months) over which the loan is repaid.' },
  { term: 'Amortization', def: 'The process of spreading loan payments over time, with each payment covering both interest and principal.' },
  { term: 'Grace period', def: 'A period at the loan\'s start where reduced or no principal payments are required.' },
  { term: 'Total interest', def: 'The sum of all interest payments over the full loan term — the real cost of borrowing.' },
]

// ─── AdSense ─────────────────────────────────────────────────────────────────
// Replace with your real IDs from AdSense dashboard (adsense.google.com)
//   Publisher ID: ca-pub-XXXXXXXXXXXXXXXXX  (Settings → Account info)
//   Slot IDs: create "Display ad" units and copy the slot number
const ADSENSE_CLIENT  = 'ca-pub-XXXXXXXXXXXXXXXXX'
const AD_SLOT_RESULTS = '1111111111'   // below calculator results
const AD_SLOT_MID     = '2222222222'   // between calculator and tools grid
const AD_SLOT_BOTTOM  = '3333333333'   // above footer

declare global { interface Window { adsbygoogle?: unknown[] } }

function AdUnit({ slot, label }: { slot: string; label: string }) {
  // Uncomment the useEffect below after AdSense account is approved:
  // useEffect(() => {
  //   try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  // }, [])

  return (
    <div style={{
      width: '100%',
      minHeight: 90,
      background: '#f3f4f6',
      border: '1px dashed #d1d5db',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: 11,
      letterSpacing: 1,
      textTransform: 'uppercase',
    }}>
      {/* Replace this placeholder div with the ins tag below after AdSense approval:

      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      */}
      Ad · {label}
    </div>
  )
}

// ─── Currencies ───────────────────────────────────────────────────────────────

const CURRENCIES = {
  'Tier 1 — Most traded': [
    { value: 'USD', label: 'USD — US Dollar ($)' },
    { value: 'EUR', label: 'EUR — Euro (€)' },
    { value: 'GBP', label: 'GBP — British Pound (£)' },
    { value: 'CAD', label: 'CAD — Canadian Dollar (C$)' },
    { value: 'AUD', label: 'AUD — Australian Dollar (A$)' },
    { value: 'CHF', label: 'CHF — Swiss Franc (Fr)' },
    { value: 'JPY', label: 'JPY — Japanese Yen (¥)' },
    { value: 'NZD', label: 'NZD — New Zealand Dollar (NZ$)' },
    { value: 'SGD', label: 'SGD — Singapore Dollar (S$)' },
    { value: 'HKD', label: 'HKD — Hong Kong Dollar (HK$)' },
  ],
  'Europe': [
    { value: 'NOK', label: 'NOK — Norwegian Krone (kr)' },
    { value: 'SEK', label: 'SEK — Swedish Krona (kr)' },
    { value: 'DKK', label: 'DKK — Danish Krone (kr)' },
    { value: 'PLN', label: 'PLN — Polish Złoty (zł)' },
    { value: 'CZK', label: 'CZK — Czech Koruna (Kč)' },
    { value: 'HUF', label: 'HUF — Hungarian Forint (Ft)' },
    { value: 'RON', label: 'RON — Romanian Leu (lei)' },
    { value: 'BGN', label: 'BGN — Bulgarian Lev (лв)' },
    { value: 'TRY', label: 'TRY — Turkish Lira (₺)' },
    { value: 'RUB', label: 'RUB — Russian Ruble (₽)' },
  ],
  'Latin America': [
    { value: 'BRL', label: 'BRL — Brazilian Real (R$)' },
    { value: 'MXN', label: 'MXN — Mexican Peso (MX$)' },
    { value: 'ARS', label: 'ARS — Argentine Peso ($)' },
    { value: 'COP', label: 'COP — Colombian Peso (COL$)' },
    { value: 'CLP', label: 'CLP — Chilean Peso (CLP$)' },
    { value: 'PEN', label: 'PEN — Peruvian Sol (S/)' },
    { value: 'UYU', label: 'UYU — Uruguayan Peso ($U)' },
  ],
  'Asia Pacific': [
    { value: 'CNY', label: 'CNY — Chinese Yuan (¥)' },
    { value: 'KRW', label: 'KRW — South Korean Won (₩)' },
    { value: 'INR', label: 'INR — Indian Rupee (₹)' },
    { value: 'TWD', label: 'TWD — Taiwan Dollar (NT$)' },
    { value: 'THB', label: 'THB — Thai Baht (฿)' },
    { value: 'MYR', label: 'MYR — Malaysian Ringgit (RM)' },
    { value: 'IDR', label: 'IDR — Indonesian Rupiah (Rp)' },
    { value: 'PHP', label: 'PHP — Philippine Peso (₱)' },
    { value: 'VND', label: 'VND — Vietnamese Dong (₫)' },
    { value: 'PKR', label: 'PKR — Pakistani Rupee (₨)' },
    { value: 'BDT', label: 'BDT — Bangladeshi Taka (৳)' },
  ],
  'Middle East & Africa': [
    { value: 'AED', label: 'AED — UAE Dirham (د.إ)' },
    { value: 'SAR', label: 'SAR — Saudi Riyal (﷼)' },
    { value: 'QAR', label: 'QAR — Qatari Riyal (ر.ق)' },
    { value: 'KWD', label: 'KWD — Kuwaiti Dinar (د.ك)' },
    { value: 'BHD', label: 'BHD — Bahraini Dinar (.د.ب)' },
    { value: 'OMR', label: 'OMR — Omani Rial (ر.ع.)' },
    { value: 'ILS', label: 'ILS — Israeli Shekel (₪)' },
    { value: 'ZAR', label: 'ZAR — South African Rand (R)' },
    { value: 'NGN', label: 'NGN — Nigerian Naira (₦)' },
    { value: 'EGP', label: 'EGP — Egyptian Pound (E£)' },
    { value: 'KES', label: 'KES — Kenyan Shilling (KSh)' },
    { value: 'GHS', label: 'GHS — Ghanaian Cedi (₵)' },
  ],
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtCurrency(v: number, currency: string) {
  // For very large values, use compact (1.2M) — otherwise standard comma-separated
  if (Math.abs(v) >= 1_000_000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency,
      notation: 'compact', maximumFractionDigits: 2,
    }).format(v)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(v)
}

function fmtInput(v: string) {
  const n = parseFloat(v.replace(/,/g, ''))
  if (isNaN(n)) return v
  return new Intl.NumberFormat('en-US').format(n)
}

// ─── Tools catalog ────────────────────────────────────────────────────────────

const TOOLS = [
  { slug: 'mortgage-calculator', title: 'Mortgage Calculator', desc: 'Home price, down payment, and full PITI — principal, interest, taxes, and insurance.', Icon: HomeIcon, live: true },
  { slug: 'debt-payoff', title: 'Debt Payoff Planner', desc: 'Avalanche vs. snowball — find the fastest and cheapest path to debt-free.', Icon: CreditCard },
  { slug: 'compound-interest', title: 'Compound Interest', desc: 'How money grows over time with compound interest and regular contributions.', Icon: TrendingUp },
  { slug: 'roi-calculator', title: 'ROI Calculator', desc: 'Return on any investment — simple, annualized, or inflation-adjusted.', Icon: BarChart3 },
]

// ─── Main component ───────────────────────────────────────────────────────────

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={16} color="#9ca3af" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 14px', paddingRight: 24 }}>{a}</p>
      )}
    </div>
  )
}

export default function Calculator() {
  const today = new Date().toISOString().split('T')[0]

  const [rawAmount, setRawAmount]     = useState('100000')
  const [displayAmount, setDisplay]   = useState('100,000')
  const [rate, setRate]               = useState('1.5')
  const [ratePeriod, setRatePeriod]   = useState<'monthly' | 'annual'>('monthly')
  const [term, setTerm]               = useState('24')
  const [grace, setGrace]             = useState('0')
  const [currency, setCurrency]       = useState('USD')
  const [showSchedule, setShowSchedule] = useState(false)

  const result = useMemo(() => {
    const principal = parseFloat(rawAmount)
    const rateRaw   = parseFloat(rate) / 100
    const periods   = parseInt(term)
    const gracePeriods = parseInt(grace) || 0
    if (!principal || !rateRaw || !periods || principal <= 0 || periods <= 0) return null
    const rateMonthly = ratePeriod === 'annual' ? annualToMonthly(rateRaw) : rateRaw
    return calculate({ principal, rateMonthly, periods, gracePeriods, graceType: 'partial', type: 'PRICE', gradientRate: 0, startDate: today })
  }, [rawAmount, rate, ratePeriod, term, grace, today])

  const chartData = useMemo(() => {
    if (!result) return []
    const rows = result.rows
    const maxPoints = 60
    const step = rows.length > maxPoints ? Math.ceil(rows.length / maxPoints) : 1
    return rows
      .filter((_, i) => i % step === 0 || i === rows.length - 1)
      .map(r => ({ period: r.period, balance: r.closingBalance, principal: r.amortization, interest: r.interest }))
  }, [result])

  function exportCSV() {
    if (!result) return
    const headers = ['Period', 'Date', 'Opening Balance', 'Principal', 'Interest', 'Installment', 'Closing Balance']
    const rows = result.rows.map(r => [r.period, r.date, r.openingBalance.toFixed(2), r.amortization.toFixed(2), r.interest.toFixed(2), r.installment.toFixed(2), r.closingBalance.toFixed(2)])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'loan-schedule.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function exportExcel() {
    if (!result) return
    const data = result.rows.map(r => ({
      'Period': r.period, 'Date': r.date,
      'Opening Balance': r.openingBalance, 'Principal': r.amortization,
      'Interest': r.interest, 'Installment': r.installment, 'Closing Balance': r.closingBalance,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Amortization Schedule')
    XLSX.writeFile(wb, 'loan-schedule.xlsx')
  }

  function exportPDF() {
    if (!result) return
    const tableRows = result.rows.map(r => `<tr>
      <td>${r.period}</td><td>${r.date}</td>
      <td>${fmtCurrency(r.openingBalance, currency)}</td>
      <td>${fmtCurrency(r.amortization, currency)}</td>
      <td>${fmtCurrency(r.interest, currency)}</td>
      <td>${fmtCurrency(r.installment, currency)}</td>
      <td>${fmtCurrency(r.closingBalance, currency)}</td>
    </tr>`).join('')
    const html = `<!DOCTYPE html><html><head><title>Loan Schedule — Numrica</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:11px;padding:24px;color:#111}
        h1{font-size:15px;margin:0 0 4px}p{color:#666;margin:0 0 16px;font-size:10px}
        table{width:100%;border-collapse:collapse}
        th{background:#f3f4f6;padding:6px 8px;text-align:right;font-weight:600;border-bottom:2px solid #e5e7eb;font-size:10px}
        td{padding:5px 8px;text-align:right;border-bottom:1px solid #f0f0f0}
        tr:nth-child(even){background:#fafafa}
        @media print{body{padding:0}}
      </style></head><body>
      <h1>Loan Amortization Schedule</h1>
      <p>Generated by numrica.com &middot; ${new Date().toLocaleDateString('en-US')}</p>
      <table><thead><tr>
        <th>#</th><th>Date</th><th>Opening Balance</th><th>Principal</th><th>Interest</th><th>Installment</th><th>Closing Balance</th>
      </tr></thead><tbody>${tableRows}</tbody></table>
      <script>setTimeout(()=>{window.print();window.onafterprint=()=>window.close();},200)<\/script>
    </body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  const inputCls  = "w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 transition-colors"
  const selectCls = inputCls + " cursor-pointer"
  const labelCls  = "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })

  const howToSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Calculate a Loan Payment',
    description: 'Calculate your monthly loan payment and total interest using this free online loan calculator.',
    step: [
      { '@type': 'HowToStep', name: 'Enter loan amount', text: 'Type the total amount you want to borrow in the Loan Amount field.' },
      { '@type': 'HowToStep', name: 'Set interest rate', text: 'Enter the interest rate as a percentage. Toggle between monthly and annual rate.' },
      { '@type': 'HowToStep', name: 'Set loan term', text: 'Enter the number of months for your loan repayment period.' },
      { '@type': 'HowToStep', name: 'Add grace period if applicable', text: 'If your loan has a deferred payment period, enter the number of grace months.' },
      { '@type': 'HowToStep', name: 'Read results instantly', text: 'Monthly payment, total paid, and total interest appear immediately. Click "Full amortization schedule" for a period-by-period breakdown.' },
    ],
  })

  return (
    <>
      <Script id="faq-schema" type="application/ld+json">{faqSchema}</Script>
      <Script id="howto-schema" type="application/ld+json">{howToSchema}</Script>
    <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>

      {/* ── Ad slot top ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '20px 24px 0' }}>
        <AdUnit slot={AD_SLOT_RESULTS} label="leaderboard" />
      </section>

      {/* ── Hero + SEO copy ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '28px 24px 32px' }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.7px', lineHeight: 1.15, margin: '0 0 10px' }}>
          Free Loan Calculator
        </h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6, maxWidth: 520 }}>
          Calculate your monthly loan payment, total interest, and full amortization schedule instantly — no signup, no ads tracking.
        </p>

        {/* ── Calculator card ──────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px 24px 20px' }}>

          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14, marginBottom: 20 }}>

            <div>
              <label className={labelCls}>Currency</label>
              <select className={selectCls} value={currency} onChange={e => setCurrency(e.target.value)}>
                {Object.entries(CURRENCIES).map(([group, list]) => (
                  <optgroup key={group} label={group}>
                    {list.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Loan amount</label>
              <input
                className={inputCls}
                type="text"
                inputMode="numeric"
                placeholder="100,000"
                value={displayAmount}
                onChange={e => {
                  const raw = e.target.value.replace(/,/g, '')
                  setRawAmount(raw)
                  setDisplay(e.target.value)
                }}
                onBlur={() => {
                  const n = parseFloat(rawAmount)
                  if (!isNaN(n)) setDisplay(fmtInput(rawAmount))
                }}
                onFocus={() => setDisplay(rawAmount)}
              />
            </div>

            <div>
              <label className={labelCls}>Interest rate (%)</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className={inputCls}
                  style={{ flex: 1 }}
                  type="number"
                  placeholder="1.5"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  step="0.01"
                  min={0.001}
                />
                <select
                  style={{ width: 68, height: 44, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, color: '#6b7280', background: '#fff', cursor: 'pointer', paddingLeft: 4 }}
                  value={ratePeriod}
                  onChange={e => setRatePeriod(e.target.value as 'monthly' | 'annual')}
                >
                  <option value="monthly">/ mo</option>
                  <option value="annual">/ yr</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Term (months)</label>
              <input className={inputCls} type="number" placeholder="24" value={term} onChange={e => setTerm(e.target.value)} min={1} max={600} />
            </div>

            <div>
              <label className={labelCls}>Grace period (mo)</label>
              <input className={inputCls} type="number" placeholder="0" value={grace} onChange={e => setGrace(e.target.value)} min={0} />
            </div>

          </div>

          {/* Results */}
          {result ? (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Monthly payment', value: fmtCurrency(result.firstInstallment, currency) },
                  { label: 'Total paid',       value: fmtCurrency(result.totalPaid, currency) },
                  { label: 'Total interest',   value: fmtCurrency(result.totalInterest, currency) },
                  { label: 'Last payment',     value: fmtCurrency(result.lastInstallment, currency) },
                ].map(card => (
                  <div key={card.label} style={{ background: '#f8f9fb', borderRadius: 8, padding: '11px 13px' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, fontWeight: 500 }}>{card.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>{card.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowSchedule(s => !s)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#22c55e', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Full amortization schedule
                  <ChevronDown size={14} style={{ transform: showSchedule ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {showSchedule && (
                  <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                    {[
                      { label: 'CSV', fn: exportCSV },
                      { label: 'Excel', fn: exportExcel },
                      { label: 'PDF', fn: exportPDF },
                    ].map(({ label, fn }) => (
                      <button key={label} onClick={fn} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                        <Download size={11} /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {showSchedule && result && (
                <div style={{ marginTop: 16, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e5e7eb' }}>
                        {['#', 'Date', 'Opening balance', 'Principal', 'Interest', 'Installment', 'Closing balance'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={row.period} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>{row.period}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#6b7280', whiteSpace: 'nowrap' }}>{row.date}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#1a1a2e' }}>{fmtCurrency(row.openingBalance, currency)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#1a1a2e' }}>{fmtCurrency(row.amortization, currency)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#6b7280' }}>{fmtCurrency(row.interest, currency)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 600, color: '#1a1a2e' }}>{fmtCurrency(row.installment, currency)}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'right', color: '#9ca3af' }}>{fmtCurrency(row.closingBalance, currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14, fontSize: 13, color: '#d1d5db' }}>
              Fill in the fields above to see results.
            </div>
          )}
        </div>

        {/* ── Charts ─────────────────────────────────────────────────────── */}
        {result && chartData.length > 1 && (
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Outstanding balance</div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide />
                  <Tooltip formatter={(v) => [fmtCurrency(Number(v ?? 0), currency), 'Balance']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                  <Area type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} fill="url(#balGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 20px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Principal vs Interest per period</div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barSize={chartData.length > 36 ? 3 : chartData.length > 18 ? 6 : 10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide />
                  <Tooltip formatter={(v, name) => [fmtCurrency(Number(v ?? 0), currency), name === 'principal' ? 'Principal' : 'Interest']} contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="principal" stackId="a" fill="#1a1a2e" name="principal" />
                  <Bar dataKey="interest" stackId="a" fill="#86efac" name="interest" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1a1a2e' }} /> Principal
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7280' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#86efac' }} /> Interest
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Ad slot 1 — below calculator results ─────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <AdUnit slot={AD_SLOT_RESULTS} label="after results" />
        </div>
      </section>

      {/* ── Try these next ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 12px' }}>
          Try these next
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {TOOLS.slice(0, 2).map(({ slug, title, desc, Icon, live }) => {
            const inner = (
              <>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#22c55e" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{title}</span>
                    {!live && <span style={{ fontSize: 9, background: '#f3f4f6', color: '#9ca3af', padding: '2px 4px', borderRadius: 3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>soon</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </>
            )
            return live ? (
              <Link key={slug} href={`/${slug}`} style={{ background: '#fff', border: '1px solid #22c55e', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none' }}>
                {inner}
              </Link>
            ) : (
              <div key={slug} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Ad slot 2 — mid page ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 24px' }}>
        <AdUnit slot={AD_SLOT_MID} label="mid page" />
      </div>

      {/* ── SEO content block ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>
          How to use this loan calculator
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: '0 0 12px' }}>
          Enter your <strong>loan amount</strong>, <strong>interest rate</strong> (monthly or annual), and <strong>loan term in months</strong>. Results update instantly — no button needed. You'll see your monthly payment, total amount paid, and total interest cost.
        </p>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
          Use the <strong>grace period</strong> field if your loan has a deferred payment period at the start. The full amortization schedule shows every payment, broken down into principal and interest, from month 1 to the final installment.
        </p>
      </section>

      {/* ── All tools ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
          All tools
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {TOOLS.map(({ slug, title, desc, Icon, live }) => {
            const inner = (
              <>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: live ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={live ? '#22c55e' : '#9ca3af'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{title}</span>
                    {!live && <span style={{ fontSize: 9, background: '#f3f4f6', color: '#9ca3af', padding: '2px 4px', borderRadius: 3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>soon</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </>
            )
            return live ? (
              <Link key={slug} href={`/${slug}`} style={{ background: '#fff', border: '1px solid #22c55e', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none' }}>
                {inner}
              </Link>
            ) : (
              <div key={slug} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── GEO: Glossary ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>
          Key loan terms explained
        </h2>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, margin: 0, padding: 0 }}>
          {GLOSSARY.map(({ term, def }) => (
            <div key={term} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '14px 16px' }}>
              <dt style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{term}</dt>
              <dd style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── GEO: FAQ ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
          Frequently asked questions
        </h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
          Everything you need to know about loan calculations.
        </p>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 20px' }}>
          {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
        </div>
      </section>

      {/* ── GEO: Formula block ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 48px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>
          The loan payment formula
        </h2>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '16px 20px', fontFamily: 'monospace', fontSize: 15, color: '#1a1a2e', marginBottom: 14, textAlign: 'center', letterSpacing: 0.5 }}>
            M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '6px 16px', fontSize: 13, margin: 0, padding: 0 }}>
            {[
              ['M', 'Monthly payment'],
              ['P', 'Principal — the loan amount'],
              ['r', 'Monthly interest rate (annual rate ÷ 12)'],
              ['n', 'Total number of monthly payments (term in months)'],
            ].map(([sym, desc]) => (
              <>
                <dt key={sym} style={{ fontWeight: 700, color: '#1a1a2e', fontFamily: 'monospace', margin: 0 }}>{sym}</dt>
                <dd key={desc} style={{ color: '#6b7280', margin: 0 }}>{desc}</dd>
              </>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Ad slot 3 — above footer ──────────────────────────────────────── */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 32px' }}>
        <AdUnit slot={AD_SLOT_BOTTOM} label="above footer" />
      </div>

      {/* ── Superfooter — disclaimer ──────────────────────────────────────── */}
      <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '10px 24px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            Results are illustrative only and do not constitute financial advice. Always consult a qualified financial professional before making borrowing decisions.
          </span>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
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
