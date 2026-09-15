import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const auditRepository = {
  async log(data: {
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    metadata?: Prisma.InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
  }) {
    return prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId || null,
        metadata: data.metadata,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    })
  },

  async listRecent(limit: number = 50) {
    return prisma.auditLog.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },
}
