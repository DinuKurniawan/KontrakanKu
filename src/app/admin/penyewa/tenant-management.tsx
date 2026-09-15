'use client'

import { useState } from 'react'
import TenantModal from './tenant-modal'
import AssignTenantModal from './assign-tenant-modal'
import EndRentalModal from './end-rental-modal'
import { formatDateID } from '@/lib/utils'
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  DoorOpen,
  LogOut,
  Calendar,
} from 'lucide-react'

interface TenantManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialTenants: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableUnits: any[]
}

export default function TenantManagement({ initialTenants, availableUnits }: TenantManagementProps) {
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isEndModalOpen, setIsEndModalOpen] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRental, setSelectedRental] = useState<any | null>(null)
  const [search, setSearch] = useState('')

  const filteredTenants = initialTenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (t.phone && t.phone.includes(search))
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openAssign(tenant: any) {
    setSelectedTenant(tenant)
    setIsAssignModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEndRental(rental: any, tenant: any) {
    setSelectedRental({ ...rental, user: tenant })
    setIsEndModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Users className="h-3.5 w-3.5" />
            Kelola penghuni
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Data Penyewa
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
            Daftar seluruh akun penyewa dan status unit kontrakan yang dihuni
          </p>
        </div>
        <button
          onClick={() => setIsTenantModalOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Penyewa
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama penyewa, email, atau nomor HP..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
          />
        </div>
      </div>

      {/* Tabel Penyewa */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredTenants.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {initialTenants.length === 0 ? 'Belum ada penyewa' : 'Tidak ada hasil ditemukan'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              {initialTenants.length === 0
                ? 'Belum ada penyewa dalam sistem.'
                : 'Tidak ada penyewa yang cocok dengan pencarian.'}
            </p>
            {initialTenants.length === 0 && (
              <button
                onClick={() => setIsTenantModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Penyewa
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="px-6 py-3.5">Nama Penyewa</th>
                  <th className="px-6 py-3.5">Kontak</th>
                  <th className="px-6 py-3.5">Unit Kamar</th>
                  <th className="px-6 py-3.5">Status Sewa</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTenants.map(tenant => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const activeRental = tenant.rentals?.find((r: any) => r.status === 'ACTIVE')
                  const initials = String(tenant.name || '?')
                    .split(' ')
                    .map((part: string) => part.charAt(0))
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                  return (
                    <tr key={tenant.id} className="transition hover:bg-stone-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-xs font-bold text-white">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold tracking-tight text-stone-900">{tenant.name}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-stone-400">
                              <Calendar className="h-3 w-3" />
                              Dibuat: {formatDateID(tenant.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-stone-600">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            <span className="truncate">{tenant.email}</span>
                          </div>
                          {tenant.phone && (
                            <div className="flex items-center gap-1.5 text-xs tabular-nums text-stone-600">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                              {tenant.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {activeRental ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                              <DoorOpen className="h-3 w-3" />
                              {activeRental.unit.name}
                            </span>
                            <p className="mt-1 text-xs text-stone-500">
                              {activeRental.unit.property.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs italic text-stone-400">Belum ada unit</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            activeRental ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200/80 text-stone-600'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${activeRental ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          {activeRental ? 'AKTIF' : 'NON-AKTIF'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {activeRental ? (
                          <button
                            onClick={() => openEndRental(activeRental, tenant)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Selesaikan Sewa
                          </button>
                        ) : (
                          <button
                            onClick={() => openAssign(tenant)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer"
                          >
                            <DoorOpen className="h-3.5 w-3.5" />
                            Tugaskan Kamar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* key berubah tiap dibuka → form selalu fresh, tidak ada sisa input */}
      <TenantModal
        key={isTenantModalOpen ? 'tenant-open' : 'tenant-closed'}
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        availableUnits={availableUnits}
      />

      <AssignTenantModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        tenant={selectedTenant}
        availableUnits={availableUnits}
      />

      <EndRentalModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        rental={selectedRental}
      />
    </div>
  )
}
