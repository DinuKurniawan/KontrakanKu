'use client'

import { useState, useTransition } from 'react'
import CreateInvoiceModal from './create-invoice-modal'
import BatchInvoiceModal from './batch-invoice-modal'
import { syncOverdueInvoicesAction } from './actions'
import { formatDateID, formatRupiah, formatBillingPeriod } from '@/lib/utils'
import {
  Receipt,
  Plus,
  Layers,
  RefreshCw,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface InvoiceManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialInvoices: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeRentals: any[]
}

export default function InvoiceManagement({
  initialInvoices,
  activeRentals,
}: InvoiceManagementProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isSyncing, startSyncTransition] = useTransition()
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedTenant, setSelectedTenant] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Sembunyikan duplikat dari tabel: satu user hanya tampil SATU baris per periode.
  // Prioritas yang dipertahankan: kontrak AKTIF > punya bukti bayar > Lunas > paling awal dibuat.
  const dedupedInvoices = (() => {
    const groups = new Map<string, typeof initialInvoices>()
    for (const inv of initialInvoices) {
      const key = `${inv.rental?.userId}::${inv.billingPeriod}`
      const list = groups.get(key)
      if (list) list.push(inv)
      else groups.set(key, [inv])
    }
    const rank = (inv: (typeof initialInvoices)[number]) =>
      [
        inv.rental?.status === 'ACTIVE' ? 0 : 1,
        (inv.payments ?? []).length > 0 ? 0 : 1,
        inv.status === 'PAID' ? 0 : 1,
      ].join('')
    const picked: typeof initialInvoices = []
    for (const list of groups.values()) {
      if (list.length === 1) {
        picked.push(list[0])
        continue
      }
      const sorted = [...list].sort((a, b) => {
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra < rb ? -1 : 1
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
      picked.push(sorted[0])
    }
    // Pertahankan urutan semula (jatuh tempo terbaru dulu)
    const order = new Map(initialInvoices.map((inv, idx) => [inv.id, idx]))
    return picked.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
  })()

  // Nama penyewa unik untuk filter
  const tenantNames = Array.from(
    new Set(dedupedInvoices.map((inv) => inv.rental.user.name))
  ).sort((a, b) => a.localeCompare(b, 'id'))

  const filteredInvoices = dedupedInvoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.rental.user.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.rental.unit.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      selectedStatus === 'ALL' || inv.status === selectedStatus
    const matchesTenant =
      selectedTenant === 'ALL' || inv.rental.user.name === selectedTenant
    return matchesSearch && matchesStatus && matchesTenant
  })

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: string) {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  function handleTenantChange(value: string) {
    setSelectedTenant(value)
    setCurrentPage(1)
  }

  function handleSyncOverdue() {
    setSyncMessage(null)
    startSyncTransition(async () => {
      const res = await syncOverdueInvoicesAction()
      if (res.success) {
        setSyncMessage(`Sinkronisasi berhasil. ${res.updatedCount || 0} tagihan diperbarui ke status OVERDUE.`)
        setTimeout(() => setSyncMessage(null), 5000)
      }
    })
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Receipt className="h-3.5 w-3.5" />
            Kelola tagihan
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Tagihan Sewa
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
            Invoice bulanan seluruh penyewa kontrakan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncOverdue}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 cursor-pointer disabled:opacity-50"
            title="Periksa dan tandai tagihan yang telah melewati batas jatuh tempo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sinkronisasi Terlambat
          </button>

          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Terbitkan Massal
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Tagihan
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Filter & Pencarian Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Cari no. invoice, nama penyewa, atau unit..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={e => handleStatusChange(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 shadow-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
          >
            <option value="ALL" className="text-stone-900 bg-white">Semua Status</option>
            <option value="UNPAID" className="text-stone-900 bg-white">Belum Dibayar (UNPAID)</option>
            <option value="WAITING_PAYMENT" className="text-stone-900 bg-white">Menunggu Verifikasi (WAITING_PAYMENT)</option>
            <option value="PAID" className="text-stone-900 bg-white">Lunas (PAID)</option>
            <option value="OVERDUE" className="text-stone-900 bg-white">Terlambat (OVERDUE)</option>
            <option value="CANCELLED" className="text-stone-900 bg-white">Dibatalkan (CANCELLED)</option>
          </select>
        </div>

        {/* Nama Penyewa Filter */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedTenant}
            onChange={e => handleTenantChange(e.target.value)}
            className="max-w-48 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-700 shadow-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
            title="Filter berdasarkan nama penyewa"
          >
            <option value="ALL" className="text-stone-900 bg-white">Semua Penyewa</option>
            {tenantNames.map((name) => (
              <option key={name} value={name} className="text-stone-900 bg-white">
                {name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Tabel Tagihan */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {dedupedInvoices.length === 0 ? 'Belum ada tagihan' : 'Tidak ada hasil'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              {dedupedInvoices.length === 0
                ? 'Belum ada invoice/tagihan yang diterbitkan.'
                : 'Tidak ada tagihan yang cocok dengan filter pencarian.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="px-6 py-3.5">No. Invoice</th>
                  <th className="px-6 py-3.5">Penyewa</th>
                  <th className="px-6 py-3.5">Unit</th>
                  <th className="px-6 py-3.5">Periode</th>
                  <th className="px-6 py-3.5">Nominal</th>
                  <th className="px-6 py-3.5">Jatuh Tempo</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedInvoices.map(inv => (
                  <tr key={inv.id} className="transition hover:bg-stone-50/80">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-stone-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-900">
                      {inv.rental.user.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-600">
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">{inv.rental.unit.name}</span>
                      <p className="mt-1 text-[11px] text-stone-400">{inv.rental.unit.property.name}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-800 text-xs">
                      {formatBillingPeriod(inv.billingPeriod)}
                    </td>
                    <td className="px-6 py-4 font-bold tabular-nums text-stone-900 text-sm">
                      {formatRupiah(Number(inv.amount))}
                    </td>
                    <td className="px-6 py-4 text-xs tabular-nums text-stone-500">
                      {formatDateID(inv.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800'
                            : inv.status === 'WAITING_PAYMENT'
                            ? 'bg-sky-100 text-sky-800'
                            : inv.status === 'CANCELLED'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500'
                              : inv.status === 'OVERDUE'
                              ? 'bg-rose-500'
                              : inv.status === 'WAITING_PAYMENT'
                              ? 'bg-sky-500'
                              : inv.status === 'CANCELLED'
                              ? 'bg-stone-400'
                              : 'bg-amber-500'
                          }`}
                        />
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white px-6 py-4 shadow-sm sm:flex-row">
          <p className="text-xs text-stone-500">
            Menampilkan{' '}
            <span className="font-semibold tabular-nums text-stone-700">
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)}
            </span>{' '}
            dari <span className="font-semibold tabular-nums text-stone-700">{filteredInvoices.length}</span> tagihan
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage <= 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200/80 text-stone-500 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold tabular-nums transition cursor-pointer ${
                  page === safeCurrentPage
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-stone-200/80 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safeCurrentPage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200/80 text-stone-500 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        activeRentals={activeRentals}
      />

      <BatchInvoiceModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        activeRentalsCount={activeRentals.length}
      />
    </div>
  )
}
