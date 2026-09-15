'use client'

import { useState, useTransition } from 'react'
import { endRentalAction, TenantActionState } from './actions'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

interface EndRentalModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rental?: any
}

export default function EndRentalModal({ isOpen, onClose, rental }: EndRentalModalProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<TenantActionState | null>(null)
  const [reason, setReason] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rental) return
    setState(null)

    const formData = new FormData()
    formData.append('rentalId', rental.id)
    formData.append('reason', reason)

    startTransition(async () => {
      const res = await endRentalAction(undefined, formData)
      if (res?.success) {
        onClose()
      } else {
        setState(res || { error: 'Terjadi kesalahan saat mengakhiri sewa' })
      }
    })
  }

  if (!isOpen || !rental) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-stone-900">Selesaikan Kontrak Sewa</h3>
              <p className="mt-0.5 text-xs text-stone-500">Unit: <span className="font-semibold text-stone-800">{rental.unit?.name}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {state?.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
              {state.error}
            </div>
          )}

          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 text-xs leading-relaxed text-stone-600">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Penyewa: <span className="text-stone-900">{rental.user?.name}</span>
            </p>
            <p className="mt-1.5">
              Unit <span className="font-semibold text-stone-900">{rental.unit?.name}</span> akan otomatis berubah status menjadi <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />AVAILABLE (Tersedia)</span> dan siap disewakan kembali.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Alasan Pengakhiran Sewa (Opsional)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Contoh: Masa kontrak habis / pindah tugas..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div className="-mx-6 -mb-6 flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Selesaikan Sewa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
