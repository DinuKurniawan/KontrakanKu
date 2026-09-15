'use client'

import { useState, useTransition, useEffect } from 'react'
import { createInvoiceAction, InvoiceActionState } from './actions'
import { formatRupiah } from '@/lib/utils'
import { X, Receipt, Calendar, Loader2 } from 'lucide-react'

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeRentals: any[]
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  activeRentals,
}: CreateInvoiceModalProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<InvoiceActionState | null>(null)

  const [rentalId, setRentalId] = useState('')
  const [billingPeriod, setBillingPeriod] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (activeRentals.length > 0) {
      const first = activeRentals[0]
      setRentalId(first.id)
      setAmount(String(first.monthlyRent))
    }

    // Default period: bulan saat ini YYYY-MM
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    setBillingPeriod(`${year}-${month}`)

    // Default due date: tanggal 10 bulan ini
    const due = new Date(year, now.getMonth(), 10)
    setDueDate(due.toISOString().split('T')[0])
    setNotes('')
    setState(null)
  }, [activeRentals, isOpen])

  function handleRentalChange(id: string) {
    setRentalId(id)
    const selected = activeRentals.find(r => r.id === id)
    if (selected) {
      setAmount(String(selected.monthlyRent))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState(null)

    const formData = new FormData()
    formData.append('rentalId', rentalId)
    formData.append('billingPeriod', billingPeriod)
    formData.append('amount', amount)
    formData.append('dueDate', dueDate)
    formData.append('notes', notes)

    startTransition(async () => {
      const res = await createInvoiceAction(undefined, formData)
      if (res?.success) {
        onClose()
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-stone-900 text-lg">Buat Tagihan Manual</h3>
              <p className="text-xs text-stone-500">Menerbitkan invoice sewa untuk satu penyewa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              {state.error}
            </div>
          )}

          {activeRentals.length === 0 ? (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              Belum ada kontrak sewa yang aktif. Tugaskan penyewa ke unit terlebih dahulu sebelum membuat tagihan.
            </div>
          ) : (
            <>
              {/* Pilih Sewa Aktif */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Pilih Penyewa / Unit <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={rentalId}
                  onChange={e => handleRentalChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-white transition"
                >
                  {activeRentals.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.user.name} — {r.unit.name} ({formatRupiah(Number(r.monthlyRent))})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Periode Tagihan */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Periode (YYYY-MM) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="month"
                    required
                    value={billingPeriod}
                    onChange={e => setBillingPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                  />
                  {state?.fieldErrors?.billingPeriod && (
                    <p className="text-[11px] text-rose-600 mt-1">{state.fieldErrors.billingPeriod[0]}</p>
                  )}
                </div>

                {/* Jatuh Tempo */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    Jatuh Tempo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Nominal Tagihan */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Nominal Tagihan (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="1300000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
                {state?.fieldErrors?.amount && (
                  <p className="text-[11px] text-rose-600 mt-1">{state.fieldErrors.amount[0]}</p>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Catatan Tagihan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Contoh: Termasuk biaya iuran sampah bulan ini"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
              </div>
            </>
          )}

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
              disabled={isPending || activeRentals.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Terbitkan Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
