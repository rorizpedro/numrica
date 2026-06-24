import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const allBlogPosts = [
  { slug: 'real-cost-minimum-payments', publishDate: '2026-05-21' },
  { slug: 'custo-real-pagamento-minimo', publishDate: '2026-05-21' },
  { slug: 'debt-avalanche-vs-snowball', publishDate: '2026-05-21' },
  { slug: 'avalanche-vs-bola-de-neve', publishDate: '2026-05-21' },
  { slug: 'variable-rate-vs-fixed-rate-mortgage', publishDate: '2026-05-21' },
  { slug: 'euribor-variavel-vs-taxa-fixa', publishDate: '2026-05-21' },
  { slug: 'how-to-get-out-of-credit-card-debt', publishDate: '2026-06-24' },
  { slug: 'what-is-a-good-credit-score', publishDate: '2026-06-25' },
  { slug: 'balance-transfer-cards-explained', publishDate: '2026-06-26' },
  { slug: 'debt-to-income-ratio-explained', publishDate: '2026-06-27' },
  { slug: 'paying-off-50000-in-debt', publishDate: '2026-06-28' },
  { slug: 'how-much-house-can-you-afford', publishDate: '2026-06-29' },
  { slug: 'pay-down-mortgage-or-invest', publishDate: '2026-06-30' },
  { slug: 'mortgage-refinancing-explained', publishDate: '2026-07-01' },
  { slug: '15-vs-30-year-mortgage', publishDate: '2026-07-02' },
  { slug: 'mortgage-points-explained', publishDate: '2026-07-03' },
  { slug: 'dollar-cost-averaging-vs-lump-sum', publishDate: '2026-07-04' },
  { slug: 'cost-of-waiting-to-invest', publishDate: '2026-07-05' },
  { slug: 'index-funds-vs-active-funds', publishDate: '2026-07-06' },
  { slug: 'roth-ira-vs-traditional-ira', publishDate: '2026-07-07' },
  { slug: 'emergency-fund-how-much', publishDate: '2026-07-08' },
  { slug: 'rule-of-72-explained', publishDate: '2026-07-09' },
  { slug: 'how-much-to-save-at-each-age', publishDate: '2026-07-10' },
  { slug: 'inflation-effect-on-savings', publishDate: '2026-07-11' },
  { slug: 'high-yield-savings-vs-cd', publishDate: '2026-07-12' },
  { slug: 'savings-rate-and-retirement-age', publishDate: '2026-07-13' },
  { slug: '50-30-20-budget-rule', publishDate: '2026-07-14' },
  { slug: 'true-hourly-wage', publishDate: '2026-07-15' },
  { slug: 'fire-movement-what-savings-rate', publishDate: '2026-07-16' },
  { slug: 'car-loan-vs-leasing-total-cost', publishDate: '2026-07-17' },
  { slug: 'net-worth-how-to-calculate', publishDate: '2026-07-18' },
  { slug: 'rental-property-roi-calculation', publishDate: '2026-07-19' },
  { slug: 'home-equity-loan-vs-heloc', publishDate: '2026-07-20' },
  { slug: 'student-loan-payoff-strategies', publishDate: '2026-07-21' },
  { slug: 'building-wealth-on-60k-salary', publishDate: '2026-07-22' },
  { slug: 'minimum-payment-five-credit-cards', publishDate: '2026-07-23' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split('T')[0]
  const publishedPosts = allBlogPosts.filter((p) => p.publishDate <= today)

  return [
    { url: 'https://numrica.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://numrica.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://numrica.com/contact', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: 'https://numrica.com/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://numrica.com/terms', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://numrica.com/loan-simulator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/mortgage-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/compound-interest', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/roi-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/debt-payoff', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/blog', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...publishedPosts.map((p) => ({
      url: `https://numrica.com/blog/${p.slug}`,
      lastModified: new Date(p.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
