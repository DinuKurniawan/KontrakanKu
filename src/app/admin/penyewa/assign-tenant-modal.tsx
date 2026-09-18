'use client'

import { useState, useTransition, useEffect } from 'react'
import { assignTenantAction, TenantActionState } from './actions'
import { formatRupiah } from '@/lib/utils'
import { X, DoorOpen, Calendar, CheckSquare, Loader2 } from 'lucide-react'

interface AssignTenantModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tenant?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableUnits: any[]
}

export default function AssignTenantModal({
  isOpen,
  onClose,
  tenant,
  availableUnits,
}: AssignTenantModalProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<TenantActionState | null>(null)

  const [unitId, setUnitId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [generateInitialInvoice, setGenerateInitialInvoice] = useState(true)

  useEffect(() => {
    if (availableUnits.length > 0) {
      setUnitId(availableUnits[0].id)
    }
    setState(null)
  }, [availableUnits, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tenant) return
    setState(null)

    const formData = new FormData()
    formData.append('userId', tenant.id)
    formData.append('unitId', unitId)
    formData.append('startDate', startDate)
    formData.append('generateInitialInvoice', String(generateInitialInvoice))

    startTransition(async () => {
      const res = await assignTenantAction(undefined, formData)
      if (res?.success) {
        onClose()
      } else {
        setState(res || { error: 'Terjadi kesalahan saat menugaskan kamar' })
      }
    })
  }

  if (!isOpen || !tenant) return null

  const selectedUnitObj = availableUnits.find(u => u.id === unitId)

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-stone-900">Tugaskan Kamar Kontrakan</h3>
              <p className="mt-0.5 text-xs text-stone-500">Penyewa: <span className="font-semibold text-stone-800">{tenant.name}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {state?.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
              {state.error}
            </div>
          )}

          {availableUnits.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              Tidak ada unit/kamar yang berstatus AVAILABLE (Tersedia) saat ini. Tambahkan kamar baru atau selesaikan kontrak penyewa lain terlebih dahulu.
            </div>
          ) : (
            <>
              {/* Pilih Unit */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Pilih Unit / Kamar Tersedia <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                >
                  {availableUnits.map(u => (
                    <option key={u.id} value={u.id} className="text-stone-900 bg-white">
                      {u.property.name} — {u.name} ({formatRupiah(Number(u.monthlyRent))}/bln)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  Mulai Sewa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs tabular-nums text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
                />
              </div>

              {/* Terbitkan Tagihan Awal */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-3.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={generateInitialInvoice}
                    onChange={e => setGenerateInitialInvoice(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                    Terbitkan tagihan bulan pertama secara otomatis
                  </span>
                </label>
                {generateInitialInvoice && selectedUnitObj && (
                  <p className="mt-1.5 pl-6 text-[11px] tabular-nums leading-relaxed text-stone-500">
                    Invoice senilai {formatRupiah(Number(selectedUnitObj.monthlyRent))} akan langsung terbit dan dapat dibayar penyewa.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Footer Buttons */}
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
              disabled={isPending || availableUnits.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Konfirmasi Penugasan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
