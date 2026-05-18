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

export default function Page() {
  return <CompoundInterestCalculator />
}
