import { Metadata } from 'next'
import ROICalculator from './ROICalculator'

export const metadata: Metadata = {
  title: 'Free ROI Calculator — CAGR, S&P 500 Benchmark & Real Returns | Numrica',
  description:
    'Calculate your return on investment with CAGR, compare against the S&P 500, factor in fees and inflation, and see your real purchasing power. Free and instant.',
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
  openGraph: {
    title: 'Free ROI Calculator — CAGR, S&P 500 Benchmark & Real Returns',
    description:
      'Calculate ROI, CAGR, and real returns. Compare your investment against the S&P 500 and see how fees eat into your gains.',
    url: 'https://numrica.com/roi-calculator',
    siteName: 'Numrica',
    type: 'website',
  },
  alternates: {
    canonical: 'https://numrica.com/roi-calculator',
  },
}

export default function ROICalculatorPage() {
  return (
    <main>
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        Free ROI Calculator with CAGR, S&P 500 Benchmark, and Real Returns After Inflation
      </h1>
      <ROICalculator />
    </main>
  )
}
