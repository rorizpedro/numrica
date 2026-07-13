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

const textStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }
const sectionStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }

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
      <div style={sectionStyle}>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Debt avalanche vs debt snowball: what the math says</h2>
          <p style={textStyle}>
            The <strong>debt avalanche</strong> targets your highest interest rate first while paying minimums on everything else.
            When the highest-rate debt is eliminated, its freed payment is redirected to the next highest rate. This is mathematically
            optimal — it minimizes the total interest paid across all debts. The <strong>debt snowball</strong> targets the smallest
            balance first, regardless of rate. It costs more in total interest but produces earlier wins that some people find
            motivating enough to stay committed over a multi-year payoff plan.
          </p>
          <p style={textStyle}>
            On $18,000 across three debts (credit card at 24.99%, personal loan at 18.5%, auto loan at 8.9%) with $400 extra per
            month, the avalanche method pays approximately $1,100 less in total interest than the snowball and finishes about five
            months sooner. The difference compounds in favor of avalanche whenever high-rate debts carry large balances.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>The cascade: why concentrated payments win</h2>
          <p style={textStyle}>
            The most important principle in debt repayment is concentration. Splitting extra payments across multiple accounts
            slows the payoff for all of them — no debt reaches zero faster, so no minimum payment is freed up to redirect to the
            next target. The cascade mechanism — where each cleared debt&#39;s minimum payment transfers to the next target —
            only activates through sequential payoffs, not simultaneous reductions.
          </p>
          <p style={textStyle}>
            Once the cascade is running, the final debt receives the combined force of every freed minimum plus the original extra
            payment. A problem that appeared to require seven years of payments often resolves in two or three once the full
            cascade is in motion. The debt payoff planner shows exactly when each account clears and the total interest saved
            compared to minimum-only payments.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>The minimum payment trap</h2>
          <p style={textStyle}>
            Credit card minimum payments are typically set at 1–2% of the balance plus the current month&#39;s interest — which
            means that in the early months, the minimum barely covers the interest charge. A $5,000 balance at 24.99% APR on
            minimum payments only takes over 17 years to pay off and costs more than $4,300 in interest — nearly as much as
            the original balance borrowed. The minimum payment is not a repayment plan. It is a floor designed to keep you
            current while maximizing the lender&#39;s interest income.
          </p>
        </section>
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }}>Related reading</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 10 }}><a href="/blog/debt-avalanche-vs-snowball" style={{ color: '#22c55e', fontSize: 15, textDecoration: 'underline' }}>Debt Avalanche vs Snowball: Which Saves More?</a></li>
            <li style={{ marginBottom: 10 }}><a href="/blog/how-to-get-out-of-credit-card-debt" style={{ color: '#22c55e', fontSize: 15, textDecoration: 'underline' }}>How to Get Out of Credit Card Debt</a></li>
            <li style={{ marginBottom: 10 }}><a href="/blog/paying-off-50000-in-debt" style={{ color: '#22c55e', fontSize: 15, textDecoration: 'underline' }}>Paying Off $50,000 in Debt: A Realistic Plan</a></li>
            <li style={{ marginBottom: 10 }}><a href="/blog/minimum-payment-five-credit-cards" style={{ color: '#22c55e', fontSize: 15, textDecoration: 'underline' }}>What Happens With Minimum Payments on Five Cards</a></li>
          </ul>
        </section>
      </div>
    </>
  )
}
