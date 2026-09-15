import { prisma } from '@/lib/prisma'
import { UnitStatus } from '@prisma/client'

export const unitRepository = {
  async findById(id: string) {
    return prisma.unit.findUnique({
      where: { id },
      include: {
        property: true,
        rentals: {
          where: { status: 'ACTIVE' },
          include: { user: true },
        },
      },
    })
  },

  async findByPropertyId(propertyId: string) {
    return prisma.unit.findMany({
      where: { propertyId },
      include: {
        rentals: {
          where: { status: 'ACTIVE' },
          include: { user: true },
        },
      },
      orderBy: { name: 'asc' },
    })
  },

  async create(data: {
    propertyId: string
    name: string
    description?: string | null
    monthlyRent: number
    status?: UnitStatus
    facilities?: string[]
  }) {
    return prisma.unit.create({
      data: {
        propertyId: data.propertyId,
        name: data.name,
        description: data.description,
        monthlyRent: data.monthlyRent,
        status: data.status || UnitStatus.AVAILABLE,
        facilities: data.facilities || [],
      },
      include: {
        property: true,
      },
    })
  },

  async update(id: string, data: {
    name?: string
    description?: string | null
    monthlyRent?: number
    status?: UnitStatus
    facilities?: string[]
  }) {
    return prisma.unit.update({
      where: { id },
      data,
    })
  },

  async updateStatus(id: string, status: UnitStatus) {
    return prisma.unit.update({
      where: { id },
      data: { status },
    })
  },
}
