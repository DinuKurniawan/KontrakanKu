import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'

function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/kontrakan`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tentang`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const properties = await prisma.property.findMany({
    where: { status: PropertyStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
  })

  const dynamicRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/kontrakan/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
