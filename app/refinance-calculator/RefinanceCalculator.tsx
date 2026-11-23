'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Share2, TriangleAlert } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import EmbedButton from '@/app/components/EmbedButton'
import { calculateRefinance, closingCostsFromPercent } from '@/app/lib/refinance'

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt0 = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const fmt2 = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)

const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0

const withCommas = (s: string) => {
  const n = parseNum(s)
  return n === 0 ? s : new Intl.NumberFormat('en-US').format(n)
}

function monthsLabel(m: number) {
  const whole = Math.round(m)
  const y = Math.floor(whole / 12)
  const mo = whole % 12
  if (y === 0) return `${whole} month${whole === 1 ? '' : 's'}`
  if (mo === 0) return `${y} year${y === 1 ? '' : 's'}`
  return `${y} yr ${mo} mo`
}

type CostMode = 'pct' | 'usd'

interface Scenario {
  label: string
  balance: string
  currentRate: string
  remYears: string
  remMonths: string
  newRate: string
  newYears: string
  costMode: CostMode
  costValue: string
  finance: boolean
  horizonYears: string
}

const PRESETS: Scenario[] = [
  { label: 'Rate drop, same term', balance: '250000', currentRate: '7.00', remYears: '30', remMonths: '0', newRate: '6.00', newYears: '30', costMode: 'pct', costValue: '2', finance: false, horizonYears: '7' },
  { label: 'Finance the costs', balance: '250000', currentRate: '7.00', remYears: '30', remMonths: '0', newRate: '6.00', newYears: '30', costMode: 'pct', costValue: '2', finance: true, horizonYears: '7' },
  { label: 'Term-reset trap', balance: '280000', currentRate: '6.75', remYears: '27', remMonths: '0', newRate: '6.25', newYears: '30', costMode: 'pct', costValue: '2', finance: false, horizonYears: '7' },
  { label: 'Shorten to 15 years', balance: '250000', currentRate: '7.00', remYears: '30', remMonths: '0', newRate: '6.00', newYears: '15', costMode: 'pct', costValue: '2', finance: false, horizonYears: '15' },
]

const NEW_TERMS = ['10', '15', '20', '25', '30']
const HORIZONS = ['2', '5', '7', '10']

const inputClass =
  'h-10 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-[#1a1a2e] outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20'
