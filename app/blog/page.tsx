import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog — Numrica',
  description:
    'Financial education articles from Pedro Roriz — debt payoff strategies, mortgage mechanics, compound interest, and personal finance for Tier 1 audiences.',
  alternates: { canonical: 'https://numrica.com/blog' },
}

const allPosts = [
  {
    slug: 'real-cost-minimum-payments',
    title: "The real cost of minimum payments: what your monthly statement doesn't show you",
    excerpt:
      "A $5,400 credit card balance at 24.99% APR, paid on minimums only, costs you $4,300 in interest before it's gone. Here is the number that actually matters.",
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'custo-real-pagamento-minimo',
    title: 'O custo real dos pagamentos mínimos: o que o seu extrato não mostra',
    excerpt:
      'Um saldo de R$5.000 no rotativo a 10% ao mês, pago apenas no mínimo, pode custar R$10.000 em juros antes de ser quitado. Aqui está a matemática — e o que R$200 a mais por mês realmente fazem.',
    displayDate: '21 de maio de 2026',
    publishDate: '2026-05-21',
    readTime: '6 min de leitura',
    lang: 'PT-BR',
  },
  {
    slug: 'debt-avalanche-vs-snowball',
    title: 'Debt avalanche vs debt snowball: which method saves more money?',
    excerpt:
      'Most people with three debts do not know which to pay first. That indecision has a measurable cost — between 20% and over 100% of the original debt balance in extra interest.',
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'avalanche-vs-bola-de-neve',
    title: 'Avalanche vs bola de neve: qual método paga menos juros?',
    excerpt:
      'A maioria das pessoas com três dívidas simultâneas não sabe qual pagar primeiro. Essa indecisão tem um custo que pode representar entre 20% e mais de 100% do valor original das dívidas.',
    displayDate: '21 de maio de 2026',
    publishDate: '2026-05-21',
    readTime: '7 min de leitura',
    lang: 'PT-BR',
  },
  {
    slug: 'variable-rate-vs-fixed-rate-mortgage',
    title: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows',
    excerpt:
      'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision. Three scenarios, one simulation.',
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'euribor-variavel-vs-taxa-fixa',
    title: 'Euribor variável vs taxa fixa: simulação real de 20 anos',
    excerpt:
      'A maioria das pessoas escolhe o regime de taxa do crédito habitação com base na prestação inicial. Essa é a decisão errada.',
    displayDate: '21 de maio de 2026',
    publishDate: '2026-05-21',
    readTime: '7 min de leitura',
    lang: 'PT-PT',
  },
  // --- 30 new posts, 1 per day Jun 24 → Jul 23 ---
  {
    slug: 'how-to-get-out-of-credit-card-debt',
    title: 'How to Get Out of Credit Card Debt: A Step-by-Step Plan',
    excerpt: 'The average American with credit card debt carries $6,000 across multiple cards at 22% APR. A structured plan to eliminate it — with the exact order, amounts, and math.',
    displayDate: 'June 24, 2026',
    publishDate: '2026-06-24',
    readTime: '8 min read',
    lang: 'EN',
  },
  {
    slug: 'what-is-a-good-credit-score',
    title: 'What Is a Good Credit Score — and How to Improve Yours in 6 Months',
    excerpt: 'A 760 vs 680 score on a $400,000 mortgage costs $80,000 more in interest over 30 years. Here is exactly what moves the needle — and how fast.',
    displayDate: 'June 25, 2026',
    publishDate: '2026-06-25',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'balance-transfer-cards-explained',
    title: 'Balance Transfer Cards Explained: When a 0% APR Offer Actually Saves You Money',
    excerpt: 'A 0% APR balance transfer can save $1,200 in interest — or cost $300 in transfer fees. How to calculate whether the offer makes sense before you apply.',
    displayDate: 'June 26, 2026',
    publishDate: '2026-06-26',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'debt-to-income-ratio-explained',
    title: 'Debt-to-Income Ratio Explained: What Lenders See Before You Get Approved',
    excerpt: 'Most lenders reject borrowers with a DTI above 43%. Here is how to calculate yours, what each range means, and the fastest ways to bring it down.',
    displayDate: 'June 27, 2026',
    publishDate: '2026-06-27',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'paying-off-50000-in-debt',
    title: 'Paying Off $50,000 in Debt: A Realistic Month-by-Month Plan',
    excerpt: '$50,000 in mixed debt — student loans, car loan, credit cards — feels impossible. Here is how to structure payments so the last dollar is gone in under 4 years.',
    displayDate: 'June 28, 2026',
    publishDate: '2026-06-28',
    readTime: '9 min read',
    lang: 'EN',
  },
  {
    slug: 'how-much-house-can-you-afford',
    title: 'How Much House Can You Afford? The Numbers Lenders Use vs What Is Actually Safe',
    excerpt: 'Lenders approve mortgages up to 43% DTI. Financial planners recommend 28%. The gap between those two numbers is your financial cushion — or lack of it.',
    displayDate: 'June 29, 2026',
    publishDate: '2026-06-29',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'pay-down-mortgage-or-invest',
    title: 'Pay Down Your Mortgage or Invest the Extra Cash? The Math Is Not What You Think',
    excerpt: 'At 3% mortgage rate, investing wins by a wide margin. At 7%, the answer is far less obvious. How to run the actual numbers for your situation.',
    displayDate: 'June 30, 2026',
    publishDate: '2026-06-30',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'mortgage-refinancing-explained',
    title: 'Mortgage Refinancing Explained: When It Saves Money and When It Does Not',
    excerpt: 'The break-even rule: if closing costs are $4,000 and you save $200/month, you break even in 20 months. But that calculation misses three critical variables.',
    displayDate: 'July 1, 2026',
    publishDate: '2026-07-01',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: '15-vs-30-year-mortgage',
    title: '15-Year vs 30-Year Mortgage: Total Cost Comparison With Real Numbers',
    excerpt: 'On a $350,000 loan, the 30-year costs $232,000 more in interest than the 15-year. But the monthly payment difference is $600. Here is the real tradeoff.',
    displayDate: 'July 2, 2026',
    publishDate: '2026-07-02',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'mortgage-points-explained',
    title: 'Mortgage Points Explained: Should You Pay to Lower Your Rate?',
    excerpt: 'One mortgage point costs 1% of the loan and buys roughly 0.25% off your rate. Whether that is worth it depends on one number: how long you plan to stay.',
    displayDate: 'July 3, 2026',
    publishDate: '2026-07-03',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'dollar-cost-averaging-vs-lump-sum',
    title: 'Dollar-Cost Averaging vs Lump Sum: What 50 Years of Market Data Shows',
    excerpt: 'Studies show lump sum investing beats DCA about two-thirds of the time. But the psychological risk of investing everything the day before a crash is real. The honest tradeoff.',
    displayDate: 'July 4, 2026',
    publishDate: '2026-07-04',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'cost-of-waiting-to-invest',
    title: 'The Cost of Waiting to Invest: What Every Year of Delay Actually Costs You',
    excerpt: 'Starting at 25 vs 35 with the same contributions produces a $340,000 difference by retirement. That is not a rule of thumb — it is compound interest doing its work.',
    displayDate: 'July 5, 2026',
    publishDate: '2026-07-05',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'index-funds-vs-active-funds',
    title: 'Index Funds vs Active Funds: The Fee Math That Determines the Winner',
    excerpt: 'Over 20 years, a 1% fee difference reduces your terminal wealth by 18%. That is why 85% of active funds underperform their index benchmark after fees.',
    displayDate: 'July 6, 2026',
    publishDate: '2026-07-06',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'roth-ira-vs-traditional-ira',
    title: 'Roth IRA vs Traditional IRA: Which One Wins Depends on This One Variable',
    excerpt: 'If your tax rate is higher now than in retirement, Traditional wins. If lower now, Roth wins. Here is how to estimate which camp you are in — with actual scenarios.',
    displayDate: 'July 7, 2026',
    publishDate: '2026-07-07',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'emergency-fund-how-much',
    title: 'How Much Should Your Emergency Fund Be? The Answer Depends on Your Job',
    excerpt: 'The 3-6 month rule is a starting point. A freelancer with variable income needs 9 months. A dual-income household with stable jobs might need only 2. The right number for your situation.',
    displayDate: 'July 8, 2026',
    publishDate: '2026-07-08',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'rule-of-72-explained',
    title: 'The Rule of 72 Explained: The Fastest Way to Estimate Investment Growth',
    excerpt: 'Divide 72 by your return rate to find how many years to double your money. At 8%, that is 9 years. At 12%, just 6. A simple mental model that reveals compounding in one step.',
    displayDate: 'July 9, 2026',
    publishDate: '2026-07-09',
    readTime: '5 min read',
    lang: 'EN',
  },
  {
    slug: 'how-much-to-save-at-each-age',
    title: 'How Much Should You Have Saved at Every Age? Benchmarks That Actually Hold Up',
    excerpt: 'At 30: 1x salary. At 40: 3x. At 50: 6x. At 60: 8x. These Fidelity benchmarks assume a specific savings rate and return. Here is what the math looks like behind each target.',
    displayDate: 'July 10, 2026',
    publishDate: '2026-07-10',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'inflation-effect-on-savings',
    title: 'How Inflation Destroys the Value of Cash Savings (And What to Do About It)',
    excerpt: 'At 3% inflation, $10,000 in a 0.5% savings account loses $250 in real purchasing power every year. After 10 years you have $10,500 nominal but $7,700 in real value.',
    displayDate: 'July 11, 2026',
    publishDate: '2026-07-11',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'high-yield-savings-vs-cd',
    title: 'High-Yield Savings Account vs CD: Which Earns More in 2026?',
    excerpt: 'HYSAs now pay 4.5–5%. 12-month CDs offer 4.7–5.1%. The yield difference is narrow — the real distinction is liquidity vs rate lock. How to choose based on your timeline.',
    displayDate: 'July 12, 2026',
    publishDate: '2026-07-12',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'savings-rate-and-retirement-age',
    title: 'Your Savings Rate Is the Single Biggest Lever on When You Can Retire',
    excerpt: 'Save 10% and work 40 years. Save 50% and work 17 years. The relationship between savings rate and retirement age follows a precise mathematical curve — and the gains accelerate.',
    displayDate: 'July 13, 2026',
    publishDate: '2026-07-13',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: '50-30-20-budget-rule',
    title: 'The 50/30/20 Budget Rule: What It Gets Right, What It Gets Wrong, and How to Adapt It',
    excerpt: '50% needs, 30% wants, 20% savings. The rule was designed for median incomes in the 1990s. Here is why it breaks for high earners, high-cost cities, and heavy debt loads.',
    displayDate: 'July 14, 2026',
    publishDate: '2026-07-14',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'true-hourly-wage',
    title: 'Your True Hourly Wage: Why You Earn Less Per Hour Than Your Salary Suggests',
    excerpt: 'Factor in commute time, work clothes, lunches, and job-related stress spending and your $80,000 salary might net $28/hour. This calculation changes how you think about purchases.',
    displayDate: 'July 15, 2026',
    publishDate: '2026-07-15',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'fire-movement-what-savings-rate',
    title: 'The FIRE Movement: What Savings Rate You Actually Need to Retire in 10, 15, or 20 Years',
    excerpt: 'Retire in 10 years: save 66% of income. In 15 years: 50%. In 20 years: 40%. These are not aspirational figures — they are the output of the 4% rule applied to standard spending multiples.',
    displayDate: 'July 16, 2026',
    publishDate: '2026-07-16',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'car-loan-vs-leasing-total-cost',
    title: 'Car Loan vs Leasing: The Total Cost Comparison Nobody Gives You Upfront',
    excerpt: 'Over 6 years of driving, leasing typically costs $4,000–$8,000 more than buying. But if you lease into a new car every 3 years, the math can flip depending on depreciation.',
    displayDate: 'July 17, 2026',
    publishDate: '2026-07-17',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'net-worth-how-to-calculate',
    title: 'How to Calculate Your Net Worth — and What the Number Is Actually Telling You',
    excerpt: 'Net worth = assets minus liabilities. But what counts, how often to measure, and which benchmarks to compare against are not obvious. A practical guide for building and tracking it.',
    displayDate: 'July 18, 2026',
    publishDate: '2026-07-18',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'rental-property-roi-calculation',
    title: 'How to Calculate ROI on a Rental Property (The Right Way)',
    excerpt: 'Gross yield is misleading. Cap rate ignores financing. Cash-on-cash return is what you actually pocket. Here is how to run all three calculations with a real $350,000 property example.',
    displayDate: 'July 19, 2026',
    publishDate: '2026-07-19',
    readTime: '8 min read',
    lang: 'EN',
  },
  {
    slug: 'home-equity-loan-vs-heloc',
    title: 'Home Equity Loan vs HELOC: Which Is Cheaper for Your Project?',
    excerpt: 'Home equity loans give you a fixed rate on the full amount. HELOCs give you a revolving line at variable rates. For a $30,000 kitchen reno, one is clearly cheaper — but it depends on timing.',
    displayDate: 'July 20, 2026',
    publishDate: '2026-07-20',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'student-loan-payoff-strategies',
    title: 'Student Loan Payoff Strategies: Standard, Income-Driven, or Aggressive Extra Payments?',
    excerpt: 'On $45,000 in federal loans at 6.5%, the standard 10-year plan costs $15,600 in interest. Income-driven can cut monthly payments but doubles total interest. The full comparison.',
    displayDate: 'July 21, 2026',
    publishDate: '2026-07-21',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'building-wealth-on-60k-salary',
    title: 'Building Wealth on a $60,000 Salary: What Is Actually Possible in 20 Years',
    excerpt: 'Saving 20% of $60,000 ($12,000/year) invested at 7% CAGR produces $491,000 in 20 years. Here is the roadmap: order of accounts, asset mix, and the milestones along the way.',
    displayDate: 'July 22, 2026',
    publishDate: '2026-07-22',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'minimum-payment-five-credit-cards',
    title: 'What Happens When You Only Make Minimum Payments on Five Credit Cards',
    excerpt: 'Five cards, $18,000 total, minimum payments only: you pay $14,000 in interest over 12 years before the last card clears. This is the math — and the way out.',
    displayDate: 'July 23, 2026',
    publishDate: '2026-07-23',
    readTime: '7 min read',
    lang: 'EN',
  },
]

export default function BlogIndex() {
  const today = new Date().toISOString().split('T')[0]
  const posts = allPosts
    .filter((p) => p.publishDate <= today)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))

  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 0' }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 12px',
            fontFamily: 'Georgia, serif',
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#6b7280',
            margin: '0 0 40px',
            fontFamily: 'sans-serif',
            lineHeight: 1.6,
          }}
        >
          Financial education from Pedro Roriz — professor, consultant, and founder of Numrica.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: 11,
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontFamily: 'sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {post.lang}
                </span>
              </div>

              <h2 style={{ margin: '0 0 10px', fontSize: 18, lineHeight: 1.4 }}>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    color: '#1a1a2e',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {post.title}
                </Link>
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: '0 0 14px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {post.excerpt}
              </p>

              <p
                style={{
                  color: '#9ca3af',
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  margin: 0,
                }}
              >
                {post.displayDate} · {post.readTime}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
