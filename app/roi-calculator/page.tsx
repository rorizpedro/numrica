import type { Metadata } from 'next'
import ROICalculator from './ROICalculator'

export const metadata: Metadata = {
  title: 'Free ROI Calculator — CAGR, S&P 500 Benchmark & Real Returns | Numrica',
  description: 'Calculate your return on investment with CAGR, compare against the S&P 500, factor in fees and inflation, and see your real purchasing power. Free and instant.',
  keywords: [
    'ROI calculator',
    'return on investment calculator',
    'CAGR calculator',
    'investment return calculator',
    'S&P 500 benchmark',
    'real return after inflation',
    'fee drag calculator',
    'annualized return calculator',
  ],
  alternates: { canonical: 'https://numrica.com/roi-calculator' },
  openGraph: {
    title: 'Free ROI Calculator — CAGR, S&P 500 Benchmark & Real Returns — Numrica',
    description: 'Calculate ROI, CAGR, and real returns. Compare your investment against the S&P 500 and see how fees eat into your gains.',
    url: 'https://numrica.com/roi-calculator',
    siteName: 'Numrica',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ROI Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ROI Calculator — CAGR & S&P 500 Benchmark — Numrica',
    description: 'Calculate ROI, CAGR, real returns after inflation, and fee drag. Compare against the S&P 500. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free ROI Calculator',
      url: 'https://numrica.com/roi-calculator',
      description: 'Calculate return on investment (ROI) and CAGR. Compare against the S&P 500, factor in annual fees and inflation, and see your real purchasing power.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'ROI calculation, CAGR calculation, S&P 500 benchmark comparison, Fee drag analysis, Inflation-adjusted real returns, Year-by-year growth table',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is ROI and how is it calculated?', acceptedAnswer: { '@type': 'Answer', text: 'ROI (Return on Investment) measures how much your investment gained or lost relative to its cost. The formula is ROI = (Final Value - Initial Investment) / Initial Investment x 100. A $10,000 investment that grows to $18,500 has an ROI of 85%.' } },
        { '@type': 'Question', name: 'What is CAGR and how is it different from ROI?', acceptedAnswer: { '@type': 'Answer', text: 'CAGR (Compound Annual Growth Rate) is the constant annual rate that would take your investment from its starting value to its ending value. The formula is CAGR = (Final/Initial)^(1/years) - 1. While ROI shows total return, CAGR shows annualized return with compounding.' } },
        { '@type': 'Question', name: 'What is a good ROI or CAGR?', acceptedAnswer: { '@type': 'Answer', text: 'The S&P 500 has returned approximately 10% per year on average (nominal) over the long term — roughly 7% after inflation. A CAGR above 10% means you outperformed the market; below 10% means you underperformed.' } },
        { '@type': 'Question', name: 'What is fee drag and how much does it cost?', acceptedAnswer: { '@type': 'Answer', text: 'Fee drag is the cumulative loss of returns caused by annual management fees. A 1% annual fee on a 20-year investment can reduce the ending balance by 15-20% due to compounding. Passive index funds typically charge 0.03-0.10%.' } },
        { '@type': 'Question', name: 'How does inflation affect real investment returns?', acceptedAnswer: { '@type': 'Answer', text: 'Inflation erodes purchasing power. A nominal return of 8% with 3% inflation yields a real return of about 4.85% (1.08/1.03 - 1). Over 20 years, $46,610 nominal at 3% inflation is worth only $25,800 in today dollars.' } },
        { '@type': 'Question', name: 'What is the difference between nominal and real returns?', acceptedAnswer: { '@type': 'Answer', text: 'Nominal return is the raw percentage gain before adjusting for inflation. Real return shows how much your purchasing power actually increased. If you earned 8% nominally and inflation was 3%, your real return is about 4.85%.' } },
        { '@type': 'Question', name: 'What is opportunity cost in investing?', acceptedAnswer: { '@type': 'Answer', text: 'Opportunity cost is the return you gave up by choosing one investment over another. If your investment returned 6% CAGR while the S&P 500 returned 10% over the same period, your opportunity cost is 4% per year.' } },
      ],
    },
  ],
}

export default function ROICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <main>
        <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
          Free ROI Calculator with CAGR, S&P 500 Benchmark, and Real Returns After Inflation
        </h1>
        <ROICalculator />
      </main>
    </>
  )
}
