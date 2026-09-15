import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