const labelClass = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-400'
const cardClass = 'rounded-xl border border-gray-200 bg-white p-5'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'h-10 min-w-10 rounded-lg border px-3 text-xs font-semibold transition-colors ' +
        (active ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white' : 'border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200')
      }
    >
      {children}
    </button>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function RefinanceCalculator() {
  const [balance, setBalance] = useState('250000')
  const [balanceDisplay, setBalanceDisplay] = useState('250,000')
  const [currentRate, setCurrentRate] = useState('7.00')
  const [remYears, setRemYears] = useState('30')
  const [remMonths, setRemMonths] = useState('0')
  const [newRate, setNewRate] = useState('6.00')
  const [newYears, setNewYears] = useState('30')
  const [costMode, setCostMode] = useState<CostMode>('pct')
  const [costValue, setCostValue] = useState('2')
  const [finance, setFinance] = useState(false)
  const [horizonYears, setHorizonYears] = useState('7')
  const [showTable, setShowTable] = useState(false)
  const [copied, setCopied] = useState(false)

  // Read shareable URL params on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    // URL params exist only after hydration; reading them in the initializer would mismatch server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p.get('b')) { const v = p.get('b')!; setBalance(v); setBalanceDisplay(withCommas(v)) }
    if (p.get('cr')) setCurrentRate(p.get('cr')!)
    if (p.get('ry')) setRemYears(p.get('ry')!)
    if (p.get('rm')) setRemMonths(p.get('rm')!)
    if (p.get('nr')) setNewRate(p.get('nr')!)
    if (p.get('nt')) setNewYears(p.get('nt')!)
    if (p.get('cc')) setCostValue(p.get('cc')!)
    if (p.get('ccm') === 'usd' || p.get('ccm') === 'pct') setCostMode(p.get('ccm') as CostMode)
    if (p.get('fin')) setFinance(p.get('fin') === '1')
    if (p.get('h')) setHorizonYears(p.get('h')!)
  }, [])

  // Keep the URL in sync so a scenario can be shared (preserves the embed flag)
  useEffect(() => {
    const p = new URLSearchParams()
    if (new URLSearchParams(window.location.search).get('embed')) p.set('embed', '1')
    p.set('b', balance)
    p.set('cr', currentRate)
    p.set('ry', remYears)
    p.set('rm', remMonths)
    p.set('nr', newRate)
    p.set('nt', newYears)
    p.set('cc', costValue)
    p.set('ccm', costMode)
    if (finance) p.set('fin', '1')
    p.set('h', horizonYears)
    window.history.replaceState(null, '', `?${p.toString()}`)
  }, [balance, currentRate, remYears, remMonths, newRate, newYears, costValue, costMode, finance, horizonYears])

  const balanceNum = parseNum(balance)
  const closingDollars = costMode === 'pct' ? closingCostsFromPercent(balanceNum, parseNum(costValue)) : parseNum(costValue)

  const r = useMemo(
    () =>
      calculateRefinance({
        currentBalance: balanceNum,
        currentRate: parseFloat(currentRate) || 0,
        remainingMonths: Math.round((parseFloat(remYears) || 0) * 12 + (parseFloat(remMonths) || 0)),
        newRate: parseFloat(newRate) || 0,
        newTermMonths: Math.round((parseFloat(newYears) || 0) * 12),
        closingCosts: closingDollars,
        financeClosingCosts: finance,
        horizonMonths: Math.round((parseFloat(horizonYears) || 0) * 12),
      }),
    [balanceNum, currentRate, remYears, remMonths, newRate, newYears, closingDollars, finance, horizonYears],
  )

  const tableRows = useMemo(() => {
    if (!r) return []
    return r.series
      .filter((pt) => pt.month > 0 && pt.month % 12 === 0)
      .map((pt) => ({ year: pt.month / 12, keep: pt.keep, refinance: pt.refinance, diff: pt.keep - pt.refinance }))
  }, [r])

  const chartEnd = r && r.series.length ? r.series[r.series.length - 1].month : 0

  function applyPreset(s: Scenario) {
    setBalance(s.balance)
    setBalanceDisplay(withCommas(s.balance))
    setCurrentRate(s.currentRate)
    setRemYears(s.remYears)
    setRemMonths(s.remMonths)
    setNewRate(s.newRate)
    setNewYears(s.newYears)
    setCostMode(s.costMode)
    setCostValue(s.costValue)
    setFinance(s.finance)
    setHorizonYears(s.horizonYears)
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const saves = r ? r.monthlySavings > 0.005 : false

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <section className="mx-auto max-w-[840px] px-6 pb-6 pt-5">
        <h1 className="mb-2 text-[32px] font-bold leading-tight tracking-tight text-[#1a1a2e]">
          Refinance Break-Even Calculator
        </h1>
        <p className="mb-6 max-w-[560px] text-[15px] leading-relaxed text-gray-500">
          Find out how many months it takes for a refinance to pay back its closing costs, and whether it still comes out
          ahead for the time you plan to keep the loan. No signup.
        </p>

        {/* ── Inputs ───────────────────────────────────────────────────── */}
        <div className={cardClass}>
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {PRESETS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => applyPreset(s)}
                className="whitespace-nowrap rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200"
              >
                {s.label}
              </button>
            ))}
            <span className="ml-1 text-[11px] text-gray-400">Quick start</span>
          </div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#15803d]">Your current loan</p>
          <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
            <div>
              <label htmlFor="rf-balance" className={labelClass}>Balance owed</label>
              <input
                id="rf-balance" className={inputClass} type="text" inputMode="numeric" placeholder="250,000"
                value={balanceDisplay}
                onChange={(e) => { setBalance(e.target.value.replace(/,/g, '')); setBalanceDisplay(e.target.value) }}
                onBlur={() => { const n = parseNum(balance); if (n) { setBalance(String(n)); setBalanceDisplay(withCommas(String(n))) } }}
                onFocus={() => setBalanceDisplay(balance)}
              />
            </div>
            <div>
              <label htmlFor="rf-current-rate" className={labelClass}>Current rate (%)</label>
              <input id="rf-current-rate" className={inputClass} type="number" step="0.125" min="0" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} />
            </div>
            <div>
              <span className={labelClass}>Time left</span>
              <div className="flex items-center gap-1.5">
                <input aria-label="Years left" className={inputClass} type="number" min="0" max="50" value={remYears} onChange={(e) => setRemYears(e.target.value)} />
                <span className="text-xs text-gray-400">yr</span>
                <input aria-label="Months left" className={inputClass} type="number" min="0" max="11" value={remMonths} onChange={(e) => setRemMonths(e.target.value)} />
                <span className="text-xs text-gray-400">mo</span>
              </div>
            </div>
          </div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#15803d]">The refinance</p>
          <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
            <div>
              <label htmlFor="rf-new-rate" className={labelClass}>New rate (%)</label>
              <input id="rf-new-rate" className={inputClass} type="number" step="0.125" min="0" value={newRate} onChange={(e) => setNewRate(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <span className={labelClass}>New loan term (years)</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {NEW_TERMS.map((t) => (
                  <Chip key={t} active={newYears === t} onClick={() => setNewYears(t)}>{t}</Chip>
                ))}
                <input
                  aria-label="Custom new term in years" className={inputClass + ' !w-16'} type="number" min="1" max="50" placeholder="yr"
                  value={NEW_TERMS.includes(newYears) ? '' : newYears} onChange={(e) => setNewYears(e.target.value)}
                />
              </div>
            </div>
            <div>
              <span className={labelClass}>Closing costs</span>
              <div className="flex items-center gap-1.5">
                <input
                  aria-label="Closing costs amount" className={inputClass} type="number" step={costMode === 'pct' ? '0.25' : '100'} min="0"
                  value={costValue} onChange={(e) => setCostValue(e.target.value)}
                />
                <Chip active={costMode === 'pct'} onClick={() => setCostMode('pct')}>%</Chip>
                <Chip active={costMode === 'usd'} onClick={() => setCostMode('usd')}>$</Chip>
              </div>
              <p className="mt-1 text-[11px] text-gray-400">{fmt0(closingDollars)} total</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <span className={labelClass}>Years you will keep the loan</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {HORIZONS.map((h) => (
                  <Chip key={h} active={horizonYears === h} onClick={() => setHorizonYears(h)}>{h}</Chip>
                ))}
                <input
                  aria-label="Custom horizon in years" className={inputClass + ' !w-16'} type="number" min="1" max="50" placeholder="yr"
                  value={HORIZONS.includes(horizonYears) ? '' : horizonYears} onChange={(e) => setHorizonYears(e.target.value)}
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-gray-600">
              <input type="checkbox" checked={finance} onChange={(e) => setFinance(e.target.checked)} className="h-4 w-4 accent-[#22c55e]" />
              Roll closing costs into the new loan
            </label>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────────────── */}
        {r ? (
          <div className="mt-4" aria-live="polite">
            {r.alerts.length > 0 && (
              <div className="mb-3 space-y-2">
                {r.alerts.map((a) => (
                  <div key={a.kind} className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] leading-relaxed text-amber-900">
                    <TriangleAlert size={16} className="mt-0.5 shrink-0" />
                    <span>{a.message}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={cardClass}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-[#f8f9fb] p-3.5">
                  <div className="mb-1 text-[11px] font-medium text-gray-400">Current payment</div>
                  <div className="text-xl font-bold tracking-tight text-[#1a1a2e]">{fmt2(r.currentPayment)}</div>
                  <div className="text-[11px] text-gray-400">principal and interest</div>
                </div>
                <div className="rounded-lg bg-[#f8f9fb] p-3.5">
                  <div className="mb-1 text-[11px] font-medium text-gray-400">New payment</div>
                  <div className="text-xl font-bold tracking-tight text-[#1a1a2e]">{fmt2(r.newPayment)}</div>
                  <div className="text-[11px] text-gray-400">on {fmt0(r.newPrincipal)}</div>
                </div>
                <div className={'rounded-lg p-3.5 ' + (saves ? 'bg-[#dcfce7]' : 'bg-red-50')}>
                  <div className={'mb-1 text-[11px] font-medium ' + (saves ? 'text-[#15803d]' : 'text-red-700')}>
                    {saves ? 'Monthly savings' : 'Monthly increase'}
                  </div>
                  <div className={'text-xl font-bold tracking-tight ' + (saves ? 'text-[#15803d]' : 'text-red-700')}>
                    {fmt2(Math.abs(r.monthlySavings))}
                  </div>
                  <div className={'text-[11px] ' + (saves ? 'text-[#166534]' : 'text-red-600')}>per month</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Break-even: costs ÷ monthly savings</div>
                  <div className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
                    {r.simpleBreakEvenMonths !== null ? `${r.simpleBreakEvenMonths.toFixed(1)} months` : 'No break-even'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {r.simpleBreakEvenMonths !== null
                      ? `About ${monthsLabel(r.simpleBreakEvenMonths)} of payment savings to earn back your closing costs.`
                      : 'The new payment is not lower, so payment savings never repay the costs.'}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Break-even counting the balance you owe</div>
                  <div className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
                    {r.trueBreakEvenMonths !== null ? `${r.trueBreakEvenMonths} months` : 'Never'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    First month when payments, closing costs and the balance still owed are lower with the refinance.
                  </p>
                </div>
              </div>

              <div className={'mt-4 rounded-lg border p-4 ' + (r.netAtHorizon >= 0 ? 'border-[#86efac] bg-[#dcfce7]' : 'border-red-200 bg-red-50')}>
                <div className={'text-sm font-bold ' + (r.netAtHorizon >= 0 ? 'text-[#15803d]' : 'text-red-700')}>
                  If you keep the loan {monthsLabel(r.horizonMonths)}, refinancing leaves you{' '}
                  {fmt0(Math.abs(r.netAtHorizon))} {r.netAtHorizon >= 0 ? 'ahead' : 'behind'}.
                </div>
                <p className={'mt-1 text-xs leading-relaxed ' + (r.netAtHorizon >= 0 ? 'text-[#166534]' : 'text-red-600')}>
                  Cost at that point: {fmt0(r.costAtHorizonRefinance)} with the refinance versus {fmt0(r.costAtHorizonKeep)} if you keep your
                  loan. Both include the payments you make and the balance you still owe (which you would pay off if you sold).
                </p>
              </div>

              <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
                {[
                  { label: 'Interest left, current loan', value: fmt0(r.interestKeep) },
                  { label: 'Interest, new loan', value: fmt0(r.interestRefinance) },
                  { label: 'Closing costs paid at closing', value: fmt0(r.cashAtClosing) },
                  { label: 'Closing costs rolled in', value: fmt0(r.financedCosts) },
                  { label: 'Total paid, current loan', value: fmt0(r.totalPaidKeep) },
                  { label: 'Total paid, refinance', value: fmt0(r.totalPaidRefinance) },
                ].map((c) => (
                  <div key={c.label} className="rounded-lg bg-[#f8f9fb] px-3 py-2.5">
                    <div className="mb-1 text-[11px] font-medium text-gray-400">{c.label}</div>
                    <div className="text-[15px] font-bold tracking-tight text-[#1a1a2e]">{c.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Over the full life of both loans, refinancing {r.lifetimeSavings >= 0 ? 'saves' : 'costs'}{' '}
                <strong className="text-[#1a1a2e]">{fmt0(Math.abs(r.lifetimeSavings))}</strong> in total payments, closing costs included.
              </p>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={copyShareUrl}
                className={'inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 text-xs font-semibold ' + (copied ? 'text-[#22c55e]' : 'text-gray-500')}
              >
                <Share2 size={13} />
                {copied ? 'Link copied!' : 'Share this scenario'}
              </button>
            </div>

            {/* ── Chart ──────────────────────────────────────────────────── */}
            {r.series.length > 1 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-5 pb-3 pt-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Cash paid so far: keep your loan vs refinance
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={r.series} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      type="number" dataKey="month" domain={[0, chartEnd]} tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickLine={false} axisLine={false} tickFormatter={(m) => `${Math.round((Number(m) / 12) * 10) / 10}y`}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v, name) => [fmt0(Number(v ?? 0)), name === 'keep' ? 'Keep current loan' : 'Refinance']}
                      labelFormatter={(m) => `Month ${m}`}
                    />
                    <Legend formatter={(v) => (v === 'keep' ? 'Keep current loan' : 'Refinance')} />
                    <Line type="monotone" dataKey="keep" stroke="#9ca3af" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="refinance" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                    {r.simpleBreakEvenMonths !== null && r.simpleBreakEvenMonths > 0 && r.simpleBreakEvenMonths <= chartEnd && (
                      <ReferenceLine x={r.simpleBreakEvenMonths} stroke="#1a1a2e" strokeDasharray="4 3" label={{ value: 'Break-even', fontSize: 10, fill: '#1a1a2e', position: 'top' }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
                <p className="mt-1 text-[11px] text-gray-400">
                  Payments plus closing costs paid in cash. The lines cross at the break-even point when both loans have the same term.
                </p>
              </div>
            )}

            {/* ── Yearly table ───────────────────────────────────────────── */}
            {tableRows.length > 0 && (
              <div className={cardClass + ' mt-4'}>
                <button
                  type="button"
                  onClick={() => setShowTable((s) => !s)}
                  aria-expanded={showTable}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#22c55e]"
                >
                  Year-by-year comparison
                  <ChevronDown size={14} className={'transition-transform ' + (showTable ? 'rotate-180' : '')} />
                </button>
                {showTable && (
                  <div className="mt-3.5 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-[#f8f9fb]">
                          {['Year', 'Cash paid: keep', 'Cash paid: refinance', 'Difference'].map((h) => (
                            <th key={h} className="whitespace-nowrap px-2.5 py-2 text-right font-semibold text-gray-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, i) => (
                          <tr key={row.year} className={'border-b border-gray-100 ' + (i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                            <td className="px-2.5 py-1.5 text-right font-medium text-gray-400">{row.year}</td>
                            <td className="px-2.5 py-1.5 text-right text-gray-500">{fmt0(row.keep)}</td>
                            <td className="px-2.5 py-1.5 text-right text-gray-500">{fmt0(row.refinance)}</td>
                            <td className={'px-2.5 py-1.5 text-right font-semibold ' + (row.diff >= 0 ? 'text-[#15803d]' : 'text-red-600')}>
                              {row.diff >= 0 ? '+' : '-'}{fmt0(Math.abs(row.diff))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-2 text-[11px] text-gray-400">
                      Difference = cash paid keeping your loan minus cash paid refinancing. It ignores the balance still owed, so use the
                      figures above for the full picture.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={cardClass + ' mt-4 text-[13px] text-gray-400'}>
            Enter your balance, current rate and time left to see your break-even.
          </div>
        )}
      </section>

      <div className="embed-hide mx-auto flex max-w-[840px] justify-end px-6 py-1">
        <EmbedButton tool="refinance-calculator" title="Refinance Break-Even Calculator" />
      </div>
      <div className="embed-only mx-auto max-w-[840px] items-center justify-center gap-2 border-t border-gray-200 px-6 py-3">
        <span className="text-xs text-gray-400">Powered by</span>
        <a href="https://numrica.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#22c55e] no-underline">numrica.com</a>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">Free financial calculators</span>
      </div>
    </div>
  )
}
