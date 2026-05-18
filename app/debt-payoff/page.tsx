import { Metadata } from 'next'
import DebtPayoffCalculator from './DebtPayoffCalculator'

export const metadata: Metadata = {
  title: 'Free Debt Payoff Calculator — Avalanche vs Snowball | Numrica',
  description:
    'Compare the debt avalanche and snowball methods side by side. Enter your debts, add an extra monthly payment, and find the fastest, cheapest path to debt-free.',
  keywords: [
    'debt payoff calculator',
    'avalanche vs snowball',
    'debt avalanche calculator',
    'debt snowball calculator',
    'credit card payoff calculator',
    'debt free calculator',
    'debt payoff planner',
    'fastest way to pay off debt',
  ],
  openGraph: {
    title: 'Free Debt Payoff Calculator — Avalanche vs. Snowball',
    description:
      'Compare avalanche and snowball debt payoff methods. See total interest, payoff date, and month-by-month breakdown for all your debts.',
    url: 'https://numrica.com/debt-payoff',
    siteName: 'Numrica',
    type: 'website',
  },
  alternates: {
    canonical: 'https://numrica.com/debt-payoff',
  },
}

export default function DebtPayoffPage() {
  return (
    <main>
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        Free Debt Payoff Calculator — Avalanche vs Snowball Method
      </h1>
      <DebtPayoffCalculator />
    </main>
  )
}
