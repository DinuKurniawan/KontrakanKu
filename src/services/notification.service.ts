import { notificationRepository } from '@/repositories/notification.repository'
import { formatRupiah, formatBillingPeriod } from '@/lib/utils'

export const notificationService = {
  /**
   * Kirim notifikasi saat invoice baru dibuat untuk seorang user
   */
  async notifyInvoiceCreated(params: {
    userId: string
    invoiceNumber: string
    billingPeriod: string
    amount: number
    dueDate: Date
    unitName: string
  }) {
    const { userId, invoiceNumber, billingPeriod, amount, dueDate, unitName } = params

    const dueDateStr = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dueDate))

    return notificationRepository.create({
      userId,
      title: 'Tagihan Baru Diterbitkan',
      message: `Tagihan ${invoiceNumber} untuk unit ${unitName} periode ${formatBillingPeriod(billingPeriod)} sebesar ${formatRupiah(amount)} telah diterbitkan. Jatuh tempo: ${dueDateStr}.`,
      type: 'INVOICE',
      linkUrl: '/dashboard/tagihan',
    })
  },

  /**
   * Kirim notifikasi massal saat batch invoice dibuat
   */
  async notifyBatchInvoicesCreated(
    invoices: {
      userId: string
      invoiceNumber: string
      billingPeriod: string
      amount: number
      dueDate: Date
      unitName: string
    }[]
  ) {
    const notifications = invoices.map((inv) => {
      const dueDateStr = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(inv.dueDate))

      return {
        userId: inv.userId,
        title: 'Tagihan Baru Diterbitkan',
        message: `Tagihan ${inv.invoiceNumber} untuk unit ${inv.unitName} periode ${formatBillingPeriod(inv.billingPeriod)} sebesar ${formatRupiah(inv.amount)} telah diterbitkan. Jatuh tempo: ${dueDateStr}.`,
        type: 'INVOICE',
        linkUrl: '/dashboard/tagihan',
      }
    })

    if (notifications.length > 0) {
      return notificationRepository.createMany(notifications)
    }
  },

  /**
   * Ambil notifikasi milik user
   */
  async getUserNotifications(userId: string, limit = 20) {
    return notificationRepository.findByUserId(userId, limit)
  },

  /**
   * Hitung notifikasi belum dibaca
   */
  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId)
  },

  /**
   * Tandai satu notifikasi sebagai sudah dibaca
   */
  async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId)
  },

  /**
   * Tandai semua notifikasi sebagai sudah dibaca
   */
  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId)
  },
}
