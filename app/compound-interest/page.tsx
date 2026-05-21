import type { Metadata } from 'next'
import CompoundInterestCalculator from './CompoundInterestCalculator'

export const metadata: Metadata = {
  title: 'Free Compound Interest Calculator with Monthly Contributions',
  description: 'Calculate how your money grows with compound interest and monthly contributions. See future value, APY, Rule of 72, inflation-adjusted returns, and annual growth schedule. Free, no signup.',
  keywords: [
    'compound interest calculator',
    'compound interest calculator with monthly contributions',
    'compound interest calculator with inflation',
    'monthly compound interest calculator',
    'investment growth calculator',
    'savings growth calculator',
    'compound interest formula calculator',
    'rule of 72 calculator',
    'CAGR calculator',
    'future value calculator',
    'how much will my investment grow',
  ],
  alternates: { canonical: 'https://numrica.com/compound-interest' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com/compound-interest',
    siteName: 'Numrica',
    title: 'Free Compound Interest Calculator with Monthly Contributions — Numrica',
    description: 'See how your money grows with compound interest. Includes monthly contributions, inflation adjustment, Rule of 72, APY, and annual growth schedule.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Compound Interest Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Compound Interest Calculator with Monthly Contributions — Numrica',
    description: 'Future value, APY, Rule of 72, inflation adjustment, goal reverse mode. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free Compound Interest Calculator',
      url: 'https://numrica.com/compound-interest',
      description: 'Calculate how money grows with compound interest and regular monthly contributions. Shows future value, APY, Rule of 72, inflation-adjusted returns, and year-by-year growth schedule.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'Future value calculation, APY calculation, Rule of 72, Inflation adjustment, Monthly contributions, Goal reverse mode, Compounding frequency selector, Annual growth schedule, CSV export, Excel export',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is compound interest?', acceptedAnswer: { '@type': 'Answer', text: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest — which only earns on the original principal — compound interest causes money to grow exponentially over time.' } },
        { '@type': 'Question', name: 'How is compound interest calculated?', acceptedAnswer: { '@type': 'Answer', text: 'The formula is FV = P(1 + r/n)^(nt), where P is the principal, r is the annual rate, n is the number of compounding periods per year, and t is the time in years. With monthly contributions, the formula adds PMT x [(1+r/n)^(nt) - 1] / (r/n).' } },
        { '@type': 'Question', name: 'What is the Rule of 72?', acceptedAnswer: { '@type': 'Answer', text: 'The Rule of 72 estimates how many years it takes to double your money: divide 72 by the annual interest rate. At 6%, money doubles in about 12 years. At 9%, about 8 years. It is accurate to within 1% for rates between 2% and 15%.' } },
        { '@type': 'Question', name: 'What is APY and how is it different from APR?', acceptedAnswer: { '@type': 'Answer', text: 'APR is the nominal annual rate before compounding. APY is the effective annual return after compounding. If your APR is 6% compounded monthly, your APY is (1 + 0.06/12)^12 - 1 = 6.168%. The more frequently interest compounds, the higher the APY relative to APR.' } },
        { '@type': 'Question', name: 'How much do monthly contributions matter?', acceptedAnswer: { '@type': 'Answer', text: '$10,000 invested at 7% for 30 years grows to $76,123 with no contributions. Add $500/month and the result is $613,543 — 8x more. The extra $174,000 in contributions earned $363,420 in compound interest.' } },
        { '@type': 'Question', name: 'How does starting earlier affect compound interest?', acceptedAnswer: { '@type': 'Answer', text: '$5,000 invested at 25 with 7% annual growth reaches $106,000 by age 65 with no additional contributions. Waiting until 35 gives only $52,000. That 10-year head start more than doubles the outcome.' } },
        { '@type': 'Question', name: 'What is the difference between compound and simple interest?', acceptedAnswer: { '@type': 'Answer', text: 'Simple interest only earns on the original principal: $10,000 at 7% for 30 years = $31,000. Compound interest earns on principal plus accumulated interest: the same inputs grow to $76,123 monthly compounded — 2.5x more.' } },
        { '@type': 'Question', name: 'How does inflation affect investment returns?', acceptedAnswer: { '@type': 'Answer', text: 'Inflation erodes purchasing power. If your investment grows 7% but inflation runs at 3%, your real return is about 3.88%. Over 30 years at 3% inflation, $154,000 nominal is equivalent to about $63,000 in today purchasing power.' } },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate Compound Interest',
      description: 'Calculate how your investment grows with compound interest and monthly contributions.',
      step: [
        { '@type': 'HowToStep', name: 'Enter your initial investment', text: 'Input the starting principal amount you are investing.' },
        { '@type': 'HowToStep', name: 'Set the interest rate', text: 'Enter the annual interest rate or expected return percentage.' },
        { '@type': 'HowToStep', name: 'Choose compounding frequency', text: 'Select how often interest compounds: daily, monthly, quarterly, or annually.' },
        { '@type': 'HowToStep', name: 'Add monthly contributions', text: 'Optionally enter a monthly contribution amount to see how regular deposits accelerate growth.' },
        { '@type': 'HowToStep', name: 'Review results', text: 'See future value, total contributions, total interest earned, APY, Rule of 72, and year-by-year growth schedule.' },
      ],
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <CompoundInterestCalculator />
    </>
  )
}
