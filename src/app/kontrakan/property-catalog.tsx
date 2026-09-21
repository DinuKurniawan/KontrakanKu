'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import {
  Building2,
  MapPin,
  Eye,
  MessageCircle,
  Bookmark,
  Search,
  CheckCircle2,
  ArrowUpDown,
  Info,
  SearchX,
} from 'lucide-react'

export interface SerializedPublicProperty {
  id: string
  name: string
  slug: string
  address: string
  description?: string | null
  monthlyPriceFrom: number
  coverImageUrl?: string | null
  facilities: string[]
  totalUnits: number
  availableUnits: number
  units?: { name: string; monthlyRent: number; status: string; facilities: string[] }[]
}

interface PropertyCatalogProps {
  properties: SerializedPublicProperty[]
}

type StatusFilter = 'all' | 'ready' | 'occupied'
type SortOrder = 'default' | 'price-asc' | 'price-desc'

export default function PropertyCatalog({ properties }: PropertyCatalogProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortOrder>('default')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = properties.filter((p) => {
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      const isReady = p.availableUnits > 0
      const matchesStatus =
        status === 'all' || (status === 'ready' ? isReady : !isReady)
      return matchesSearch && matchesStatus
    })
    if (sort === 'price-asc')
      return [...list].sort((a, b) => a.monthlyPriceFrom - b.monthlyPriceFrom)
    if (sort === 'price-desc')
      return [...list].sort((a, b) => b.monthlyPriceFrom - a.monthlyPriceFrom)
    return list
  }, [properties, search, status, sort])

  const hasFilter = search.trim() !== '' || status !== 'all'

  function resetFilters() {
    setSearch('')
    setStatus('all')
    setSort('default')
  }

  return (
    <div className="w-full">
      {/* ——— Filter bar ——— */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:p-6">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717975]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau lokasi — mis. Melati, Cilandak"
              aria-label="Cari unit"
              className="w-full rounded-lg border border-[#e0e3e0] bg-[#f7faf6] py-3 pl-11 pr-4 text-sm text-[#181c1b] outline-none transition placeholder:text-[#717975] focus:border-[#013428] focus:ring-2 focus:ring-[#013428]/15"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:col-span-6 md:justify-end">
            <label className="flex items-center gap-1 rounded-lg bg-[#ecefeb] px-3 py-1.5 text-sm font-semibold text-[#181c1b]">
              <CheckCircle2 className="h-[18px] w-[18px] text-[#404945]" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                aria-label="Filter status"
                className="cursor-pointer bg-transparent focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="ready">Siap Huni Saja</option>
                <option value="occupied">Waiting List</option>
              </select>
            </label>
            <label className="flex items-center gap-1 rounded-lg bg-[#ecefeb] px-3 py-1.5 text-sm font-semibold text-[#181c1b]">
              <ArrowUpDown className="h-[18px] w-[18px] text-[#404945]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                aria-label="Urutkan"
                className="cursor-pointer bg-transparent focus:outline-none"
              >
                <option value="default">Rekomendasi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between border-t border-[#ecefeb] pt-2 text-[#404945]">
          <div className="flex items-center gap-1">
            <Info className="h-[18px] w-[18px] text-[#974723]" />
            <span className="text-sm">
              Seluruh unit dilengkapi meteran listrik terpisah per unit.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-[#013428] underline underline-offset-4 hover:text-[#1e4b3e]"
              >
                Reset Filter
              </button>
            )}
            <span className="rounded-full bg-[#bdeddb]/40 px-3 py-0.5 text-sm font-semibold text-[#013428]">
              Menampilkan {filtered.length} Unit
            </span>
          </div>
        </div>
      </div>

      {/* ——— Grid ——— */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white px-6 py-14 text-center">
          <SearchX className="mx-auto h-12 w-12 text-[#c0c8c3]" />
          <h3 className="mt-1 text-lg font-semibold text-[#181c1b]">
            Tidak Ditemukan Unit yang Sesuai
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#404945]">
            Coba sesuaikan filter ketersediaan atau kata kunci pencarian.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-[#013428] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e4b3e]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => {
            const isReady = property.availableUnits > 0
            const unitList = [...(property.units ?? [])].sort(
              (a, b) => a.monthlyRent - b.monthlyRent
            )
            const badges = [
              ...property.facilities,
              ...unitList.flatMap((u) => u.facilities ?? []),
            ]
              .filter((f, i, arr) => arr.indexOf(f) === i)
              .slice(0, 3)
            const waUrl = `https://wa.me/6281384634526?text=${encodeURIComponent(
              `Halo Pengelola, saya tertarik dengan ${property.name} (${formatRupiah(property.monthlyPriceFrom)}/bln). Apakah masih tersedia?`
            )}`
            return (
              <article
                key={property.id}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-[480px] w-full overflow-hidden bg-[#e6e9e5]">
                  {property.coverImageUrl ? (
                    <img
                      src={property.coverImageUrl}
                      alt={property.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-[#717975]" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    {isReady ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        Siap Huni — {property.availableUnits} tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 shadow-sm backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-amber-600" />
                        Terisi (Daftar Tunggu)
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded bg-[#013428]/80 px-3 py-0.5 text-sm font-semibold text-white backdrop-blur-md">
                    {property.availableUnits}/{property.totalUnits} unit
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#974723]">
                        {property.totalUnits} Tipe Unit
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#404945]">
                        <MapPin className="h-4 w-4" />
                        <span className="max-w-[160px] truncate">{property.address}</span>
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-[#181c1b] transition-colors group-hover:text-[#013428]">
                      {property.name}
                    </h2>
                    {property.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-[#404945]">
                        {property.description}
                      </p>
                    )}
                    {badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {badges.map((b) => (
                          <span
                            key={b}
                            className="rounded bg-[#ecefeb] px-2 py-0.5 text-xs text-[#404945]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    {unitList.length > 0 && (
                      <ul className="mt-3 divide-y divide-[#ecefeb] rounded-lg bg-[#f1f4f1] px-3">
                        {unitList.slice(0, 3).map((u) => (
                          <li
                            key={u.name}
                            className="flex items-center justify-between gap-2 py-2 text-[13px]"
                          >
                            <span className="flex min-w-0 items-center gap-2 font-semibold text-[#181c1b]">
                              <span
                                aria-hidden
                                className={`h-2 w-2 shrink-0 rounded-full ${u.status === 'AVAILABLE' ? 'bg-emerald-600' : 'bg-[#717975]/50'}`}
                              />
                              <span className="truncate">{u.name}</span>
                            </span>
                            <span className="font-bold tabular-nums">
                              {formatRupiah(u.monthlyRent)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="-mb-4 -mx-4 mt-4 flex flex-col gap-2 rounded-b-xl bg-[#f1f4f1] p-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#013428]">
                          {formatRupiah(property.monthlyPriceFrom)}
                        </span>
                        <span className="text-sm text-[#404945]">/ bulan</span>
                      </div>
                      <span className="rounded bg-[#ffdbce] px-2 py-0.5 text-xs text-[#772f0d]">
                        Mulai dari
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <Link
                        href={`/kontrakan/${property.slug}`}
                        className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#e0e3e0] py-2 text-sm font-semibold text-[#181c1b] transition-colors hover:bg-[#d8dbd7]"
                      >
                        <Eye className="h-4 w-4" />
                        Detail Unit
                      </Link>
                      {isReady ? (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#013428] py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1e4b3e]"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Tanya WA
                        </a>
                      ) : (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#974723] py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#772f0d]"
                        >
                          <Bookmark className="h-4 w-4" />
                          Waitlist WA
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
