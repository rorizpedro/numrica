import type { Metadata } from 'next'
import DebtPayoffCalculator from './DebtPayoffCalculator'

export const metadata: Metadata = {
  title: 'Free Debt Payoff Calculator — Avalanche vs Snowball | Numrica',
  description: 'Compare the debt avalanche and snowball methods side by side. Enter your debts, add an extra monthly payment, and find the fastest, cheapest path to debt-free.',
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
  alternates: { canonical: 'https://numrica.com/debt-payoff' },
  openGraph: {
    title: 'Free Debt Payoff Calculator — Avalanche vs. Snowball — Numrica',
    description: 'Compare avalanche and snowball debt payoff methods. See total interest, payoff date, and month-by-month breakdown for all your debts.',
    url: 'https://numrica.com/debt-payoff',
    siteName: 'Numrica',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Debt Payoff Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Debt Payoff Calculator — Avalanche vs Snowball — Numrica',
    description: 'Compare avalanche and snowball methods. See which saves more, your payoff date, and month-by-month breakdown. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free Debt Payoff Calculator',
      url: 'https://numrica.com/debt-payoff',
      description: 'Compare debt avalanche vs snowball payoff strategies side by side. Enter multiple debts, set extra monthly payments, and find the fastest and cheapest path to debt-free.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'Avalanche vs Snowball comparison, Multiple debts up to 8, Extra monthly payment, Payoff date, Total interest comparison, Month-by-month breakdown table, URL sharing',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is the debt avalanche method?', acceptedAnswer: { '@type': 'Answer', text: 'The debt avalanche targets the highest interest rate first while making minimum payments on all others. Once the top debt is paid off, its payment cascades to the next highest-rate debt. This is mathematically optimal — it minimizes the total interest you pay.' } },
        { '@type': 'Question', name: 'What is the debt snowball method?', acceptedAnswer: { '@type': 'Answer', text: 'The debt snowball focuses on the smallest balance first, regardless of interest rate. The psychological wins of eliminating debts quickly help people stay motivated. Total interest paid is usually higher than with the avalanche.' } },
        { '@type': 'Question', name: 'Which method saves more money: avalanche or snowball?', acceptedAnswer: { '@type': 'Answer', text: 'Avalanche almost always saves more in total interest because you eliminate high-rate balances faster. On $20,000 across three debts with rates of 25%, 15%, and 8%, the avalanche can save $400-$1,000 vs. the snowball.' } },
        { '@type': 'Question', name: 'How much does extra monthly payment help?', acceptedAnswer: { '@type': 'Answer', text: 'On $10,000 in credit card debt at 20% APR with a $250 minimum, paying $100 extra per month reduces payoff from 67 months to 42 — 25 months faster — and saves over $2,100 in interest.' } },
        { '@type': 'Question', name: 'Should I pay off debt or invest?', acceptedAnswer: { '@type': 'Answer', text: 'General rule: debt above 6-7% interest beats uncertain market returns — pay it off first. High-interest debt (credit cards at 18-25%) should almost always be paid before investing. Always contribute to a 401(k) up to any employer match first.' } },
        { '@type': 'Question', name: 'What is a minimum payment trap?', acceptedAnswer: { '@type': 'Answer', text: 'Paying only the required minimum keeps your balance high and maximizes interest charges. On $5,000 at 24% APR with a $125 minimum, minimum-only payments take 7+ years and result in over $4,000 in interest.' } },
        { '@type': 'Question', name: 'What order should I pay off my debts?', acceptedAnswer: { '@type': 'Answer', text: 'For minimum cost: highest interest rate first (avalanche). For motivation: smallest balance first (snowball). Always continue minimums on all other debts. Use any 0% APR promotional window aggressively before the rate resets.' } },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Use the Debt Payoff Calculator',
      description: 'Compare debt avalanche and snowball methods to find the fastest path to debt-free.',
      step: [
        { '@type': 'HowToStep', name: 'Enter your debts', text: 'Add each debt with its name, current balance, annual interest rate (APR), and minimum monthly payment.' },
        { '@type': 'HowToStep', name: 'Set extra monthly payment', text: 'Enter any additional amount above minimums you can pay each month.' },
        { '@type': 'HowToStep', name: 'Choose your strategy', text: 'Select Avalanche (highest rate first) or Snowball (smallest balance first) to see results.' },
        { '@type': 'HowToStep', name: 'Review the comparison', text: 'See total interest paid, debt-free date, and savings for each method side by side.' },
      ],
    },
  ],
}

export default function DebtPayoffPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <main>
        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
          Free Debt Payoff Calculator — Avalanche vs Snowball Method
        </h1>
        <DebtPayoffCalculator />
      </main>
    </>
  )
}
