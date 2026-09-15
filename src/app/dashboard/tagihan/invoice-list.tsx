'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRupiah, formatDateID, formatBillingPeriod } from '@/lib/utils'
import {
  Receipt,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Wallet,
} from 'lucide-react'

export interface SerializedTenantInvoice {
  id: string
  invoiceNumber: string
  billingPeriod: string
  amount: number
  dueDate: string
  status: 'PENDING' | 'UNPAID' | 'WAITING_PAYMENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  paidAt?: string | null
  unitName: string
  propertyName: string
  latestPayment?: {
    id: string
    amount: number
    transferDate: string
    status: string
    proofFileUrl: string
  } | null
}

interface InvoiceListProps {
  invoices: SerializedTenantInvoice[]
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const [filter, setFilter] = useState<'ALL' | 'UNPAID' | 'WAITING' | 'PAID'>('ALL')

  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === 'UNPAID' || inv.status === 'OVERDUE'
  )
  const waitingInvoices = invoices.filter((inv) => inv.status === 'WAITING_PAYMENT')
  const paidInvoices = invoices.filter((inv) => inv.status === 'PAID')

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === 'UNPAID') return inv.status === 'UNPAID' || inv.status === 'OVERDUE'
    if (filter === 'WAITING') return inv.status === 'WAITING_PAYMENT'
    if (filter === 'PAID') return inv.status === 'PAID'
    return true
  })

  // Check if overdue
  const now = new Date()

  function getStatusBadge(inv: SerializedTenantInvoice, isOverdue: boolean) {
    if (inv.status === 'PAID')
      return {
        label: 'Lunas',
        pill: 'bg-emerald-100 text-emerald-800',
        dot: 'bg-emerald-500',
        tile: 'bg-emerald-600 text-white',
        Icon: CheckCircle2,
      }
    if (inv.status === 'WAITING_PAYMENT')
      return {
        label: 'Menunggu Verifikasi Admin',
        pill: 'bg-sky-100 text-sky-800',
        dot: 'bg-sky-500',
        tile: 'bg-sky-600 text-white',
        Icon: Clock,
      }
    if (inv.status === 'CANCELLED')
      return {
        label: 'Dibatalkan',
        pill: 'bg-stone-100 text-stone-600',
        dot: 'bg-stone-400',
        tile: 'bg-stone-500 text-white',
        Icon: Receipt,
      }
    if (inv.status === 'OVERDUE' || isOverdue)
      return {
        label: 'Terlambat Bayar',
        pill: 'bg-rose-100 text-rose-800',
        dot: 'bg-rose-500',
        tile: 'bg-rose-600 text-white',
        Icon: AlertTriangle,
      }
    return {
      label: 'Belum Dibayar',
      pill: 'bg-amber-100 text-amber-800',
      dot: 'bg-amber-500',
      tile: 'bg-amber-500 text-white',
      Icon: Wallet,
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer tabular-nums ${
              filter === 'ALL'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Semua ({invoices.length})
          </button>

          <button
            onClick={() => setFilter('UNPAID')}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer tabular-nums ${
              filter === 'UNPAID'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-500 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            Belum Bayar ({unpaidInvoices.length})
          </button>

          <button
            onClick={() => setFilter('WAITING')}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer tabular-nums ${
              filter === 'WAITING'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-stone-500 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            Menunggu Verifikasi ({waitingInvoices.length})
          </button>

          <button
            onClick={() => setFilter('PAID')}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer tabular-nums ${
              filter === 'PAID'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-500 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Lunas ({paidInvoices.length})
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Receipt className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">Tidak ada tagihan dalam kategori ini</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              {filter === 'ALL'
                ? 'Belum ada tagihan yang diterbitkan untuk kontrak aktif Anda.'
                : 'Coba pilih kategori lain atau tampilkan semua tagihan Anda.'}
            </p>
            {filter !== 'ALL' ? (
              <button
                onClick={() => setFilter('ALL')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Tampilkan Semua Tagihan
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Kembali ke Dashboard
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredInvoices.map((inv) => {
              const isOverdue =
                (inv.status === 'UNPAID' || inv.status === 'OVERDUE') &&
                new Date(inv.dueDate) < now
              const badge = getStatusBadge(inv, isOverdue)
              const StatusIcon = badge.Icon

              return (
                <div
                  key={inv.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-stone-50/80 sm:p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${badge.tile}`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-xs font-bold text-stone-700">
                          {inv.invoiceNumber}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.pill}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>

                        <span className="text-xs text-stone-500">
                          {inv.propertyName} • <strong className="font-semibold text-stone-800">{inv.unitName}</strong>
                        </span>
                      </div>

                      <h3 className="text-base font-bold tracking-tight text-stone-900">
                        Tagihan Bulan {formatBillingPeriod(inv.billingPeriod)}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          Jatuh Tempo:{' '}
                          <strong className="font-semibold text-stone-700 tabular-nums">
                            {formatDateID(inv.dueDate)}
                          </strong>
                        </span>

                        {inv.paidAt && (
                          <span className="font-medium text-emerald-700">
                            Dilunasi pada {formatDateID(inv.paidAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 self-start pl-[58px] md:self-center md:pl-0">
                    <div className="text-left md:text-right">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Total Tagihan
                      </span>
                      <span className="mt-0.5 block text-xl font-bold tabular-nums tracking-tight text-stone-900">
                        {formatRupiah(inv.amount)}
                      </span>
                    </div>

                    {(inv.status === 'UNPAID' || inv.status === 'OVERDUE') && (
                      <Link
                        href={`/dashboard/pembayaran?invoiceId=${inv.id}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        <CreditCard className="h-4 w-4" />
                        Bayar Sekarang
                      </Link>
                    )}

                    {inv.status === 'WAITING_PAYMENT' && (
                      <Link
                        href="/dashboard/riwayat"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-semibold text-sky-800 transition hover:bg-sky-100"
                      >
                        Lihat Status
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    {inv.status === 'PAID' && (
                      <Link
                        href="/dashboard/riwayat"
                        className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                        title="Lihat di Riwayat"
                      >
                        Riwayat
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
