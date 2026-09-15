import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PaymentForm from './payment-form'
import { InvoiceStatus, InvoiceSource, RentalStatus } from '@prisma/client'
import { CheckCircle2, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ invoiceId?: string }>
}

export default async function TenantPembayaranPage({ searchParams }: PageProps) {
  const user = await requireAuth()
  const { invoiceId } = await searchParams

  // Periode berjalan: tagihan MANUAL dari admin selalu bisa dibayar,
  // tagihan BATCH (massal) bulan berikutnya belum bisa dibayar sampai bulannya tiba.
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Ambil invoice aktif yang belum lunas (hanya dari kontrak AKTIF)
  const rawInvoices = await prisma.invoice.findMany({
    where: {
      rental: { userId: user.id, status: RentalStatus.ACTIVE },
      status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.OVERDUE, InvoiceStatus.WAITING_PAYMENT] },
      OR: [{ billingPeriod: { lte: currentPeriod } }, { source: InvoiceSource.MANUAL }],
    },
    include: {
      rental: {
        include: { unit: true },
      },
    },
    orderBy: { dueDate: 'asc' },
  })

  // Rekening bank aktif
  const rawPaymentAccounts = await prisma.paymentAccount.findMany({
    where: { isActive: true },
    orderBy: { bankName: 'asc' },
  })

  if (rawInvoices.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-stone-900">
            Tidak Ada Tagihan Tertunggak
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-stone-500">
            Seluruh tagihan sewa Anda telah lunas atau belum ada invoice baru yang diterbitkan.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Format invoices and accounts for client component
  const invoices = rawInvoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    billingPeriod: inv.billingPeriod,
    amount: inv.amount.toNumber(),
    dueDate: inv.dueDate.toISOString(),
    status: inv.status,
    unitName: inv.rental.unit.name,
  }))

  const paymentAccounts = rawPaymentAccounts.map((acc) => ({
    id: acc.id,
    bankName: acc.bankName,
    accountNumber: acc.accountNumber,
    accountName: acc.accountName,
    qrCodeUrl: acc.qrCodeUrl,
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
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Konfirmasi Pembayaran</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone-500">
              Kirim bukti transfer bank manual untuk diverifikasi oleh pengelola kontrakan.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
        <PaymentForm
          invoices={invoices}
          paymentAccounts={paymentAccounts}
          selectedInvoiceId={invoiceId}
          defaultSenderName={user.name}
        />
      </div>
    </div>
  )
}
