import { prisma } from '@/lib/prisma'
import { formatRupiah, formatBillingPeriod } from '@/lib/utils'
import {
  Building2,
  DoorOpen,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  CalendarDays,
  CircleAlert,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { UnitStatus, InvoiceStatus, PaymentStatus } from '@prisma/client'
import RevenueChart from './revenue-chart'

const dateFmt = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default async function AdminDashboardPage() {
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  // Query statistik langsung dari database PostgreSQL.
  // groupBy dipakai agar beberapa count yang hanya beda status
  // digabung menjadi SATU query (bukan N query berulang).
  const [
    totalProperties,
    unitGroups,
    unpaidInvoices,
    pendingPayments,
    monthGroups,
    recentPaymentsRaw,
    approvedPayments,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.unit.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.invoice.count({
      where: {
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.OVERDUE, InvoiceStatus.WAITING_PAYMENT] },
      },
    }),
    prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
    // Overview Tagihan Bulan Ini (PRD Sec 9.2): satu query untuk semua status
    prisma.invoice.groupBy({
      by: ['status'],
      where: { billingPeriod: currentMonth },
      _count: { _all: true },
    }),
    prisma.payment.findMany({
      // Ambil lebih banyak agar setelah dedup per penyewa tetap terisi 5 baris.
      // Hanya kolom yang dirender yang diambil (tanpa user:true / unit:true penuh).
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        status: true,
        senderBank: true,
        senderName: true,
        createdAt: true,
        invoice: {
          select: {
            billingPeriod: true,
            rental: {
              select: {
                user: { select: { id: true, name: true } },
                unit: { select: { name: true } },
              },
            },
          },
        },
      },
    }),
    // Pemasukan: pembayaran APPROVED 5 tahun terakhir untuk grafik bulanan & tahunan
    prisma.payment.findMany({
      where: {
        status: PaymentStatus.APPROVED,
        verifiedAt: { gte: new Date(today.getFullYear() - 4, 0, 1) },
      },
      select: { amount: true, verifiedAt: true },
    }),
  ])

  const unitCountByStatus = new Map(unitGroups.map((g) => [g.status, g._count._all]))
  const occupiedUnits = unitCountByStatus.get(UnitStatus.OCCUPIED) ?? 0
  const availableUnits = unitCountByStatus.get(UnitStatus.AVAILABLE) ?? 0
  const totalUnits = unitGroups.reduce((sum, g) => sum + g._count._all, 0)

  const monthCountByStatus = new Map(monthGroups.map((g) => [g.status, g._count._all]))
  const currentMonthPaid = monthCountByStatus.get(InvoiceStatus.PAID) ?? 0
  const currentMonthWaiting = monthCountByStatus.get(InvoiceStatus.WAITING_PAYMENT) ?? 0
  const currentMonthUnpaid = monthCountByStatus.get(InvoiceStatus.UNPAID) ?? 0
  const currentMonthOverdue = monthCountByStatus.get(InvoiceStatus.OVERDUE) ?? 0

  // Agregasi pemasukan per bulan (3 tahun terakhir) & per tahun (5 tahun terakhir)
  const currentYear = today.getFullYear()
  const monthlySeries = [currentYear - 2, currentYear - 1, currentYear].map((year) => ({
    year,
    months: Array.from({ length: 12 }, () => 0 as number),
  }))
  const yearlySeries = Array.from({ length: 5 }, (_, i) => ({
    year: currentYear - 4 + i,
    total: 0 as number,
  }))
  for (const p of approvedPayments) {
    if (!p.verifiedAt) continue
    const amount = Number(p.amount)
    const y = p.verifiedAt.getFullYear()
    const m = p.verifiedAt.getMonth()
    const yearIdx = y - (currentYear - 4)
    if (yearIdx >= 0 && yearIdx < 5) yearlySeries[yearIdx].total += amount
    const monthIdx = y - (currentYear - 2)
    if (monthIdx >= 0 && monthIdx < 3 && m >= 0 && m < 12) {
      monthlySeries[monthIdx].months[m] += amount
    }
  }

  // Aktivitas terkini: satu baris per penyewa (transfer terbaru saja,
  // nama yang sama tidak tampil berulang)
  const recentPayments = (() => {
    const seen = new Set<string>()
    const unique: typeof recentPaymentsRaw = []
    for (const p of recentPaymentsRaw) {
      const userId = p.invoice.rental.user.id
      if (seen.has(userId)) continue
      seen.add(userId)
      unique.push(p)
      if (unique.length >= 5) break
    }
    return unique
  })()

  const occupancyPct = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0
  const monthTotal = currentMonthPaid + currentMonthWaiting + currentMonthUnpaid + currentMonthOverdue
  const collectedPct = monthTotal > 0 ? Math.round((currentMonthPaid / monthTotal) * 100) : 0

  const stats = [
    {
      label: 'Total Kontrakan',
      value: String(totalProperties),
      sub: 'Kompleks aktif',
      href: '/admin/kontrakan',
      linkLabel: 'Kelola kontrakan',
      icon: Building2,
      tile: 'bg-emerald-600 text-white',
      ring: 'ring-emerald-600/10',
    },
    {
      label: 'Kamar Terisi',
      value: `${occupiedUnits} / ${totalUnits}`,
      sub: `${availableUnits} kamar kosong • ${occupancyPct}% terisi`,
      href: '/admin/unit',
      linkLabel: 'Lihat unit',
      icon: DoorOpen,
      tile: 'bg-sky-600 text-white',
      ring: 'ring-sky-600/10',
      progress: occupancyPct,
      progressBar: 'bg-sky-500',
      progressTrack: 'bg-sky-100',
    },
    {
      label: 'Tagihan Belum Lunas',
      value: String(unpaidInvoices),
      sub: 'Perlu ditagihkan / diverifikasi',
      href: '/admin/tagihan',
      linkLabel: 'Kelola tagihan',
      icon: Wallet,
      tile: 'bg-amber-500 text-white',
      ring: 'ring-amber-500/10',
    },
    {
      label: 'Menunggu Verifikasi',
      value: String(pendingPayments),
      sub: pendingPayments > 0 ? 'Bukti transfer baru masuk' : 'Semua sudah diverifikasi',
      href: '/admin/pembayaran',
      linkLabel: 'Buka verifikasi',
      icon: CreditCard,
      tile: pendingPayments > 0 ? 'bg-rose-600 text-white' : 'bg-stone-500 text-white',
      ring: 'ring-rose-600/10',
      alert: pendingPayments > 0,
    },
  ]

  const monthTiles = [
    {
      label: 'Lunas',
      value: currentMonthPaid,
      hint: 'Telah diverifikasi',
      icon: CheckCircle2,
      box: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-900',
      sub: 'text-emerald-600',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Menunggu',
      value: currentMonthWaiting,
      hint: 'Proses transfer / cek',
      icon: Clock,
      box: 'bg-sky-50 border-sky-100',
      text: 'text-sky-900',
      sub: 'text-sky-600',
      iconColor: 'text-sky-600',
    },
    {
      label: 'Belum Bayar',
      value: currentMonthUnpaid,
      hint: 'Belum ada bukti',
      icon: Wallet,
      box: 'bg-stone-50 border-stone-200',
      text: 'text-stone-900',
      sub: 'text-stone-500',
      iconColor: 'text-stone-400',
    },
    {
      label: 'Terlambat',
      value: currentMonthOverdue,
      hint: 'Lewat jatuh tempo',
      icon: CircleAlert,
      box: 'bg-rose-50 border-rose-100',
      text: 'text-rose-900',
      sub: 'text-rose-600',
      iconColor: 'text-rose-500',
    },
  ]

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
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Dashboard pengelola
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Ringkasan operasional
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              {dateFmt.format(today)} — pantau hunian, tagihan bulan berjalan, dan verifikasi
              transfer penyewa dalam satu layar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/tagihan"
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700"
            >
              <Plus className="h-4 w-4" />
              Buat tagihan
            </Link>
            <Link
              href="/admin/pembayaran"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Verifikasi bayar
              {pendingPayments > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold tabular-nums">
                  {pendingPayments}
                </span>
              )}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistik utama */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md ${stat.ring} hover:ring-1`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${stat.tile}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {stat.alert && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                  </span>
                )}
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-stone-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-stone-500">{stat.sub}</p>
              {stat.progress !== undefined && (
                <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${stat.progressTrack}`}>
                  <div
                    className={`h-full rounded-full ${stat.progressBar}`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
              <Link
                href={stat.href}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:gap-1.5 hover:text-emerald-800"
              >
                {stat.linkLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )
        })}
      </section>

      {/* Banner verifikasi pending */}
      {pendingPayments > 0 && (
        <section className="relative overflow-hidden rounded-2xl bg-stone-900 px-5 py-4 text-white shadow-sm sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(400px 160px at 15% 20%, rgba(16,185,129,0.35), transparent 70%)',
            }}
          />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm text-stone-100">
                Ada <span className="font-bold text-white tabular-nums">{pendingPayments} bukti pembayaran</span>{' '}
                menunggu verifikasi Anda.
              </p>
            </div>
            <Link
              href="/admin/pembayaran"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-stone-900 transition hover:bg-emerald-50"
            >
              Buka verifikasi
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Tagihan bulan ini */}
      <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-stone-900">
                Tagihan {formatBillingPeriod(currentMonth)}
              </h2>
              <p className="mt-0.5 text-xs text-stone-500">
                {monthTotal > 0 ? (
                  <>
                    <span className="font-semibold text-stone-700 tabular-nums">{collectedPct}%</span> lunas
                    dari <span className="font-semibold text-stone-700 tabular-nums">{monthTotal}</span> tagihan
                    periode berjalan
                  </>
                ) : (
                  'Belum ada tagihan pada periode berjalan'
                )}
              </p>
            </div>
          </div>
          <Link
            href="/admin/tagihan"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
          >
            Kelola tagihan
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {monthTotal > 0 && (
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                style={{ width: `${collectedPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {monthTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <div key={tile.label} className={`rounded-2xl border p-4 transition hover:shadow-sm ${tile.box}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${tile.text}`}>{tile.label}</span>
                  <Icon className={`h-4 w-4 ${tile.iconColor}`} />
                </div>
                <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${tile.text}`}>
                  {tile.value}
                </p>
                <p className={`mt-0.5 text-[11px] ${tile.sub}`}>{tile.hint}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Grafik + aktivitas */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <RevenueChart
            monthlySeries={monthlySeries}
            yearlySeries={yearlySeries}
            defaultYear={currentYear}
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold tracking-tight text-stone-900">Aktivitas terkini</h2>
              <p className="mt-0.5 text-xs text-stone-500">Bukti transfer terbaru dari penyewa</p>
            </div>
            <Link
              href="/admin/riwayat"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Semua
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada transaksi</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                Bukti pembayaran yang dikirim penyewa akan muncul di sini.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentPayments.map((payment) => {
                const initials = payment.invoice.rental.user.name
                  .split(' ')
                  .map((part: string) => part.charAt(0))
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
                return (
                  <li key={payment.id} className="flex items-center justify-between gap-3 px-6 py-4 transition hover:bg-stone-50/80">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="truncate text-sm font-semibold text-stone-900">
                            {payment.invoice.rental.user.name}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                            {payment.invoice.rental.unit.name}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-stone-500">
                          {payment.invoice.billingPeriod} • {payment.senderBank} a.n {payment.senderName}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold tabular-nums text-stone-900">
                        {formatRupiah(payment.amount.toNumber())}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          payment.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : payment.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            payment.status === 'PENDING'
                              ? 'bg-amber-500'
                              : payment.status === 'APPROVED'
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {payment.status}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
