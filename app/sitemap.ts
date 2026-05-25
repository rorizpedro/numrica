import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://numrica.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://numrica.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://numrica.com/contact', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: 'https://numrica.com/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: 'https://numrica.com/loan-simulator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/mortgage-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/compound-interest', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/roi-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/debt-payoff', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/blog', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: 'https://numrica.com/blog/real-cost-minimum-payments', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://numrica.com/blog/custo-real-pagamento-minimo', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://numrica.com/blog/debt-avalanche-vs-snowball', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://numrica.com/blog/avalanche-vs-bola-de-neve', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]
}
