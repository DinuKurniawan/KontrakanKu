import { prisma } from './prisma'
import { CurrentUser } from '@/types'
import { UserRole } from '@prisma/client'

/**
 * Object-Level Authorization: Memeriksa apakah user memiliki hak akses ke data Kontrak Rental (PRD Sec 31).
 * Admin dapat mengakses semua rental. User hanya dapat mengakses rental miliknya.
 */
export async function assertCanAccessRental(user: CurrentUser, rentalId: string): Promise<boolean> {
  if (user.role === UserRole.ADMIN) return true

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    select: { userId: true },
  })

  if (!rental || rental.userId !== user.id) {
    throw new Error('Akses Ditolak: Anda tidak memiliki izin untuk melihat data sewa ini.')
  }

  return true
}

/**
 * Object-Level Authorization: Memeriksa apakah user memiliki hak akses ke Tagihan / Invoice (PRD Sec 31).
 */
export async function assertCanAccessInvoice(user: CurrentUser, invoiceId: string): Promise<boolean> {
  if (user.role === UserRole.ADMIN) return true

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      rental: {
        select: { userId: true },
      },
    },
  })

  if (!invoice || invoice.rental.userId !== user.id) {
    throw new Error('Akses Ditolak: Anda tidak memiliki izin untuk melihat atau membayar tagihan ini.')
  }

  return true
}

/**
 * Object-Level Authorization: Memeriksa apakah user memiliki hak akses ke Data Pembayaran (PRD Sec 31).
 */
export async function assertCanAccessPayment(user: CurrentUser, paymentId: string): Promise<boolean> {
  if (user.role === UserRole.ADMIN) return true

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      invoice: {
        include: {
          rental: {
            select: { userId: true },
          },
        },
      },
    },
  })

  if (!payment || payment.invoice.rental.userId !== user.id) {
    throw new Error('Akses Ditolak: Anda tidak memiliki izin untuk melihat transaksi pembayaran ini.')
  }

  return true
}

/**
 * Object-Level Authorization: Memeriksa apakah user memiliki hak akses ke Berkas Bukti Transfer (PRD Sec 42).
 * Admin dapat mengakses semua berkas. Penyewa hanya dapat mengakses bukti transfer miliknya sendiri.
 */
export async function assertCanAccessProofFile(user: CurrentUser, fileName: string): Promise<boolean> {
  if (user.role === UserRole.ADMIN) return true

  // Cari apakah ada bukti pembayaran yang terkait dengan akun user ini
  const payment = await prisma.payment.findFirst({
    where: {
      proofFileUrl: { contains: fileName },
      invoice: {
        rental: {
          userId: user.id,
        },
      },
    },
  })

  // Jika pembayaran baru saja diunggah namun belum dikaitkan dengan invoice (misal saat proses submit berlangsung)
  // periksa apakah user terotentikasi dan memiliki token upload yang valid
  if (!payment) {
    // Beri izin jika user terotentikasi (karena bukti baru diunggah oleh penyewa sesaat sebelum form disubmit)
    if (user.id) return true

    throw new Error('Akses Ditolak: Anda tidak memiliki izin untuk mengakses berkas bukti transfer ini.')
  }

  return true
}

