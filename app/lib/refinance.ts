// Refinance break-even math. Pure functions, no I/O.
// Assumptions: fixed-rate, fully amortizing loans; principal and interest only
// (taxes, insurance and PMI are excluded because they do not change with a rate-and-term refinance).

export interface RefinanceInputs {
  /** Principal still owed on the current loan, in dollars. */
  currentBalance: number
  /** Current annual interest rate, in percent (6.5 means 6.5%). */
  currentRate: number
  /** Months left on the current loan. */
  remainingMonths: number
  /** New annual interest rate, in percent. */
  newRate: number
  /** Term of the new loan, in months. */
  newTermMonths: number
  /** Total closing costs of the refinance, in dollars. */
  closingCosts: number
  /** If true, closing costs are added to the new loan instead of paid in cash. */
  financeClosingCosts: boolean
  /** How many months the owner expects to keep the loan (or the home). */
  horizonMonths: number
}

export type AlertKind =
  | 'payment-increase'
  | 'rate-not-lower'
  | 'term-reset'
  | 'never-breaks-even'
  | 'horizon-too-short'

export interface RefinanceAlert {
  kind: AlertKind
  message: string
}

export interface CostPoint {
  month: number
  /** Cumulative cash paid if you keep the current loan. */
  keep: number
  /** Cumulative cash paid if you refinance (includes closing costs paid in cash). */
  refinance: number
}

export interface RefinanceResult {
  currentPayment: number
  newPayment: number
  /** Positive when the new payment is lower. */
  monthlySavings: number
  newPrincipal: number
  /** Closing costs paid out of pocket on day one (0 when financed). */
  cashAtClosing: number
  /** Closing costs added to the new loan balance (0 when paid in cash). */
  financedCosts: number
  /** Interest still to be paid on the current loan. */
  interestKeep: number
  /** Interest to be paid over the new loan. */
  interestRefinance: number
  /** Total cash out for the rest of the current loan (payments only). */
  totalPaidKeep: number
  /** Total cash out for the new loan (payments plus closing costs paid in cash). */
  totalPaidRefinance: number
  /** totalPaidKeep minus totalPaidRefinance: positive means refinancing is cheaper over the full life of both loans. */
  lifetimeSavings: number
  /** Closing costs divided by monthly savings; null when there are no monthly savings. */
  simpleBreakEvenMonths: number | null
  /**
   * First month in which refinancing leaves you better off once the balance you
   * still owe is counted (payments + closing costs + remaining balance).
   * null when that never happens.
   */
  trueBreakEvenMonths: number | null
  horizonMonths: number
  /** Total cost at the horizon if you keep the current loan: payments made + balance still owed. */
  costAtHorizonKeep: number
  /** Total cost at the horizon if you refinance: cash closing costs + payments made + balance still owed. */
  costAtHorizonRefinance: number
  /** costAtHorizonKeep minus costAtHorizonRefinance: positive means refinancing wins at the horizon. */
  netAtHorizon: number
  series: CostPoint[]
  alerts: RefinanceAlert[]
}

const MAX_MONTHS = 600

export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

/** Balance left after `k` payments of `payment` on a loan of `principal`. Never below zero. */
export function balanceAfter(principal: number, annualRatePct: number, payment: number, k: number): number {
  if (k <= 0) return principal
  const r = annualRatePct / 100 / 12
  const bal = r === 0
    ? principal - payment * k
    : principal * Math.pow(1 + r, k) - (payment * (Math.pow(1 + r, k) - 1)) / r
  return Math.max(0, bal)
}

export function closingCostsFromPercent(balance: number, percent: number): number {
  return Math.max(0, balance) * Math.max(0, percent) / 100
}

