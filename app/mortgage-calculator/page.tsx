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

export default function Page() {
  return <MortgageCalculator />
}
