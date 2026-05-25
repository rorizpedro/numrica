import type { Metadata } from 'next'
import './globals.css'
import ToolNav from '@/app/components/ToolNav'
import EmbedController from '@/app/components/EmbedController'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'

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
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1573463799478833"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ margin: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://numrica.com/#website',
                  url: 'https://numrica.com',
                  name: 'Numrica',
                  description: 'Free financial calculators — loan, mortgage, compound interest, ROI, and debt payoff. No signup, no tracking. Just math.',
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://numrica.com/#organization',
                  name: 'Numrica',
                  url: 'https://numrica.com',
                  logo: { '@type': 'ImageObject', url: 'https://numrica.com/logo.svg' },
                  contactPoint: { '@type': 'ContactPoint', email: 'hello@numrica.com', contactType: 'customer support' },
                  founder: {
                    '@type': 'Person',
                    name: 'Pedro Roriz',
                    url: 'https://pedrororiz.com',
                    jobTitle: 'Professor of Corporate Finance',
                    worksFor: [
                      { '@type': 'Organization', name: 'IPOG' },
                      { '@type': 'Organization', name: 'TAG Business Solutions' },
                    ],
                  },
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <header style={{ background: '#fff' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Numrica logo" width={26} height={30} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>numrica</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.2px' }}>
              Free tools. No signup.{' '}
              <span style={{ color: '#22c55e' }}>Just math.</span>
            </span>
          </div>
        </header>
        <EmbedController />
        <ToolNav />
        {children}
        <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', marginTop: 40 }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <Link href="/about" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>About</Link>
              <Link href="/blog" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Blog</Link>
              <Link href="/contact" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Contact</Link>
              <Link href="/privacy-policy" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</Link>
            </nav>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} Numrica</span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
