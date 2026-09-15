import { prisma } from '@/lib/prisma'

export const paymentAccountRepository = {
  async findAll() {
    return prisma.paymentAccount.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async findActive() {
    return prisma.paymentAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.paymentAccount.findUnique({
      where: { id },
    })
  },

  async create(data: {
    bankName: string
    accountNumber: string
    accountName: string
    qrCodeUrl?: string | null
    isActive?: boolean
  }) {
    return prisma.paymentAccount.create({
      data: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive ?? true,
      },
    })
  },

  async update(
    id: string,
    data: {
      bankName?: string
      accountNumber?: string
      accountName?: string
      qrCodeUrl?: string | null
      isActive?: boolean
    }
  ) {
    return prisma.paymentAccount.update({
      where: { id },
      data,
    })
  },

  async toggleStatus(id: string) {
    const current = await prisma.paymentAccount.findUnique({
      where: { id },
      select: { isActive: true },
    })
    if (!current) {
      throw new Error('Rekening pembayaran tidak ditemukan')
    }
    return prisma.paymentAccount.update({
      where: { id },
      data: { isActive: !current.isActive },
    })
  },

  async delete(id: string) {
    // Periksa apakah rekening sudah pernah digunakan dalam pembayaran (PRD Sec 39)
    const paymentCount = await prisma.payment.count({
      where: { paymentAccountId: id },
    })
    if (paymentCount > 0) {
      // Jika sudah ada riwayat transaksi, nonaktifkan alih-alih hard delete untuk integritas data
      return prisma.paymentAccount.update({
        where: { id },
        data: { isActive: false },
      })
    }
    return prisma.paymentAccount.delete({
      where: { id },
    })
  },
}
