export type AmortizationType = 'SAC' | 'PRICE' | 'GRADIENTE' | 'AMERICANO'
export type GraceType = 'partial' | 'total'

export interface LoanParams {
  principal: number
  rateMonthly: number   // decimal, e.g. 0.02 = 2% per month
  periods: number       // total amortization periods (excluding grace)
  gracePeriods: number  // grace period in months
  graceType: GraceType  // partial = pay interest; total = capitalize interest
  type: AmortizationType
  gradientRate: number  // monthly geometric gradient rate (decimal)
  startDate: string     // ISO date string YYYY-MM-DD
}

export interface PeriodRow {
  period: number
  date: string
  openingBalance: number
  amortization: number
  interest: number
  installment: number
  closingBalance: number
  isGrace: boolean
}

export interface LoanSchedule {
  rows: PeriodRow[]
  totalInterest: number
  totalAmortization: number
  totalPaid: number
  firstInstallment: number
  lastInstallment: number
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split('T')[0]
}

function pricePayment(pv: number, rate: number, n: number): number {
  if (rate === 0) return pv / n
  return (pv * rate) / (1 - Math.pow(1 + rate, -n))
}

function gradientFirstPayment(pv: number, rate: number, n: number, g: number): number {
  // Geometric gradient: PMT_k = PMT_1 * (1+g)^(k-1)
  // PV = PMT_1 * sum_{k=1}^{n} (1+g)^(k-1) / (1+rate)^k
  if (Math.abs(rate - g) < 1e-10) {
    // Special case: rate == g
    return (pv * rate) / n
  }
  const factor = (1 - Math.pow((1 + g) / (1 + rate), n)) / (rate - g)
  return pv / factor
}

export function calculate(params: LoanParams): LoanSchedule {
  const { principal, rateMonthly: i, periods, gracePeriods, graceType, type, gradientRate: g, startDate } = params
  const rows: PeriodRow[] = []

  let balance = principal

  // Handle grace period - total (capitalize interest, no payments)
  if (graceType === 'total') {
    for (let k = 1; k <= gracePeriods; k++) {
      const date = addMonths(startDate, k)
      const interest = balance * i
      const newBalance = balance + interest
      rows.push({
        period: k,
        date,
        openingBalance: balance,
        amortization: 0,
        interest: 0,
        installment: 0,
        closingBalance: newBalance,
        isGrace: true,
      })
      balance = newBalance
    }
  } else {
    // Partial grace: pay interest only
    for (let k = 1; k <= gracePeriods; k++) {
      const date = addMonths(startDate, k)
      const interest = balance * i
      rows.push({
        period: k,
        date,
        openingBalance: balance,
        amortization: 0,
        interest,
        installment: interest,
        closingBalance: balance,
        isGrace: true,
      })
    }
  }

  // Calculate pre-payment for fixed-payment types
  let pmt = 0
  let pmt1 = 0  // for gradient
  if (type === 'PRICE') {
    pmt = pricePayment(balance, i, periods)
  } else if (type === 'GRADIENTE') {
    pmt1 = gradientFirstPayment(balance, i, periods, g)
  }

  // Main amortization periods
  for (let k = 1; k <= periods; k++) {
    const periodNumber = gracePeriods + k
    const date = addMonths(startDate, periodNumber)
    const openingBalance = balance
    const interest = openingBalance * i
    let amortization = 0
    let installment = 0

    if (type === 'SAC') {
      // partial grace: balance unchanged → amortize original principal over periods
      // total grace: balance grew → amortize current balance over remaining periods
      amortization = (graceType === 'total' && gracePeriods > 0)
        ? openingBalance / (periods - k + 1)
        : principal / periods
      installment = amortization + interest
    } else if (type === 'PRICE') {
      installment = pmt
      amortization = installment - interest
    } else if (type === 'GRADIENTE') {
      installment = pmt1 * Math.pow(1 + g, k - 1)
      amortization = installment - interest
    } else if (type === 'AMERICANO') {
      if (k < periods) {
        amortization = 0
        installment = interest
      } else {
        amortization = openingBalance
        installment = amortization + interest
      }
    }

    const closingBalance = Math.max(0, openingBalance - amortization)

    rows.push({
      period: periodNumber,
      date,
      openingBalance,
      amortization,
      interest,
      installment,
      closingBalance,
      isGrace: false,
    })

    balance = closingBalance
  }

  const amortRows = rows.filter(r => !r.isGrace)
  const graceRows = rows.filter(r => r.isGrace && graceType === 'partial')
  const totalInterest = rows.reduce((s, r) => s + r.interest, 0)
  const totalAmortization = rows.reduce((s, r) => s + r.amortization, 0)
  const totalPaid = rows.reduce((s, r) => s + r.installment, 0)

  const payingRows = rows.filter(r => r.installment > 0)
  const firstInstallment = payingRows[0]?.installment ?? 0
  const lastInstallment = payingRows[payingRows.length - 1]?.installment ?? 0

  return { rows, totalInterest, totalAmortization, totalPaid, firstInstallment, lastInstallment }
}

export function annualToMonthly(annual: number): number {
  return Math.pow(1 + annual, 1 / 12) - 1
}

export function monthlyToAnnual(monthly: number): number {
  return Math.pow(1 + monthly, 12) - 1
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(isoDate: string): string {
  const [year, month] = isoDate.split('-')
  return `${month}/${year}`
}
