import type { Metadata } from 'next'
import LoanSimulatorCalculator from './LoanSimulatorCalculator'

export const metadata: Metadata = {
  title: 'Loan Amortization Calculator — SAC, Price, Gradient & Bullet',
  description: 'Calculate loan payments and full amortization schedules for SAC, Price (French), Gradient, and Bullet systems. Compare systems side by side, export to Excel. Free, no signup.',
  keywords: [
    'loan amortization calculator', 'SAC calculator', 'Price system calculator',
    'loan amortization schedule', 'amortization table', 'loan payment calculator',
    'bullet loan calculator', 'gradient loan calculator', 'French amortization',
    'SAC vs Price', 'total interest calculator', 'loan simulator',
    'amortization schedule Excel', 'debt amortization calculator',
  ],
  alternates: { canonical: 'https://numrica.com/loan-simulator' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com/loan-simulator',
    siteName: 'Numrica',
    title: 'Loan Amortization Calculator — SAC, Price, Gradient & Bullet — Numrica',
    description: 'Full amortization schedule for SAC, Price, Gradient, and Bullet loan systems. Compare methods, see total interest, export to Excel. Free, no signup.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Loan Amortization Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loan Amortization Calculator — SAC, Price, Gradient & Bullet — Numrica',
    description: 'Full amortization schedule for SAC, Price, Gradient, and Bullet systems. Compare methods, export to Excel. Free.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Loan Amortization Calculator',
      url: 'https://numrica.com/loan-simulator',
      description: 'Calculate loan payments and complete amortization schedules for SAC, Price (French), Gradient, and Bullet loan systems. Compare amortization methods side by side and export to Excel.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'SAC amortization, Price (French) amortization, Gradient amortization, Bullet (American) system, Grace period support, Side-by-side system comparison, Scenario analysis, Excel export, Multi-currency, Monthly/yearly chart view',
      dateModified: '2026-06-12',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a loan amortization schedule?',
          acceptedAnswer: { '@type': 'Answer', text: 'A loan amortization schedule is a complete table showing every payment over the life of a loan. Each row breaks down how much of your payment goes to principal (reducing your balance) and how much goes to interest. It also shows the remaining balance after each payment. Amortization schedules help borrowers understand the true cost of a loan and plan their cash flow.' },
        },
        {
          '@type': 'Question',
          name: 'What is the SAC amortization system?',
          acceptedAnswer: { '@type': 'Answer', text: 'SAC (Sistema de Amortização Constante) pays a fixed amount of principal each period. Because the outstanding balance decreases every month, the interest portion also decreases — resulting in installments that get smaller over time. SAC produces lower total interest than the Price system for the same loan amount, rate, and term.' },
        },
        {
          '@type': 'Question',
          name: 'What is the Price (French) amortization system?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Price system (also called French amortization) produces constant installments throughout the loan. Early payments are mostly interest; late payments are mostly principal. This makes cash flow planning straightforward — the borrower pays the same amount every month. Price results in higher total interest than SAC because the principal is paid down more slowly.' },
        },
        {
          '@type': 'Question',
          name: 'What is a Bullet loan?',
          acceptedAnswer: { '@type': 'Answer', text: 'A Bullet loan (also called American system) requires interest-only payments during the loan term, with the entire principal repaid in a single lump sum at the final period. Total interest is higher than both SAC and Price because the principal never decreases until maturity. Bullet loans are common in bridge financing, commercial real estate, and corporate bonds.' },
        },
        {
          '@type': 'Question',
          name: 'How does a grace period work?',
          acceptedAnswer: { '@type': 'Answer', text: 'A grace period delays the start of principal repayment. Under a partial grace period, the borrower pays only interest during the grace months; the principal repayment schedule then begins as normal. Under a total (capitalized) grace period, no payment is made at all during the grace months — accrued interest is added to the principal balance, increasing the base amount subject to future interest.' },
        },
        {
          '@type': 'Question',
          name: 'Which amortization system pays less total interest — SAC or Price?',
          acceptedAnswer: { '@type': 'Answer', text: 'SAC always produces lower total interest than the Price system for identical loan parameters. Because SAC repays principal at a constant rate, the outstanding balance decreases faster — meaning less interest accrues each period. On a $100,000 loan at 1.5%/month for 24 months, SAC pays approximately $20,500 in total interest vs. $22,200 for Price — a difference of about 8%.' },
        },
        {
          '@type': 'Question',
          name: 'What is a gradient (progressive) amortization system?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Gradient system increases each installment by a fixed percentage every period. This is useful when the borrower expects income to grow over time — early payments are smaller and more manageable, while later payments are larger. The gradient rate determines how fast installments grow. Like Price, it produces a predictable payment schedule, but with a progressive instead of constant payment amount.' },
        },
        {
          '@type': 'Question',
          name: 'How do I convert an annual interest rate to a monthly rate?',
          acceptedAnswer: { '@type': 'Answer', text: 'To convert an annual rate to monthly: monthly rate = (1 + annual rate)^(1/12) − 1. For example, an annual rate of 19.56% converts to (1.1956)^(1/12) − 1 = 1.5%/month. Simple division (19.56% ÷ 12 = 1.63%) ignores compounding and overstates the monthly rate. This calculator accepts both monthly and annual inputs and converts automatically.' },
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Use the Loan Amortization Calculator',
      description: 'Calculate a complete loan amortization schedule in four steps.',
      step: [
        { '@type': 'HowToStep', name: 'Enter loan parameters', text: 'Input the loan amount, interest rate (monthly or annual), number of periods (months), and start date.' },
        { '@type': 'HowToStep', name: 'Select the amortization system', text: 'Choose SAC, Price, Gradient, or Bullet. Add a grace period if applicable.' },
        { '@type': 'HowToStep', name: 'Review the amortization schedule', text: 'See total interest, total paid, first and last installment, and the full period-by-period table.' },
        { '@type': 'HowToStep', name: 'Compare and export', text: 'Use Compare Mode to see all systems side by side, or Scenario Mode to test a different rate/term. Export the full schedule to Excel.' },
      ],
    },
  ],
}

const textStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }
const sectionStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }
const disclaimerStyle: React.CSSProperties = { fontSize: 12, color: '#9ca3af', lineHeight: 1.6, borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 24 }

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <LoanSimulatorCalculator />
      <div style={sectionStyle}>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>What is loan amortization?</h2>
          <p style={textStyle}>
            Loan amortization is the process of paying off a debt through regular installments over time. Each payment covers
            two components: <strong>interest</strong> — the cost of borrowing — and <strong>principal</strong> — the portion
            that reduces your outstanding balance. The proportion of each component changes every period depending on the
            amortization system chosen.
          </p>
          <p style={textStyle}>
            An amortization schedule is the complete period-by-period table that shows exactly how much of each payment goes
            to principal and how much to interest, along with the remaining balance after each installment. Lenders provide
            this table at loan origination; borrowers use it to plan prepayments, refinancing decisions, and total cost
            comparisons between competing loan offers.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>The four main amortization systems</h2>
          <p style={textStyle}>
            <strong>SAC (Constant Amortization System)</strong> repays the same principal amount every period. Because the
            outstanding balance decreases at a constant pace, the interest portion also shrinks each month — producing
            installments that start high and decrease steadily. SAC minimizes total interest paid over the life of the
            loan and is common in Brazil and other Latin American markets for mortgage and commercial loans.
          </p>
          <p style={textStyle}>
            <strong>Price (French System)</strong> produces fixed installments throughout the loan term. Early payments are
            heavily weighted toward interest; late payments are mostly principal. The constant payment simplifies cash flow
            planning — the borrower pays exactly the same amount every month. Because principal is repaid more slowly than
            in SAC, total interest is higher. Price is the most common system globally for personal loans, auto loans, and
            consumer credit.
          </p>
          <p style={textStyle}>
            <strong>Gradient (Progressive System)</strong> increases each installment by a fixed percentage every period.
            This structure is designed for borrowers whose income is expected to grow — for example, a business taking a
            loan against projected revenue growth. Initial installments are lower and more affordable; later installments
            compensate. The gradient rate controls how fast payments escalate.
          </p>
          <p style={textStyle}>
            <strong>Bullet (American System)</strong> requires interest-only payments throughout the loan term. The entire
            principal is repaid in a single lump sum at final maturity. Because the balance never decreases, interest
            accrues on the full principal for the entire term — making total interest cost the highest of all systems.
            Bullet loans are used in bridge financing, commercial real estate, and corporate bond structures where
            the borrower expects a liquidity event (asset sale, refinancing, or IPO) to fund the principal repayment.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>SAC vs. Price: a worked example</h2>
          <p style={textStyle}>
            Consider a loan of <strong>$100,000 at 1.5% per month for 24 months</strong>, starting January 2026, with no
            grace period.
          </p>
          <p style={textStyle}>
            Under <strong>SAC</strong>: monthly amortization = $100,000 ÷ 24 = $4,166.67. Month 1 interest = $100,000 ×
            1.5% = $1,500. First installment = $5,666.67. Month 24 interest = $4,166.67 × 1.5% = $62.50. Last installment
            = $4,229.17. Total interest paid ≈ <strong>$19,125</strong>.
          </p>
          <p style={textStyle}>
            Under <strong>Price</strong>: the constant installment M = P × [r(1+r)^n] / [(1+r)^n − 1] = $100,000 ×
            [0.015 × (1.015)^24] / [(1.015)^24 − 1] ≈ <strong>$4,971.49/month</strong>. Month 1 interest = $1,500;
            principal = $3,471.49. Month 24 interest ≈ $73.47; principal ≈ $4,898.02. Total interest paid ≈
            <strong>$19,315</strong> — about 1% more than SAC for this example. The gap widens with longer terms and
            higher rates.
          </p>
          <p style={textStyle}>
            The key tradeoff: SAC offers lower total cost but requires higher initial payments. Price offers payment
            stability at a slightly higher total cost. For most consumer borrowers, Price is easier to budget; for
            businesses focused on minimizing interest expense, SAC is preferable.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Grace periods: partial vs. total capitalization</h2>
          <p style={textStyle}>
            A grace period defers the start of principal repayment. Under a <strong>partial grace period</strong>, the
            borrower pays only the interest accrued each month during the grace phase — the principal remains unchanged.
            Once the grace period ends, the full amortization schedule begins on the original principal.
          </p>
          <p style={textStyle}>
            Under a <strong>total (capitalized) grace period</strong>, no payment is made at all during the grace months.
            Accrued interest is added to the principal balance each period — a process called capitalization. This increases
            the base amount on which future interest is calculated, making it significantly more expensive than a partial
            grace period. A 3-month total grace on a $100,000 loan at 1.5%/month adds approximately $4,568 to the
            principal before amortization even begins.
          </p>
          <p style={textStyle}>
            Grace periods are common in project finance, infrastructure loans, and construction financing — contexts where
            the borrower needs time to generate revenue before servicing the debt. For consumer loans, they typically signal
            a weaker credit position and should be treated with caution due to their compounding cost.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>How to convert between annual and monthly interest rates</h2>
          <p style={textStyle}>
            Loan rates are quoted in different conventions depending on the market. Brazilian and Portuguese lenders often
            quote monthly rates directly; US and European lenders typically quote annual rates (APR or EAR). Converting
            between them correctly matters — the wrong formula can materially distort total cost comparisons.
          </p>
          <p style={textStyle}>
            <strong>Annual to monthly (compound):</strong> monthly rate = (1 + annual rate)^(1/12) − 1. Example: 19.56%
            annual → (1.1956)^(1/12) − 1 = 1.50%/month.
          </p>
          <p style={textStyle}>
            <strong>Monthly to annual (compound):</strong> annual rate = (1 + monthly rate)^12 − 1. Example: 1.5%/month →
            (1.015)^12 − 1 = 19.56%/year.
          </p>
          <p style={textStyle}>
            Avoid simple division (annual ÷ 12) for compound-interest products — it understates the effective monthly cost.
            This calculator accepts both monthly and annual inputs and performs the correct compound conversion automatically.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>When to use each amortization system</h2>
          <p style={textStyle}>
            <strong>Choose SAC</strong> when minimizing total interest is the priority and the borrower can handle higher
            early payments. Ideal for mortgage loans, corporate debt with strong initial cash flow, and any situation where
            the borrower wants to reduce exposure to interest rate risk quickly.
          </p>
          <p style={textStyle}>
            <strong>Choose Price</strong> when predictable monthly payments matter more than total cost. Best for personal
            loans, vehicle financing, and consumer credit where budget certainty is valued over interest savings.
          </p>
          <p style={textStyle}>
            <strong>Choose Gradient</strong> when cash flows are expected to grow over time — revenue-generating projects,
            startup financing, or investments with a ramp-up period. The initial lower payments align with the initial
            lower income phase.
          </p>
          <p style={textStyle}>
            <strong>Choose Bullet</strong> for short-term bridge financing or situations where a specific future event (asset
            sale, bond maturity, IPO) will fund the principal repayment. Never use for consumer lending — the interest-only
            structure can create a false sense of affordability while building significant end-of-term exposure.
          </p>
        </section>

        <p style={disclaimerStyle}>
          <strong>Disclaimer:</strong> Results produced by this calculator are for informational and illustrative purposes
          only. They do not constitute financial, investment, legal, or tax advice. Actual loan terms, rates, and costs will
          vary depending on the lender, jurisdiction, borrower profile, and market conditions. Always review the official loan
          contract and consult a qualified financial professional before making borrowing decisions. Last updated June 2026.
          Sources: Banco Central do Brasil — <em>Manual de Normas — Resolução CMN 4.935/2021</em>; Consumer Financial
          Protection Bureau — <em>What is an amortization schedule?</em> (CFPB, 2024); Brealey, Myers &amp; Allen —
          <em>Principles of Corporate Finance</em>, 14th ed.
        </p>
      </div>
    </>
  )
}
