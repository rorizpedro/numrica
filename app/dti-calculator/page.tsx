import type { Metadata } from 'next'
import Link from 'next/link'
import DtiCalculator from './DtiCalculator'
import { analyze, fmtMoney, fmtPct, type DtiResult } from '@/app/lib/dti'

export const metadata: Metadata = {
  title: 'Free DTI Calculator: Front-End and Back-End Debt-to-Income Ratio',
  description:
    'Calculate your front-end and back-end debt-to-income ratio, see how much more monthly debt fits under common reference points, and find the largest housing payment for your income. Free, no signup.',
  keywords: [
    'DTI calculator',
    'debt to income ratio calculator',
    'front-end ratio calculator',
    'back-end ratio calculator',
    'mortgage DTI calculator',
    '28/36 rule calculator',
    'how much house can I afford DTI',
    'what is a good debt to income ratio',
    'free DTI calculator',
  ],
  alternates: { canonical: 'https://numrica.com/dti-calculator' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com/dti-calculator',
    siteName: 'Numrica',
    title: 'Free DTI Calculator: Front-End and Back-End Ratio — Numrica',
    description: 'Front-end and back-end debt-to-income ratio, room for more debt, and the largest housing payment for your income.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DTI Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free DTI Calculator — Numrica',
    description: 'See both debt-to-income ratios and how much more debt fits. Free, no signup.',
    images: ['/og-image.png'],
  },
}

// ─── Worked examples: every number below comes from the same functions as the calculator ───
const A = analyze({ incomes: [6000], housing: 1500, debts: { car: 350, student: 250 } })
const B = analyze({ incomes: [5000], housing: 1700, debts: { cards: 300, car: 450, student: 200 } })
const BnoCar = analyze({ incomes: [5000], housing: 1700, debts: { cards: 300, student: 200 } })
const BnoCard = analyze({ incomes: [5000], housing: 1700, debts: { car: 450, student: 200 } })
const BnoBoth = analyze({ incomes: [5000], housing: 1700, debts: { student: 200 } })
const C = analyze({ incomes: [8000], housing: 0, debts: { car: 500, student: 400 } })

const room = (r: DtiResult, ceiling: number) => r.debtRoom.find((x) => x.ceiling === ceiling)!

const SOURCES = [
  {
    name: 'Fannie Mae Selling Guide, B3-6-02 Debt-to-Income Ratios (page version dated 04/02/2025)',
    url: 'https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios',
    supports: 'manual underwriting limits (36%, up to 45%) and the Desktop Underwriter limit (50%).',
  },
  {
    name: 'HUD FHA Resource Center: maximum qualifying ratios for manually underwritten loans',
    url: 'https://answers.hud.gov/FHA/s/article/What-are-the-maximum-qualifying-ratio-requirements-for-manually-underwritten-loans',
    supports: 'the 31/43 base ratios and higher ratios with compensating factors.',
  },
  {
    name: 'eCFR, 38 CFR 36.4340 (VA underwriting standards)',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-36/subpart-B/section-36.4340',
    supports: "DTI and residual income as VA's two primary standards.",
  },
  {
    name: 'Code of Federal Regulations 2009, 38 CFR 36.4337 (govinfo.gov)',
    url: 'https://www.govinfo.gov/content/pkg/CFR-2009-title38-vol2/pdf/CFR-2009-title38-vol2-sec36-4337.pdf',
    supports: 'the 41% reference point and residual-income exception, as published in 2009.',
  },
  {
    name: 'USDA Rural Development, Single Family Housing Guaranteed Loan Program fact sheet (April 2024)',
    url: 'https://www.rd.usda.gov/sites/default/files/usda-rd-fs-rhs-sfhglp-04262024.pdf',
    supports: 'the total-debt cap and the separate housing-payment cap.',
  },
  {
    name: 'CFPB, General QM final rule (December 2020)',
    url: 'https://files.consumerfinance.gov/f/documents/cfpb_atr-qm-general-qm-final-rule_2020-12.pdf',
    supports: 'the 43% DTI cap replaced by a price-based test.',
  },
]

