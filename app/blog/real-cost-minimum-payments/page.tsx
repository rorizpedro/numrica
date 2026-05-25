import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The real cost of minimum payments — Numrica',
  description:
    "A $5,400 credit card balance at 24.99% APR on minimum payments costs $4,300 in interest. Here's the math — and what $100/month extra actually does.",
  keywords: ['minimum payment calculator', 'credit card interest', 'debt payoff', 'minimum payment cost'],
  alternates: {
    canonical: 'https://numrica.com/blog/real-cost-minimum-payments',
    languages: {
      'en-US': 'https://numrica.com/blog/real-cost-minimum-payments',
      'pt-BR': 'https://numrica.com/blog/custo-real-pagamento-minimo',
    },
  },
  openGraph: {
    title: 'The real cost of minimum payments',
    description:
      'A $5,400 credit card balance at 24.99% APR on minimum payments costs $4,300 in interest.',
    url: 'https://numrica.com/blog/real-cost-minimum-payments',
    type: 'article',
  },
}

const articleCss = `body { font-family: Georgia, serif; max-width: 720px; margin: 60px auto; line-height: 1.8; color: #1a1a2e; font-size: 17px; padding: 0 20px; }
    h1 { font-size: 30px; line-height: 1.25; margin-bottom: 10px; font-weight: 700; }
    h2 { font-size: 20px; margin-top: 52px; margin-bottom: 14px; font-weight: 700; }
    p { margin: 0 0 22px; }
    a { color: #22c55e; text-decoration: underline; }
    .meta { color: #9ca3af; font-size: 14px; margin-bottom: 44px; font-family: sans-serif; }
    .highlight { background: #f0fdf4; border-left: 3px solid #22c55e; padding: 16px 20px; margin: 32px 0; border-radius: 0 6px 6px 0; }
    .highlight p { margin: 0 0 8px; font-size: 15px; }
    .highlight p:last-child { margin: 0; }
    .chart { margin: 36px 0; font-family: sans-serif; }
    .chart-title { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 18px; }
    .bar-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .bar-label { width: 130px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; }
    .bar-value { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; }
    .bar-extra { font-size: 12px; color: #6b7280; margin-left: 8px; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }`

