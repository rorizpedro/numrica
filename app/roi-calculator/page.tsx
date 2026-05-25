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

const textStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }
const sectionStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }

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
      <div style={sectionStyle}>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>ROI vs CAGR: which number actually matters</h2>
          <p style={textStyle}>
            ROI (Return on Investment) measures total gain as a percentage of the initial investment: a $10,000 investment that
            grows to $18,500 has an ROI of 85%. But ROI says nothing about how long the investment took, which makes it useless
            for comparing investments held over different time periods. A 100% ROI over 20 years is far less impressive than a
            100% ROI over 3 years.
          </p>
          <p style={textStyle}>
            CAGR (Compound Annual Growth Rate) solves this by expressing the return as an annualized rate: <strong>(Final/Initial)^(1/years) − 1</strong>.
            The 85% ROI over 7 years becomes a CAGR of 9.2% — which can then be meaningfully compared to other investments,
            to the S&P 500 historical average (~10%), or to inflation. CAGR is the standard metric professionals use to evaluate
            and compare investment performance.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Fee drag: the cost you don't see on the statement</h2>
          <p style={textStyle}>
            Annual management fees compound against you the same way returns compound for you. A 1% annual fee sounds trivial —
            but on a $100,000 portfolio earning 8% over 25 years, the difference between 0.1% fees and 1% fees is approximately
            $80,000 in lost terminal value. That is money that compounds away from your portfolio and into the fund manager&#39;s
            revenue, every year, automatically.
          </p>
          <p style={textStyle}>
            Passive index funds typically charge 0.03%–0.10% annually. Actively managed funds charge 0.5%–2% or more.
            This calculator isolates fee drag so you can see exactly what your investment cost structure is reducing from your
            final balance.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Real returns: what your money actually buys</h2>
          <p style={textStyle}>
            Nominal returns — what your brokerage statement shows — do not account for inflation. A 7% nominal return during a
            period of 3% inflation leaves you with approximately 3.9% in real purchasing power gain. Over long periods, the
            difference between nominal and real is substantial: $100,000 growing nominally to $761,000 over 30 years at 7%
            is worth only about $313,000 in today&#39;s purchasing power at 3% average inflation. This calculator shows both
            nominal and inflation-adjusted outcomes so you can evaluate your investment in real terms.
          </p>
        </section>
      </div>
    </>
  )
}
