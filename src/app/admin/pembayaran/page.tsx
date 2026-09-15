import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateID, formatRupiah, formatBillingPeriod } from '@/lib/utils'
import PaymentVerificationCard, { SerializedPaymentVerification } from './verification-card'
import { ShieldCheck, Clock, History, Inbox } from 'lucide-react'

export default async function AdminPembayaranPage() {
  await requireAdmin()

  const rawPayments = await prisma.payment.findMany({
    include: {
      invoice: {
        include: {
          rental: {
            include: {
              user: true,
              unit: { include: { property: true } },
            },
          },
        },
      },
      paymentAccount: true,
      verifiedBy: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Format and serialize data for client component (eliminating Decimal objects)
  const payments = rawPayments.map((p) => ({
    id: p.id,
    amount: p.amount.toNumber(),
    transferDate: p.transferDate.toISOString(),
    senderBank: p.senderBank,
    senderName: p.senderName,
    proofFileUrl: p.proofFileUrl,
    notes: p.notes,
    status: p.status,
    rejectionReason: p.rejectionReason,
    invoice: {
      id: p.invoice.id,
      invoiceNumber: p.invoice.invoiceNumber,
      billingPeriod: p.invoice.billingPeriod,
      amount: p.invoice.amount.toNumber(),
      rental: {
        user: {
          name: p.invoice.rental.user.name,
        },
        unit: {
          name: p.invoice.rental.unit.name,
          property: {
            name: p.invoice.rental.unit.property.name,
          },
        },
      },
    },
  }))

  const pendingPayments: SerializedPaymentVerification[] = payments.filter((p) => p.status === 'PENDING')
  // Riwayat: satu baris per penyewa (terbaru saja, nama yang sama tidak tampil berulang)
  const completedPayments = (() => {
    const seen = new Set<string>()
    return payments.filter((p) => {
      if (p.status === 'PENDING') return false
      const key = p.invoice.rental.user.name.trim().toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  })()

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verifikasi pembayaran
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Verifikasi Pembayaran
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
            Periksa bukti transfer manual dari penyewa dan verifikasi pelunasan tagihan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="tabular-nums">{pendingPayments.length}</span> menunggu
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-600 shadow-sm">
            <span className="tabular-nums">{completedPayments.length}</span> riwayat
          </span>
        </div>
      </div>

      {/* Bagian 1: Antrean Pending yang Memerlukan Aksi (PRD Sec 22 & 53) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-stone-900">
              Menunggu Verifikasi
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold tabular-nums text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {pendingPayments.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">Bukti transfer yang memerlukan keputusan Anda</p>
          </div>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">Semua sudah diverifikasi</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Tidak ada pembayaran yang sedang menunggu verifikasi saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingPayments.map((payment) => (
              <PaymentVerificationCard key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </div>

      {/* Bagian 2: Riwayat Pembayaran yang Sudah Diproses */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-stone-900">Riwayat Pembayaran Sebelumnya</h2>
            <p className="mt-0.5 text-xs text-stone-500">Keputusan verifikasi yang sudah diproses</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
          {completedPayments.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada riwayat</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Belum ada riwayat pembayaran yang diproses.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {completedPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-3 p-5 transition hover:bg-stone-50/80">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">
                        {payment.invoice.rental.user.name}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                        {payment.invoice.rental.unit.name}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Tagihan {formatBillingPeriod(payment.invoice.billingPeriod)} • Transfer {formatDateID(payment.transferDate)}
                    </p>
                    {payment.rejectionReason && (
                      <p className="mt-1.5 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-xs italic text-rose-700">
                        Alasan penolakan: &quot;{payment.rejectionReason}&quot;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-nums text-stone-900">
                      {formatRupiah(payment.amount)}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        payment.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          payment.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
