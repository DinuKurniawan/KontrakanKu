'use client'

import { useState } from 'react'
import { approvePaymentAction, rejectPaymentAction } from './actions'
import { formatDateID, formatRupiah, formatBillingPeriod } from '@/lib/utils'
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  User,
  Building,
  AlertTriangle,
} from 'lucide-react'

export interface SerializedPaymentVerification {
  id: string
  amount: number
  transferDate: string
  senderBank: string
  senderName: string
  proofFileUrl: string
  notes: string | null
  status: string
  invoice: {
    id: string
    invoiceNumber: string
    billingPeriod: string
    amount: number
    rental: {
      user: {
        name: string
      }
      unit: {
        name: string
        property: {
          name: string
        }
      }
    }
  }
}

export default function PaymentVerificationCard({ payment }: { payment: SerializedPaymentVerification }) {
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invoiceAmount = Number(payment.invoice.amount)
  const transferAmount = Number(payment.amount)
  const isAmountMismatch = invoiceAmount !== transferAmount

  async function handleApprove() {
    if (!confirm('Verifikasi pembayaran ini? Tagihan invoice akan otomatis ditandai lunas (PAID).')) {
      return
    }
    setLoading(true)
    setError(null)
    const res = await approvePaymentAction(payment.id)
    if (!res.success) {
      setError(res.error || 'Gagal memverifikasi pembayaran')
      setLoading(false)
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault()
    if (!rejectReason.trim() || rejectReason.length < 5) {
      setError('Alasan penolakan minimal 5 karakter.')
      return
    }
    setLoading(true)
    setError(null)
    const res = await rejectPaymentAction(payment.id, rejectReason)
    if (!res.success) {
      setError(res.error || 'Gagal menolak pembayaran')
      setLoading(false)
    }
  }

  const initials = payment.invoice.rental.user.name
    .split(' ')
    .map((part: string) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition hover:shadow-md">
      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-rose-200/80 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 p-6 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800">
              Pembayaran #{payment.id.slice(-6).toUpperCase()}
            </span>
            <h4 className="mt-1.5 flex items-center gap-1.5 text-base font-bold tracking-tight text-stone-900">
              <User className="h-4 w-4 shrink-0 text-stone-400" />
              {payment.invoice.rental.user.name}
            </h4>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
              <Building className="h-3.5 w-3.5 shrink-0 text-stone-400" />
              {payment.invoice.rental.unit.property.name} — Unit {payment.invoice.rental.unit.name}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-left md:text-right">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Periode Sewa</span>
          <span className="mt-0.5 block text-sm font-bold text-stone-900">
            {formatBillingPeriod(payment.invoice.billingPeriod)}
          </span>
        </div>
      </div>

      <div className="mx-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Nominal Tagihan</span>
          <span className="mt-1 block text-sm font-bold tabular-nums text-stone-900">{formatRupiah(invoiceAmount)}</span>
        </div>
        <div className={`rounded-2xl border p-4 ${isAmountMismatch ? 'border-amber-200/80 bg-amber-50' : 'border-emerald-100 bg-emerald-50'}`}>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Nominal Ditransfer</span>
          <span className={`mt-1 block text-sm font-bold tabular-nums ${isAmountMismatch ? 'text-amber-700' : 'text-emerald-700'}`}>
            {formatRupiah(transferAmount)}
          </span>
          {isAmountMismatch && (
            <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
              <AlertTriangle className="h-3 w-3" /> Beda dengan tagihan
            </span>
          )}
        </div>
        <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">Pengirim & Tanggal</span>
          <span className="mt-1 block text-xs font-semibold text-stone-800">
            {payment.senderBank} a.n {payment.senderName}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs tabular-nums text-stone-500">
            <Calendar className="h-3 w-3" />
            {formatDateID(payment.transferDate)}
          </span>
        </div>
      </div>

      {payment.notes && (
        <div className="mx-6 mt-3 rounded-2xl border border-stone-200/80 bg-stone-50 px-4 py-3 text-xs leading-relaxed text-stone-600">
          <span className="font-semibold text-stone-700">Catatan Penyewa:</span> {payment.notes}
        </div>
      )}

      {/* Preview Bukti Transfer */}
      <div className="mt-5 flex flex-col gap-4 border-t border-stone-100 bg-stone-50/50 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <a
          href={payment.proofFileUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex w-fit items-center gap-3"
        >
          <img
            src={payment.proofFileUrl}
            alt={`Bukti transfer ${payment.invoice.rental.user.name}`}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="h-16 w-24 rounded-xl border border-stone-200 bg-white object-cover shadow-sm transition group-hover:border-emerald-200 group-hover:shadow"
          />
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <ExternalLink className="h-4 w-4" />
            Buka Bukti Transfer
          </span>
        </a>

        {/* Action Buttons */}
        {!isRejecting ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsRejecting(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Tolak Pembayaran
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Verifikasi Pelunasan
            </button>
          </div>
        ) : (
          <form onSubmit={handleReject} className="w-full max-w-md space-y-2">
            <input
              type="text"
              required
              placeholder="Tuliskan alasan penolakan untuk penyewa..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                Kirim Penolakan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
