import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — Numrica',
  description: 'Contact the Numrica team. For questions, feedback, or partnership inquiries about our free financial calculators.',
  alternates: { canonical: 'https://numrica.com/contact' },
}

export default function ContactPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '52px 24px 80px' }}>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, fontFamily: 'Georgia, serif' }}>
          Contact
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 48, lineHeight: 1.6 }}>
          Numrica is a free financial tools platform. We welcome feedback, questions, and collaboration inquiries.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          <section style={{ borderLeft: '3px solid #22c55e', paddingLeft: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, marginTop: 0 }}>General inquiries</h2>
            <p style={{ fontSize: 15, color: '#374151', margin: '0 0 8px', lineHeight: 1.7 }}>
              For questions about the calculators, editorial content, or anything else:
            </p>
            <a href="mailto:hello@numrica.com" style={{ fontSize: 15, color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
              hello@numrica.com
            </a>
          </section>

          <section style={{ borderLeft: '3px solid #22c55e', paddingLeft: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, marginTop: 0 }}>Privacy and data requests</h2>
            <p style={{ fontSize: 15, color: '#374151', margin: '0 0 8px', lineHeight: 1.7 }}>
              For questions about data collection, cookies, or to exercise your privacy rights under GDPR or CCPA:
            </p>
            <a href="mailto:privacy@numrica.com" style={{ fontSize: 15, color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
              privacy@numrica.com
            </a>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: '8px 0 0', lineHeight: 1.6 }}>
              See the full <Link href="/privacy-policy" style={{ color: '#22c55e' }}>Privacy Policy</Link> for details on data practices.
            </p>
          </section>

          <section style={{ borderLeft: '3px solid #22c55e', paddingLeft: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, marginTop: 0 }}>Partnership and media</h2>
            <p style={{ fontSize: 15, color: '#374151', margin: '0 0 8px', lineHeight: 1.7 }}>
              For guest post collaborations, editorial partnerships, or press inquiries:
            </p>
            <a href="mailto:hello@numrica.com" style={{ fontSize: 15, color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
              hello@numrica.com
            </a>
          </section>

          <section style={{ background: '#f9fafb', borderRadius: 8, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, marginTop: 0 }}>About the team</h2>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 }}>
              Numrica was built by Pedro Roriz, a corporate finance professor at IPOG and founder of TAG Business Solutions
              — a financial BPO firm operating in Brazil and Portugal.{' '}
              <Link href="/about" style={{ color: '#22c55e' }}>Learn more about Numrica →</Link>
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