const articleBody = `<p class="meta">Numrica · Personal finance · 6 min read</p>

<h1>The real cost of minimum payments: what your monthly statement doesn't show you</h1>

<p>Most people look at the wrong number on their credit card statement.</p>

<p>The minimum payment feels manageable. $130 a month on a $5,400 balance. That number is engineered to feel manageable — because a payment you can afford is a payment you keep making, month after month, year after year, while interest compounds in the background.</p>

<p>Here is the number that actually matters: a $5,400 credit card balance at 24.99% APR (Annual Percentage Rate — the yearly cost of borrowing, expressed as a percentage of the outstanding balance), paid on minimums only, costs you <strong>$4,300 in interest</strong> before it's gone. You borrow $5,400 and repay nearly $9,700. It takes just under 17 years.</p>

<p>That is not a rounding error. That is how minimum payments are structured.</p>

<h2>How the minimum payment is calculated</h2>

<p>Credit card issuers typically set the minimum at either a fixed dollar amount ($25–$35) or a percentage of the outstanding balance (commonly 1–2%), whichever is higher. Many use a combined formula: 1% of the principal balance plus the current month's interest charge.</p>

<p>The critical detail: as your balance decreases, the minimum decreases with it. A $5,400 balance at 24.99% APR accrues $112 in interest in the first month. If your minimum is 2% of the balance, you pay $108 — which doesn't cover the interest charge. Your balance increases, not decreases.</p>

<p>In the early months, the overwhelming majority of each payment goes to interest. Principal reduction is almost incidental. This is not an accident — it is the product specification.</p>

<h2>What extra payments actually do</h2>

<p>Adding a fixed amount above the minimum each month changes the outcome dramatically. On that same $5,400 balance at 24.99% APR:</p>

<div class="chart">
  <div class="chart-title">Total interest paid — $5,400 balance at 24.99% APR</div>
  <div class="bar-row">
    <div class="bar-label">Minimum only</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:100%; background:#1a1a2e;">
        <span class="bar-value">$4,300 interest · 17 years</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">+ $100/month</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:32%; background:#22c55e;">
        <span class="bar-value">$1,380 · 3.4 yrs</span>
      </div>
      <span class="bar-extra" style="position:absolute; left:34%; top:7px;">saves $2,920</span>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">+ $200/month</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:20%; background:#22c55e;">
        <span class="bar-value">$870 · 22 mo</span>
      </div>
      <span class="bar-extra" style="position:absolute; left:22%; top:7px;">saves $3,430</span>
    </div>
  </div>
</div>

<p>A $100 increase per month eliminates 14 years of payments and saves nearly $3,000. At $200 extra per month, you're done in 22 months.</p>

<p>These are not approximations — they're the outputs of a standard amortization model, the same math your lender uses when they calculate how much interest you'll pay over the life of the account.</p>

<h2>The cascade: what happens when a debt disappears</h2>

<p>If you carry multiple debts — a credit card, a car loan, a personal loan — the math gets more compelling once you understand what happens at payoff.</p>

<p>When one debt is gone, its minimum payment doesn't go back into discretionary spending. You redirect it to the next target. A $130 credit card minimum, freed up, reduces a $12,000 car loan at 7.5% by about eight months. That frees the car payment, which then accelerates the next account.</p>

<p>This is the avalanche method (highest interest rate first) or snowball method (smallest balance first) — two names for the same underlying principle: concentrated repayment cascades. The last debt gets the combined force of every minimum payment you've freed, plus whatever extra you started with. A problem that looked like seven years often resolves in three.</p>

<p>The choice between avalanche and snowball is secondary to actually running the numbers. Most people don't, because the numbers are uncomfortable. But knowing your exact payoff date is substantially less uncomfortable than still carrying the same debt five years from now.</p>

<h2>Three things to do right now</h2>

<p><strong>Stop treating the minimum as the payment.</strong> It's a floor set by the lender, not a plan set by you. Decide what you can realistically pay each month — even if it's $50 more than the minimum — and treat that as a fixed commitment.</p>

<p><strong>Run your exact numbers.</strong> The figures above use a single debt at one rate. Your situation is different — different balances, different APRs, different minimums. The <a href="https://numrica.com/debt-payoff">Numrica debt payoff planner</a> lets you enter all your debts, choose a strategy (avalanche or snowball), set an extra payment amount, and see the exact month you'll be debt-free. It takes three minutes and requires no signup.</p>

<p><strong>Concentrate your extra payment on one debt at a time.</strong> Splitting extra payments across multiple accounts slows everything down. Pick a strategy, point the extra payment at one target, and hold the line for 12 consecutive months before reassessing. The cascade won't start until the first debt is gone.</p>

<p>The credit card company has already modeled your minimum payment schedule. They built the product around it. The minimum payment is not a courtesy — it is a revenue model.</p>

<p>The good news: the same compounding that works against you on minimums works for you the moment you start paying ahead. The math doesn't have a side.</p>

<div class="cta">
  <p>See your exact debt-free date — no signup required.</p>
  <a href="https://numrica.com/debt-payoff">→ Open the debt payoff planner</a>
</div>

<p class="disclaimer">Results are illustrative. Actual minimum payments, APRs, and balances vary by lender and account. This article is educational and does not constitute financial advice. Consult a qualified financial professional before making debt management decisions.</p>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>About the author:</strong> Pedro Roriz teaches corporate finance and management accounting at IPOG, one of Brazil's leading business schools, with over 15,000 students trained. He founded TAG Business Solutions in 2016 — a financial BPO and CFO-as-a-service firm operating in Brazil and Portugal. He is also the creator of Numrica.com.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: "The real cost of minimum payments: what your monthly statement doesn't show you",
      description: "A $5,400 credit card balance at 24.99% APR on minimum payments costs $4,300 in interest. Here's what $100/month extra actually does.",
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/real-cost-minimum-payments',
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Pedro Roriz',
        url: 'https://pedrororiz.com',
        jobTitle: 'Professor of Corporate Finance',
        worksFor: [
          { '@type': 'Organization', name: 'IPOG' },
          { '@type': 'Organization', name: 'TAG Business Solutions' },
        ],
        knowsAbout: ['corporate finance', 'debt payoff', 'minimum payments', 'credit card interest', 'amortization'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/real-cost-minimum-payments' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'The real cost of minimum payments' },
      ],
    },
  ],
}

export default function BlogPost() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <style dangerouslySetInnerHTML={{ __html: articleCss }} />
      <div dangerouslySetInnerHTML={{ __html: articleBody }} />
    </>
  )
}
