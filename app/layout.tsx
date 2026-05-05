import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://numrica.com'),
  title: {
    default: 'Free Loan Calculator — Numrica',
    template: '%s — Numrica',
  },
  description: 'Calculate loan payments, total interest, and full amortization schedule instantly. Free loan calculator — no signup, no ads tracking. Just math.',
  keywords: [
    'loan calculator', 'free loan calculator', 'loan payment calculator',
    'amortization calculator', 'interest calculator', 'mortgage calculator',
    'monthly payment calculator', 'loan amortization schedule',
    'debt calculator', 'personal loan calculator', 'auto loan calculator',
    'loan interest calculator online', 'calculate loan repayment',
  ],
  authors: [{ name: 'Numrica', url: 'https://numrica.com' }],
  creator: 'Numrica',
  publisher: 'Numrica',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://numrica.com',
    siteName: 'Numrica',
    title: 'Free Loan Calculator — Numrica',
    description: 'Calculate loan payments and total interest in seconds. Free, no signup required.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Numrica — Free Financial Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Loan Calculator — Numrica',
    description: 'Calculate loan payments and total interest in seconds. Free, no signup required.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://numrica.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
