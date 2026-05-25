import type { Metadata } from 'next'
import Calculator from '@/app/components/Calculator'

export const metadata: Metadata = {
  title: 'Free Loan Calculator — Monthly Payment & Amortization Schedule',
  description: 'Calculate your monthly loan payment, total interest, and full amortization schedule instantly. Supports SAC, Price/PMT systems, grace periods, and multiple currencies. Free, no signup.',
  keywords: [
    'loan calculator', 'free loan calculator', 'loan payment calculator',
    'amortization calculator', 'monthly payment calculator',
    'loan amortization schedule', 'calculate loan repayment',
    'personal loan calculator', 'auto loan calculator', 'debt calculator',
    'SAC calculator', 'PMT calculator',
  ],
  alternates: { canonical: 'https://numrica.com' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com',
    siteName: 'Numrica',
    title: 'Free Loan Calculator — Numrica',
    description: 'Monthly payment, total interest, and full amortization schedule. Free, no signup.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Loan Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Loan Calculator — Numrica',
    description: 'Monthly payment, total interest, and full amortization schedule. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free Loan Calculator',
      url: 'https://numrica.com',
      description: 'Calculate monthly loan payments, total interest paid, and full amortization schedule. Supports fixed-rate loans, SAC vs Price systems, grace periods, and multiple currencies.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'Monthly payment calculation, Amortization schedule, SAC vs Price comparison, Grace period support, Multiple currencies, CSV export, Excel export, URL sharing',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is a loan calculator?', acceptedAnswer: { '@type': 'Answer', text: 'A loan calculator is a tool that computes your monthly loan payment, total interest paid, and full amortization schedule based on three inputs: loan amount (principal), interest rate, and loan term. It uses the standard PMT (Payment) formula to give you exact figures before you sign any agreement.' } },
        { '@type': 'Question', name: 'How is a monthly loan payment calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Monthly payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the principal, r is the monthly interest rate (annual rate ÷ 12), and n is the number of monthly payments. This formula assumes a fixed-rate, fully amortizing loan with equal payments throughout the term.' } },
        { '@type': 'Question', name: 'What is an amortization schedule?', acceptedAnswer: { '@type': 'Answer', text: 'An amortization schedule is a complete table of every loan payment, showing how each installment splits between principal repayment and interest. Early payments are mostly interest; later payments are mostly principal. The schedule also shows the remaining balance after each payment.' } },
        { '@type': 'Question', name: 'What is the difference between interest rate and APR?', acceptedAnswer: { '@type': 'Answer', text: 'The interest rate is the cost of borrowing the principal, expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus any fees, points, or other costs — making it a broader measure of the true annual cost of a loan. Always compare APRs when evaluating loan offers.' } },
        { '@type': 'Question', name: 'How do I reduce the total interest I pay on a loan?', acceptedAnswer: { '@type': 'Answer', text: 'Four strategies reduce total loan interest: (1) make a larger down payment to reduce the principal; (2) choose a shorter loan term; (3) negotiate a lower interest rate; (4) make extra principal payments when possible.' } },
        { '@type': 'Question', name: 'What is the SAC vs. Price (constant installment) difference?', acceptedAnswer: { '@type': 'Answer', text: 'SAC (Constant Amortization) keeps the principal portion the same each month, so installments decrease over time — total interest is lower. Price (Constant Installment) keeps the payment the same every month, which simplifies budgeting but results in higher total interest.' } },
        { '@type': 'Question', name: 'Is this loan calculator free?', acceptedAnswer: { '@type': 'Answer', text: "Yes. Numrica's loan calculator is completely free. No account required, no personal data collected, no hidden fees." } },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate a Loan Payment',
      description: 'Calculate your monthly loan payment and total interest using this free online loan calculator.',
      step: [
        { '@type': 'HowToStep', name: 'Enter loan amount', text: 'Type the total amount you plan to borrow in the Loan Amount field.' },
        { '@type': 'HowToStep', name: 'Enter interest rate', text: 'Enter the annual interest rate as a percentage (e.g., 6.5 for 6.5%).' },
        { '@type': 'HowToStep', name: 'Set loan term', text: 'Choose the loan term in months or years (e.g., 60 months for a 5-year loan).' },
        { '@type': 'HowToStep', name: 'Review results', text: 'Instantly see your monthly payment, total interest paid, and full amortization schedule.' },
      ],
    },
  ],
}

const textStyle: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.75, margin: '0 0 14px' }
const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 10px', fontFamily: 'Georgia, serif' }
const sectionStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Calculator />
      <div style={sectionStyle}>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>How loan payment is calculated</h2>
          <p style={textStyle}>
            A loan payment is computed using the PMT (payment) formula: <strong>P × [r(1+r)^n] / [(1+r)^n − 1]</strong>, where P is the
            principal borrowed, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments.
            This formula assumes a fixed-rate, fully amortizing loan — meaning every payment is equal and the balance reaches exactly
            zero on the final payment date.
          </p>
          <p style={textStyle}>
            The key insight from the amortization schedule is that early payments are mostly interest. On a $20,000 loan at 7% over
            48 months, the first payment of $479 includes $117 in interest and only $362 in principal. By the final payment,
            that same $479 is almost entirely principal. This shift is automatic — it is how amortization works, and it is why paying
            extra in the early months saves disproportionately more interest than paying extra later.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>SAC vs Price (constant installment) — which to choose</h2>
          <p style={textStyle}>
            The SAC system (Constant Amortization) keeps the principal reduction constant each month, so payments start high and
            decrease over time as the balance falls. The Price system (also called PMT or constant installment) keeps payments equal
            throughout — the principal portion grows and the interest portion shrinks with each payment, but the total stays the same.
          </p>
          <p style={textStyle}>
            SAC results in less total interest paid because the balance decreases faster in the early months — but the higher initial
            payments require more budget flexibility. Price offers payment predictability and lower initial payments at the cost of more
            total interest. Which is better depends on your cash flow situation and how long you plan to hold the loan.
          </p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>How to use this calculator</h2>
          <p style={textStyle}>
            Enter the loan amount, annual interest rate, and term in months. The calculator outputs your monthly payment, total
            interest paid over the life of the loan, and a full amortization schedule showing the balance after each payment.
            You can toggle between SAC and Price systems, add a grace period, and export the schedule as CSV or Excel.
          </p>
          <p style={textStyle}>
            Results are for educational and planning purposes. Actual loan terms — including any origination fees, prepayment
            penalties, or rate adjustments — affect the true cost of borrowing. Always compare APR (which includes fees) across
            lenders, not just the nominal interest rate.
          </p>
        </section>
      </div>
    </>
  )
}
