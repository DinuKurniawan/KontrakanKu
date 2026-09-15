import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'

export const propertyRepository = {
  async findAll(status?: PropertyStatus) {
    return prisma.property.findMany({
      where: status ? { status } : undefined,
      include: {
        units: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            rentals: {
              where: { status: 'ACTIVE' },
              include: { user: true },
            },
          },
          orderBy: { name: 'asc' },
        },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    })
  },

  async findBySlug(slug: string) {
    return prisma.property.findUnique({
      where: { slug },
      include: {
        units: { orderBy: { name: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    })
  },

  async create(data: {
    name: string
    slug: string
    address: string
    description?: string | null
    monthlyPriceFrom: number
    status?: PropertyStatus
    facilities?: string[]
    coverImageUrl?: string | null
    coverImageUrls?: string[]
  }) {
    const urls = (data.coverImageUrls && data.coverImageUrls.length > 0
      ? data.coverImageUrls
      : data.coverImageUrl ? [data.coverImageUrl] : []
    ).filter(Boolean) as string[]
    return prisma.property.create({
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        description: data.description,
        monthlyPriceFrom: data.monthlyPriceFrom,
        status: data.status || PropertyStatus.DRAFT,
        facilities: data.facilities || [],
        images: urls.length > 0
          ? {
              create: urls.map((url, idx) => ({
                url,
                altText: data.name,
                isCover: idx === 0,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        units: true,
      },
    })
  },

  async update(id: string, data: {
    name?: string
    slug?: string
    address?: string
    description?: string | null
    monthlyPriceFrom?: number
    status?: PropertyStatus
    facilities?: string[]
    coverImageUrl?: string | null
    coverImageUrls?: string[]
  }) {
    const { coverImageUrl, coverImageUrls, ...rest } = data as any
    const urls = coverImageUrls !== undefined
      ? coverImageUrls
      : coverImageUrl !== undefined && coverImageUrl ? [coverImageUrl] : undefined
    if (urls !== undefined) {
      const filtered = (urls as string[]).filter(Boolean)
      return prisma.$transaction(async tx => {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } })
        const updated = await tx.property.update({
          where: { id },
          data: {
            ...rest,
            ...(filtered.length > 0 ? {
              images: {
                create: filtered.map((url: string, idx: number) => ({
                  url,
                  altText: rest.name || undefined,
                  isCover: idx === 0,
                  sortOrder: idx,
                })),
              },
            } : {}),
          },
          include: { units: true, images: true },
        })
        return updated
      })
    }
    return prisma.property.update({
      where: { id },
      data: rest,
      include: { units: true, images: true },
    })
  },

  async setStatus(id: string, status: PropertyStatus) {
    return prisma.property.update({
      where: { id },
      data: { status },
    })
  },

  async delete(id: string) {
    return prisma.property.delete({
      where: { id },
    })
  },

  async countRentals(propertyId: string) {
    return prisma.rental.count({
      where: { unit: { propertyId } },
    })
  },
}
