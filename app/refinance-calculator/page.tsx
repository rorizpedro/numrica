import type { Metadata } from 'next'
import Link from 'next/link'
import RefinanceCalculator from './RefinanceCalculator'

export const metadata: Metadata = {
  title: 'Refinance Break-Even Calculator: Is It Worth It?',
  description:
    'Find your refinance break-even point in months, compare payments, interest and total cost, and see if refinancing pays off for the time you will keep the loan. Free, no signup.',
  keywords: [
    'refinance break even calculator', 'mortgage refinance calculator', 'is refinancing worth it',
    'refinance closing costs calculator', 'refinance break even point', 'should I refinance my mortgage',
    'refinance savings calculator', 'term reset refinance', 'roll closing costs into loan',
  ],
  alternates: { canonical: 'https://numrica.com/refinance-calculator' },
  openGraph: {
    type: 'website',
    url: 'https://numrica.com/refinance-calculator',
    siteName: 'Numrica',
    title: 'Refinance Break-Even Calculator — Numrica',
    description: 'How many months until a refinance pays back its closing costs, and does it still win for the time you will keep the loan?',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Refinance Break-Even Calculator — Numrica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refinance Break-Even Calculator — Numrica',
    description: 'Break-even months, total cost at your time horizon, and warnings for term resets. Free, no signup.',
    images: ['/og-image.png'],
  },
}

const FAQ = [
  {
    q: 'What is a refinance break-even point?',
    a: 'It is the number of months it takes for your monthly savings to repay the closing costs of a refinance. If you keep the loan longer than the break-even point, the refinance has time to pay off. If you sell or refinance again sooner, it usually does not.',
  },
  {
    q: 'How do I calculate the break-even point on a refinance?',
    a: 'Divide the total cost of the refinance by your monthly savings. With $5,000 in closing costs and $164.38 saved each month, the break-even is 30.4 months. This calculator also shows a second figure that counts the balance you still owe, which is more reliable when the rate and term both change.',
  },
  {
    q: 'How long should a refinance break-even period be?',
    a: 'There is no universal number. What matters is that it is clearly shorter than the time you expect to keep the loan. Because plans change, test a short, an expected and a long time horizon in the calculator and see whether the answer stays the same.',
  },
  {
    q: 'Does break-even work for cash-out or shorter-term refinances?',
    a: 'Not on its own. Freddie Mac notes that dividing costs by monthly savings does not work for cash-out refinances or when you shorten the loan term, because the monthly payment may go up. In those cases compare total interest and total cost at your time horizon, which this calculator shows.',
  },
  {
    q: 'Should I roll closing costs into the new loan?',
    a: 'It keeps cash in your pocket, but you pay interest on the costs for the life of the loan. In the example above, financing $5,000 makes the break-even about 7 months longer (30.4 versus 37.2 months) and cuts the seven-year gain from $12,578 to $10,578.',
  },
  {
    q: 'Can I cancel a refinance after closing?',
    a: 'On a refinance of your primary home, federal rules generally give you three business days after closing to cancel. Saturdays count as business days for this purpose; Sundays and legal public holidays do not. Check the notice of the right to cancel you receive at closing for your exact deadline.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Refinance Break-Even Calculator',
      url: 'https://numrica.com/refinance-calculator',
      description:
        'Calculate the break-even point of a mortgage refinance, compare monthly payments, total interest and total cost at your time horizon, and get warnings for term resets and higher payments.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList:
        'Break-even in months, break-even counting the remaining balance, total cost at your time horizon, closing costs paid in cash or rolled into the loan, term reset warning, cash paid chart, year-by-year comparison',
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'HowTo',
      name: 'How to Find Your Refinance Break-Even Point',
      description: 'Compare your current mortgage with a refinance and see how long it takes to earn back the closing costs.',
      step: [
        { '@type': 'HowToStep', name: 'Enter your current loan', text: 'Add the balance you owe, your current interest rate and how much time is left on the loan.' },
        { '@type': 'HowToStep', name: 'Enter the refinance offer', text: 'Add the new rate and the new loan term from your Loan Estimate.' },
        { '@type': 'HowToStep', name: 'Add closing costs', text: 'Enter the total closing costs as a dollar amount or a percentage, and choose whether they are paid at closing or rolled into the new loan.' },
        { '@type': 'HowToStep', name: 'Set your time horizon', text: 'Choose how many years you expect to keep the loan or the home.' },
        { '@type': 'HowToStep', name: 'Read the results', text: 'Compare the break-even months with your time horizon and check any warnings about the loan term or the payment.' },
      ],
    },
  ],
}

