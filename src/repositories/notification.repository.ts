import { prisma } from '@/lib/prisma'

export const notificationRepository = {
  async create(data: {
    userId: string
    title: string
    message: string
    type?: string
    linkUrl?: string
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        linkUrl: data.linkUrl,
      },
    })
  },

  async createMany(
    notifications: {
      userId: string
      title: string
      message: string
      type?: string
      linkUrl?: string
    }[]
  ) {
    return prisma.notification.createMany({
      data: notifications.map((n) => ({
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type || 'INFO',
        linkUrl: n.linkUrl,
      })),
    })
  },

  async findByUserId(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    })
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    })
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  },
}
