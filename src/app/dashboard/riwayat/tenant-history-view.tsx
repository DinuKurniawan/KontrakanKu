'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRupiah, formatDateID, formatBillingPeriod } from '@/lib/utils'
import {
  CheckCircle2,
  Clock,
  XCircle,
  X,
  ChevronRight,
  RotateCcw,
  Wallet,
  ExternalLink,
  ReceiptText,
} from 'lucide-react'

export interface SerializedTenantPayment {
  id: string
  invoiceId: string
  invoiceNumber: string
  billingPeriod: string
  amount: number
  transferDate: string
  senderBank: string
  senderName: string
  proofFileUrl: string
  notes?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string | null
  createdAt: string
  unitName: string
  propertyName: string
  destinationBank?: string | null
}

interface TenantHistoryViewProps {
  payments: SerializedTenantPayment[]
}

type Filter = 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'

const STATUS_META = {
  APPROVED: {
    label: 'Lunas',
    icon: CheckCircle2,
    iconClass: 'bg-emerald-50 text-emerald-600',
    pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    tileClass: 'bg-emerald-600 text-white',
  },
  PENDING: {
    label: 'Menunggu',
    icon: Clock,
    iconClass: 'bg-amber-50 text-amber-600',
    pillClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    tileClass: 'bg-amber-500 text-white',
  },
  REJECTED: {
    label: 'Ditolak',
    icon: XCircle,
    iconClass: 'bg-rose-50 text-rose-600',
    pillClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    tileClass: 'bg-rose-600 text-white',
  },
} as const

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'Semua' },
  { key: 'APPROVED', label: 'Lunas' },
  { key: 'PENDING', label: 'Menunggu' },
  { key: 'REJECTED', label: 'Ditolak' },
]

function countBy(payments: SerializedTenantPayment[], status: Filter): number {
  if (status === 'ALL') return payments.length
  return payments.filter((p) => p.status === status).length
}

