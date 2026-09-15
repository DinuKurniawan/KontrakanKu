import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TenantHistoryView, { SerializedTenantPayment } from './tenant-history-view'

export default async function TenantRiwayatPage() {
  const user = await requireAuth()

  const rawPayments = await prisma.payment.findMany({
    where: {
      invoice: {
        rental: { userId: user.id },
      },
    },
    include: {
      invoice: {
        include: {
          rental: {
            include: {
              unit: {
                include: { property: true },
              },
            },
          },
        },
      },
      paymentAccount: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Format and serialize data for client component
  const payments: SerializedTenantPayment[] = rawPayments.map((p) => ({
    id: p.id,
    invoiceId: p.invoiceId,
    invoiceNumber: p.invoice.invoiceNumber,
    billingPeriod: p.invoice.billingPeriod,
    amount: p.amount.toNumber(),
    transferDate: p.transferDate.toISOString(),
    senderBank: p.senderBank,
    senderName: p.senderName,
    proofFileUrl: p.proofFileUrl,
    notes: p.notes,
    status: p.status as 'PENDING' | 'APPROVED' | 'REJECTED',
    rejectionReason: p.rejectionReason,
    createdAt: p.createdAt.toISOString(),
    unitName: p.invoice.rental.unit.name,
    propertyName: p.invoice.rental.unit.property.name,
    destinationBank: p.paymentAccount?.bankName || null,
  }))

  return (
    <div className="w-full space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 200px at 12% 0%, rgba(16,185,129,0.12), transparent 70%), radial-gradient(420px 200px at 95% 10%, rgba(14,165,233,0.10), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-4 p-6 sm:p-8">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            Bukti & verifikasi
          </p>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Riwayat Transaksi
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Pembayaran sewa yang pernah Anda kirim beserta status verifikasinya.
            </p>
          </div>
        </div>
      </section>

      <TenantHistoryView payments={payments} />
    </div>
  )
}
