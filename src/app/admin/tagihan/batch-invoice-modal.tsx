'use client'

import { useState, useTransition } from 'react'
import { generateBatchInvoicesAction, InvoiceActionState } from './actions'
import { X, Layers, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface BatchInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  activeRentalsCount: number
}

export default function BatchInvoiceModal({
  isOpen,
  onClose,
  activeRentalsCount,
}: BatchInvoiceModalProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<InvoiceActionState | null>(null)

  // Default: bulan berikutnya
  const nextMonthDate = new Date()
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
  const defaultPeriod = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`

  const [billingPeriod, setBillingPeriod] = useState(defaultPeriod)
  const [dueDay, setDueDay] = useState(10)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState(null)

    const formData = new FormData()
    formData.append('billingPeriod', billingPeriod)
    formData.append('dueDay', String(dueDay))

    startTransition(async () => {
      const res = await generateBatchInvoicesAction(undefined, formData)
      if (res?.success) {
        setState({
          success: true,
          createdCount: res.createdCount,
          skippedCount: res.skippedCount,
          errors: res.errors,
        })
      } else {
        setState(res || { error: 'Terjadi kesalahan sistem' })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl border border-stone-200/80 shadow-2xl w-full max-w-md my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-stone-900 text-lg">Tagihan Massal Bulanan</h3>
              <p className="text-xs text-stone-500">Terbitkan tagihan otomatis untuk seluruh penyewa aktif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {state?.success ? (
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold tracking-tight text-stone-900 text-base">Berhasil Diterbitkan!</h4>
              <p className="text-xs text-stone-600 mt-1">
                Sebanyak <span className="font-bold tabular-nums text-emerald-700">{state.createdCount ?? 0} invoice</span> berhasil dibuat untuk periode {billingPeriod}.
              </p>
              <p className="text-xs leading-relaxed text-stone-600 mt-1">
                Pemberitahuan tagihan otomatis terkirim ke{' '}
                <span className="font-bold tabular-nums text-emerald-700">{state.createdCount ?? 0} penyewa</span>.
                Setiap penyewa dapat melihatnya di lonceng notifikasi & halaman Pemberitahuan.
              </p>
              {(state.skippedCount ?? 0) > 0 && (
                <p className="text-[11px] text-stone-500 mt-1">
                  {state.skippedCount} sewa dilewati karena sudah memiliki tagihan pada periode ini.
                </p>
              )}
            </div>
            {state.errors && state.errors.length > 0 && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-left">
                <p className="text-xs font-semibold mb-1">
                  {state.errors.length} sewa gagal diproses:
                </p>
                <ul className="text-[11px] space-y-0.5 max-h-28 overflow-y-auto list-disc list-inside">
                  {state.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {state.errors.length > 10 && (
                    <li>... dan {state.errors.length - 10} lainnya.</li>
                  )}
                </ul>
              </div>
            )}
            <button
              onClick={onClose}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {state?.error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                {state.error}
              </div>
            )}

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50 p-4 text-xs text-emerald-900 shadow-sm space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                Informasi Otomatisasi (PRD Sec 17 & 62)
              </p>
              <p className="text-stone-600">
                Sistem akan memindai <span className="font-bold">{activeRentalsCount} sewa aktif</span> dan membuatkan invoice bulanan masing-masing. Satu user hanya mendapat satu tagihan per periode — yang sudah memiliki tagihan periode ini akan dilewati otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Periode */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Periode Tagihan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="month"
                  required
                  value={billingPeriod}
                  onChange={e => setBillingPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
              </div>

              {/* Tanggal Jatuh Tempo */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  Tanggal Jatuh Tempo
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={28}
                  value={dueDay}
                  onChange={e => setDueDay(Number(e.target.value))}
                  placeholder="10"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Tgl 1 - 28 setiap bulan</span>
              </div>
            </div>

            <div className="-mx-6 -mb-6 mt-2 flex items-center justify-end gap-2.5 border-t border-stone-100 bg-stone-50/50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold shadow-sm hover:bg-stone-50 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending || activeRentalsCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Terbitkan Tagihan Massal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
