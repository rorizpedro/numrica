'use client'

import { useMemo, useState } from 'react'
import EmbedButton from '@/app/components/EmbedButton'
import {
  analyze,
  scenarios,
  DEBT_KEYS,
  DEBT_LABELS,
  fmtMoney,
  fmtPct,
  type BandInfo,
  type DebtKey,
} from '@/app/lib/dti'

// ─── Input helpers ─────────────────────────────────────────────────────────────
const formatInput = (raw: string): string => {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const [int = '', ...rest] = cleaned.split('.')
  const dec = rest.join('').slice(0, 2)
  const withCommas = int.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return rest.length > 0 ? `${withCommas}.${dec}` : withCommas
}

const toNum = (s: string): number => parseFloat(s.replace(/,/g, '')) || 0

const LABEL = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9ca3af]'
const INPUT =
  'h-10 w-full rounded-lg border border-[#e5e7eb] bg-white pl-6 pr-2.5 text-[13px] text-[#1a1a2e] outline-none focus:border-[#22c55e]'
const CARD = 'rounded-xl border border-[#e5e7eb] bg-white px-[22px] py-5'

function MoneyField(props: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const { id, label, value, onChange, hint } = props
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9ca3af]">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(formatInput(e.target.value))}
          className={INPUT}
        />
      </div>
      {hint ? <p className="mt-1 text-[11px] leading-snug text-[#9ca3af]">{hint}</p> : null}
    </div>
  )
}

// ─── Gauge (SVG, attributes only) ──────────────────────────────────────────────
interface Zone {
  from: number
  to: number
  fill: string
}

function Gauge(props: { ratio: number | null; max: number; zones: Zone[]; marks: number[]; ariaLabel: string }) {
  const { ratio, max, zones, marks, ariaLabel } = props
  const x = (v: number) => (Math.min(Math.max(v, 0), max) / max) * 300
  return (
    <svg viewBox="0 0 300 44" className="h-auto w-full" role="img" aria-label={ariaLabel}>
      {zones.map((z) => (
        <rect key={z.from} x={x(z.from)} y={6} width={x(z.to) - x(z.from)} height={14} fill={z.fill} />
      ))}
      {marks.map((m) => (
        <g key={m}>
          <line x1={x(m)} x2={x(m)} y1={6} y2={24} stroke="#6b7280" strokeWidth={0.75} />
          <text x={x(m)} y={36} textAnchor="middle" fontSize={10} fill="#6b7280">
            {Math.round(m * 100)}%
          </text>
        </g>
      ))}
      {ratio !== null ? (
        <g>
          <rect x={x(ratio) - 1.5} y={2} width={3} height={22} rx={1.5} fill="#1a1a2e" />
        </g>
      ) : null}
    </svg>
  )
}

const BACK_ZONES: Zone[] = [
  { from: 0, to: 0.36, fill: '#bbf7d0' },
  { from: 0.36, to: 0.43, fill: '#fef08a' },
  { from: 0.43, to: 0.5, fill: '#fed7aa' },
  { from: 0.5, to: 0.6, fill: '#fecaca' },
]
const FRONT_ZONES: Zone[] = [
  { from: 0, to: 0.28, fill: '#bbf7d0' },
  { from: 0.28, to: 0.31, fill: '#fef08a' },
  { from: 0.31, to: 0.36, fill: '#fed7aa' },
  { from: 0.36, to: 0.45, fill: '#fecaca' },
]

const BADGE: Record<BandInfo['band'], string> = {
  strong: 'bg-green-100 text-green-800',
  ok: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  veryHigh: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-600',
}

