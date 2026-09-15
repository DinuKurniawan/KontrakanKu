import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async create(data: {
    name: string
    email: string
    passwordHash: string
    role?: UserRole
    phone?: string | null
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        role: data.role || UserRole.USER,
        phone: data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
      },
    })
  },

  async listTenants() {
    return prisma.user.findMany({
      where: { role: UserRole.USER },
      include: {
        rentals: {
          include: {
            unit: {
              include: {
                property: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findWithPasswordHash(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  },

  async update(id: string, data: { name?: string; phone?: string | null; avatarUrl?: string | null }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        updatedAt: true,
      },
    })
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: {
        id: true,
        email: true,
        updatedAt: true,
      },
    })
  },
}

