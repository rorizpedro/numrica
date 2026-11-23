// Debt-to-income (DTI) math. Pure functions, no I/O.
//
// Front-end (housing) ratio = monthly housing cost / gross monthly income
// Back-end (total) ratio    = (housing cost + other monthly debts) / gross monthly income
//
// All ratios are returned as fractions (0.35 = 35%). When gross income is zero or
// negative the ratios are null: never divide by zero.

export const DEBT_KEYS = ['car', 'student', 'cards', 'personal', 'support', 'other'] as const
export type DebtKey = (typeof DEBT_KEYS)[number]

export const DEBT_LABELS: Record<DebtKey, string> = {
  car: 'Car loans or leases',
  student: 'Student loans',
  cards: 'Credit cards (minimum payments)',
  personal: 'Personal loans',
  support: 'Child support or alimony',
  other: 'Other monthly debt payments',
}

export type DebtMap = Partial<Record<DebtKey, number>>

export interface DtiInput {
  /** Gross (pre-tax) monthly income from every source, one entry per source. */
  incomes: number[]
  /** Monthly housing cost: rent, or proposed principal, interest, taxes, insurance and HOA. */
  housing: number
  /** Other recurring monthly debt payments by category. */
  debts: DebtMap
}

/** Reference ceilings used by the calculator. They are reference points, not lender rules. */
export const BACK_END_CEILINGS = [0.36, 0.43, 0.45, 0.5] as const
export const FRONT_END_CEILINGS = [0.28, 0.31] as const
/** Common front-end / back-end pairs: 28/36 and 31/43. */
export const RATIO_PAIRS = [
  { front: 0.28, back: 0.36 },
  { front: 0.31, back: 0.43 },
] as const

const clean = (n: number | undefined): number => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : 0)

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + clean(v), 0)
}

export function sumDebts(debts: DebtMap): number {
  return DEBT_KEYS.reduce((acc, k) => acc + clean(debts[k]), 0)
}

export type Band = 'strong' | 'ok' | 'high' | 'veryHigh' | 'unknown'

export interface BandInfo {
  band: Band
  label: string
}

/** Tolerance so a ratio that is exactly on a ceiling is not pushed over it by floating-point noise. */
const EPS = 1e-9

/** Back-end bands relative to the 36%, 43%, 45% and 50% reference points. */
export function backEndBand(ratio: number | null): BandInfo {
  if (ratio === null) return { band: 'unknown', label: 'Enter income to see your ratio' }
  if (ratio <= 0.36 + EPS) return { band: 'strong', label: 'At or below 36%' }
  if (ratio <= 0.43 + EPS) return { band: 'ok', label: 'Above 36%, at or below 43%' }
  if (ratio <= 0.5 + EPS) return { band: 'high', label: 'Above 43%, at or below 50%' }
  return { band: 'veryHigh', label: 'Above 50%' }
}

/** Front-end bands relative to the 28% and 31% reference points. */
export function frontEndBand(ratio: number | null): BandInfo {
  if (ratio === null) return { band: 'unknown', label: 'Enter income to see your ratio' }
  if (ratio <= 0.28 + EPS) return { band: 'strong', label: 'At or below 28%' }
  if (ratio <= 0.31 + EPS) return { band: 'ok', label: 'Above 28%, at or below 31%' }
  if (ratio <= 0.36 + EPS) return { band: 'high', label: 'Above 31%, at or below 36%' }
  return { band: 'veryHigh', label: 'Above 36%' }
}

/** Round to cents and drop sub-cent noise so 1400.0000000000002 becomes 1400. */
const cents = (n: number): number => Math.round(n * 100) / 100

export interface DebtRoom {
  ceiling: number
  /** Extra monthly debt payment that still fits under the ceiling (0 when already over). */
  additionalDebt: number
  /** Monthly amount by which current obligations exceed the ceiling (0 when under). */
  overBy: number
}

export interface MaxHousing {
  ceiling: number
  /** Largest housing payment that keeps the front-end ratio at this ceiling, ignoring other debts. */
  byFrontEnd: number
}

export interface MaxHousingPair {
  front: number
  back: number
  /** Largest housing payment that satisfies BOTH ceilings given your other debts. */
  maxHousing: number
  /** Which ceiling is the binding one. */
  binding: 'front-end' | 'back-end'
}

export interface IncomeNeeded {
  ceiling: number
  /** Gross monthly income needed so current obligations fit under the ceiling. */
  income: number
}

