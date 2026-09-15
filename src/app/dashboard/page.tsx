import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatRupiah, formatDateID, formatBillingPeriod } from '@/lib/utils'
import Link from 'next/link'
import {
  Receipt,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  CreditCard,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { RentalStatus, InvoiceStatus, InvoiceSource } from '@prisma/client'

export default async function TenantDashboardPage() {
  const user = await requireAuth()

  // Periode berjalan: tagihan bulan berikutnya disembunyikan sampai bulannya tiba
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  // Ambil kontrak rental aktif milik user
  const activeRental = await prisma.rental.findFirst({
    where: {
      userId: user.id,
      status: RentalStatus.ACTIVE,
    },
    include: {
      unit: {
        include: {
          property: true,
        },
      },
      invoices: {
        where: {
          OR: [{ billingPeriod: { lte: currentMonth } }, { source: InvoiceSource.MANUAL }],
        },
        orderBy: { dueDate: 'desc' },
        take: 5,
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  // Tagihan bulan ini yang belum lunas
  const latestUnpaidInvoice = activeRental?.invoices.find(
    (inv) =>
      inv.status === InvoiceStatus.UNPAID ||
      inv.status === InvoiceStatus.OVERDUE ||
      inv.status === InvoiceStatus.WAITING_PAYMENT
  )

  const isOverdue =
    latestUnpaidInvoice &&
    (latestUnpaidInvoice.status === InvoiceStatus.OVERDUE ||
      (latestUnpaidInvoice.status === InvoiceStatus.UNPAID &&
        new Date(latestUnpaidInvoice.dueDate) < new Date()))

  return (
    <div className="w-full space-y-6">
      {/* Hero sapaan penyewa */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 200px at 12% 0%, rgba(16,185,129,0.12), transparent 70%), radial-gradient(420px 200px at 95% 10%, rgba(14,165,233,0.10), transparent 70%)',
          }}
        />
        <div className="relative p-6 sm:p-8">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Building className="h-3.5 w-3.5" />
            Portal Penyewa
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Halo, {user.name} 👋
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
            Selamat datang di portal informasi dan pembayaran sewa kontrakan Anda.
          </p>
        </div>
      </section>

      {/* Alert Banner jika Terlambat Bayar */}
      {isOverdue && (
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-rose-900 uppercase tracking-wider">
                Pemberitahuan Tagihan Terlambat
              </p>
              <p className="text-xs leading-relaxed text-rose-700 mt-0.5">
                Tagihan periode <strong>{formatBillingPeriod(latestUnpaidInvoice.billingPeriod)}</strong> telah melewati batas waktu jatuh tempo ({formatDateID(latestUnpaidInvoice.dueDate)}). Mohon segera lakukan pembayaran.
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/pembayaran?invoiceId=${latestUnpaidInvoice.id}`}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Bayar Sekarang
          </Link>
        </div>
      )}

      {/* Hero Card: Tagihan Terkini (PRD Sec 25) */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 200px at 12% 0%, rgba(16,185,129,0.10), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Tagihan Sewa Terkini
              </span>
              {latestUnpaidInvoice && (
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    latestUnpaidInvoice.status === InvoiceStatus.WAITING_PAYMENT
                      ? 'bg-amber-100 text-amber-800'
                      : isOverdue
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      latestUnpaidInvoice.status === InvoiceStatus.WAITING_PAYMENT
                        ? 'bg-amber-500'
                        : isOverdue
                        ? 'bg-rose-500'
                        : 'bg-stone-400'
                    }`}
                  />
                  {latestUnpaidInvoice.status === InvoiceStatus.WAITING_PAYMENT
                    ? 'Menunggu Verifikasi Admin'
                    : isOverdue
                    ? 'Terlambat'
                    : 'Belum Dibayar'}
                </span>
              )}
            </div>

            {latestUnpaidInvoice ? (
              <div className="mt-4">
                <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-stone-900">
                  {formatRupiah(latestUnpaidInvoice.amount.toNumber())}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    Periode: <strong className="font-semibold text-stone-900">{formatBillingPeriod(latestUnpaidInvoice.billingPeriod)}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    Jatuh Tempo: <strong className="font-semibold text-stone-900">{formatDateID(latestUnpaidInvoice.dueDate)}</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight text-stone-900">Tidak ada tagihan tertunggak 🎉</p>
                  <p className="text-xs leading-relaxed text-stone-500 mt-1">
                    Seluruh pembayaran sewa Anda telah diverifikasi lunas. Terima kasih atas ketepatan waktu Anda!
                  </p>
                </div>
              </div>
            )}
          </div>

          {latestUnpaidInvoice && (
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              {latestUnpaidInvoice.status === InvoiceStatus.WAITING_PAYMENT ? (
                <Link
                  href="/dashboard/riwayat"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  <Clock className="w-4 h-4 text-amber-700" />
                  Lihat Status Verifikasi
                </Link>
              ) : (
                <Link
                  href={`/dashboard/pembayaran?invoiceId=${latestUnpaidInvoice.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  <CreditCard className="w-4 h-4" />
                  Bayar Sekarang
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Detail Unit Saya & Histori Terakhir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Info Kontrakan Saya (PRD Sec 26) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-stone-900">Kontrakan Saya</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Informasi unit yang Anda tempati</p>
                </div>
              </div>
              <Link
                href="/dashboard/kontrakan-saya"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700 transition-all hover:gap-1.5 hover:text-emerald-800"
              >
                Detail
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeRental ? (
              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex justify-between gap-3 py-2 border-b border-stone-100">
                  <span className="text-stone-500">Nama Kontrakan:</span>
                  <span className="font-semibold text-stone-900 text-right">{activeRental.unit.property.name}</span>
                </div>
                <div className="flex justify-between gap-3 py-2 border-b border-stone-100">
                  <span className="text-stone-500">Nomor Unit:</span>
                  <span className="font-bold text-emerald-800">{activeRental.unit.name}</span>
                </div>
                <div className="flex justify-between gap-3 py-2 border-b border-stone-100">
                  <span className="text-stone-500">Sewa Bulanan:</span>
                  <span className="font-bold tabular-nums tracking-tight text-stone-900">
                    {formatRupiah(activeRental.monthlyRent.toNumber())}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-2 border-b border-stone-100">
                  <span className="text-stone-500">Mulai Sewa:</span>
                  <span className="font-medium text-stone-700">{formatDateID(activeRental.startDate)}</span>
                </div>
                <div className="flex justify-between gap-3 items-center py-2">
                  <span className="text-stone-500">Status Sewa:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {activeRental.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                  <Building className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada unit aktif</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  Anda belum ada unit kontrakan aktif. Silakan hubungi pengelola.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Riwayat Tagihan Terakhir */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-stone-900">Riwayat Tagihan</h3>
                  <p className="text-xs text-stone-500 mt-0.5">5 periode tagihan terbaru</p>
                </div>
              </div>
              <Link
                href="/dashboard/tagihan"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700 transition-all hover:gap-1.5 hover:text-emerald-800"
              >
                Semua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!activeRental || activeRental.invoices.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                  <Receipt className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada tagihan</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  Belum ada riwayat tagihan.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {activeRental.invoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between gap-3 transition rounded-xl px-2 -mx-2 hover:bg-stone-50/80">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-tight text-stone-900">
                        {formatBillingPeriod(inv.billingPeriod)}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Jatuh tempo: {formatDateID(inv.dueDate)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold tabular-nums tracking-tight text-stone-900">
                        {formatRupiah(inv.amount.toNumber())}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'WAITING_PAYMENT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500'
                              : inv.status === 'WAITING_PAYMENT'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {inv.status === 'PAID' ? 'Lunas' : inv.status === 'WAITING_PAYMENT' ? 'Menunggu' : 'Belum Bayar'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
