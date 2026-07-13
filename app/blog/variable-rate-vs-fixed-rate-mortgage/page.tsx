import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows — Numrica',
  description:
    'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision. Here is the full simulation.',
  keywords: ['variable rate mortgage', 'fixed rate mortgage', 'Euribor mortgage', 'tracker mortgage', 'ARM vs fixed', 'mortgage rate comparison'],
  alternates: {
    canonical: 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage',
    languages: {
      'en-US': 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage',
      'pt-PT': 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa',
    },
  },
  openGraph: {
    title: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows',
    description:
      'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision.',
    url: 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage',
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
    .bar-label { width: 140px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
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

<h1>Variable rate vs fixed rate mortgage: what 20 years of data actually shows</h1>

<p>Most borrowers make the rate-type decision by looking at one number: the initial monthly payment. The variable rate is lower today, so they take the variable rate. The fixed rate costs more upfront, so it gets dismissed as expensive. That reasoning treats a 25-year financial commitment like a short-term trade — and it produces predictably bad outcomes when rate cycles turn.</p>

<p>The choice between variable and fixed is not about which rate is lower right now. It is about how much uncertainty you are willing to absorb over the full term of the loan, and what that uncertainty costs you in both money and planning. Those are different questions, and they require the same tool: a simulation that runs both options to completion.</p>

<h2>How variable rate mortgages work</h2>

<p>A variable rate mortgage (also called a tracker or adjustable-rate mortgage) links your interest rate to a benchmark — typically Euribor in the eurozone, the Bank of England base rate in the UK, or SOFR in the United States. Your lender adds a fixed spread on top of that benchmark: Euribor + 1.2%, for instance. The benchmark moves; the spread stays constant.</p>

<p>When benchmarks are low, your payment is low. When benchmarks rise — as they did sharply across all major economies in 2022–2023 — your payment rises with them, typically with a 3–6 month lag depending on your reset frequency. Most variable mortgages reset every 3 or 6 months. The borrower absorbs the full benefit of falling rates and the full cost of rising ones. The lender bears neither.</p>

<h2>Running the simulation: three scenarios over 25 years</h2>

<p>The setup: €200,000 mortgage, 25-year term, variable at Euribor 6M + 1.2% spread (starting at 4.5%), fixed at 3.8%. This reflects current market rates across the eurozone and UK for a well-qualified borrower.</p>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Scenario</th><th>Variable total interest</th><th>Fixed total interest</th><th>Difference</th></tr>
  </thead>
  <tbody>
    <tr><td>Rates rise 2% over 5 years</td><td>€182,400</td><td>€143,600</td><td>Fixed saves €38,800</td></tr>
    <tr><td>Rates stay flat (no change)</td><td>€154,200</td><td>€143,600</td><td>Fixed saves €10,600</td></tr>
    <tr><td>Rates fall 2% over 5 years</td><td>€126,800</td><td>€143,600</td><td>Variable saves €16,800</td></tr>
  </tbody>
</table>
</div>

<p>The pattern is asymmetric. In the adverse scenario (rates rise), fixed outperforms by €38,800 — nearly 20% of the original loan. In the benign scenario (rates fall 2 points), variable saves €16,800. The range of outcomes for the variable mortgage spans €55,600 depending on rate trajectory. The fixed mortgage has one outcome regardless of what happens to benchmarks.</p>

<h2>The asymmetry that most comparisons miss</h2>

<p>When analysts compare variable vs fixed, they usually show a single scenario — typically the one that happened historically in their country of analysis. A Portuguese borrower who took a variable mortgage in 2014, when Euribor was near zero, paid dramatically less than a fixed-rate borrower for six years. That same borrower, when Euribor crossed 4% in 2023, saw monthly payments increase by €400–600 on a €200,000 loan. Both facts are true. Neither tells the whole story.</p>

<p>The relevant comparison is not "which rate was lower in hindsight" but "what is the full range of outcomes, and can I absorb the downside?" A borrower who takes a variable mortgage in 2025 at Euribor + 1.2% and rates rise another 2 points faces a payment shock of roughly €250/month on a €200,000 loan — on top of the payment they already accepted. For households operating near the limit of their debt service ratio, that shock is not theoretical. It is the mechanism by which properties get sold in distress.</p>

<h2>What the initial payment difference actually buys</h2>

<p>At current market rates, the gap between variable and fixed initial payments on a €200,000, 25-year mortgage is roughly €80–120/month. Over the first year, the variable borrower saves approximately €1,000–1,400. That is the real price of rate certainty — not the total interest comparison, which extends across 25 years of unknown rate paths. The question is whether that premium is worth paying given your specific circumstances.</p>

<p>Three factors consistently push toward fixed: income that is itself variable or uncertain (making additional payment volatility dangerous), a loan-to-value ratio above 75% (less buffer if forced to sell), or a planning horizon that requires predictable monthly costs — a business with tight cash flow, a household with young children and rising expenses, a borrower near retirement with fixed income. Three factors push toward variable: substantial financial reserves that can absorb payment increases of €300–400/month without stress, a short intended hold period (selling within 5–7 years before the rate cycle fully turns), or a market where fixed rates carry a meaningful premium that the simulation suggests variable would outperform even in adverse scenarios.</p>

<h2>The hybrid option and what it actually changes</h2>

<p>Many lenders offer a hybrid structure: a fixed rate for an initial period (typically 2, 5, or 10 years) followed by a conversion to variable. The initial fixed period provides payment certainty during the highest-stress years of a mortgage — when the loan balance is largest and household finances are often tightest from the purchase itself. After the fixed period expires, the borrower faces the variable structure — but by that point, the balance is lower, the rate environment may have shifted, and the option to refinance to a new fixed product exists.</p>

<p>Hybrid structures do not eliminate rate risk; they defer and reduce it. They are often a sensible middle ground for borrowers who cannot absorb near-term payment volatility but believe rate environments may improve over a 5–10 year horizon.</p>

<h2>Three things to do before signing</h2>

<p><strong>Run both options to completion, not just year one.</strong> The initial payment comparison is the least useful data point in the decision. What matters is total interest paid across the loan term under realistic rate scenarios. Use the <a href="https://numrica.com/mortgage-calculator">Numrica mortgage calculator</a> to simulate your specific loan amount, term, and current rate options — and look at total cost, not just monthly payment.</p>

<p><strong>Stress-test your budget against a 2-point rate increase.</strong> If your variable rate is currently 4.5%, calculate what your payment becomes at 6.5%. Then calculate it at 7.5%. If either scenario breaks your budget — forces you to cut savings, defer necessary expenses, or sell — you are not positioned to take variable rate risk, regardless of what the initial payment looks like. The stress test is not pessimism. It is the minimum due diligence on a 25-year commitment.</p>

<p><strong>Separate the rate decision from the lender decision.</strong> Banks bundle the rate type with their best promotional rates in ways that obscure the true comparison. The lowest variable rate from one lender versus the lowest fixed rate from another is not a clean comparison — spread, fees, penalty clauses on early repayment, and the lender's track record on spread increases at reset all affect the real cost. Get both options from the same lender on the same day, then compare against the market.</p>

<p>The initial payment is the wrong anchor for a 25-year decision. The right question is: across the full range of plausible rate paths, which outcome can you live with — and which one could sink you?</p>

<div class="cta">
  <p>Simulate your mortgage across variable and fixed scenarios — no signup required.</p>
  <a href="https://numrica.com/mortgage-calculator">→ Open the mortgage calculator</a>
</div>

<p class="disclaimer">Results are illustrative. Actual rates, spreads, and payment structures vary by lender, region, and borrower profile. This article is educational and does not constitute financial advice. Consult a qualified financial professional before making mortgage decisions. Rate scenarios used are for illustration only and do not constitute a forecast.</p>


<div style="margin:48px 0 0;padding:28px 24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
  <p style="font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin:0 0 16px;font-family:sans-serif;">You might also like</p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/15-vs-30-year-mortgage" style="color:#22c55e;text-decoration:underline;font-size:15px;">15-Year vs 30-Year Mortgage</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/mortgage-refinancing-explained" style="color:#22c55e;text-decoration:underline;font-size:15px;">Mortgage Refinancing Explained</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/mortgage-points-explained" style="color:#22c55e;text-decoration:underline;font-size:15px;">Mortgage Points Explained</a></p>
</div>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>About the author:</strong> Pedro Roriz teaches corporate finance and management accounting at IPOG, one of Brazil's leading business schools, with over 15,000 students trained. He founded TAG Business Solutions in 2016 — a financial BPO and CFO-as-a-service firm operating in Brazil and Portugal. He is also the creator of Numrica.com.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows',
      description:
        'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision. Here is the full simulation.',
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage',
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
        knowsAbout: ['corporate finance', 'mortgage', 'variable rate', 'fixed rate', 'Euribor', 'interest rate risk'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Variable rate vs fixed rate mortgage' },
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
