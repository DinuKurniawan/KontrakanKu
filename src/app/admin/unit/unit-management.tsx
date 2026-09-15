'use client'

import { useState, useEffect } from 'react'
import UnitModal from './unit-modal'
import { formatRupiah, formatDateID } from '@/lib/utils'
import {
  DoorOpen,
  Plus,
  Search,
  Building,
  User,
  Edit2,
  Filter,
  Calendar,
  Clock,
} from 'lucide-react'

interface UnitManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialUnits: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[]
}

export default function UnitManagement({ initialUnits, properties }: UnitManagementProps) {
  const [units, setUnits] = useState(initialUnits)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  useEffect(() => {
    setUnits(initialUnits)
  }, [initialUnits])

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(search.toLowerCase()) ||
      unit.property.name.toLowerCase().includes(search.toLowerCase())
    const matchesProperty = selectedPropertyId === 'ALL' || unit.propertyId === selectedPropertyId
    const matchesStatus = selectedStatus === 'ALL' || unit.status === selectedStatus
    return matchesSearch && matchesProperty && matchesStatus
  })

  function openCreate() {
    setSelectedUnit(null)
    setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(unit: any) {
    setSelectedUnit(unit)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
            <DoorOpen className="h-3.5 w-3.5" />
            Kelola hunian
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Unit & Kamar
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
            Status hunian dan ketersediaan masing-masing kamar
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={properties.length === 0}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title={properties.length === 0 ? 'Buat kontrakan terlebih dahulu' : 'Tambah unit baru'}
        >
          <Plus className="h-4 w-4" />
          Tambah Unit
        </button>
      </div>

      {/* Filter & Pencarian Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama kamar atau kontrakan..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
          />
        </div>

        {/* Filter Properti */}
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-0.5 focus-within:border-emerald-600">
          <Building className="h-4 w-4 shrink-0 text-stone-400" />
          <select
            value={selectedPropertyId}
            onChange={e => setSelectedPropertyId(e.target.value)}
            className="w-full cursor-pointer bg-transparent py-2 text-xs font-semibold text-stone-700 focus:outline-none md:w-auto"
          >
            <option value="ALL" className="text-stone-900 bg-white">Semua Kontrakan</option>
            {properties.map(p => (
              <option key={p.id} value={p.id} className="text-stone-900 bg-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-0.5 focus-within:border-emerald-600">
          <Filter className="h-4 w-4 shrink-0 text-stone-400" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full cursor-pointer bg-transparent py-2 text-xs font-semibold text-stone-700 focus:outline-none md:w-auto"
          >
            <option value="ALL" className="text-stone-900 bg-white">Semua Status</option>
            <option value="AVAILABLE" className="text-stone-900 bg-white">Tersedia (AVAILABLE)</option>
            <option value="OCCUPIED" className="text-stone-900 bg-white">Terisi (OCCUPIED)</option>
            <option value="MAINTENANCE" className="text-stone-900 bg-white">Perbaikan (MAINTENANCE)</option>
            <option value="INACTIVE" className="text-stone-900 bg-white">Nonaktif (INACTIVE)</option>
          </select>
        </div>
      </div>

      {/* Tabel Unit */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredUnits.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <DoorOpen className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {initialUnits.length === 0 ? 'Belum ada unit' : 'Tidak ada hasil ditemukan'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              {initialUnits.length === 0
                ? 'Belum ada unit atau kamar yang ditambahkan.'
                : 'Tidak ada unit yang cocok dengan filter pencarian.'}
            </p>
            {initialUnits.length === 0 && properties.length > 0 && (
              <button
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Unit
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="px-6 py-3.5">Unit / Kamar</th>
                  <th className="px-6 py-3.5">Kontrakan</th>
                  <th className="px-6 py-3.5">Harga</th>
                  <th className="px-6 py-3.5">Penyewa Aktif</th>
                  <th className="px-6 py-3.5">Tanggal Masuk</th>
                  <th className="px-6 py-3.5">Jatuh Tempo</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUnits.map(unit => {
                  const activeRental = unit.rentals?.[0]
                  const activeTenant = activeRental?.user
                  const latestInvoice = activeRental?.invoices?.[0]
                  const startDay = activeRental?.startDate ? new Date(activeRental.startDate).getDate() : null
                  return (
                    <tr key={unit.id} className="transition hover:bg-stone-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                            <DoorOpen className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold tracking-tight text-stone-900">{unit.name}</span>
                            {unit.description && (
                              <p className="max-w-xs truncate text-[11px] font-normal text-stone-400">
                                {unit.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-600">
                        {unit.property.name}
                      </td>
                      <td className="px-6 py-4 font-bold tabular-nums tracking-tight text-stone-900">
                        {formatRupiah(Number(unit.monthlyRent))}
                        <span className="text-xs font-normal text-stone-400">/bln</span>
                      </td>
                      <td className="px-6 py-4">
                        {activeTenant ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
                            <User className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            {activeTenant.name}
                          </div>
                        ) : (
                          <span className="text-xs italic text-stone-400">Kosong</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {activeRental?.startDate ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            <span className="tabular-nums">{formatDateID(activeRental.startDate)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {latestInvoice?.dueDate ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            <span className="tabular-nums">{formatDateID(latestInvoice.dueDate)}</span>
                            {latestInvoice.status === 'OVERDUE' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                Terlambat
                              </span>
                            )}
                          </div>
                        ) : activeRental?.startDate ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            <span className="tabular-nums">Tiap tgl {startDay}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            unit.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : unit.status === 'OCCUPIED'
                              ? 'bg-sky-100 text-sky-800'
                              : unit.status === 'MAINTENANCE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200/80 text-stone-600'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              unit.status === 'AVAILABLE'
                                ? 'bg-emerald-500'
                                : unit.status === 'OCCUPIED'
                                ? 'bg-sky-500'
                                : unit.status === 'MAINTENANCE'
                                ? 'bg-amber-500'
                                : 'bg-stone-500'
                            }`}
                          />
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEdit(unit)}
                          className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
                          title="Edit Unit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Unit */}
      <UnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unit={selectedUnit}
        properties={properties}
      />
    </div>
  )
}