const FAQ = [
  {
    q: 'What is a good debt-to-income ratio?',
    a: 'There is no single number. As a rule of thumb, a front-end ratio at or below 28% and a back-end ratio at or below 36% sit inside the classic 28/36 benchmark. Many lenders approve higher ratios for some loan types and borrower profiles, so treat 36% as a reference point, not a pass mark.',
  },
  {
    q: 'Is DTI calculated on gross or net income?',
    a: 'Gross income, which is your income before taxes and payroll deductions. Lenders verify it with pay stubs, tax returns and bank records.',
  },
  {
    q: 'Do utilities, groceries and insurance premiums count in DTI?',
    a: 'No. The ratio counts recurring debt payments and the housing payment. Utilities, groceries, phone bills, subscriptions and auto or health insurance premiums are left out.',
  },
  {
    q: 'Does rent count in my debt-to-income ratio?',
    a: 'When you apply for a mortgage, lenders use the proposed housing payment, and the rent you pay today is replaced by it. For other applications, such as an auto loan, how rent is counted depends on the lender.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Free DTI Calculator',
      url: 'https://numrica.com/dti-calculator',
      description:
        'Calculate your front-end and back-end debt-to-income ratio, how much more monthly debt fits under common reference points, and the largest housing payment for your income.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: 'Front-end ratio, Back-end ratio, Room for additional monthly debt, Largest housing payment at 28/36 and 31/43, Income needed per ceiling, What-if scenarios',
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate Your Debt-to-Income Ratio',
      description: 'Work out your front-end and back-end debt-to-income ratios from your gross income, housing cost and monthly debt payments.',
      step: [
        { '@type': 'HowToStep', name: 'Add up your gross monthly income', text: 'Total your income before taxes from every stable source. If you know the yearly figure, divide it by 12.' },
        { '@type': 'HowToStep', name: 'Find your monthly housing cost', text: 'Use your rent, or the proposed mortgage payment including principal, interest, property taxes, insurance and HOA dues.' },
        { '@type': 'HowToStep', name: 'List your monthly debt payments', text: 'Add the required monthly payment on car loans, student loans, credit cards, personal loans and support obligations. Use payments, not balances.' },
        { '@type': 'HowToStep', name: 'Divide to get both ratios', text: 'Front-end ratio equals housing cost divided by gross income. Back-end ratio equals housing cost plus other debt payments, divided by gross income.' },
        { '@type': 'HowToStep', name: 'Compare with reference points', text: 'Compare the results with the common 28/36 benchmark and the program limits your lender uses, then see how much room is left.' },
      ],
    },
  ],
}

