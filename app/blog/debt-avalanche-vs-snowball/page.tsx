import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Debt avalanche vs debt snowball: which method saves more money? — Numrica',
  description:
    'Most people with three debts do not know which to pay first. That indecision has a measurable cost — between 20% and over 100% of the original debt balance in extra interest.',
  keywords: ['debt avalanche', 'debt snowball', 'debt payoff strategy', 'which debt to pay first', 'avalanche method', 'snowball method'],
  alternates: {
    canonical: 'https://numrica.com/blog/debt-avalanche-vs-snowball',
    languages: {
      'en-US': 'https://numrica.com/blog/debt-avalanche-vs-snowball',
      'pt-BR': 'https://numrica.com/blog/avalanche-vs-bola-de-neve',
    },
  },
  openGraph: {
    title: 'Debt avalanche vs debt snowball: which method saves more money?',
    description:
      'Most people with three debts do not know which to pay first. That indecision has a measurable cost.',
    url: 'https://numrica.com/blog/debt-avalanche-vs-snowball',
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
    .table-wrap { overflow-x: auto; margin: 32px 0; }
    table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
    th { background: #f3f4f6; color: #374151; font-weight: 600; text-align: left; padding: 10px 14px; border-bottom: 2px solid #e5e7eb; }
    td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; color: #374151; }
    tr:last-child td { border-bottom: none; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }`

const articleBody = `<p class="meta">Numrica · Personal finance · 7 min read</p>

<h1>Debt avalanche vs debt snowball: which method saves more money?</h1>

<p>Most people carrying multiple debts don't know which one to pay off first. They split the extra payment across all accounts — a little here, a little there — because it feels fair, or because it's less painful than concentrating on one target. That instinct is understandable. It is also expensive.</p>

<p>The two structured alternatives — the avalanche method and the snowball method — both work by answering the same question differently: <em>where does the extra dollar go?</em> The math of one is better. The psychology of the other is sometimes more effective. Understanding both means you can choose deliberately rather than defaulting to habit.</p>

<h2>The two methods, defined</h2>

<p>The <strong>debt avalanche</strong> targets the highest interest rate first, regardless of balance size. You pay minimums on everything else and direct every spare dollar at the highest-rate account. When that account is gone, you redirect its freed payment — plus the extra — at the next highest rate. And so on. The <strong>debt snowball</strong> targets the smallest balance first, regardless of interest rate. The logic is psychological: clearing small accounts quickly generates wins and momentum. When that account is paid off, you roll the freed payment into the next-smallest balance. In both cases, the total monthly outflow doesn't change — only the allocation shifts. The freed minimums cascade from one cleared debt to the next, building force as they go.</p>

<h2>Running the numbers on a real example</h2>

<p>Take a common three-debt situation:</p>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Debt</th><th>Balance</th><th>APR</th><th>Min. payment</th></tr>
  </thead>
  <tbody>
    <tr><td>Credit card</td><td>$4,200</td><td>24.99%</td><td>$129/mo</td></tr>
    <tr><td>Personal loan</td><td>$8,000</td><td>18.5%</td><td>$235/mo</td></tr>
    <tr><td>Auto loan</td><td>$5,800</td><td>8.9%</td><td>$121/mo</td></tr>
  </tbody>
</table>
</div>

<p>Total: $18,000 across three accounts. Total minimum payments: $485/month. Add $400/month in extra payment for a total of $885/month deployed.</p>

<p><strong>Avalanche order:</strong> credit card (24.99%) → personal loan (18.5%) → auto loan (8.9%). The credit card is eliminated in roughly 11 months. Its freed payment cascades to the personal loan, cleared around month 22. The auto loan — now receiving all three freed minimums plus the $400 extra — is paid off around month 27. Total interest paid: approximately $4,200.</p>

<p><strong>Snowball order:</strong> credit card ($4,200 smallest) → auto loan ($5,800) → personal loan ($8,000 largest). The credit card is cleared at roughly the same point — month 11. But the freed payment then attacks the auto loan at only 8.9%, allowing the personal loan's 18.5% rate to compound uncontested until month 25 or so. The personal loan — the largest balance at the highest remaining rate — is the last target, cleared around month 32. Total interest paid: approximately $5,300.</p>

<div class="chart">
  <div class="chart-title">Total interest paid — $18,000 in three debts, $400/month extra</div>
  <div class="bar-row">
    <div class="bar-label">Snowball</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:100%; background:#1a1a2e;">
        <span class="bar-value">$5,300 interest · 32 months</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Avalanche</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:79%; background:#22c55e;">
        <span class="bar-value">$4,200 interest · 27 months</span>
      </div>
      <span class="bar-extra" style="position:absolute; left:81%; top:7px;">saves $1,100</span>
    </div>
  </div>
</div>

<p>The avalanche method saves approximately $1,100 in interest and five months of payments. The difference is driven by one structural fact: the personal loan's 18.5% rate compounds against a large balance for longer under the snowball sequence. The auto loan carries a low rate — clearing it quickly in snowball order does not generate meaningful interest savings, and the personal loan pays for it.</p>

<h2>When does snowball actually win?</h2>

<p>On pure interest cost, the avalanche method wins in almost every scenario where rates differ meaningfully. But the snowball method has a legitimate case, and it is behavioral rather than mathematical. Early payoffs change the psychology of debt repayment. Seeing an account go to zero — even a small one — provides a concrete signal that the strategy is working. For some people, this signal matters enough to sustain commitment over the 2–3 years required to clear a meaningful debt load. An abandoned avalanche saves nothing.</p>

<p>The scenarios where snowball closes the gap: when the high-rate debts also happen to be the smallest balances (rate and size align), when rate differences are small (within 2–3 percentage points), or when one small account carries psychological weight disproportionate to its balance — a creditor, a recurring statement, a source of recurring stress. In those cases, the momentum effect has real economic value that partially offsets the interest cost. The scenarios where avalanche clearly dominates: when the highest-rate debt is also a large balance, when rate differences exceed 5–6 percentage points, and when you are motivated by watching total interest numbers decline rather than account counts.</p>

<h2>The choice that actually matters: concentrate, don't split</h2>

<p>The most expensive default is neither avalanche nor snowball — it is the non-strategy of distributing extra payments evenly. When $400 extra is split across three accounts, each debt receives roughly $133 of acceleration. No account reaches payoff faster in a meaningful sense. The cascade never starts, because no account is cleared early enough to free its minimum payment for redeployment. The math of concentrated repayment depends entirely on sequential payoffs. Split payments eliminate that mechanism.</p>

<p>Choose one method. Apply the extra dollar to one account only. Hold the line for at least 12 consecutive months before assessing. The sequence of cleared accounts builds its own momentum regardless of which method you choose — the cascade grows with each payoff. The last debt absorbs the force of every minimum you've freed, plus the original extra amount. What looked like a seven-year problem usually resolves in two or three.</p>

<h2>Three things to do before this week is over</h2>

<p><strong>List every debt with its current balance and exact interest rate.</strong> Not the rate from the original agreement — the rate on the current statement. Rates on variable products change. The list determines which method helps you most and gives you the starting point for the cascade.</p>

<p><strong>Calculate the difference for your specific situation.</strong> The $1,100 difference above is specific to that debt profile. Your numbers will be different — different rates, different balances, different minimums. The <a href="https://numrica.com/debt-payoff">Numrica debt payoff planner</a> runs both methods side by side for your exact debts, shows the total interest cost and payoff date for each, and lets you adjust the extra payment to see what difference $50 or $100 more per month makes. No signup required.</p>

<p><strong>Commit to one method for at least 12 months.</strong> The cascade requires patience. The first payoff is the hardest — nothing is cleared yet, the extra payment feels like it's disappearing, and the total debt balance declines slowly. After the first account is gone, the freed minimum accelerates the next target, and the pace shifts. Don't switch methods before the cascade has a chance to start. Pick one. Run it. The interest meter runs every day you carry these balances.</p>

<div class="cta">
  <p>See your exact payoff date under both methods — no signup required.</p>
  <a href="https://numrica.com/debt-payoff">→ Open the debt payoff planner</a>
</div>

<p class="disclaimer">Results are illustrative. Actual interest rates, minimum payments, and balances vary by lender and account. This article is educational and does not constitute financial advice. Consult a qualified financial professional before making debt management decisions.</p>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>About the author:</strong> Pedro Roriz teaches corporate finance and management accounting at IPOG, one of Brazil's leading business schools, with over 15,000 students trained. He founded TAG Business Solutions in 2016 — a financial BPO and CFO-as-a-service firm operating in Brazil and Portugal. He is also the creator of Numrica.com.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: 'Debt avalanche vs debt snowball: which method saves more money?',
      description:
        'Most people with three debts do not know which to pay first. That indecision has a measurable cost — between 20% and over 100% of the original debt balance in extra interest.',
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/debt-avalanche-vs-snowball',
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
        knowsAbout: ['corporate finance', 'debt payoff', 'avalanche method', 'snowball method', 'debt repayment strategy'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/debt-avalanche-vs-snowball' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Debt avalanche vs debt snowball' },
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