export default function TenantHistoryView({ payments }: TenantHistoryViewProps) {
  const [statusFilter, setStatusFilter] = useState<Filter>('ALL')
  const [selectedPayment, setSelectedPayment] = useState<SerializedTenantPayment | null>(null)

  const totalPaid = payments
    .filter((p) => p.status === 'APPROVED')
    .reduce((acc, p) => acc + p.amount, 0)

  const filteredPayments =
    statusFilter === 'ALL' ? payments : payments.filter((p) => p.status === statusFilter)

  // Satu baris per periode pembayaran (periode yang sama tidak tampil berulang)
  const displayedPayments = (() => {
    const seen = new Set<string>()
    return filteredPayments.filter((p) => {
      if (seen.has(p.billingPeriod)) return false
      seen.add(p.billingPeriod)
      return true
    })
  })()

  return (
    <div className="space-y-4">
      {/* Ringkasan ringkas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Terverifikasi
          </p>
          <p className="mt-1 truncate text-xl font-bold tabular-nums tracking-tight text-stone-900">
            {formatRupiah(totalPaid)}
          </p>
          <p className="mt-1 text-xs text-stone-500">Total pembayaran lunas</p>
        </div>
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Menunggu
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-stone-900">
            {countBy(payments, 'PENDING')}{' '}
            <span className="text-xs font-medium text-stone-400">transaksi</span>
          </p>
          <p className="mt-1 text-xs text-stone-500">Perlu verifikasi pengelola</p>
        </div>
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
            <XCircle className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Ditolak
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-stone-900">
            {countBy(payments, 'REJECTED')}{' '}
            <span className="text-xs font-medium text-stone-400">transaksi</span>
          </p>
          <p className="mt-1 text-xs text-stone-500">Perlu kirim ulang bukti</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-stone-200/80 bg-white p-1 shadow-sm">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              statusFilter === f.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            {f.label}
            <span
              className={`ml-1.5 tabular-nums ${
                statusFilter === f.key ? 'opacity-80' : 'text-stone-400'
              }`}
            >
              {countBy(payments, f.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Riwayat transaksi */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <ReceiptText className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {payments.length === 0 ? 'Belum ada riwayat pembayaran' : 'Tidak ada transaksi pada filter ini'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              {payments.length === 0
                ? 'Bukti pembayaran yang Anda kirim akan tercatat di sini.'
                : 'Coba pilih filter status yang lain.'}
            </p>
            {payments.length === 0 && (
              <Link
                href="/dashboard/tagihan"
                className="mt-4 inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Lihat Tagihan
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {displayedPayments.map((p) => {
              const meta = STATUS_META[p.status]
              const Icon = meta.icon
              return (
                <li key={p.id} className="transition hover:bg-stone-50/80">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(p)}
                    className="flex w-full items-center gap-3.5 px-6 py-4 text-left transition cursor-pointer"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${meta.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-stone-900">
                          {formatBillingPeriod(p.billingPeriod)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.pillClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                          {meta.label}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-stone-500">
                        #{p.invoiceNumber} · {p.senderBank} · {formatDateID(p.transferDate)}
                      </span>
                      {p.status === 'REJECTED' && p.rejectionReason && (
                        <span className="block text-xs text-rose-600 mt-1.5 truncate">
                          {p.rejectionReason}{' '}
                          <Link
                            href={`/dashboard/pembayaran?invoiceId=${p.invoiceId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 font-bold hover:underline whitespace-nowrap"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Kirim ulang
                          </Link>
                        </span>
                      )}
                    </span>

                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-bold tabular-nums tracking-tight text-stone-900">
                        {formatRupiah(p.amount)}
                      </span>
                      <span className="mt-0.5 hidden items-center justify-end gap-0.5 text-[11px] font-semibold text-stone-400 sm:flex">
                        Detail
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Modal rincian */}
      {selectedPayment && (
        <DetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  )
}

function DetailModal({
  payment: p,
  onClose,
}: {
  payment: SerializedTenantPayment
  onClose: () => void
}) {
  const meta = STATUS_META[p.status]
  const Icon = meta.icon

  const rows: [string, string][] = [
    ['Periode sewa', formatBillingPeriod(p.billingPeriod)],
    ['Tanggal transfer', formatDateID(p.transferDate)],
    ['Bank pengirim', `${p.senderBank} · a.n. ${p.senderName}`],
    ['Dikirim pada', formatDateID(p.createdAt)],
    ['Unit', `${p.unitName} · ${p.propertyName}`],
  ]
  if (p.destinationBank) rows.push(['Tujuan transfer', p.destinationBank])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="my-8 w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${meta.tileClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-stone-400">#{p.invoiceNumber}</p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-stone-900">
                {formatRupiah(p.amount)}
              </p>
              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.pillClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                {p.status === 'APPROVED'
                  ? 'Terverifikasi (Lunas)'
                  : p.status === 'PENDING'
                  ? 'Menunggu verifikasi pengelola'
                  : 'Ditolak pengelola'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <dl className="divide-y divide-stone-100 text-xs">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  {label}
                </dt>
                <dd className="text-right font-semibold text-stone-900">{value}</dd>
              </div>
            ))}
          </dl>

          {p.status === 'REJECTED' && p.rejectionReason && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs leading-relaxed text-rose-800">
              <strong className="mb-0.5 block">Alasan penolakan</strong>
              &ldquo;{p.rejectionReason}&rdquo;
            </p>
          )}

          {p.notes && (
            <p className="text-xs leading-relaxed text-stone-500">
              <strong className="text-stone-700">Catatan Anda: </strong>
              &ldquo;{p.notes}&rdquo;
            </p>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold text-stone-700">Bukti transfer</p>
            <button
              type="button"
              onClick={() => window.open(p.proofFileUrl, '_blank')}
              className="block w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50 transition hover:shadow-sm cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.proofFileUrl}
                alt="Bukti transfer"
                className="max-h-56 w-full object-contain"
              />
            </button>
            <div className="mt-1.5 flex justify-end">
              <a
                href={p.proofFileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Buka ukuran penuh
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-100 bg-stone-50/60 px-6 py-4">
          {p.status === 'REJECTED' && (
            <Link
              href={`/dashboard/pembayaran?invoiceId=${p.invoiceId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Kirim Ulang
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