const H2 = 'mb-2.5 font-[Georgia,serif] text-[18px] font-bold text-[#1a1a2e]'
const P = 'mb-3.5 text-[15px] leading-[1.75] text-[#374151]'
const LI = 'mb-2 text-[15px] leading-[1.75] text-[#374151]'
const LINK = 'text-[#22c55e] underline'
const SECTION = 'mb-9'

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <DtiCalculator />
      <div id="dti-editorial" className="embed-hide mx-auto max-w-[720px] px-6 pb-16 pt-10">
        <section className={SECTION}>
          <h2 className={H2}>What DTI measures</h2>
          <p className={P}>
            Debt-to-income, or DTI, compares the money you owe each month with the money you earn before taxes. Lenders use it as a quick check on whether a new
            payment fits your budget. The calculator above gives two versions. The <strong>front-end ratio</strong>, also called the housing ratio, divides your
            monthly housing cost by your gross monthly income. The <strong>back-end ratio</strong>, also called the total ratio, adds every other recurring debt
            payment to the housing cost before dividing.
          </p>
          <p className={P}>
            Both use gross income because that is the figure a lender can verify with pay stubs, tax returns and bank records. A borrower who earns{' '}
            {fmtMoney(A.grossIncome)} a month and pays {fmtMoney(A.housing)} for housing and {fmtMoney(A.otherDebts)} toward other debts has a front-end ratio of{' '}
            {fmtPct(A.frontEnd)} and a back-end ratio of {fmtPct(A.backEnd)}.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>What counts as debt, and what does not</h2>
          <p className={P}>
            The back-end ratio includes recurring obligations that show up on a credit report or in a court order: car loans and leases, student loans, the
            minimum payment on each credit card, personal loans, and child support or alimony you are required to pay. For a home purchase, housing means the
            proposed payment: principal, interest, property taxes, homeowners insurance, any mortgage insurance and HOA dues. A renter is in a different position,
            because the rent paid today is replaced by the new payment instead of added to it.
          </p>
          <p className={P}>
            Everyday living costs are left out: groceries, utilities, phone and internet, subscriptions, auto and health insurance premiums, and taxes withheld
            from your paycheck. How a lender counts a student loan that is deferred or on an income-driven plan depends on the loan program, so ask which payment
            figure will be used.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Front-end versus back-end</h2>
          <p className={P}>
            The front-end ratio asks whether the home is affordable on your income. The back-end ratio asks whether it is still affordable once your other debts
            are included. A borrower with no other debt gets the same number for both, while one with a car loan, a student loan and card payments can look fine
            on the front-end ratio and still hit the back-end ceiling.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>The 28/36 rule and what lenders use today</h2>
          <p className={P}>
            The 28/36 rule is the classic rule of thumb: keep housing at or below 28% of gross income and total debt at or below 36%. Lenders are not required to
            follow it. Actual limits depend on the loan program, the underwriting method and the rest of the file, and they change over time. The reference points
            below were checked against the sources listed at the end of this page on November 23, 2026. Confirm current figures with your lender.
          </p>
          <ul className="mb-3.5 list-disc pl-5">
            <li className={LI}>
              <strong>Conventional loans sold to Fannie Mae.</strong> For manually underwritten loans the maximum total DTI is 36%, which can be exceeded up to 45%
              when the borrower meets the credit score and reserve requirements in Fannie Mae&apos;s Eligibility Matrix. For loans underwritten through Desktop
              Underwriter, the maximum allowable DTI is 50%.
            </li>
            <li className={LI}>
              <strong>FHA loans.</strong> HUD&apos;s table for manually underwritten loans starts at 31/43 (housing and total) for borrowers with a credit score of
              580 or higher, and allows higher ratios, such as 40/50, when the file has compensating factors.
            </li>
            <li className={LI}>
              <strong>VA loans.</strong> VA&apos;s regulation names two primary standards: the DTI ratio and residual income, the money left after debts and living
              expenses. A 41% DTI has long been VA&apos;s reference point, and a loan above it has needed additional review unless residual income clears the
              guideline by at least 20% (text published in 2009; check VA&apos;s current Lenders Handbook for today&apos;s thresholds).
            </li>
            <li className={LI}>
              <strong>USDA loans.</strong> The guaranteed loan program fact sheet cites a 41% cap on total monthly debt after compensating factors. It also sets a
              separate cap on the housing payment, which has differed between handbook versions, so confirm that figure with a USDA-approved lender.
            </li>
            <li className={LI}>
              <strong>Qualified mortgage rule.</strong> A December 2020 CFPB final rule replaced the 43% DTI cap in the general qualified mortgage definition with
              a price-based test. Lenders must still consider and verify income and debts.
            </li>
          </ul>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Three worked examples</h2>
          <p className={P}>
            <strong>Example 1: a comfortable profile.</strong> Gross income {fmtMoney(A.grossIncome)}, proposed housing {fmtMoney(A.housing)}, a {fmtMoney(350)} car
            payment and a {fmtMoney(250)} student loan payment. Front-end {fmtPct(A.frontEnd)}, back-end {fmtPct(A.backEnd)}. Both sit inside 28/36, but the slack is
            thin: only {fmtMoney(room(A, 0.36).additionalDebt)} of extra monthly debt fits under 36%, and {fmtMoney(room(A, 0.43).additionalDebt)} under 43%. A new
            payment of {fmtMoney(room(A, 0.36).additionalDebt)} would use up all of the room under 36%.
          </p>
          <p className={P}>
            <strong>Example 2: over the line, and what moves it.</strong> Gross income {fmtMoney(B.grossIncome)}, housing {fmtMoney(B.housing)}, a{' '}
            {fmtMoney(300)} card minimum, a {fmtMoney(450)} car payment and a {fmtMoney(200)} student loan payment. Front-end {fmtPct(B.frontEnd)}, back-end{' '}
            {fmtPct(B.backEnd)}, which is {fmtMoney(room(B, 0.5).overBy)} a month over the 50% reference point. Paying off only the car loan brings the back-end ratio
            to {fmtPct(BnoCar.backEnd)}. Paying off only the card brings it to {fmtPct(BnoCard.backEnd)}. Paying off both brings it to {fmtPct(BnoBoth.backEnd)}.
            None of those steps changed income or housing.
          </p>
          <p className={P}>
            <strong>Example 3: which ratio sets the limit.</strong> A household earns {fmtMoney(C.grossIncome)} a month and pays {fmtMoney(C.otherDebts)} toward a car
            and a student loan. At a 28/36 pair, the front-end limit alone would allow {fmtMoney(C.maxHousing[0].byFrontEnd)} for housing, but the back-end limit
            leaves {fmtMoney(C.maxHousingPairs[0].maxHousing)} after the other debts, so the back-end ratio sets the cap. At a 31/43 pair the front-end limit alone
            allows {fmtMoney(C.maxHousingPairs[1].maxHousing)}, and it is the one that binds.
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>How to lower your DTI</h2>
          <p className={P}>
            There are only two levers: raise the income in the denominator or lower the payments in the numerator. In practice that gives five moves.
          </p>
          <ol className="mb-3.5 list-decimal pl-5">
            <li className={LI}>
              <strong>Pay off the loans with the biggest monthly payments first.</strong> For DTI the payment matters, not the balance. In Example 2, retiring the{' '}
              {fmtMoney(450)} car payment moved the ratio {((B.backEnd! - BnoCar.backEnd!) * 100).toFixed(0)} points, while retiring the {fmtMoney(300)} card
              payment alone moved it {((B.backEnd! - BnoCard.backEnd!) * 100).toFixed(0)}.
            </li>
            <li className={LI}>
              <strong>Lower the housing payment.</strong> A larger down payment, a lower purchase price or a longer term all reduce the monthly figure, though a
              longer term raises total interest over the life of the loan. The{' '}
              <Link href="/mortgage-calculator" className={LINK}>
                mortgage calculator
              </Link>{' '}
              shows that trade-off.
            </li>
            <li className={LI}>
              <strong>Document more stable income.</strong> Income a lender can verify, such as a co-borrower&apos;s pay, can count. Keep in mind that a
              co-borrower&apos;s debts count too.
            </li>
            <li className={LI}>
              <strong>Refinance or consolidate only when the monthly payment falls.</strong> A longer term lowers the ratio but can raise total cost. Compare
              both in the{' '}
              <Link href="/debt-payoff" className={LINK}>
                debt payoff calculator
              </Link>
              .
            </li>
            <li className={LI}>
              <strong>Avoid new credit before you apply.</strong> A new car loan or a card with a balance adds a payment immediately.
            </li>
          </ol>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Common mistakes</h2>
          <ul className="mb-3.5 list-disc pl-5">
            <li className={LI}>Using take-home pay instead of gross income.</li>
            <li className={LI}>Entering loan balances instead of required monthly payments.</li>
            <li className={LI}>Leaving HOA dues, property taxes or mortgage insurance out of the housing payment.</li>
            <li className={LI}>Forgetting a loan you co-signed, which lenders usually count as yours.</li>
            <li className={LI}>Adding groceries, utilities or phone bills, which are not debts.</li>
          </ul>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>DTI and your credit score</h2>
          <p className={P}>
            Credit reports do not include your income, so DTI is a separate test that lenders run alongside your credit score. A strong score does not remove a
            high ratio, and a low ratio does not repair a weak score. For a wider view of affordability, read{' '}
            <Link href="/blog/how-much-house-can-you-afford" className={LINK}>
              How Much House Can You Afford?
            </Link>
          </p>
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} className="mb-4">
              <h3 className="mb-1 text-[15px] font-bold text-[#1a1a2e]">{f.q}</h3>
              <p className={P}>{f.a}</p>
            </div>
          ))}
        </section>

        <section className={SECTION}>
          <h2 className={H2}>Sources and method</h2>
          <p className={P}>
            Every example number on this page comes from the same code that runs the calculator. The reference limits were read on November 23, 2026: the Fannie
            Mae page was opened directly and the others were reviewed through the publishers&apos; official pages. Programs revise their limits, so check the
            current version before relying on any figure.
          </p>
          <ul className="mb-3.5 list-disc pl-5">
            {SOURCES.map((s) => (
              <li key={s.url} className={LI}>
                <a href={s.url} className={LINK} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
                : {s.supports}
              </li>
            ))}
          </ul>
          <p className={P}>
            Published by the Numrica Team. This page is educational. It is not financial advice and it does not predict whether a lender will approve a loan.
          </p>
        </section>

        <section>
          <h2 className={H2}>Related tools and reading</h2>
          <ul className="m-0 list-none p-0">
            <li className="mb-2.5">
              <Link href="/mortgage-calculator" className={`${LINK} text-[15px]`}>
                Mortgage calculator with PMI and taxes
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/loan-simulator" className={`${LINK} text-[15px]`}>
                Loan amortization comparison
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/debt-payoff" className={`${LINK} text-[15px]`}>
                Debt payoff calculator
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/blog/debt-avalanche-vs-snowball" className={`${LINK} text-[15px]`}>
                Debt avalanche vs snowball
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/blog/real-cost-minimum-payments" className={`${LINK} text-[15px]`}>
                The real cost of minimum payments
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
