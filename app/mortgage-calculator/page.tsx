import type { Metadata } from 'next'
import MortgageCalculator from './MortgageCalculator'

export const metadata: Metadata = {
  title: 'Free Mortgage Calculator with PMI and Taxes',
  description: 'Calculate your full PITI mortgage payment — principal, interest, property taxes, homeowners insurance, and PMI. Supports FHA, VA, USDA, and conventional loans with biweekly savings and extra payment analysis.',
  keywords: [
    'PITI calculator', 'mortgage calculator with PMI and taxes',
    'FHA mortgage calculator', 'VA mortgage calculator', 'USDA mortgage calculator',
    'biweekly mortgage calculator', 'mortgage amortization calculator',
    'mortgage payment calculator', 'PMI calculator', 'free mortgage calculator',
    'mortgage calculator with taxes and insurance',
  ],
  alternates: { canonical: 'https://numrica.com/mortgage-calculator' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com/mortgage-calculator',
    siteName: 'Numrica',
    title: 'Free Mortgage Calculator with PMI and Taxes — Numrica',
    description: 'Calculate your full PITI mortgage payment. Supports FHA, VA, USDA, conventional. Biweekly savings, extra payment slider, PMI cancellation date.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mortgage Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Calculator with PMI and Taxes — Numrica',
    description: 'Full PITI calculation with biweekly savings, PMI cancellation date, and income qualifier. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free Mortgage Calculator',
      url: 'https://numrica.com/mortgage-calculator',
      description: 'Calculate your full PITI mortgage payment including principal, interest, property taxes, homeowners insurance, and PMI. Supports FHA, VA, USDA, and conventional loans.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'PITI payment breakdown, FHA/VA/USDA/Conventional loan types, PMI calculation, Biweekly payment savings, Extra payment slider, Amortization table, Income qualifier, CSV export, Excel export',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is PITI in a mortgage payment?', acceptedAnswer: { '@type': 'Answer', text: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a complete monthly mortgage payment. Principal reduces your loan balance. Interest is the cost of borrowing. Taxes are your property taxes collected monthly in escrow. Insurance covers homeowners insurance plus PMI or MIP if applicable.' } },
        { '@type': 'Question', name: 'How is a monthly mortgage payment calculated?', acceptedAnswer: { '@type': 'Answer', text: 'The principal and interest portion uses the PMT formula: M = P x [r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly interest rate (annual / 12), and n is the number of monthly payments. Property taxes, insurance, PMI, and HOA are then added to reach the full PITI payment.' } },
        { '@type': 'Question', name: 'What is PMI and when can I remove it?', acceptedAnswer: { '@type': 'Answer', text: 'Private Mortgage Insurance (PMI) is required on conventional loans when your down payment is below 20% (LTV above 80%). PMI typically costs 0.5%-1.5% of the loan annually. PMI cancels automatically once your loan balance reaches 80% of the original home value.' } },
        { '@type': 'Question', name: 'How do biweekly mortgage payments save money?', acceptedAnswer: { '@type': 'Answer', text: 'Biweekly payments result in 26 half-payments per year — equivalent to 13 full monthly payments. That extra annual payment goes entirely to principal, reducing your balance faster. On a $400,000 30-year loan at 7%, this can save over $50,000 in interest.' } },
        { '@type': 'Question', name: 'What income do I need to qualify for this mortgage?', acceptedAnswer: { '@type': 'Answer', text: 'Lenders use the 28% front-end rule: your monthly PITI should not exceed 28% of your gross monthly income. If your PITI is $2,800/month, you need at least $10,000/month ($120,000/year) gross income.' } },
        { '@type': 'Question', name: 'What is the difference between FHA, VA, USDA, and conventional loans?', acceptedAnswer: { '@type': 'Answer', text: 'Conventional loans require PMI with down payments below 20%. FHA loans allow 3.5% down but require MIP. VA loans serve veterans with no down payment or monthly insurance. USDA loans cover rural areas with zero down payment.' } },
        { '@type': 'Question', name: 'Should I choose a 15-year or 30-year mortgage?', acceptedAnswer: { '@type': 'Answer', text: 'A 30-year mortgage has lower monthly payments but costs more in total interest. A 15-year mortgage builds equity faster and saves tens of thousands in interest, but payments are roughly 40-50% higher.' } },
        { '@type': 'Question', name: 'How does extra principal payment reduce my mortgage?', acceptedAnswer: { '@type': 'Answer', text: 'Extra payments go directly to reducing principal. Even $100-$200 extra per month can save $20,000-$40,000 in interest on a typical 30-year mortgage and shorten payoff by 3-5 years.' } },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate Your Mortgage Payment',
      description: 'Calculate your full PITI mortgage payment including taxes, insurance, and PMI.',
      step: [
        { '@type': 'HowToStep', name: 'Enter home price and down payment', text: 'Input the home purchase price and your down payment amount or percentage.' },
        { '@type': 'HowToStep', name: 'Set interest rate and loan term', text: 'Enter the annual interest rate and choose your loan term (15, 20, or 30 years).' },
        { '@type': 'HowToStep', name: 'Select loan type', text: 'Choose between Conventional, FHA, VA, or USDA to get accurate PMI/MIP calculations.' },
        { '@type': 'HowToStep', name: 'Add taxes and insurance', text: 'Optionally add property tax rate, homeowners insurance, and HOA fees for a complete PITI breakdown.' },
        { '@type': 'HowToStep', name: 'Review your payment', text: 'See your full PITI payment, PMI cancellation date, amortization schedule, and biweekly savings.' },
      ],
    },
  ],
}

const textStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }
const sectionStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <MortgageCalculator />
      <div style={sectionStyle}>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>What PITI means and why it matters</h2>
          <p style={textStyle}>
            PITI stands for <strong>Principal, Interest, Taxes, and Insurance</strong> — the four components of a complete monthly
            mortgage payment. Most calculators show only principal and interest. Numrica includes all four because lenders qualify
            borrowers on the full PITI payment, not just the loan portion. A $400,000 home at 7% for 30 years has a principal and
            interest payment of $2,661 — but with property taxes, homeowners insurance, and PMI, the real monthly cost is often
            $3,200–$3,600.
          </p>
          <p style={textStyle}>
            The standard lender qualification rule is the 28% front-end ratio: your total monthly PITI should not exceed 28% of gross
            monthly income. If your PITI is $3,000, lenders expect at least $10,700/month ($128,000/year) in gross income. This
            calculator shows the income you need to qualify alongside the payment breakdown.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>PMI: what it is and when it cancels</h2>
          <p style={textStyle}>
            Private Mortgage Insurance (PMI) is required on conventional loans when the down payment is below 20% — meaning the
            loan-to-value (LTV) ratio exceeds 80%. PMI protects the lender, not the borrower, and typically costs 0.5%–1.5% of the
            loan balance annually, added to your monthly payment. On a $350,000 loan, that is $1,750–$5,250 per year.
          </p>
          <p style={textStyle}>
            PMI cancels automatically once your loan balance reaches 80% of the original appraised home value — either through
            regular amortization or extra principal payments. This calculator shows the exact month when PMI cancels, which is one
            of the most useful outputs for planning extra payments. An extra $200/month on a typical 30-year mortgage can eliminate
            PMI 3–5 years earlier.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Biweekly payments: how they work</h2>
          <p style={textStyle}>
            Switching from monthly to biweekly payments results in 26 half-payments per year — equivalent to 13 full monthly
            payments instead of 12. That extra annual payment goes entirely to principal reduction. On a $400,000 30-year loan at
            7%, biweekly payments eliminate about 4.5 years of payments and save over $50,000 in interest. The calculator shows
            this comparison side by side so you can see the exact savings for your loan parameters.
          </p>
        </section>
      </div>
    </>
  )
}
