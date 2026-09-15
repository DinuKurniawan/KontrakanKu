import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import HistoryView, { SerializedPayment } from './history-view'

export default async function AdminRiwayatPage() {
  await requireAdmin()

  const rawPayments = await prisma.payment.findMany({
    include: {
      invoice: {
        include: {
          rental: {
            include: {
              user: true,
              unit: {
                include: {
                  property: true,
                },
              },
            },
          },
        },
      },
      paymentAccount: true,
      verifiedBy: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Format and serialize data for client component
  const payments: SerializedPayment[] = rawPayments.map((p) => ({
    id: p.id,
    invoiceId: p.invoiceId,
    invoiceNumber: p.invoice.invoiceNumber,
    billingPeriod: p.invoice.billingPeriod,
    amount: p.amount.toNumber(),
    invoiceAmount: p.invoice.amount.toNumber(),
    transferDate: p.transferDate.toISOString(),
    senderBank: p.senderBank,
    senderName: p.senderName,
    proofFileUrl: p.proofFileUrl,
    notes: p.notes,
    status: p.status as 'PENDING' | 'APPROVED' | 'REJECTED',
    rejectionReason: p.rejectionReason,
    verifiedByName: p.verifiedBy?.name || null,
    verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    paymentAccount: p.paymentAccount
      ? {
          bankName: p.paymentAccount.bankName,
          accountNumber: p.paymentAccount.accountNumber,
          accountName: p.paymentAccount.accountName,
        }
      : null,
    tenant: {
      name: p.invoice.rental.user.name,
      email: p.invoice.rental.user.email,
      phone: p.invoice.rental.user.phone,
    },
    unit: {
      name: p.invoice.rental.unit.name,
      propertyName: p.invoice.rental.unit.property.name,
    },
  }))

  return (
    <div className="w-full">
      <HistoryView initialPayments={payments} />
    </div>
  )
}
