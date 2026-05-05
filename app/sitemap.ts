import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.bidlivklecanech.cz'
  return [
    { url: base,            lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pozemky`, lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${base}/sluzby`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
