'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import { Building2, MapPin, ArrowUpRight, Search, X, SlidersHorizontal } from 'lucide-react'

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

export default function PropertyCatalog({ properties }: PropertyCatalogProps) {
  const [search, setSearch] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [sortOption, setSortOption] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  const pricePresets: { label: string; value: number | null }[] = [
    { label: 'Semua harga', value: null },
    { label: '≤ 1 jt', value: 1_000_000 },
    { label: '≤ 1,5 jt', value: 1_500_000 },
    { label: '≤ 2 jt', value: 2_000_000 },
  ]

  const uniqueFacilities = useMemo(
    () =>
      Array.from(
        new Set(
          properties.flatMap((p) => [...(p.facilities ?? []), ...((p.units ?? []).flatMap((u) => u.facilities ?? []))])
        )
      ).sort((a, b) => a.localeCompare(b, 'id')),
    [properties]
  )

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) => (prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]))
  }

  const filteredProperties = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = properties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      const matchesAvailability = !onlyAvailable || p.availableUnits > 0
      const matchesPrice = maxPrice === null || p.monthlyPriceFrom <= maxPrice
      const matchesFacilities = selectedFacilities.every(
        (f) => p.facilities.includes(f) || (p.units ?? []).some((u) => (u.facilities ?? []).includes(f))
      )
      return matchesSearch && matchesAvailability && matchesPrice && matchesFacilities
    })
    if (sortOption === 'PRICE_ASC') return [...filtered].sort((a, b) => a.monthlyPriceFrom - b.monthlyPriceFrom)
    if (sortOption === 'PRICE_DESC') return [...filtered].sort((a, b) => b.monthlyPriceFrom - a.monthlyPriceFrom)
    return filtered
  }, [properties, search, onlyAvailable, maxPrice, selectedFacilities, sortOption])

  const hasActiveFilter = search !== '' || onlyAvailable || maxPrice !== null || selectedFacilities.length > 0

  function clearAll() {
    setSearch('')
    setOnlyAvailable(false)
    setMaxPrice(null)
    setSelectedFacilities([])
    setSortOption('NEWEST')
  }

  return (
    <div className="w-full min-w-0">
      {/* Filter */}
      <div className="card-dossier !transform-none p-5 sm:p-6">
        <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau lokasi — mis. Melati, Cilandak"
              className="field !rounded-full !py-3 pl-11"
              aria-label="Cari kontrakan"
            />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
            <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border hairline bg-white px-4 py-2.5 text-sm font-semibold text-bark transition hover:border-moss hover:text-pine">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="h-4 w-4 accent-[#0e5f43]"
              />
              Tersedia saja
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
              className="field !w-full !rounded-full !py-2.5 font-semibold sm:!w-auto"
              aria-label="Urutkan"
            >
              <option value="NEWEST">Terbaru</option>
              <option value="PRICE_ASC">Termurah</option>
              <option value="PRICE_DESC">Termahal</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t hairline pt-4">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Harga
          </span>
          {pricePresets.map((preset) => {
            const active = maxPrice === preset.value
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => setMaxPrice(preset.value)}
                className={`chip !py-1.5 !text-xs ${active ? 'chip-on' : ''}`}
              >
                {preset.label}
              </button>
            )
          })}
          {uniqueFacilities.length > 0 && (
            <>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Fasilitas</span>
              {uniqueFacilities.slice(0, 8).map((facility) => {
                const active = selectedFacilities.includes(facility)
                return (
                  <button
                    key={facility}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleFacility(facility)}
                    className={`chip !py-1.5 !text-xs ${active ? 'chip-on' : ''}`}
                  >
                    {facility}
                  </button>
                )
              })}
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-fog">
          <p>
            Menampilkan <span className="tick font-bold text-ink">{filteredProperties.length}</span> dari{' '}
            {properties.length} kontrakan
            {hasActiveFilter && <span className="stamp stamp-open ml-2 !py-0.5 !text-[11px]">filter aktif</span>}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="btn-elegant-ghost !p-1 text-[13px] font-bold text-pine"
            >
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredProperties.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border-2 border-dashed border-line bg-paper px-6 py-16 text-center">
          <Building2 className="mx-auto h-8 w-8 text-fog" />
          <h3 className="mt-3 font-display text-xl font-semibold text-ink">Tidak ada hasil yang cocok</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-bark">
            Coba ubah kata kunci atau longgarkan filter harga dan fasilitas.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="btn-elegant-primary mt-5"
          >
            Tampilkan semua
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property, idx) => {
            const hasAvailable = property.availableUnits > 0
            const unitList = (property.units ?? []).slice().sort((a, b) => a.monthlyRent - b.monthlyRent)
            const rents = unitList.map((u) => u.monthlyRent)
            const minRent = rents.length > 0 ? Math.min(...rents) : property.monthlyPriceFrom
            const maxRent = rents.length > 0 ? Math.max(...rents) : property.monthlyPriceFrom
            const priceLabel = minRent === maxRent ? formatRupiah(minRent) : `${formatRupiah(minRent)} – ${formatRupiah(maxRent)}`
            return (
              <article
                key={property.id}
                className="card-dossier animate-fade-up overflow-hidden"
                style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` }}
              >
                <figure className="relative m-0 aspect-[16/10] overflow-hidden bg-sand">
                  {property.coverImageUrl ? (
                    <img
                      src={property.coverImageUrl}
                      alt={property.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-fog" />
                    </div>
                  )}
                  <span className={`stamp absolute right-4 top-4 shadow-warm ${hasAvailable ? 'stamp-open' : 'stamp-muted'}`}>
                    {hasAvailable ? `${property.availableUnits} tersedia` : 'Penuh'}
                  </span>
                </figure>

                <div className="p-6">
                  <p className="font-display text-[1.35rem] font-semibold tracking-tight text-pine">
                    {priceLabel}
                    <span className="font-sans text-sm font-normal text-fog"> /bulan</span>
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">{property.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-fog">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </p>

                  {unitList.length > 0 && (
                    <ul className="mt-4 divide-y divide-line rounded-2xl bg-cream/60 px-4">
                      {unitList.slice(0, 3).map((u) => (
                        <li key={u.name} className="flex items-center justify-between gap-2 py-2.5 text-[13px]">
                          <span className="flex min-w-0 items-center gap-2 font-semibold text-ink">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${u.status === 'AVAILABLE' ? 'bg-fern' : 'bg-fog/50'}`}
                              aria-hidden
                            />
                            <span className="truncate">{u.name}</span>
                          </span>
                          <span className="tick font-bold">{formatRupiah(u.monthlyRent)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t hairline pt-4">
                    <span className="tick text-xs text-fog">
                      {property.availableUnits}/{property.totalUnits} unit tersedia
                    </span>
                    <Link
                      href={`/kontrakan/${property.slug}`}
                      className="btn-elegant-ghost !p-0 font-bold text-pine"
                    >
                      Detail <ArrowUpRight className="h-4 w-4" />
                    </Link>
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