const h2 = 'mb-2.5 text-lg font-bold text-[#1a1a2e]'
const p = 'mb-3.5 text-[15px] leading-relaxed text-gray-700'
const section = 'mb-9'
const cite = 'text-[#15803d] no-underline hover:underline'

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <RefinanceCalculator />
      <div className="embed-hide mx-auto max-w-[720px] px-6 pb-16">
        <article>
          <section className={section}>
            <h2 className={h2}>What a refinance break-even point tells you</h2>
            <p className={p}>
              A refinance is not free. You pay closing costs up front, or roll them into the new loan, and you earn that money back through a
              lower payment over time. The break-even point is the month where the savings catch up with the costs. Freddie Mac describes the
              quick version: divide the total cost of the refinance by your monthly savings to see how long it takes to recoup the cost
              <sup><a className={cite} href="#source-1">1</a></sup>. If you will keep the loan longer than that, the refinance has time to pay
              off. If you will sell or refinance again sooner, it probably will not.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Worked example: a one-point rate drop</h2>
            <p className={p}>
              Take a $250,000 balance at 7.00% with 30 years left, refinanced to 6.00% over 30 years with $5,000 in closing costs (2% of the
              balance) paid at closing. The payment falls from $1,663.26 to $1,498.88, a saving of $164.38 a month. Dividing $5,000 by $164.38
              gives 30.4 months, about two and a half years.
            </p>
            <p className={p}>
              That is the simple break-even. Counting the balance you still owe, the refinance pulls ahead in month 24, partly because the
              lower rate sends more of each payment to principal. Keep the loan for 7 years and the refinance leaves you $12,578 ahead. Keep
              it for 18 months and you are $1,243 behind. Same loan, opposite answers: the time you stay is the whole decision.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Why this calculator shows two break-even figures</h2>
            <p className={p}>
              The divide-costs-by-savings figure looks only at cash, the difference between two monthly payments. It misses that loans with
              different rates and terms pay down principal at different speeds. So we also find the first month when payments, closing costs
              and the balance still owed add up to less with the refinance. Both appear in your results. When they disagree by a lot, look at
              why. Usually the term changed.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>The term-reset trap</h2>
            <p className={p}>
              Suppose you owe $280,000 at 6.75% with 27 years left, and you refinance into a 30-year loan at 6.25% with $5,600 (2%) in closing
              costs. The payment drops from $1,880.48 to $1,724.01, saving $156.47 a month, and the simple break-even is about 36 months. It
              looks like a clear win.
            </p>
            <p className={p}>
              It is not. Starting a fresh 30-year clock adds three years of payments. Total interest rises from $329,276 to $340,643, and
              across the full life of both loans the refinance costs $16,967 more than doing nothing. The break-even that counts your balance
              is 53 months, not 36, and at seven years you are only $2,763 ahead. The lower payment is real, but part of it is simply a longer
              repayment. If you do this kind of refinance, consider choosing a term close to what you have left, or keep paying the old amount.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Shortening the term changes the question</h2>
            <p className={p}>
              Refinance the first example into a 15-year loan at 6.00% and the payment rises to $2,109.64, about $446 more than today. The
              break-even formula returns nothing, because there are no monthly savings. Yet interest drops from $348,772 to $129,736, and over
              the full life of both loans you save $214,037 after closing costs. Freddie Mac notes the divide-costs-by-savings method does not
              work for cash-out refinances or for refinances that shorten the loan term
              <sup><a className={cite} href="#source-1">1</a></sup>, which is why the calculator also shows total cost at your time horizon.
              Here the real test is whether you can afford the higher payment, not break-even.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Pay closing costs in cash, or roll them in?</h2>
            <p className={p}>
              Rolling costs into the loan keeps cash in your pocket but adds to the balance, so you pay interest on the costs. In the first
              example, financing the $5,000 raises the new balance to $255,000. The payment is $1,528.85, saving $134.40 a month instead of
              $164.38. The simple break-even stretches from 30.4 to 37.2 months, interest on the new loan grows from $289,595 to $295,387,
              and at seven years the refinance leaves you $10,578 ahead instead of $12,578. Financing is not wrong. It just makes the
              break-even longer.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>What closing costs look like</h2>
            <p className={p}>
              Published ranges differ. Freddie Mac says to expect 3% to 6% of the loan principal
              <sup><a className={cite} href="#source-2">2</a></sup>, while Fannie Mae&apos;s refinance calculator puts typical costs at 2% to 5%
              of the new loan<sup><a className={cite} href="#source-3">3</a></sup>. On $250,000, 2% is $5,000, the figure used above, and 6% is
              $15,000, roughly three times as long to earn back. Your own number matters more than any range. A lender must deliver a Loan
              Estimate within three business days of receiving your application
              <sup><a className={cite} href="#source-4">4</a></sup>, so ask several lenders for one and enter the total here.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Before you sign</h2>
            <p className={p}>
              Check three things. Compare the new loan&apos;s term with what you have left, as in the term-reset example. Test a short, an
              expected and a long time horizon, because plans change. And know that on a refinance of your primary home, federal rules
              generally give you three business days after closing to cancel. Saturdays count; Sundays and legal public holidays do not
              <sup><a className={cite} href="#source-5">5</a></sup>.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>When a refinance usually does not make sense</h2>
            <ul className="mb-3.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-gray-700">
              <li>You may move or refinance again before the break-even point, as in the 18-month case above.</li>
              <li>The new rate is not meaningfully lower than your current rate.</li>
              <li>The term restarts and you have no plan to pay extra.</li>
              <li>You roll in the closing costs and expect a short stay.</li>
            </ul>
          </section>

          <section className={section}>
            <h2 className={h2}>What this calculator assumes</h2>
            <p className={p}>
              Fixed-rate, fully amortizing loans, principal and interest only. Taxes, insurance and mortgage insurance are left out. Closing
              costs mean everything you pay to close, including any points. The calculator does not model investment returns on your savings,
              taxes or prepayment penalties. The cost at your time horizon counts the payments you make plus the balance you would still
              owe, as if you paid the loan off then. It is an educational estimate, not financial advice. Confirm every figure against your
              Loan Estimate.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>Frequently asked questions</h2>
            <div className="rounded-xl border border-gray-200 bg-white px-5">
              {FAQ.map((f) => (
                <details key={f.q} className="border-b border-gray-100 py-3.5 last:border-b-0">
                  <summary className="cursor-pointer text-sm font-semibold text-[#1a1a2e]">{f.q}</summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-500">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={section} id="sources">
            <h2 className={h2}>Sources</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-gray-600">
              <li id="source-1"><a className={cite} href="https://myhome.freddiemac.com/refinancing/planning-to-refinance" target="_blank" rel="noopener noreferrer">Freddie Mac: Planning to refinance</a></li>
              <li id="source-2"><a className={cite} href="https://myhome.freddiemac.com/refinancing/costs-of-refinancing" target="_blank" rel="noopener noreferrer">Freddie Mac: Understanding the costs of refinancing</a></li>
              <li id="source-3"><a className={cite} href="https://yourhome.fanniemae.com/calculators-tools/mortgage-refinance-calculator" target="_blank" rel="noopener noreferrer">Fannie Mae: Mortgage refinance calculator</a></li>
              <li id="source-4"><a className={cite} href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/" target="_blank" rel="noopener noreferrer">CFPB: What is a Loan Estimate?</a></li>
              <li id="source-5"><a className={cite} href="https://www.consumerfinance.gov/ask-cfpb/how-long-do-i-have-to-rescind-when-does-the-right-of-rescission-start-en-187/" target="_blank" rel="noopener noreferrer">CFPB: How long do I have to rescind?</a></li>
            </ol>
          </section>

          <section>
            <h2 className={h2}>Related reading</h2>
            <ul className="m-0 list-none p-0">
              <li className="mb-2.5"><Link href="/mortgage-calculator" className="text-[15px] text-[#22c55e] underline">Mortgage Calculator with PMI and Taxes</Link></li>
              <li className="mb-2.5"><Link href="/loan-simulator" className="text-[15px] text-[#22c55e] underline">Amortization Compare</Link></li>
              <li className="mb-2.5"><Link href="/blog/15-vs-30-year-mortgage" className="text-[15px] text-[#22c55e] underline">15-Year vs 30-Year Mortgage: Total Cost Comparison</Link></li>
              <li className="mb-2.5"><Link href="/blog/variable-rate-vs-fixed-rate-mortgage" className="text-[15px] text-[#22c55e] underline">Variable vs Fixed Rate Mortgage</Link></li>
              <li className="mb-2.5"><Link href="/blog/how-much-house-can-you-afford" className="text-[15px] text-[#22c55e] underline">How Much House Can You Afford?</Link></li>
            </ul>
          </section>

          <p className="mt-8 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-400">
            By the Numrica Team. This page is educational and is not financial advice. Results are estimates based on the inputs you enter.
          </p>
        </article>
      </div>
    </>
  )
}
