import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const allBlogPosts = [
  { slug: 'real-cost-minimum-payments', publishDate: '2026-05-21' },
  { slug: 'debt-avalanche-vs-snowball', publishDate: '2026-05-21' },
  { slug: 'variable-rate-vs-fixed-rate-mortgage', publishDate: '2026-05-21' },
  { slug: 'how-much-house-can-you-afford', publishDate: '2026-06-29' },
  { slug: '15-vs-30-year-mortgage', publishDate: '2026-07-02' },
  { slug: 'rule-of-72-explained', publishDate: '2026-07-09' },
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