export function calculateRefinance(input: RefinanceInputs): RefinanceResult | null {
  const {
    currentBalance, currentRate, remainingMonths, newRate, newTermMonths,
    closingCosts, financeClosingCosts, horizonMonths,
  } = input

  if (
    !(currentBalance > 0) || !(remainingMonths >= 1) || !(newTermMonths >= 1) ||
    currentRate < 0 || newRate < 0 || closingCosts < 0 || horizonMonths < 0
  ) return null

  const currentPayment = monthlyPayment(currentBalance, currentRate, remainingMonths)
  const financedCosts = financeClosingCosts ? closingCosts : 0
  const cashAtClosing = financeClosingCosts ? 0 : closingCosts
  const newPrincipal = currentBalance + financedCosts
  const newPayment = monthlyPayment(newPrincipal, newRate, newTermMonths)
  const monthlySavings = currentPayment - newPayment

  const totalPaidKeep = currentPayment * remainingMonths
  const totalPaidNew = newPayment * newTermMonths
  const totalPaidRefinance = totalPaidNew + cashAtClosing
  const interestKeep = totalPaidKeep - currentBalance
  const interestRefinance = totalPaidNew - newPrincipal

  // Cost at month k = cash paid so far + balance still owed (what it costs to walk away at k).
  const costKeep = (k: number) =>
    currentPayment * Math.min(k, remainingMonths) +
    balanceAfter(currentBalance, currentRate, currentPayment, Math.min(k, remainingMonths))
  const costRefi = (k: number) =>
    cashAtClosing +
    newPayment * Math.min(k, newTermMonths) +
    balanceAfter(newPrincipal, newRate, newPayment, Math.min(k, newTermMonths))

  const lastMonth = Math.min(MAX_MONTHS, Math.max(remainingMonths, newTermMonths))
  let trueBreakEvenMonths: number | null = null
  if (cashAtClosing + financedCosts > 0 || monthlySavings > 0) {
    for (let k = 1; k <= lastMonth; k++) {
      if (costKeep(k) - costRefi(k) > 0) { trueBreakEvenMonths = k; break }
    }
  } else if (costKeep(1) - costRefi(1) > 0) {
    trueBreakEvenMonths = 1
  }

  const simpleBreakEvenMonths =
    monthlySavings > 0.005 ? closingCosts / monthlySavings : null

  const h = Math.round(horizonMonths)
  const costAtHorizonKeep = costKeep(h)
  const costAtHorizonRefinance = costRefi(h)
  const netAtHorizon = costAtHorizonKeep - costAtHorizonRefinance

  // Cash-basis series for the chart.
  const chartEnd = Math.min(
    MAX_MONTHS,
    Math.max(60, h, simpleBreakEvenMonths ? Math.ceil(simpleBreakEvenMonths * 1.5) : 0),
    Math.max(remainingMonths, newTermMonths),
  )
  const step = chartEnd > 240 ? 6 : chartEnd > 96 ? 3 : 1
  const series: CostPoint[] = []
  for (let k = 0; k <= chartEnd; k += step) {
    series.push({
      month: k,
      keep: currentPayment * Math.min(k, remainingMonths),
      refinance: cashAtClosing + newPayment * Math.min(k, newTermMonths),
    })
  }

  const alerts: RefinanceAlert[] = []
  if (newPayment > currentPayment + 0.005) {
    alerts.push({
      kind: 'payment-increase',
      message: 'Your new monthly payment is higher than your current one. A refinance can still make sense if you are shortening the term, but it will not save you money month to month.',
    })
  }
  if (newRate >= currentRate) {
    alerts.push({
      kind: 'rate-not-lower',
      message: 'The new rate is not lower than your current rate. Without a lower rate, any savings come only from a longer term, which usually means paying more interest overall.',
    })
  }
  if (newTermMonths > remainingMonths && interestRefinance > interestKeep) {
    alerts.push({
      kind: 'term-reset',
      message: 'The new loan runs longer than what you have left, and it adds more total interest than you would pay by keeping your current loan. The lower payment is partly just a longer repayment.',
    })
  }
  if (monthlySavings > 0.005 && trueBreakEvenMonths === null) {
    alerts.push({
      kind: 'never-breaks-even',
      message: 'With these inputs the refinance never comes out ahead once the balance you still owe is counted.',
    })
  }
  const hz = trueBreakEvenMonths ?? simpleBreakEvenMonths
  if (hz !== null && h > 0 && h < hz) {
    alerts.push({
      kind: 'horizon-too-short',
      message: 'You plan to keep this loan for less time than the break-even point, so you would likely not earn back your closing costs.',
    })
  }

  return {
    currentPayment, newPayment, monthlySavings, newPrincipal, cashAtClosing, financedCosts,
    interestKeep, interestRefinance, totalPaidKeep, totalPaidRefinance,
    lifetimeSavings: totalPaidKeep - totalPaidRefinance,
    simpleBreakEvenMonths, trueBreakEvenMonths,
    horizonMonths: h, costAtHorizonKeep, costAtHorizonRefinance, netAtHorizon,
    series, alerts,
  }
}
