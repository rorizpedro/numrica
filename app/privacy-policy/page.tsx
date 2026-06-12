import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Numrica',
  description: 'Privacy policy for Numrica.com — free financial tools.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://numrica.com/privacy-policy' },
}

export default function PrivacyPolicy() {
  const updated = 'May 21, 2026'

  return (
    <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Numrica logo" width={26} height={30} />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>numrica</span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '52px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 40 }}>Last updated: {updated}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>1. Overview</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              Numrica (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates numrica.com, a free financial tools website.
              This policy explains what data we collect, how it is used, and your rights regarding that data.
              By using numrica.com, you agree to the terms of this policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>2. Information we collect</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, marginBottom: 12 }}>
              Numrica does not require account creation or collect personally identifiable information directly.
              However, the following data may be collected automatically:
            </p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {[
                'Usage data — pages visited, time on site, referring URLs, and browser type, collected via Google Analytics (if active).',
                'Device and log data — IP address, browser version, operating system, and approximate location derived from IP.',
                'Advertising data — Google AdSense may use cookies and web beacons to serve personalized ads based on your browsing activity across websites. See section 5 for details.',
              ].map(item => (
                <li key={item} style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>3. How we use your information</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, marginBottom: 12 }}>
              Data collected is used exclusively to:
            </p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {[
                'Operate and improve numrica.com.',
                'Analyze traffic patterns and user behavior to enhance the tools we provide.',
                'Serve relevant advertisements through Google AdSense.',
              ].map(item => (
                <li key={item} style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>4. Cookies</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              We use cookies to support site analytics and advertising functionality. You can control cookie
              preferences through your browser settings. Disabling cookies may affect the display of
              advertisements on the site but will not affect the functionality of the financial tools.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>5. Google AdSense</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, marginBottom: 12 }}>
              Numrica uses Google AdSense to display advertisements. Google may use cookies (including the
              DoubleClick cookie) to serve ads based on your prior visits to this or other websites.
            </p>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              You may opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e' }}>
                Google Ads Settings
              </a>
              . For more information on how Google uses data, see{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e' }}>
                Google&apos;s Privacy & Terms
              </a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>6. Third-party links</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              numrica.com may contain links to third-party websites. We are not responsible for the privacy
              practices or content of those sites and encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>7. Data retention</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              Numrica does not store personal data on its own servers. Any data retained by third-party
              services (Google Analytics, Google AdSense) is governed by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>8. Children&apos;s privacy</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              numrica.com is not directed to children under the age of 13. We do not knowingly collect
              personal information from children. If you believe a child has provided personal information
              through our site, please contact us and we will promptly remove it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>9. Your rights</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              Depending on your jurisdiction, you may have rights to access, correct, or delete personal
              data processed about you. To exercise any such rights, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>10. Changes to this policy</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              We may update this policy from time to time. Changes will be posted on this page with an
              updated date. Continued use of numrica.com after changes constitutes acceptance of the
              revised policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>11. Legal entity and jurisdiction</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              Numrica is a brand operated by <strong>Petra4 Infinite Solutions Ltda</strong> (CNPJ 63.118.008/0001-77),
              registered in Goiânia, Goiás, Brazil. This policy is governed by the laws of Brazil, including the
              Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). EU residents may also have rights under
              the General Data Protection Regulation (GDPR — Regulation 2016/679).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>12. Contact</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.75, margin: 0 }}>
              For questions about this policy, contact us at{' '}
              <a href="mailto:hello@numrica.com" style={{ color: '#22c55e' }}>hello@numrica.com</a>.
            </p>
          </section>

        </div>
      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>← Back to numrica.com</Link>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} Numrica</span>
        </div>
      </footer>
    </div>
  )
}
