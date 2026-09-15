'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import { Building2, MapPin, ArrowUpRight, Search, X, KeyRound, Filter } from 'lucide-react'

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
    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
      {/* LACI FILTER — brass drawer */}
      <div className="border-[1.5px] border-[#0F1F33] bg-white shadow-[4px_4px_0_rgba(15,31,51,0.08)]">
        {/* drawer header with brass handle */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-3 sm:px-4 py-2.5 text-white">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Filter className="h-3.5 w-3.5 text-[#C8A46A]" /> Laci Filter — tarik untuk menyaring
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-white/60">
            <span className="h-1.5 w-6 rounded-full bg-[#C8A46A]/40" /> brass handle
          </span>
          {/* brass pull */}
          <span className="hidden sm:flex h-6 w-14 items-center justify-center rounded-[3px] key-shine border border-[#B8935A]" aria-hidden>
            <span className="h-1 w-8 rounded-full bg-[#0F1F33]/25" />
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Row 1: search + controls */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full max-w-[460px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1F33]/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau lokasi — mis. Melati, Cilandak"
                  className="w-full border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] py-2.5 pl-9 pr-4 font-mono text-sm text-[#0F1F33] placeholder:text-[#0F1F33]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A46A]/30"
                />
              </div>

              <label className="hidden shrink-0 cursor-pointer items-center gap-2 border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-white sm:inline-flex">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-none border-[#0F1F33] text-[#0F1F33] focus:ring-0 accent-[#0F1F33]"
                />
                Hanya yang tersedia
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/60">
                Urut
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                  className="border-[1.5px] border-[#0F1F33] bg-white px-3 py-2 font-mono text-xs font-semibold text-[#0F1F33] focus:outline-none focus:ring-2 focus:ring-[#C8A46A]/30"
                >
                  <option value="NEWEST">Terbaru</option>
                  <option value="PRICE_ASC">Termurah</option>
                  <option value="PRICE_DESC">Termahal</option>
                </select>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide sm:hidden">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#0F1F33]"
                />
                Ada unit
              </label>
            </div>
          </div>

          {/* Row 2: price + facilities */}
          <div className="space-y-3 border-t border-dashed border-[#0F1F33]/15 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">Harga maks</span>
              <span className="h-3 w-px bg-[#0F1F33]/15" aria-hidden />
              {pricePresets.map((preset) => {
                const active = maxPrice === preset.value
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMaxPrice(preset.value)}
                    className={`border-[1.5px] px-3 py-1.5 font-mono text-xs font-semibold transition ${
                      active
                        ? 'border-[#0F1F33] bg-[#0F1F33] text-white'
                        : 'border-[#0F1F33]/15 bg-white text-[#0F1F33]/70 hover:border-[#0F1F33] hover:text-[#0F1F33]'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {uniqueFacilities.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">Fasilitas</span>
                <span className="h-3 w-px bg-[#0F1F33]/15" aria-hidden />
                {uniqueFacilities.map((facility) => {
                  const active = selectedFacilities.includes(facility)
                  return (
                    <button
                      key={facility}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleFacility(facility)}
                      className={`border-[1.5px] px-3 py-1.5 font-mono text-xs font-semibold transition ${
                        active
                          ? 'border-[#C8A46A] bg-[#C8A46A] text-[#0F1F33]'
                          : 'border-[#0F1F33]/15 bg-white text-[#0F1F33]/70 hover:border-[#0F1F33]/40'
                      }`}
                    >
                      {facility}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Results meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-[#0F1F33] bg-[#E9E5DD]/60 px-4 py-3 font-mono text-[11px]">
          <p className="uppercase tracking-widest text-[#0F1F33]/70">
            Menampilkan <span className="font-bold tabular-nums text-[#0F1F33]">{filteredProperties.length}</span> dari{' '}
            <span className="tabular-nums">{properties.length}</span> map kontrakan
            {hasActiveFilter && <span className="ml-2 text-[#D93D30]">· filter aktif</span>}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-3 py-1.5 uppercase tracking-wide font-semibold hover:bg-[#0F1F33] hover:text-white transition"
            >
              <X className="h-3 w-3" /> Reset laci
            </button>
          )}
        </div>
      </div>

      {/* Grid — folder MAP */}
      {filteredProperties.length === 0 ? (
        <div className="mt-6 border-[1.5px] border-dashed border-[#0F1F33]/20 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center border-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
            <Building2 className="h-5 w-5 text-[#0F1F33]/40" />
          </div>
          <h3 className="mt-4 font-display text-[16px] font-bold">Tidak ada yang cocok di laci</h3>
          <p className="mx-auto mt-1 max-w-[40ch] text-sm leading-6 text-[#0F1F33]/60">
            Coba ubah kata kunci atau longgarkan filter harga & fasilitas. Atau kosongkan laci untuk lihat semua unit.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 border-[1.5px] border-[#0F1F33] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition"
          >
            Kosongkan laci
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property, idx) => {
            const hasAvailable = property.availableUnits > 0
            const unitList = (property.units ?? []).slice().sort((a, b) => a.monthlyRent - b.monthlyRent)
            const rents = unitList.map(u => u.monthlyRent)
            const minRent = rents.length > 0 ? Math.min(...rents) : property.monthlyPriceFrom
            const maxRent = rents.length > 0 ? Math.max(...rents) : property.monthlyPriceFrom
            const priceLabel = minRent === maxRent ? formatRupiah(minRent) : `${formatRupiah(minRent)}–${formatRupiah(maxRent)}`
            return (
              <article
                key={property.id}
                className="group flex flex-col border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] shadow-[4px_4px_0_rgba(15,31,51,0.10)] hover:shadow-[6px_6px_0_rgba(15,31,51,0.12)] hover:-translate-y-[1px] transition-all"
              >
                {/* folder tab */}
                <div className="flex items-center justify-between bg-white border-b-[1.5px] border-[#0F1F33] px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                    <span className="h-2 w-2 rounded-full bg-[#D93D30]" aria-hidden />
                    MAP — No. {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] text-[#0F1F33]/50">{property.totalUnits} unit</span>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E5DD] border-b-[1.5px] border-[#0F1F33]">
                  {property.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.coverImageUrl}
                      alt={property.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-[#0F1F33]/20" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-[#0F1F33] px-2.5 py-1.5 font-mono text-xs font-bold text-white">
                    {priceLabel}
                    <span className="font-normal opacity-60"> /bln</span>
                  </span>
                  <span
                    className={`absolute right-2 top-2 inline-flex items-center gap-1.5 border-[1.5px] px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${
                      hasAvailable ? 'bg-white border-[#0F1F33] text-[#115E59]' : 'bg-[#0F1F33] border-[#0F1F33] text-white'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 ${hasAvailable ? 'bg-[#115E59]' : 'bg-white'}`} aria-hidden />
                    {hasAvailable ? `${property.availableUnits} tersedia` : 'Penuh'}
                  </span>
                  <span className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full key-shine border border-[#B8935A] shadow-sm" aria-hidden />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-display text-[16px] font-[800] leading-tight tracking-tight">{property.name}</h2>
                  <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#0F1F33]/60">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </p>

                  {property.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#0F1F33]/70">{property.description}</p>
                  )}

                  {unitList.length > 0 ? (
                    <div className="mt-3 border border-[#0F1F33]/10 bg-white">
                      <p className="border-b border-dashed border-[#0F1F33]/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/50">
                        Tipe unit & harga
                      </p>
                      <ul className="divide-y divide-[#0F1F33]/10">
                        {unitList.slice(0, 3).map((u) => (
                          <li key={u.name} className="flex items-center justify-between gap-2 px-2.5 py-1.5 font-mono text-xs">
                            <span className="inline-flex min-w-0 items-center gap-1.5 font-bold">
                              <span className={`h-1.5 w-1.5 shrink-0 ${u.status === 'AVAILABLE' ? 'bg-[#115E59]' : 'bg-[#0F1F33]/25'}`} aria-hidden />
                              <span className="truncate">{u.name}</span>
                            </span>
                            <span className="shrink-0 font-bold tabular-nums">
                              {formatRupiah(u.monthlyRent)}
                              <span className="font-normal text-[#0F1F33]/50">/bln</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      {unitList.length > 3 && (
                        <p className="border-t border-dashed border-[#0F1F33]/15 px-2.5 py-1.5 font-mono text-[10px] text-[#0F1F33]/50">
                          +{unitList.length - 3} tipe lain — buka map untuk lengkap
                        </p>
                      )}
                    </div>
                  ) : (
                    property.facilities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {property.facilities.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="border border-[#0F1F33]/10 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/60"
                          >
                            {f}
                          </span>
                        ))}
                        {property.facilities.length > 3 && (
                          <span className="self-center font-mono text-[10px] text-[#0F1F33]/40">+{property.facilities.length - 3}</span>
                        )}
                      </div>
                    )
                  )}

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-[#0F1F33]/15 pt-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Kunci</span>
                      <p className="font-mono text-xs font-bold">
                        {property.availableUnits}/{property.totalUnits} tersedia
                      </p>
                    </div>
                    <Link
                      href={`/kontrakan/${property.slug}`}
                      className="inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition"
                    >
                      Buka map <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-[#0F1F33]/15 py-6 font-mono text-xs text-[#0F1F33]/60 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Butuh bantuan pilih kunci? <span className="font-bold text-[#0F1F33]">Chat pengelola langsung</span> — respon &lt;1 jam.
        </span>
        <a
          href="https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20mengenai%20kontrakan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-4 py-2 text-white hover:bg-black font-semibold uppercase tracking-wide text-xs"
        >
          <KeyRound className="h-3 w-3" /> WhatsApp 0813-8463-4526 <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