export interface DtiResult {
  grossIncome: number
  housing: number
  otherDebts: number
  totalDebts: number
  frontEnd: number | null
  backEnd: number | null
  frontBand: BandInfo
  backBand: BandInfo
  debtRoom: DebtRoom[]
  maxHousing: MaxHousing[]
  maxHousingPairs: MaxHousingPair[]
  incomeNeeded: IncomeNeeded[]
}

export function analyze(input: DtiInput): DtiResult {
  const grossIncome = sum(input.incomes)
  const housing = clean(input.housing)
  const otherDebts = sumDebts(input.debts)
  const totalDebts = housing + otherDebts
  const hasIncome = grossIncome > 0

  const frontEnd = hasIncome ? housing / grossIncome : null
  const backEnd = hasIncome ? totalDebts / grossIncome : null

  const debtRoom: DebtRoom[] = BACK_END_CEILINGS.map((ceiling) => {
    const room = cents(ceiling * grossIncome - totalDebts)
    return { ceiling, additionalDebt: Math.max(0, room), overBy: Math.max(0, -room) }
  })

  const maxHousing: MaxHousing[] = FRONT_END_CEILINGS.map((ceiling) => ({
    ceiling,
    byFrontEnd: cents(ceiling * grossIncome),
  }))

  const maxHousingPairs: MaxHousingPair[] = RATIO_PAIRS.map(({ front, back }) => {
    const byFront = cents(front * grossIncome)
    const byBack = cents(back * grossIncome - otherDebts)
    const binding = byBack < byFront ? 'back-end' : 'front-end'
    return { front, back, maxHousing: Math.max(0, Math.min(byFront, byBack)), binding }
  })

  const incomeNeeded: IncomeNeeded[] = BACK_END_CEILINGS.map((ceiling) => ({
    ceiling,
    income: cents(totalDebts / ceiling),
  }))

  return {
    grossIncome,
    housing,
    otherDebts,
    totalDebts,
    frontEnd,
    backEnd,
    frontBand: frontEndBand(frontEnd),
    backBand: backEndBand(backEnd),
    debtRoom,
    maxHousing,
    maxHousingPairs,
    incomeNeeded,
  }
}

export interface Scenario {
  id: string
  label: string
  frontEnd: number | null
  backEnd: number | null
  /** Change in the back-end ratio, in percentage points (negative = improvement). */
  backEndChangePoints: number | null
}

/**
 * "What would change" scenarios: more income, or fewer debts.
 * Only scenarios that change something are returned.
 */
export function scenarios(input: DtiInput): Scenario[] {
  const base = analyze(input)
  const out: Scenario[] = []

  const push = (id: string, label: string, next: DtiInput) => {
    const r = analyze(next)
    out.push({
      id,
      label,
      frontEnd: r.frontEnd,
      backEnd: r.backEnd,
      backEndChangePoints: r.backEnd !== null && base.backEnd !== null ? (r.backEnd - base.backEnd) * 100 : null,
    })
  }

  if (base.grossIncome > 0) {
    push('income-500', 'Income rises by $500 a month', { ...input, incomes: [...input.incomes, 500] })
    push('income-10', 'Income rises by 10%', { ...input, incomes: [...input.incomes, base.grossIncome * 0.1] })
  }

  const paid = DEBT_KEYS.filter((k) => clean(input.debts[k]) > 0).sort((a, b) => clean(input.debts[b]) - clean(input.debts[a]))
  if (paid.length > 0) {
    const biggest = paid[0]
    push(`payoff-${biggest}`, `Pay off ${DEBT_LABELS[biggest].toLowerCase()}`, { ...input, debts: { ...input.debts, [biggest]: 0 } })
  }
  if (otherDebtsTotal(input) >= 100) {
    push('debts-100', 'Other monthly debt payments fall by $100', scaleDown(input, 100))
  }
  if (clean(input.housing) >= 100) {
    push('housing-100', 'Housing cost falls by $100 a month', { ...input, housing: clean(input.housing) - 100 })
  }
  return out
}

function otherDebtsTotal(input: DtiInput): number {
  return sumDebts(input.debts)
}

/** Remove `amount` of monthly debt payments, starting with the largest category. */
function scaleDown(input: DtiInput, amount: number): DtiInput {
  const debts: DebtMap = { ...input.debts }
  let left = amount
  const order = DEBT_KEYS.filter((k) => clean(debts[k]) > 0).sort((a, b) => clean(debts[b]) - clean(debts[a]))
  for (const k of order) {
    if (left <= 0) break
    const take = Math.min(clean(debts[k]), left)
    debts[k] = clean(debts[k]) - take
    left -= take
  }
  return { ...input, debts }
}

export const fmtMoney = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  )

export const fmtPct = (r: number | null): string => (r === null ? '--' : `${(r * 100).toFixed(1)}%`)
