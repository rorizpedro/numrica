import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for Numrica free financial calculators. Read our terms before using the site.',
  alternates: { canonical: 'https://numrica.com/terms' },
  robots: { index: true, follow: false },
}

const prose: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2: React.CSSProperties = { fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '28px 0 8px', fontFamily: 'Georgia, serif' }
const wrap: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px', fontFamily: 'Georgia, serif' }
const meta: React.CSSProperties = { fontSize: 13, color: '#9ca3af', margin: '0 0 36px' }

export default function TermsPage() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Terms of Use</h1>
      <p style={meta}>Last updated: June 12, 2026 · Operated by Numrica / Petra4 Infinite Solutions Ltda (CNPJ 63.118.008/0001-77)</p>

      <p style={prose}>
        By accessing or using any calculator, tool, or content on <strong>numrica.com</strong> (the "Site"), you agree to
        these Terms of Use. If you do not agree, please do not use the Site.
      </p>

      <h2 style={h2}>1. Nature of the service</h2>
      <p style={prose}>
        Numrica provides free, browser-based financial calculators for informational and educational purposes only. All
        calculations are performed locally in your browser — no data is sent to our servers. Results are illustrative
        estimates and do not constitute financial, investment, tax, or legal advice.
      </p>

      <h2 style={h2}>2. No financial advice</h2>
      <p style={prose}>
        The tools on this Site are not a substitute for advice from a qualified financial professional. Numrica makes no
        representations as to the accuracy, completeness, or fitness for any particular purpose of the results generated.
        Always verify calculations independently and consult a licensed advisor before making financial decisions.
      </p>

      <h2 style={h2}>3. Disclaimer of warranties</h2>
      <p style={prose}>
        The Site is provided "as is" and "as available" without warranties of any kind, express or implied, including but
        not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not
        warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
      </p>

      <h2 style={h2}>4. Limitation of liability</h2>
      <p style={prose}>
        To the fullest extent permitted by applicable law, Numrica and its operators shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising from your use of the Site or reliance on any
        information or results provided, even if we have been advised of the possibility of such damages.
      </p>

      <h2 style={h2}>5. Intellectual property</h2>
      <p style={prose}>
        All content on this Site — including calculator logic, editorial text, and design — is owned by or licensed to
        Numrica. You may use the Site for personal, non-commercial purposes. You may not reproduce, distribute, or create
        derivative works without prior written permission.
      </p>

      <h2 style={h2}>6. Third-party services</h2>
      <p style={prose}>
        The Site uses Google Analytics for anonymous traffic analytics and Google AdSense for advertising. These services
        may set cookies on your device. Numrica does not sell your personal data. See our{' '}
        <Link href="/privacy-policy" style={{ color: '#22c55e' }}>Privacy Policy</Link> for details.
      </p>

      <h2 style={h2}>7. Changes to these terms</h2>
      <p style={prose}>
        We may update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance
        of the updated Terms. The date at the top of this page reflects the most recent revision.
      </p>

      <h2 style={h2}>8. Governing law</h2>
      <p style={prose}>
        These Terms are governed by the laws of Brazil (Lei nº 13.709/2018 — LGPD; Lei nº 8.078/1990 — CDC), without
        regard to conflict of law provisions. Any disputes shall be resolved in the courts of Goiânia, Goiás, Brazil.
      </p>

      <h2 style={h2}>9. Contact</h2>
      <p style={prose}>
        Questions about these Terms may be directed to <a href="mailto:hello@numrica.com" style={{ color: '#22c55e' }}>hello@numrica.com</a>.
      </p>
    </div>
  )
}
