'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRupiah, formatDateID, formatBillingPeriod } from '@/lib/utils'
import {
  History,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  X,
  TrendingUp,
  Receipt,
  ArrowRight,
} from 'lucide-react'

export interface SerializedPayment {
  id: string
  invoiceId: string
  invoiceNumber: string
  billingPeriod: string
  amount: number
  invoiceAmount: number
  transferDate: string
  senderBank: string
  senderName: string
  proofFileUrl: string
  notes?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string | null
  verifiedByName?: string | null
  verifiedAt?: string | null
  createdAt: string
  paymentAccount?: {
    bankName: string
    accountNumber: string
    accountName: string
  } | null
  tenant: {
    name: string
    email: string
    phone?: string | null
  }
  unit: {
    name: string
    propertyName: string
  }
}

interface HistoryViewProps {
  initialPayments: SerializedPayment[]
}

export default function HistoryView({ initialPayments }: HistoryViewProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'REJECTED' | 'PENDING'>('ALL')
  const [periodFilter, setPeriodFilter] = useState<string>('ALL')
  const [selectedPayment, setSelectedPayment] = useState<SerializedPayment | null>(null)

  // Extract distinct billing periods
  const periods = Array.from(new Set(initialPayments.map((p) => p.billingPeriod))).sort().reverse()

  // Calculate Financial Stats
  const approvedPayments = initialPayments.filter((p) => p.status === 'APPROVED')
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0)
  const rejectedCount = initialPayments.filter((p) => p.status === 'REJECTED').length
  const pendingCount = initialPayments.filter((p) => p.status === 'PENDING').length

  // Filter Payments
  const filteredPayments = initialPayments.filter((p) => {
    const matchesSearch =
      p.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      p.unit.name.toLowerCase().includes(search.toLowerCase()) ||
      p.unit.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.senderBank.toLowerCase().includes(search.toLowerCase()) ||
      p.senderName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    const matchesPeriod = periodFilter === 'ALL' || p.billingPeriod === periodFilter

    return matchesSearch && matchesStatus && matchesPeriod
  })

  // Tabel: satu baris per tanggal transfer (tanggal yang sama tidak tampil berulang)
  const displayedPayments = (() => {
    const seen = new Set<string>()
    return filteredPayments.filter((p) => {
      const key = p.transferDate.slice(0, 10)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  })()

  return (
    <div className="space-y-6">
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
              <History className="h-3.5 w-3.5" />
              Riwayat transaksi
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Riwayat Transaksi
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Rekapitulasi seluruh histori pembayaran sewa dan bukti transfer dari penyewa
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/pembayaran"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Verifikasi pembayaran
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Dana Masuk</p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-stone-900">{formatRupiah(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {approvedPayments.length} pembayaran lunas
            </p>
          </div>
        </div>

        <div className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white shadow-sm flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Transaksi Berhasil</p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-stone-900">{approvedPayments.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Telah diverifikasi</p>
          </div>
        </div>

        <div className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white shadow-sm flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Pembayaran Ditolak</p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-stone-900">{rejectedCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Bukti transfer tidak valid</p>
          </div>
        </div>

        <div className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white shadow-sm flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Menunggu Verifikasi</p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-stone-900">{pendingCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Perlu diperiksa</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari penyewa, unit, invoice..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'APPROVED'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lunas
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                statusFilter === 'REJECTED'
                  ? 'bg-rose-700 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ditolak
            </button>
          </div>

          {/* Period Filter */}
          {periods.length > 0 && (
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="ALL">Semua Periode</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {formatBillingPeriod(p)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Receipt className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {search || statusFilter !== 'ALL' || periodFilter !== 'ALL'
                ? 'Tidak ada hasil yang cocok'
                : 'Belum ada transaksi'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              {search || statusFilter !== 'ALL' || periodFilter !== 'ALL'
                ? 'Tidak ada transaksi yang cocok dengan filter pencarian.'
                : 'Belum ada transaksi pembayaran yang tercatat.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-5 py-3.5">Tanggal Transfer</th>
                  <th className="px-5 py-3.5">Penyewa & Unit</th>
                  <th className="px-5 py-3.5">Periode / Tagihan</th>
                  <th className="px-5 py-3.5">Saluran Transfer</th>
                  <th className="px-5 py-3.5 text-right">Nominal</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {displayedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-5 py-4 text-stone-600 whitespace-nowrap">
                      <div className="font-semibold text-stone-800">{formatDateID(p.transferDate)}</div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-stone-900">{p.tenant.name}</div>
                      <div className="text-stone-500 flex items-center gap-1 mt-0.5">
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                          {p.unit.name}
                        </span>
                        <span className="text-stone-400 truncate max-w-[140px]">{p.unit.propertyName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-stone-800">{formatBillingPeriod(p.billingPeriod)}</div>
                      <span className="font-mono text-[11px] text-stone-400">{p.invoiceNumber}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-stone-800">{p.senderBank}</div>
                      <div className="text-[11px] text-stone-500">a.n {p.senderName}</div>
                      {p.paymentAccount && (
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Tujuan: {p.paymentAccount.bankName}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums tracking-tight text-stone-900">
                      {formatRupiah(p.amount)}
                    </td>

                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          p.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {p.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {p.status === 'APPROVED' ? 'Lunas' : p.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                        title="Lihat Rincian & Bukti Transfer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail & Bukti Pembayaran */}
      {selectedPayment && (
        <div onClick={e => { if (e.target === e.currentTarget) setSelectedPayment(null) }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-stone-900">Rincian Transaksi Pembayaran</h3>
                  <p className="text-xs text-stone-500 font-mono">{selectedPayment.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  selectedPayment.status === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : selectedPayment.status === 'REJECTED'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {selectedPayment.status === 'APPROVED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : selectedPayment.status === 'REJECTED' ? (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {selectedPayment.status === 'APPROVED'
                      ? 'Pembayaran Terverifikasi (Lunas)'
                      : selectedPayment.status === 'REJECTED'
                      ? 'Pembayaran Ditolak'
                      : 'Menunggu Verifikasi Admin'}
                  </h4>
                  {selectedPayment.rejectionReason && (
                    <p className="text-xs mt-1 text-rose-700 font-medium">
                      Alasan: &quot;{selectedPayment.rejectionReason}&quot;
                    </p>
                  )}
                  {selectedPayment.verifiedByName && selectedPayment.verifiedAt && (
                    <p className="text-[11px] text-stone-500 mt-1">
                      Diverifikasi oleh <span className="font-semibold">{selectedPayment.verifiedByName}</span> pada{' '}
                      {new Date(selectedPayment.verifiedAt).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Penyewa</span>
                  <span className="font-semibold text-stone-900 block">{selectedPayment.tenant.name}</span>
                  <span className="text-stone-500">{selectedPayment.tenant.phone || selectedPayment.tenant.email}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Unit Kamar</span>
                  <span className="font-semibold text-stone-900 block">{selectedPayment.unit.name}</span>
                  <span className="text-stone-500">{selectedPayment.unit.propertyName}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Nominal Ditransfer</span>
                  <span className="font-bold text-stone-900 text-sm font-mono block">
                    {formatRupiah(selectedPayment.amount)}
                  </span>
                  <span className="text-stone-500">
                    Tagihan: {formatRupiah(selectedPayment.invoiceAmount)}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Metode Transfer</span>
                  <span className="font-semibold text-stone-900 block">{selectedPayment.senderBank}</span>
                  <span className="text-stone-500">a.n {selectedPayment.senderName}</span>
                </div>
              </div>

              {/* Bukti Transfer */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">Bukti Transfer Penyewa</label>
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center max-h-60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPayment.proofFileUrl}
                    alt="Bukti Transfer"
                    className="max-h-60 w-auto object-contain cursor-pointer"
                    onClick={() => window.open(selectedPayment.proofFileUrl, '_blank')}
                  />
                </div>
                <div className="mt-1.5 flex justify-end">
                  <a
                    href={selectedPayment.proofFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Buka Ukuran Penuh
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                  <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400 font-medium">Catatan Penyewa:</span>
                  <p className="text-stone-700 italic">&quot;{selectedPayment.notes}&quot;</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex justify-end bg-stone-50/50">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
