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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Calculator />
    </>
  )
}
