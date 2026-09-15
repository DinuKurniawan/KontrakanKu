'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createUnitAction, updateUnitAction, UnitActionState } from './actions'
import { DEFAULT_FACILITIES } from '@/lib/facilities'
import { X, DoorOpen, Building, Loader2, Calendar, Clock, Tag } from 'lucide-react'

interface UnitModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unit?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[]
}

/**
 * Helper: convert an ISO date string or Date-like value to "YYYY-MM-DD" for <input type="date">
 */
function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function UnitModal({ isOpen, onClose, unit, properties }: UnitModalProps) {
  const router = useRouter()
  const isEdit = !!unit
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<UnitActionState | null>(null)

  const [propertyId, setPropertyId] = useState('')
  const [name, setName] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [status, setStatus] = useState('AVAILABLE')
  const [description, setDescription] = useState('')
  const [facilities, setFacilities] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Derive active rental info from unit data
  const activeRental = unit?.rentals?.[0] ?? null
  const latestInvoice = activeRental?.invoices?.[0] ?? null
  const hasActiveRental = !!activeRental

  useEffect(() => {
    if (unit) {
      setPropertyId(unit.propertyId || '')
      setName(unit.name || '')
      setMonthlyRent(unit.monthlyRent ? String(unit.monthlyRent) : '')
      setStatus(unit.status || 'AVAILABLE')
      setDescription(unit.description || '')
      setFacilities(unit.facilities || [])
      // Populate dates from active rental
      setStartDate(toDateInputValue(activeRental?.startDate))
      setDueDate(toDateInputValue(latestInvoice?.dueDate))
    } else {
      setPropertyId(properties[0]?.id || '')
      setName('')
      setMonthlyRent('')
      setStatus('AVAILABLE')
      setDescription('')
      setFacilities([])
      setStartDate('')
      setDueDate('')
    }
    setState(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, properties, isOpen])

  function toggleFacility(item: string) {
    setFacilities(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState(null)

    const formData = new FormData()
    formData.append('propertyId', propertyId)
    formData.append('name', name)
    formData.append('monthlyRent', monthlyRent)
    formData.append('status', status)
    formData.append('description', description)
    formData.append('facilitiesString', facilities.join(','))

    // Append rental dates when there's an active rental
    if (hasActiveRental) {
      if (startDate) formData.append('startDate', startDate)
      if (dueDate) formData.append('dueDate', dueDate)
      formData.append('rentalId', activeRental.id)
      if (latestInvoice) formData.append('invoiceId', latestInvoice.id)
    }

    startTransition(async () => {
      let res: UnitActionState | undefined
      if (isEdit) {
        res = await updateUnitAction(unit.id, undefined, formData)
      } else {
        res = await createUnitAction(undefined, formData)
      }

      if (res?.success) {
        router.refresh()
        onClose()
      } else {
        setState(res || { error: 'Terjadi kesalahan sistem' })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-stone-900">
                {isEdit ? 'Edit Kamar / Unit' : 'Tambah Kamar / Unit Baru'}
              </h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Konfigurasi kamar di dalam kompleks kontrakan
              </p>
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

          {/* Pilih Kontrakan (hanya saat create) */}
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              <Building className="h-3.5 w-3.5 text-stone-400" />
              Kompleks Kontrakan <span className="text-rose-500">*</span>
            </label>
            <select
              required
              disabled={isEdit}
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition disabled:bg-stone-100"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id} className="text-stone-900 bg-white">
                  {p.name} ({p.address.slice(0, 30)}...)
                </option>
              ))}
            </select>
            {state?.fieldErrors?.propertyId && (
              <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.propertyId[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nama Unit */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Nama / No. Kamar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Unit A-01"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            {/* Harga Sewa Bulanan */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Harga Sewa Bulanan (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={monthlyRent}
                onChange={e => setMonthlyRent(e.target.value)}
                placeholder="1300000"
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium tabular-nums text-stone-900 placeholder:text-stone-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
              />
              {state?.fieldErrors?.monthlyRent && (
                <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.monthlyRent[0]}</p>
              )}
            </div>
          </div>

          {/* Status Unit */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Status Kamar
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
            >
              <option value="AVAILABLE" className="text-stone-900 bg-white">AVAILABLE (Tersedia / Kosong)</option>
              <option value="OCCUPIED" className="text-stone-900 bg-white">OCCUPIED (Terisi)</option>
              <option value="MAINTENANCE" className="text-stone-900 bg-white">MAINTENANCE (Dalam Perbaikan)</option>
              <option value="INACTIVE" className="text-stone-900 bg-white">INACTIVE (Tidak Disewakan)</option>
            </select>
          </div>

          {/* Tanggal Masuk & Jatuh Tempo — hanya tampil saat edit dan ada sewa aktif */}
          {isEdit && hasActiveRental && (
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-sky-200/80 bg-sky-50/60 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-800">Informasi Sewa Aktif</p>
                <p className="mt-0.5 text-xs text-sky-700">Penyewa: <span className="font-semibold">{activeRental.user?.name ?? '-'}</span></p>
              </div>

              {/* Tanggal Masuk */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <Calendar className="h-3.5 w-3.5 text-sky-600" />
                  Tanggal Masuk
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
                />
                {state?.fieldErrors?.startDate && (
                  <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.startDate[0]}</p>
                )}
              </div>

              {/* Jatuh Tempo */}
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <Clock className="h-3.5 w-3.5 text-sky-600" />
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
                />
                {state?.fieldErrors?.dueDate && (
                  <p className="mt-1 text-[11px] text-rose-600">{state.fieldErrors.dueDate[0]}</p>
                )}
              </div>
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Deskripsi Kamar (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Contoh: Kamar lantai 1, ukuran 3x4 meter, jendela menghadap timur."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20 transition"
            />
          </div>

          {/* Fasilitas per tipe kamar */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              <Tag className="h-3.5 w-3.5 text-stone-400" />
              Fasilitas Kamar Ini
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_FACILITIES.map(item => {
                const selected = facilities.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleFacility(item)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>{selected ? '✓' : '+'}</span>
                    {item}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-stone-400">
              Kosongkan untuk memakai fasilitas kontrakan. Tiap tipe bisa beda.
            </p>
          </div>

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
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Tambah Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
