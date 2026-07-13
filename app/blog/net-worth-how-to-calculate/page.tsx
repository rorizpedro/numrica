import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Calculate Your Net Worth — and What the Number Is Actually Telling You — Numrica',
  description: 'Net worth = assets minus liabilities. But what counts, how often to measure, and which benchmarks to compare against are not obvious. A practical guide for building and tracking it.',
  alternates: { canonical: 'https://numrica.com/blog/net-worth-how-to-calculate' },
  openGraph: {
    title: 'How to Calculate Your Net Worth — and What the Number Is Actually Telling You',
    description: 'Net worth = assets minus liabilities. But what counts, how often to measure, and which benchmarks to',
    url: 'https://numrica.com/blog/net-worth-how-to-calculate',
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
    .bar-label { width: 150px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; }
    .bar-value { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }
    strong { font-weight: 700; }`

const articleBody = `<p class="meta">Numrica · Personal Finance · 6 min read</p>

<h1>How to Calculate Your Net Worth — and What the Number Is Actually Telling You</h1>

<p>According to the Federal Reserve’s Survey of Consumer Finances, the median net worth for U.S. households is around $120,000 — yet most Americans have never sat down to calculate their own. This gap between knowledge and action can have serious consequences. For example, a 35-year-old earning $75,000 annually who carries $20,000 in credit card debt and owns a home worth $300,000 might believe they’re financially stable. But if their mortgage is $150,000 and they have $10,000 in student loans, their actual net worth is only $140,000 — a number that could determine their ability to weather a job loss or medical emergency.</p>

<p>Net worth is more than just a number on a spreadsheet. It’s a snapshot of your financial health, revealing whether you’re on track to meet long-term goals like retirement or homeownership. Many Americans live paycheck to paycheck without a clear picture of where they stand — which means small financial shocks can become crises. Understanding your net worth is a critical first step toward financial resilience. Let’s break down how to calculate it and what the number really means.</p>

<h2>What Is Net Worth — and Why Does It Matter?</h2>

<p>Net worth is calculated by subtracting your total liabilities (what you owe) from your total assets (what you own). Assets include your home, car, savings accounts, investments, and retirement accounts. Liabilities include mortgages, credit card debt, student loans, and other outstanding obligations. For example, if you own a home valued at $300,000 with a $150,000 mortgage, and you have $20,000 in a savings account but $10,000 in credit card debt, your net worth would be $300,000 (assets) minus $160,000 (liabilities) = $140,000.</p>

<p>Knowing your net worth helps you identify financial gaps and track progress over time. People who regularly measure their net worth tend to catch problems earlier and stay more accountable to their savings goals. It also reveals whether you’re accumulating wealth or falling behind. For instance, a 40-year-old with a $500,000 home, $50,000 in retirement accounts, and $200,000 in debt might have a net worth of $350,000 — but if their peers have a significantly higher median, they might need to adjust their spending or investment habits.</p>

<h2>Common Mistakes When Calculating Net Worth</h2>

<p>Many people overlook key assets or miscalculate liabilities. For example, retirement accounts like 401(k)s and IRAs are often excluded from net worth calculations, even though they’re significant assets. Similarly, people may undervalue their home or overvalue their car, leading to inaccurate results. A common error is simply forgetting to count employer-sponsored retirement accounts at all — which can cause someone to dramatically underestimate their actual financial position.</p>

<p>Another common mistake is failing to account for non-liquid assets. If you own a home worth $400,000 but have a $300,000 mortgage, your net worth from that asset alone is only $100,000. However, if you need cash quickly, you can’t access that $100,000 without selling the home — a process that could take months and cost thousands in fees. Understanding this distinction helps you assess your liquidity and prepare for unexpected expenses.</p>

<div class="highlight">
  <p><strong>Average Net Worth for Americans (2023):</strong> $120,000</p>
  <p>That number is lower for younger adults, with those under 35 averaging just $50,000. This highlights the importance of starting early to build wealth.</p>
</div>

<h2>How Your Net Worth Number Reflects Your Financial Health</h2>

<p>Your net worth number tells a story about your financial habits and priorities. A positive net worth (assets > liabilities) indicates that you’re building wealth, while a negative net worth (liabilities > assets) suggests you’re in debt. For example, a 30-year-old with $50,000 in student loans, $10,000 in credit card debt, and no savings might have a net worth of -$60,000 — a red flag that could lead to financial stress if they lose their job or face a medical emergency.</p>

<p>Net worth also reveals how much of your income is going toward debt versus savings. If you earn $60,000 annually and spend $40,000 on living expenses, but $20,000 on debt payments, you’re not building wealth. However, if you’re spending $30,000 on expenses and $10,000 on debt, you’re saving $20,000 annually — a habit that can grow your net worth over time. Tools like the Numrica ROI Calculator can help you model how different spending and saving choices impact your net worth.</p>

<div class="chart">
  <div class="chart-title">AVERAGE NET WORTH BY AGE GROUP (2023)</div>
  <div class="bar-row">
    <div class="bar-label">UNDER 35</div>
    <div class="bar-track"><div class="bar-fill" style="width:100%; background:#1a1a2e;"><span class="bar-value">$50,000</span></div></div>
  </div>
  <div class="bar-row">
    <div class="bar-label">35-54</div>
    <div class="bar-track"><div class="bar-fill" style="width:72%; background:#22c55e;"><span class="bar-value">$150,000</span></div></div>
  </div>
  <div class="bar-row">
    <div class="bar-label">55+</div>
    <div class="bar-track"><div class="bar-fill" style="width:100%; background:#1a1a2e;"><span class="bar-value">$300,000</span></div></div>
  </div>
</div>

<h2>Improving Your Net Worth — and How to Measure Progress</h2>

<p>Improving your net worth starts with increasing assets and reducing liabilities. For example, paying off $10,000 in credit card debt at a typical rate of around 21% (the average APR in recent years, per Federal Reserve data) could save you over $2,000 in interest payments annually. Similarly, investing $5,000 annually in a retirement account with a 7% average real return could grow to $1.2 million by age 65. The Numrica ROI Calculator can help you see how these choices impact your net worth over time.</p>

<p>Another way to boost your net worth is by increasing your income. If you earn $75,000 annually and get a 5% raise, you’ll have an additional $3,750 to allocate toward savings or debt repayment. Even small changes, like cutting $200 monthly from dining out and investing that money, can add up to $24,000 over 10 years. The ROI Calculator can show you how these adjustments affect your long-term net worth.</p>

<h2>Take Control of Your Financial Future Today</h2>

<p>Start by listing your assets and liabilities. Use the Numrica ROI Calculator to track your net worth and see how different financial decisions impact your future. For example, you can model how paying off a mortgage early or increasing your retirement contributions affects your net worth in 10, 20, or 30 years. This tool is free and doesn’t require a login — it’s designed to help you make informed choices without the complexity of traditional financial planning tools.</p>

<div class="cta">
  <p>Calculate your own numbers with our free tool — no signup required.</p>
  <a href="https://numrica.com/roi-calculator">→ Open ROI Calculator</a>
</div>


<div style="margin:48px 0 0;padding:28px 24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
  <p style="font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin:0 0 16px;font-family:sans-serif;">You might also like</p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/how-much-to-save-at-each-age" style="color:#22c55e;text-decoration:underline;font-size:15px;">How Much to Save at Every Age</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/building-wealth-on-60k-salary" style="color:#22c55e;text-decoration:underline;font-size:15px;">Building Wealth on a $60K Salary</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/rental-property-roi-calculation" style="color:#22c55e;text-decoration:underline;font-size:15px;">ROI on a Rental Property</a></p>
</div>

<div class="disclaimer">This article is for informational purposes only and does not constitute financial advice. Always consult a qualified financial advisor before making major financial decisions.</div>
<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>About the author:</strong> Pedro Roriz is a professor of corporate finance and management accounting at IPOG, one of Brazil&apos;s largest postgraduate business schools, where he has trained over 15,000 students. He founded TAG Business Solutions in 2016, a financial BPO and CFO-as-a-service firm operating in Brazil and Portugal. He is the creator of Numrica.com.
</div>`

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "How to Calculate Your Net Worth — and What the Number Is Actually Telling You",
      "description": "Net worth = assets minus liabilities. But what counts, how often to measure, and which benchmarks to compare against are not obvious. A practical guide for building and tracking it.",
      "datePublished": "2026-07-18",
      "dateModified": "2026-07-18",
      "url": "https://numrica.com/blog/net-worth-how-to-calculate",
      "inLanguage": "en-US",
      "author": {
        "@type": "Person",
        "name": "Pedro Roriz",
        "url": "https://pedrororiz.com",
        "jobTitle": "Professor of Corporate Finance",
        "worksFor": [
          {
            "@type": "Organization",
            "name": "IPOG"
          },
          {
            "@type": "Organization",
            "name": "TAG Business Solutions"
          }
        ],
        "knowsAbout": [
          "personal finance",
          "debt payoff",
          "investing",
          "mortgages",
          "compound interest"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "Numrica",
        "url": "https://numrica.com"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://numrica.com/blog/net-worth-how-to-calculate"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Numrica",
          "item": "https://numrica.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://numrica.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "How to Calculate Your Net Worth — and What the Number Is Actually Telling You"
        }
      ]
    }
  ]
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