function RatioCard(props: { title: string; subtitle: string; ratio: number | null; band: BandInfo; zones: Zone[]; marks: number[]; max: number }) {
  const { title, subtitle, ratio, band, zones, marks, max } = props
  return (
    <div className={CARD}>
      <p className={LABEL}>{title}</p>
      <p className="mb-3 text-[12px] text-[#6b7280]">{subtitle}</p>
      <p className="mb-2 text-[40px] font-bold leading-none tracking-tight text-[#1a1a2e]">{fmtPct(ratio)}</p>
      <span className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${BADGE[band.band]}`}>{band.label}</span>
      <Gauge ratio={ratio} max={max} zones={zones} marks={marks} ariaLabel={`${title}: ${fmtPct(ratio)}. ${band.label}.`} />
    </div>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function DtiCalculator() {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [inc, setInc] = useState({ main: '6,000', partner: '', other: '' })
  const [itemize, setItemize] = useState(false)
  const [housingTotal, setHousingTotal] = useState('1,500')
  const [h, setH] = useState({ pi: '', tax: '', ins: '', hoa: '' })
  const [debts, setDebts] = useState<Record<DebtKey, string>>({ car: '350', student: '250', cards: '', personal: '', support: '', other: '' })

  // Switching period converts what was typed, so the same income stays the same income.
  const changePeriod = (next: 'monthly' | 'annual') => {
    if (next === period) return
    const factor = next === 'annual' ? 12 : 1 / 12
    const convert = (v: string) => (v.trim() === '' ? '' : Math.round(toNum(v) * factor).toLocaleString('en-US'))
    setInc({ main: convert(inc.main), partner: convert(inc.partner), other: convert(inc.other) })
    setPeriod(next)
  }

  const result = useMemo(() => {
    const div = period === 'annual' ? 12 : 1
    const incomes = [inc.main, inc.partner, inc.other].map((v) => toNum(v) / div)
    const housing = itemize ? toNum(h.pi) + toNum(h.tax) + toNum(h.ins) + toNum(h.hoa) : toNum(housingTotal)
    const debtMap = Object.fromEntries(DEBT_KEYS.map((k) => [k, toNum(debts[k])])) as Record<DebtKey, number>
    const input = { incomes, housing, debts: debtMap }
    return { analysis: analyze(input), what: scenarios(input) }
  }, [period, inc, itemize, housingTotal, h, debts])

  const { analysis: a, what } = result
  const need36 = a.incomeNeeded.find((r) => r.ceiling === 0.36)
  const room36 = a.debtRoom.find((r) => r.ceiling === 0.36)
  const tips: string[] = []
  if (a.backEnd !== null && a.backEnd > 0.36 && room36 && need36) {
    tips.push(
      `To reach 36% on the back-end ratio, total monthly obligations would need to fall by ${fmtMoney(room36.overBy)}, or gross monthly income would need to be about ${fmtMoney(need36.income)}.`,
    )
  }
  if (a.frontEnd !== null && a.frontEnd > 0.28) {
    const over = a.housing - a.maxHousing[0].byFrontEnd
    tips.push(`A housing payment at or below ${fmtMoney(a.maxHousing[0].byFrontEnd)} a month keeps the front-end ratio at 28%. You are ${fmtMoney(over)} above that.`)
  }
  if (a.backEnd !== null && a.backEnd > 0.36) {
    tips.push('Pay down or pay off the debts with the largest monthly payments first. Each dollar of monthly payment you remove improves the ratio directly.')
    tips.push('Avoid opening new credit before you apply: a new car loan or card payment raises the ratio immediately.')
  }
  if (a.backEnd !== null && a.backEnd <= 0.36 && (a.frontEnd === null || a.frontEnd <= 0.28)) {
    tips.push('Both ratios sit inside the most common reference points. Lenders still weigh credit score, savings and the loan type, so use this as one input among several.')
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fb]">
        <section className="mx-auto max-w-[840px] px-6 pb-6">
          <div className="py-5" />
          <h1 className="m-0 mb-2 text-[32px] font-bold leading-[1.15] tracking-[-0.6px] text-[#1a1a2e]">Free Debt-to-Income (DTI) Ratio Calculator</h1>
          <p className="m-0 mb-6 max-w-[560px] text-[15px] leading-relaxed text-[#6b7280]">
            Enter your gross income, housing cost and monthly debt payments to see your front-end and back-end DTI, how much more debt fits under common
            reference points, and what a change in income or debt would do. Free, no signup.
          </p>

          {/* ── Inputs ─────────────────────────────────────────────────── */}
          <div className={CARD}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="m-0 text-[15px] font-bold text-[#1a1a2e]">1. Gross income (before taxes)</h2>
              <div className="flex gap-1" role="group" aria-label="Income period">
                {(['monthly', 'annual'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => changePeriod(p)}
                    aria-pressed={period === p}
                    className={`rounded-full px-3 py-1 text-[12px] font-medium ${period === p ? 'bg-[#1a1a2e] text-white' : 'border border-[#e5e7eb] bg-white text-[#6b7280]'}`}
                  >
                    {p === 'monthly' ? 'Per month' : 'Per year'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <MoneyField id="inc-main" label="Your income" value={inc.main} onChange={(v) => setInc({ ...inc, main: v })} hint="Salary or wages" />
              <MoneyField id="inc-partner" label="Co-borrower income" value={inc.partner} onChange={(v) => setInc({ ...inc, partner: v })} hint="Optional" />
              <MoneyField id="inc-other" label="Other income" value={inc.other} onChange={(v) => setInc({ ...inc, other: v })} hint="Bonus, rental, side work, if stable" />
            </div>

            <div className="my-5 border-t border-[#f3f4f6]" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="m-0 text-[15px] font-bold text-[#1a1a2e]">2. Monthly housing cost</h2>
              <button
                type="button"
                onClick={() => setItemize((v) => !v)}
                aria-pressed={itemize}
                className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-[12px] font-medium text-[#6b7280]"
              >
                {itemize ? 'Use a single amount' : 'Itemize the payment'}
              </button>
            </div>
            {itemize ? (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                <MoneyField id="h-pi" label="Principal and interest" value={h.pi} onChange={(v) => setH({ ...h, pi: v })} />
                <MoneyField id="h-tax" label="Property taxes" value={h.tax} onChange={(v) => setH({ ...h, tax: v })} hint="Monthly amount" />
                <MoneyField id="h-ins" label="Insurance" value={h.ins} onChange={(v) => setH({ ...h, ins: v })} hint="Homeowners and mortgage insurance" />
                <MoneyField id="h-hoa" label="HOA dues" value={h.hoa} onChange={(v) => setH({ ...h, hoa: v })} />
              </div>
            ) : (
              <div className="max-w-xs">
                <MoneyField
                  id="housing"
                  label="Rent or proposed payment"
                  value={housingTotal}
                  onChange={setHousingTotal}
                  hint="For a purchase: principal, interest, taxes, insurance and HOA"
                />
              </div>
            )}

            <div className="my-5 border-t border-[#f3f4f6]" />

            <h2 className="m-0 mb-4 text-[15px] font-bold text-[#1a1a2e]">3. Other monthly debt payments</h2>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {DEBT_KEYS.map((k) => (
                <MoneyField key={k} id={`debt-${k}`} label={DEBT_LABELS[k]} value={debts[k]} onChange={(v) => setDebts({ ...debts, [k]: v })} />
              ))}
            </div>
            <p className="m-0 mt-3 text-[12px] leading-relaxed text-[#9ca3af]">
              Use the required monthly payment, not the balance. Groceries, utilities, insurance premiums and phone bills are not debts and are left out.
            </p>
          </div>

          {/* ── Results ────────────────────────────────────────────────── */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" aria-live="polite">
            <RatioCard
              title="Front-end ratio"
              subtitle="Housing cost divided by gross income"
              ratio={a.frontEnd}
              band={a.frontBand}
              zones={FRONT_ZONES}
              marks={[0.28, 0.31, 0.36]}
              max={0.45}
            />
            <RatioCard
              title="Back-end ratio"
              subtitle="Housing plus all debt payments, divided by gross income"
              ratio={a.backEnd}
              band={a.backBand}
              zones={BACK_ZONES}
              marks={[0.36, 0.43, 0.5]}
              max={0.6}
            />
          </div>

          {a.grossIncome > 0 ? (
            <>
              <div className={`${CARD} mt-4`}>
                <h2 className="m-0 mb-1 text-[15px] font-bold text-[#1a1a2e]">How much more monthly debt fits</h2>
                <p className="m-0 mb-3 text-[12px] text-[#6b7280]">
                  Your obligations today: {fmtMoney(a.totalDebts)} a month on {fmtMoney(a.grossIncome)} of gross income.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-[0.05em] text-[#9ca3af]">
                        <th className="py-1.5 pr-3 font-semibold">Back-end ceiling</th>
                        <th className="py-1.5 pr-3 font-semibold">Room for extra monthly debt</th>
                        <th className="py-1.5 font-semibold">Income needed at today&apos;s debts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.debtRoom.map((r, i) => (
                        <tr key={r.ceiling} className="border-t border-[#f3f4f6]">
                          <td className="py-2 pr-3 font-semibold text-[#1a1a2e]">{Math.round(r.ceiling * 100)}%</td>
                          <td className="py-2 pr-3 text-[#374151]">
                            {r.overBy > 0 ? <span className="text-red-700">Over by {fmtMoney(r.overBy)}</span> : fmtMoney(r.additionalDebt)}
                          </td>
                          <td className="py-2 text-[#374151]">{fmtMoney(a.incomeNeeded[i].income)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={`${CARD} mt-4`}>
                <h2 className="m-0 mb-1 text-[15px] font-bold text-[#1a1a2e]">Largest housing payment at common ratio pairs</h2>
                <p className="m-0 mb-3 text-[12px] text-[#6b7280]">The lower of the front-end limit and the back-end limit after your other debts.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-[0.05em] text-[#9ca3af]">
                        <th className="py-1.5 pr-3 font-semibold">Pair (front / back)</th>
                        <th className="py-1.5 pr-3 font-semibold">Front-end limit alone</th>
                        <th className="py-1.5 pr-3 font-semibold">Largest payment</th>
                        <th className="py-1.5 font-semibold">Set by</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.maxHousingPairs.map((p, i) => (
                        <tr key={p.front} className="border-t border-[#f3f4f6]">
                          <td className="py-2 pr-3 font-semibold text-[#1a1a2e]">
                            {Math.round(p.front * 100)} / {Math.round(p.back * 100)}
                          </td>
                          <td className="py-2 pr-3 text-[#374151]">{fmtMoney(a.maxHousing[i].byFrontEnd)}</td>
                          <td className="py-2 pr-3 font-semibold text-[#1a1a2e]">{fmtMoney(p.maxHousing)}</td>
                          <td className="py-2 text-[#374151]">{p.binding === 'back-end' ? 'Back-end ratio' : 'Front-end ratio'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {what.length > 0 ? (
                <div className={`${CARD} mt-4`}>
                  <h2 className="m-0 mb-3 text-[15px] font-bold text-[#1a1a2e]">What would change your back-end ratio</h2>
                  <ul className="m-0 list-none p-0">
                    {what.map((s) => (
                      <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[#f3f4f6] py-2 text-[13px] first:border-t-0">
                        <span className="text-[#374151]">{s.label}</span>
                        <span className="font-semibold text-[#1a1a2e]">
                          {fmtPct(s.backEnd)}
                          {s.backEndChangePoints !== null ? (
                            <span className="ml-2 text-[12px] font-medium text-[#6b7280]">
                              ({s.backEndChangePoints > 0 ? '+' : ''}
                              {s.backEndChangePoints.toFixed(1)} points)
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          <div className={`${CARD} mt-4`}>
            <h2 className="m-0 mb-3 text-[15px] font-bold text-[#1a1a2e]">What to do next</h2>
            {a.grossIncome <= 0 ? (
              <p className="m-0 text-[14px] text-[#374151]">Enter your gross income above to see your ratios.</p>
            ) : (
              <ul className="m-0 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[#374151]">
                {tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            <p className="m-0 mt-4 text-[12px] leading-relaxed text-[#9ca3af]">
              Educational estimate only. Lenders set their own limits by loan type, credit profile and compensating factors, and this tool does not predict
              approval or give financial advice.
            </p>
          </div>
        </section>

        <div className="embed-hide mx-auto flex max-w-[840px] justify-end px-6 py-1">
          <EmbedButton tool="dti-calculator" title="DTI Calculator" />
        </div>
        <div className="embed-only mx-auto max-w-[840px] items-center justify-center gap-2 border-t border-[#e5e7eb] px-6 py-3 text-[12px] text-[#6b7280]">
          Powered by{' '}
          <a href="https://numrica.com/dti-calculator" target="_blank" rel="noopener" className="font-semibold text-[#22c55e]">
            Numrica
          </a>
        </div>
      </div>
    </>
  )
}
