import { auditRepository } from '@/repositories/audit.repository'
import { Prisma } from '@prisma/client'

export const auditService = {
  async log(data: {
    action: string
    entityType: string
    entityId: string
    userId?: string | null
    metadata?: Prisma.InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
  }) {
    return auditRepository.log(data)
  },

  async listRecent(limit: number = 50) {
    return auditRepository.listRecent(limit)
  },
}
