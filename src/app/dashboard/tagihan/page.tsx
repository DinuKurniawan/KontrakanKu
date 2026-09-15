import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { InvoiceSource, RentalStatus } from '@prisma/client'
import { ReceiptText } from 'lucide-react'
import InvoiceList, { SerializedTenantInvoice } from './invoice-list'

export default async function TenantTagihanPage() {
  const user = await requireAuth()

  // Periode berjalan: tagihan MANUAL dari admin selalu tampil (bulan berapa pun),
  // sedangkan tagihan BATCH (massal) untuk bulan berikutnya disembunyikan sampai bulannya tiba.
  // Format "YYYY-MM" membuat perbandingan string aman secara leksikografis.
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const rawInvoices = await prisma.invoice.findMany({
    where: {
      rental: {
        userId: user.id,
        // Hanya kontrak AKTIF: tagihan kontrak yang sudah berakhir tidak ikut
        // ditampilkan agar satu periode tidak muncul berkali-kali.
        status: RentalStatus.ACTIVE,
      },
      OR: [{ billingPeriod: { lte: currentPeriod } }, { source: InvoiceSource.MANUAL }],
    },
    include: {
      rental: {
        include: {
          unit: { include: { property: true } },
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { dueDate: 'desc' },
  })

  // Format and serialize for client component
  const invoices: SerializedTenantInvoice[] = rawInvoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    billingPeriod: inv.billingPeriod,
    amount: inv.amount.toNumber(),
    dueDate: inv.dueDate.toISOString(),
    status: inv.status as any,
    paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
    unitName: inv.rental.unit.name,
    propertyName: inv.rental.unit.property.name,
    latestPayment: inv.payments[0]
      ? {
          id: inv.payments[0].id,
          amount: inv.payments[0].amount.toNumber(),
          transferDate: inv.payments[0].transferDate.toISOString(),
          status: inv.payments[0].status,
          proofFileUrl: inv.payments[0].proofFileUrl,
        }
      : null,
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
        <div className="relative flex flex-col gap-4 p-6 sm:p-8 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Tagihan Sewa</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-500">
              Tagihan yang belum dibayar selalu ditampilkan, termasuk tagihan yang dibuat khusus
              oleh admin. Tagihan massal bulan berikutnya baru muncul setelah memasuki bulannya.
            </p>
          </div>
        </div>
      </section>

      <InvoiceList invoices={invoices} />
    </div>
  )
}
