import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Numrica — Free Financial Calculators',
  description:
    'Numrica is a free financial tools platform built by a team of finance professionals. No signup, no tracking. Just math.',
  alternates: { canonical: 'https://numrica.com/about' },
  openGraph: {
    title: 'About Numrica — Free Financial Calculators',
    description: 'Numrica is built by a team of finance professionals with academic and consulting backgrounds.',
    url: 'https://numrica.com/about',
    type: 'website',
  },
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 40,
}

const h2Style: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#1a1a2e',
  marginBottom: 12,
  marginTop: 0,
  fontFamily: 'Georgia, serif',
}

const pStyle: React.CSSProperties = {
  fontSize: 16,
  color: '#374151',
  lineHeight: 1.75,
  margin: '0 0 16px',
}

const tools = [
  { name: 'Loan Calculator', href: '/', desc: 'Monthly payment, amortization schedule, SAC vs Price comparison.' },
  { name: 'Mortgage Calculator', href: '/mortgage-calculator', desc: 'Full PITI breakdown with PMI, FHA/VA/USDA support, biweekly savings.' },
  { name: 'Compound Interest Calculator', href: '/compound-interest', desc: 'Future value, APY, Rule of 72, inflation-adjusted returns.' },
  { name: 'Debt Payoff Planner', href: '/debt-payoff', desc: 'Avalanche vs snowball comparison with exact payoff date and interest savings.' },
  { name: 'ROI Calculator', href: '/roi-calculator', desc: 'CAGR, S&P 500 benchmark, fee drag, and real returns after inflation.' },
]

export default function AboutPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '52px 24px 80px' }}>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, fontFamily: 'Georgia, serif' }}>
          About Numrica
        </h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 40, fontFamily: 'sans-serif' }}>
          Free financial tools. No signup. No data collection. Just math.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>What Numrica is</h2>
          <p style={pStyle}>
            Numrica is a free financial calculators platform. Every tool on this site — loan calculator, mortgage calculator,
            compound interest calculator, debt payoff planner, and ROI calculator — is free to use, requires no account,
            and collects no personal data. The calculations happen in your browser. Nothing is stored on our servers.
          </p>
          <p style={pStyle}>
            The goal is simple: give anyone access to the same financial math that professionals use, without paywalls,
            registration forms, or upsell flows. Good financial decisions start with accurate numbers, and accurate numbers
            should not cost anything to compute.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Who built it</h2>
          <p style={pStyle}>
            Numrica was built by a team of finance professionals with backgrounds in corporate finance education,
            financial consulting, and M&A advisory. The team has experience training thousands of MBA and executive
            education students, and advising small and mid-sized companies on financial management, controllership,
            and capital structure decisions.
          </p>
          <p style={pStyle}>
            Numrica was built to bring the same rigor applied in the classroom and in client engagements to
            a free, public-facing tool that anyone can use — whether they are evaluating a mortgage, planning debt
            repayment, or modeling an investment return.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>The tools</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tools.map(tool => (
              <li key={tool.href} style={{ borderLeft: '3px solid #22c55e', paddingLeft: 16 }}>
                <Link href={tool.href} style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                  {tool.name}
                </Link>
                <span style={{ fontSize: 14, color: '#6b7280' }}>{tool.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Editorial content</h2>
          <p style={pStyle}>
            The <Link href="/blog" style={{ color: '#22c55e' }}>Numrica blog</Link> publishes in-depth financial education
            articles covering debt repayment strategies, mortgage mechanics, compound interest, credit card costs,
            and investment returns — written from the same analytical perspective applied in academic and consulting work.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Accuracy and methodology</h2>
          <p style={pStyle}>
            All calculators on Numrica use standard financial mathematics — PMT/FV formulas, amortization schedules,
            CAGR, and PITI breakdowns — consistent with how lenders, financial planners, and textbooks compute these
            figures. Results are for educational and planning purposes. They should be verified against lender disclosures
            and reviewed with a qualified financial professional before making financial decisions.
          </p>
        </section>

        <section style={{ ...sectionStyle, background: '#f9fafb', borderRadius: 8, padding: '24px 28px' }}>
          <h2 style={{ ...h2Style, marginBottom: 8 }}>Contact</h2>
          <p style={{ ...pStyle, margin: 0 }}>
            For questions, feedback, or partnership inquiries, email{' '}
            <a href="mailto:hello@numrica.com" style={{ color: '#22c55e', fontWeight: 600 }}>hello@numrica.com</a>.
            For privacy-related requests, see the{' '}
            <Link href="/privacy-policy" style={{ color: '#22c55e' }}>Privacy Policy</Link>.
          </p>
        </section>

      </div>
    </main>
  )
}
