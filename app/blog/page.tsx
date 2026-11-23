import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog — Numrica',
  description:
    'Financial education articles — debt payoff strategies, mortgage mechanics, compound interest, and personal finance.',
  alternates: { canonical: 'https://numrica.com/blog' },
}

const allPosts = [
  {
    slug: 'real-cost-minimum-payments',
    title: "The real cost of minimum payments: what your monthly statement doesn't show you",
    excerpt:
      "A $5,400 credit card balance at 24.99% APR, paid on minimums only, costs you $4,300 in interest before it's gone. Here is the number that actually matters.",
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'debt-avalanche-vs-snowball',
    title: 'Debt avalanche vs debt snowball: which method saves more money?',
    excerpt:
      'Most people with three debts do not know which to pay first. That indecision has a measurable cost — between 20% and over 100% of the original debt balance in extra interest.',
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'variable-rate-vs-fixed-rate-mortgage',
    title: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows',
    excerpt:
      'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision. Three scenarios, one simulation.',
    displayDate: 'May 21, 2026',
    publishDate: '2026-05-21',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'how-much-house-can-you-afford',
    title: 'How Much House Can You Afford? The Numbers Lenders Use vs What Is Actually Safe',
    excerpt: 'Lenders approve mortgages up to 43% DTI. Financial planners recommend 28%. The gap between those two numbers is your financial cushion — or lack of it.',
    displayDate: 'June 29, 2026',
    publishDate: '2026-06-29',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: '15-vs-30-year-mortgage',
    title: '15-Year vs 30-Year Mortgage: Total Cost Comparison With Real Numbers',
    excerpt: 'On a $350,000 loan, the 30-year costs $232,000 more in interest than the 15-year. But the monthly payment difference is $600. Here is the real tradeoff.',
    displayDate: 'July 2, 2026',
    publishDate: '2026-07-02',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'rule-of-72-explained',
    title: 'The Rule of 72 Explained: The Fastest Way to Estimate Investment Growth',
    excerpt: 'Divide 72 by your return rate to find how many years to double your money. At 8%, that is 9 years. At 12%, just 6. A simple mental model that reveals compounding in one step.',
    displayDate: 'July 9, 2026',
    publishDate: '2026-07-09',
    readTime: '5 min read',
    lang: 'EN',
  },
]

export default function BlogIndex() {
  const today = new Date().toISOString().split('T')[0]
  const posts = allPosts
    .filter((p) => p.publishDate <= today)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))

  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 0' }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 12px',
            fontFamily: 'Georgia, serif',
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#6b7280',
            margin: '0 0 40px',
            fontFamily: 'sans-serif',
            lineHeight: 1.6,
          }}
        >
          Financial education articles — debt payoff strategies, mortgage mechanics, compound interest, and more.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: 11,
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontFamily: 'sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {post.lang}
                </span>
              </div>

              <h2 style={{ margin: '0 0 10px', fontSize: 18, lineHeight: 1.4 }}>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    color: '#1a1a2e',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {post.title}
                </Link>
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: '0 0 14px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {post.excerpt}
              </p>

              <p
                style={{
                  color: '#9ca3af',
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  margin: 0,
                }}
              >
                {post.displayDate} · {post.readTime}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
