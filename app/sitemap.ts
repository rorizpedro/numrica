import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://numrica.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://numrica.com/loan-simulator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/mortgage-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/compound-interest', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://numrica.com/roi-calculator', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
