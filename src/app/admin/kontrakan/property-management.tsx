'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PropertyModal from './property-modal'
import { publishPropertyAction, archivePropertyAction, deletePropertyAction } from './actions'
import { formatRupiah } from '@/lib/utils'
import {
  Building2,
  Plus,
  MapPin,
  Eye,
  Edit2,
  Archive,
  CheckCircle2,
  Search,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PropertyManagement({ initialProperties }: { initialProperties: any[] }) {
  const router = useRouter()
  const [properties, setProperties] = useState(initialProperties)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setProperties(initialProperties)
  }, [initialProperties])

  const filteredProperties = properties.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function openCreate() {
    setSelectedProperty(null)
    setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(property: any) {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  async function handleTogglePublish(id: string, currentStatus: string) {
    setLoadingId(id)
    setErrorMessage(null)
    if (currentStatus === 'PUBLISHED') {
      if (confirm('Arsipkan kontrakan ini? Kontrakan tidak akan lagi terlihat pada katalog publik.')) {
        const res = await archivePropertyAction(id)
        if (res.success) {
          setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'ARCHIVED' } : p))
          router.refresh()
        } else {
          setErrorMessage(res.error || 'Gagal mengarsipkan kontrakan')
        }
      }
    } else {
      const res = await publishPropertyAction(id)
      if (res.success) {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'PUBLISHED' } : p))
        router.refresh()
      } else {
        setErrorMessage(res.error || 'Gagal mempublikasikan kontrakan')
      }
    }
    setLoadingId(null)
  }

  async function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Yakin ingin menghapus kontrakan "${name}"? Seluruh unit di dalamnya yang belum memiliki transaksi sewa juga akan terhapus secara permanen.`
      )
    ) {
      return
    }

    setLoadingId(id)
    setErrorMessage(null)

    const res = await deletePropertyAction(id)
    if (res.success) {
      // Otomatis hilang dari daftar kompleks kontrakan di UI seketika
      setProperties(prev => prev.filter(p => p.id !== id))
      router.refresh()
    } else {
      setErrorMessage(res.error || 'Gagal menghapus kontrakan')
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Building2 className="h-3.5 w-3.5" />
            Kelola properti
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Kontrakan
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
            Kompleks kontrakan yang Anda kelola
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Kontrakan
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="rounded-lg px-2 py-1 text-sm font-bold text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Pencarian */}
      <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama kontrakan atau alamat..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map(statusKey => {
            const labels: Record<string, string> = {
              ALL: 'Semua',
              PUBLISHED: 'Publik',
              DRAFT: 'Draf',
              ARCHIVED: 'Arsip',
            }
            const isActive = statusFilter === statusKey
            return (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {labels[statusKey]}
              </button>
            )
          })}
        </div>
      </div>

      {/* List Kontrakan */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {filteredProperties.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              {search || statusFilter !== 'ALL' ? 'Tidak ada hasil ditemukan' : 'Belum ada kontrakan'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              {search || statusFilter !== 'ALL'
                ? 'Tidak ada kontrakan yang cocok dengan filter atau pencarian.'
                : 'Belum ada data kontrakan yang tersimpan.'}
            </p>
            {!search && statusFilter === 'ALL' && (
              <button
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Kontrakan
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredProperties.map(property => {
              const isLoading = loadingId === property.id
              return (
                <div
                  key={property.id}
                  className="flex flex-col justify-between gap-4 p-5 transition hover:bg-stone-50/80 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4 sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 text-stone-500">
                      {property.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={property.images[0].url}
                          alt={property.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-600 text-white">
                          <Building2 className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold tracking-tight text-stone-900">{property.name}</h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            property.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : property.status === 'ARCHIVED'
                              ? 'bg-stone-200/80 text-stone-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              property.status === 'PUBLISHED'
                                ? 'bg-emerald-500'
                                : property.status === 'ARCHIVED'
                                ? 'bg-stone-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {property.status}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                        <span className="truncate">{property.address}</span>
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        <span className="font-semibold text-stone-700 tabular-nums">{property.units?.length || 0} Unit</span>
                        <span className="text-stone-400"> • </span>
                        <span className="font-semibold text-stone-700 tabular-nums">Harga {formatRupiah(Number(property.monthlyPriceFrom))}/bln</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center">
                    {isLoading ? (
                      <div className="p-2 text-stone-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleTogglePublish(property.id, property.status)}
                          className="rounded-xl p-2 text-stone-500 transition hover:border-stone-200 hover:bg-white hover:shadow-sm hover:text-stone-800 cursor-pointer"
                          title={property.status === 'PUBLISHED' ? 'Arsipkan' : 'Publikasikan'}
                        >
                          {property.status === 'PUBLISHED' ? (
                            <Archive className="h-4 w-4 text-amber-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          )}
                        </button>

                        <button
                          onClick={() => openEdit(property)}
                          className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
                          title="Edit Kontrakan"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <Link
                          href={`/kontrakan/${property.slug}`}
                          target="_blank"
                          className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                          title="Lihat Tampilan Publik"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(property.id, property.name)}
                          className="rounded-xl p-2 text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                          title="Hapus Kontrakan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  )
}
