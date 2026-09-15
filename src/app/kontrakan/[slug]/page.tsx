import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'
import {
  MapPin,
  Building2,
  DoorOpen,
  ArrowLeft,
  PhoneCall,
  Check,
  BadgeCheck,
  Sparkles,
  Star,
  ShieldCheck,
  Clock,
  Wifi,
  Car,
  Zap,
  Droplets,
  Wind,
  Tv,
  Refrigerator,
  BedDouble,
  Bath,
  Award,
  ChevronRight,
  Flag,
  Shield,
  KeyRound,
  ArrowUpRight,
  FileText,
  Archive,
  PenLine,
} from 'lucide-react'
import { PropertyStatus, UserRole } from '@prisma/client'
import GalleryViewer from './gallery-viewer'
import { HeaderActions } from './detail-actions'
import AutoReveal from '@/components/auto-reveal'

interface PageProps {
  params: Promise<{ slug: string }>
}

function truncateDescription(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return normalized.slice(0, maxLength).trimEnd()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await prisma.property.findUnique({
    where: { slug, status: PropertyStatus.PUBLISHED },
    select: {
      name: true,
      description: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } },
    },
  })

  if (!property) {
    return {
      title: 'Kontrakan tidak ditemukan',
      description: 'Detail kontrakan yang Anda cari tidak tersedia.',
    }
  }

  const description = truncateDescription(
    property.description || `Sewa ${property.name}, kontrakan bersih, nyaman, dan strategis.`
  )
  const cover = property.images[0]?.url

  return {
    title: property.name,
    description,
    openGraph: { title: property.name, description, images: cover ? [cover] : [] },
  }
}

function facilityIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('wifi') || l.includes('internet')) return Wifi
  if (l.includes('parkir') || l.includes('car') || l.includes('garasi')) return Car
  if (l.includes('listrik') || l.includes('token')) return Zap
  if (l.includes('air') || l.includes('pam') || l.includes('sumur')) return Droplets
  if (l.includes('ac') || l.includes('angin') || l.includes('kipas') || l.includes('udara')) return Wind
  if (l.includes('tv') || l.includes('televisi')) return Tv
  if (l.includes('kulkas') || l.includes('dapur') || l.includes('kompor')) return Refrigerator
  if (l.includes('kasur') || l.includes('tempat tidur') || l.includes('bed')) return BedDouble
  if (l.includes('kamar mandi') || l.includes('bath') || l.includes('toilet')) return Bath
  if (l.includes('cctv') || l.includes('keamanan') || l.includes('aman')) return ShieldCheck
  return Check
}

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
]

const WA_FALLBACK = 'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20mengenai%20kontrakan'

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [property, admin] = await Promise.all([
    prisma.property.findUnique({
      where: { slug, status: PropertyStatus.PUBLISHED },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        units: { orderBy: { name: 'asc' } },
      },
    }),
    prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
      select: { name: true, phone: true },
    }),
  ])

  if (!property) notFound()

  let waNumber = admin?.phone ? admin.phone.replace(/\D/g, '') : ''
  if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1)
  const waText = encodeURIComponent(
    `Halo ${admin?.name || 'Pengelola'}, saya tertarik dengan ${property.name}. Apakah masih ada unit kamar yang tersedia?`
  )
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : WA_FALLBACK

  const availableCount = property.units.filter((u) => u.status === 'AVAILABLE').length
  const totalUnits = property.units.length
  const availabilityPct = totalUnits ? Math.round((availableCount / totalUnits) * 100) : 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    address: property.address,
    priceRange: formatRupiah(property.monthlyPriceFrom.toNumber()),
  }

  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Bebas banjir & aman',
      desc: 'Lingkungan tertata, sirkulasi udara baik dan akses jalan lebar.',
    },
    {
      icon: MapPin,
      title: 'Lokasi strategis',
      desc: 'Dekat stasiun, minimarket, dan sarana ibadah — 5 menit jalan kaki.',
    },
    {
      icon: Clock,
      title: 'Respon cepat',
      desc: 'Pengelola aktif & siap bantu survei di hari yang sama.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0F1F33] flex flex-col selection:bg-[#C8A46A]/30">
      <div className="h-[6px] w-full bg-[#0F1F33] relative">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#C8A46A]/60" />
      </div>

      <header className="sticky top-0 z-30 bg-[#FFFBF0]/92 backdrop-blur-[10px] border-b-[1.5px] border-[#0F1F33]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[11px] bg-[#0F1F33] text-[#FFFBF0] shadow-[0_2px_10px_rgba(15,31,51,0.18)] group-hover:bg-[#115E59] transition-colors">
              <KeyRound className="h-[18px] w-[18px] -rotate-45" strokeWidth={2.2} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#C8A46A] ring-2 ring-[#FFFBF0]" aria-hidden />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[17px] font-[800] tracking-[-0.02em]">Kelola Kontrakan</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#0F1F33]/60">Cilandak · Est 2018</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`rounded-none border px-4 py-2 font-mono text-[13px] font-medium tracking-wide transition ${
                  l.href === '/kontrakan' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-transparent hover:border-[#0F1F33] hover:bg-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex items-center justify-center bg-[#D93D30] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c2362b] transition">
              Masuk
            </Link>
            <a href={waUrl} target="_blank" rel="noreferrer" className="hidden lg:inline-flex items-center gap-1.5 border border-[#E9E5DD] bg-white px-3 py-2.5 font-mono text-xs hover:border-[#0F1F33] transition">
              <PhoneCall className="h-3.5 w-3.5" /> WA
            </a>
          </div>
        </div>
        <div className="flex md:hidden items-center gap-1 border-t border-[#0F1F33]/10 bg-white px-4 py-2 overflow-x-auto">
          {NAV.map((l) => (
            <Link key={l.label} href={l.href} className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${l.href === '/kontrakan' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#E9E5DD] bg-[#FFFBF0]'}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0 font-mono text-xs underline underline-offset-4">Masuk</Link>
        </div>
      </header>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Masthead ledger bar */}
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-[#0F1F33] py-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Link href="/kontrakan" className="inline-flex items-center gap-1.5 hover:underline underline-offset-4">
            <ArrowLeft className="h-3 w-3" /> Kembali · Unit
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 text-[#0F1F33]/60">
            <span className="h-2 w-2 bg-[#D93D30]" aria-hidden /> Katalog / {property.name}
          </span>
          <span className="tabular-nums font-semibold">{availableCount}/{totalUnits} kunci tersedia · {availabilityPct}%</span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-10">
        <AutoReveal />
        {/* Title row — thesis */}
        <div className="flex flex-col gap-3 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-[720px] font-display text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[0.88] tracking-[-0.045em]">
              {property.name}
            </h1>
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <span className="inline-flex items-center gap-1.5 border-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-3 py-1.5 font-mono text-xs font-bold text-white">
                <Award className="h-3.5 w-3.5 text-[#C8A46A]" /> MAP TERJAGA
              </span>
              <HeaderActions title={property.name} url={`/kontrakan/${property.slug}`} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px]">
            <span className="inline-flex items-center gap-1.5 font-bold">
              <Star className="h-3.5 w-3.5 fill-[#0F1F33] text-[#0F1F33]" /> 4.93 <span className="font-normal text-[#0F1F33]/50">·</span>
              <span className="underline decoration-[#C8A46A] decoration-2 underline-offset-4">18 ulasan</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-[#0F1F33]/20" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-[#0F1F33]/70">
              <MapPin className="h-3.5 w-3.5 text-[#0F1F33]/50" />
              <span className="font-semibold text-[#0F1F33] underline decoration-[#0F1F33]/15 underline-offset-4">{property.address}</span>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[#0F1F33]/20 sm:inline-block" aria-hidden />
            <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
              <DoorOpen className="h-3.5 w-3.5 text-[#115E59]" />
              <span className="font-bold">{availableCount}</span> dari {totalUnits} kunci tersedia
            </span>
          </div>
        </div>

        {/* Foto kontrakan — satu foto besar + thumbnail semua foto */}
        <div className="mt-6">
          <div className="border-[1.5px] border-[#0F1F33] bg-white p-2 shadow-[4px_4px_0_rgba(15,31,51,0.08)]">
            <div className="overflow-hidden border-[1.5px] border-[#0F1F33] bg-[#E9E5DD]">
              <GalleryViewer images={property.images} propertyName={property.name} />
            </div>
            <div className="flex items-center justify-between px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/60">
              <span className="inline-flex items-center gap-1.5"><Archive className="h-3 w-3" /> Arsip foto — {property.images.length} foto</span>
              <span className="hidden sm:inline">Klik thumbnail untuk ganti foto</span>
            </div>
          </div>
        </div>

        {/* Quick stats — ledger strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
          <div className="border-[1.5px] border-[#0F1F33] bg-[#115E59] text-white px-3 py-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-bold"><span className="h-1.5 w-1.5 bg-white animate-pulse" aria-hidden />{availableCount} dari {totalUnits} tersedia</span>
            <span className="tabular-nums font-bold">{availabilityPct}%</span>
          </div>
          <div className="border-[1.5px] border-[#0F1F33] bg-white px-3 py-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-semibold"><Sparkles className="h-3.5 w-3.5" />{property.facilities.length} fasilitas</span>
            <span className="text-[#0F1F33]/50">termasuk</span>
          </div>
          <div className="border-[1.5px] border-[#0F1F33] bg-[#C8A46A] px-3 py-2.5 flex items-center justify-between font-bold">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />Pembayaran aman</span>
            <span className="text-[10px] uppercase tracking-wide">Manual</span>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Left */}
          <div className="min-w-0 space-y-6">
            {/* Host header — ledger */}
            <section className="flex items-center justify-between gap-4 border-[1.5px] border-[#0F1F33] bg-white p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0F1F33] text-sm font-bold text-white font-mono">
                  {(admin?.name || property.name).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-[14px] font-bold leading-tight">Dikelola oleh {admin?.name || 'Pengelola'}</h2>
                  <p className="font-mono text-xs text-[#0F1F33]/60">Host sejak 2018 · Respon &lt; 1 jam</p>
                </div>
              </div>
              <span className="hidden items-center gap-1 border-[1.5px] border-[#115E59] bg-[#115E59] px-2.5 py-1 font-mono text-xs font-bold text-white sm:inline-flex">
                <BadgeCheck className="h-3.5 w-3.5" /> Terverifikasi
              </span>
            </section>

            {/* Highlights — door cards */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((h) => {
                const Icon = h.icon
                return (
                  <div key={h.title} className="border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] p-4">
                    <div className="flex h-8 w-8 items-center justify-center bg-[#0F1F33] text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 font-display text-sm font-bold leading-tight">{h.title}</p>
                    <p className="mt-1 font-mono text-xs leading-5 text-[#0F1F33]/60">{h.desc}</p>
                  </div>
                )
              })}
            </section>

            {/* Description — ledger paper */}
            <section className="border-[1.5px] border-[#0F1F33] bg-white p-6">
              <div className="flex items-center gap-2 border-b-[1.5px] border-[#0F1F33] pb-3">
                <FileText className="h-4 w-4 text-[#0F1F33]" />
                <h3 className="font-display text-base font-bold">Tentang tempat ini</h3>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Arsip deskripsi</span>
              </div>
              <p className="mt-4 whitespace-pre-line font-mono text-sm leading-7 text-[#0F1F33]/80">
                {property.description || 'Kontrakan nyaman, asri, bebas banjir dengan sirkulasi udara baik. Lokasi strategis dekat stasiun, mini market, dan sarana ibadah.'}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 border-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-3 py-1.5 font-mono text-xs font-bold text-white">
                <Building2 className="h-3 w-3 text-[#C8A46A]" /> Bangunan terawat · Sertifikat lengkap
              </div>
            </section>

            {/* Facilities — per tipe unit, tiap tipe bisa beda */}
            {property.units.some((u) => (u.facilities?.length ?? 0) > 0) || property.facilities.length > 0 ? (
              <section className="border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] p-6">
                <h3 className="font-display text-base font-bold">Fasilitas unggulan</h3>
                <p className="mt-1 font-mono text-xs text-[#0F1F33]/60">Tanpa biaya tambahan — bisa berbeda tiap tipe unit</p>
                <div className="mt-4 space-y-5">
                  {property.units.map((unit) => {
                    const facs = unit.facilities?.length ? unit.facilities : property.facilities
                    if (facs.length === 0) return null
                    const isAvailable = unit.status === 'AVAILABLE'
                    return (
                      <div key={unit.id}>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#0F1F33]/15 pb-2">
                          <span className="font-mono text-xs font-bold">
                            {unit.name}
                            <span className="ml-2 font-normal tabular-nums text-[#0F1F33]/60">{formatRupiah(unit.monthlyRent.toNumber())}/bln</span>
                          </span>
                          <span className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${isAvailable ? 'bg-[#115E59] border-[#115E59] text-white' : 'bg-white border-[#0F1F33]/15 text-[#0F1F33]/50'}`}>
                            {isAvailable ? 'Tersedia' : 'Terisi'}
                          </span>
                        </div>
                        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {facs.map((fac) => {
                            const Icon = facilityIcon(fac)
                            return (
                              <div key={`${unit.id}-${fac}`} className="flex items-center gap-3 border-[1.5px] border-[#0F1F33] bg-white px-3 py-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#E9E5DD] border border-[#0F1F33]/10">
                                  <Icon className="h-4 w-4 text-[#0F1F33]" />
                                </span>
                                <span className="min-w-0 flex-1 font-mono text-xs font-semibold">{fac}</span>
                                <Check className="h-3.5 w-3.5 shrink-0 text-[#115E59]" />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {/* Units — GANTUNGAN KUNCI signature */}
            <section id="unit-tersedia" className="border-[1.5px] border-[#0F1F33] bg-white p-6 scroll-mt-28">
              <div className="flex items-end justify-between gap-4 border-b-[1.5px] border-[#0F1F33] pb-4">
                <div>
                  <h3 className="font-display text-base font-bold">Pilih kunci</h3>
                  <p className="mt-1 font-mono text-xs text-[#0F1F33]/60">{availableCount} tersedia dari {totalUnits} — update hari ini</p>
                </div>
                <span className="hidden border-[1.5px] border-[#115E59] bg-[#115E59] px-2 py-1 font-mono text-xs font-bold text-white sm:inline-flex">
                  {availableCount > 0 ? 'Sisa terbatas' : 'Penuh'}
                </span>
              </div>

              {/* Papan Kunci — blueprint */}
              <div className="mt-5 bg-[#E9E5DD] border border-[#0F1F33]/10 p-3">
                <div className="bg-[#FFFBF0] border-[1.5px] border-[#0F1F33] p-3">
                  <div className="flex items-center justify-between border-b border-dashed border-[#0F1F33]/15 pb-2 font-mono text-[10px] uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5"><KeyRound className="h-3 w-3" /> Papan Kunci — {property.name}</span>
                    <span className="tabular-nums">{availableCount}/{totalUnits} tersedia</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.units.map((unit) => {
                      const isAvailable = unit.status === 'AVAILABLE'
                      return (
                        <div key={unit.id} className="flex flex-col items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0F1F33] border border-[#0F1F33]" aria-hidden />
                          <span className="h-2 w-px bg-[#C8A46A]" aria-hidden />
                          <div
                              className={`relative flex h-[92px] w-full flex-col items-center justify-center border-[1.5px] p-2 transition ${
                                isAvailable ? 'bg-white border-[#0F1F33] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_rgba(15,31,51,0.08)]' : 'bg-[#0F1F33]/5 border-[#0F1F33]/15'
                              }`}
                            >
                              <KeyRound className={`h-5 w-5 -rotate-45 ${isAvailable ? 'text-[#115E59]' : 'text-[#0F1F33]/20'}`} />
                              <p className="mt-1 w-full truncate text-center font-mono text-xs font-bold">{unit.name}</p>
                              <p className="font-mono text-[10px] font-bold tabular-nums">{formatRupiah(unit.monthlyRent.toNumber())}/bln</p>
                              <p className="font-mono text-[10px] text-[#0F1F33]/50">{isAvailable ? 'siap huni' : 'terisi'}</p>
                              {isAvailable && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#D93D30] ring-2 ring-white" aria-hidden />}
                            </div>
                          <span
                            className={`w-full text-center border-[1.5px] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
                              isAvailable ? 'bg-[#115E59] border-[#115E59] text-white' : 'bg-white border-[#0F1F33]/15 text-[#0F1F33]/40'
                            }`}
                          >
                            {isAvailable ? 'tersedia' : 'terisi'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-center font-mono text-[11px] leading-4 text-[#0F1F33]/50">Tersedia = siap huni · Terisi = sedang dihuni</p>
                </div>
              </div>

            </section>

            {/* Location — ledger map */}
            <section className="border-[1.5px] border-[#0F1F33] bg-white overflow-hidden">
              <div className="flex items-center justify-between bg-[#FFFBF0] border-b-[1.5px] border-[#0F1F33] px-4 py-3">
                <h3 className="font-display text-base font-bold">Lokasi</h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[#0F1F33]/60">
                  <MapPin className="h-3 w-3" /> {property.address}
                </span>
              </div>
              <div className="bg-[#E9E5DD] p-2">
                <div className="overflow-hidden border-[1.5px] border-[#0F1F33] bg-white">
                  <iframe
                    title={`Peta lokasi ${property.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`}
                    loading="lazy"
                    className="h-[320px] w-full border-0 sm:h-[380px]"
                  />
                  <div className="flex items-center justify-between gap-3 border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-3 py-2.5">
                    <p className="min-w-0 truncate font-mono text-xs text-[#0F1F33]/70">{property.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 bg-[#0F1F33] px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#115E59] transition"
                    >
                      Buka di Maps <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — sticky kwitansi */}
          <div className="min-w-0">
            <div className="space-y-4 lg:sticky lg:top-[84px]">
              <div className="border-[1.5px] border-[#0F1F33] bg-white shadow-[4px_4px_0_rgba(15,31,51,0.08)] overflow-hidden">
                <div className="flex items-center justify-between bg-[#0F1F33] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                  <span className="inline-flex items-center gap-1.5"><FileText className="h-3 w-3 text-[#C8A46A]" /> Kwitansi — Sewa</span>
                  <span className="opacity-60">No. 03</span>
                </div>

                <div className="relative pl-[22px]">
                  {/* perforated */}
                  <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-white border-r border-dashed border-[#0F1F33]/20 flex flex-col justify-around items-center py-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                    ))}
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Sewa mulai</p>
                        <p className="mt-1 flex items-baseline gap-1 font-display text-[26px] font-[900] tracking-tighter">
                          {formatRupiah(property.monthlyPriceFrom.toNumber())}
                          <span className="font-mono text-sm font-normal text-[#0F1F33]/50">/bulan</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold">
                        <Star className="h-4 w-4 fill-[#0F1F33] text-[#0F1F33]" /> 4.93
                      </span>
                    </div>

                    <div className="mt-5 border border-[#0F1F33]/10 bg-[#E9E5DD]/40 p-3">
                      <div className="flex items-center justify-between font-mono text-xs font-bold">
                        <span>{availableCount} kunci tersedia</span>
                        <span className="tabular-nums">
                          {availableCount}/{totalUnits}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden border border-[#0F1F33]/10 bg-white">
                        <div className="h-full bg-[#115E59] transition-all" style={{ width: `${availabilityPct}%` }} />
                      </div>
                      <p className="mt-2 font-mono text-[11px] leading-4 text-[#0F1F33]/60">
                        {availableCount > 0 ? `Sisa ${availableCount} kunci — peminat tinggi minggu ini.` : 'Saat ini penuh. Hubungi untuk waiting list.'}
                      </p>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#0F1F33] px-6 py-3 font-mono text-sm font-bold text-white hover:bg-[#115E59] transition"
                    >
                      <PhoneCall className="h-4 w-4" /> Hubungi pengelola
                    </a>
                    <p className="mt-2 text-center font-mono text-[11px] text-[#0F1F33]/50">Balas &lt;1 jam · Gratis survei</p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href="#daftar-unit" className="inline-flex items-center justify-center border-[1.5px] border-[#0F1F33] bg-white px-3 py-2.5 font-mono text-xs font-bold hover:bg-[#0F1F33] hover:text-white transition">
                        Lihat ketersediaan
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-3 py-2.5 font-mono text-xs font-bold hover:bg-[#0F1F33] hover:text-white transition"
                      >
                        <MapPin className="h-3 w-3" /> Rute
                      </a>
                    </div>

                    <ul className="mt-5 space-y-1.5 border-t border-dashed border-[#0F1F33]/15 pt-4 font-mono text-xs">
                      {['Pembayaran manual terverifikasi', 'Bukti bayar dicek admin', 'Tagihan di portal penyewa'].map((t) => (
                        <li key={t} className="flex items-center gap-2 font-medium text-[#0F1F33]/70">
                          <Check className="h-3.5 w-3.5 text-[#115E59]" /> {t}
                        </li>
                      ))}
                    </ul>

                    <Link href="/login" className="mt-4 flex items-center justify-center gap-1 font-mono text-xs font-semibold underline decoration-[#C8A46A] decoration-2 underline-offset-4 hover:decoration-[#0F1F33]">
                      Sudah penyewa? Masuk → Riwayat <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* stamp */}
                  <span className="pointer-events-none absolute right-3 top-[92px] hidden rotate-[-11deg] border-[1.5px] border-[#D93D30] bg-white px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-[#D93D30] lg:inline-flex">
                    TERVERIFIKASI
                  </span>
                </div>

                {/* hanging key deco */}
                <div className="absolute -right-2 -top-2 hidden lg:flex h-6 w-6 items-center justify-center rounded-full key-shine border border-[#B8935A] shadow-sm" aria-hidden>
                  <KeyRound className="h-3 w-3 -rotate-45 text-[#0F1F33]" />
                </div>
              </div>

              <div className="border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0F1F33] font-mono text-sm font-bold text-white">
                    {(admin?.name || 'AD').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold leading-tight">{admin?.name || 'Pengelola'}</p>
                    <p className="font-mono text-xs text-[#0F1F33]/60">Menjawab cepat · Host sejak 2018</p>
                  </div>
                  <span className="inline-flex items-center gap-1 border border-[#115E59] bg-[#115E59] px-2 py-1 font-mono text-[10px] font-bold text-white">
                    <ShieldCheck className="h-3 w-3" /> Superhost
                  </span>
                </div>
                <p className="mt-3 font-mono text-xs leading-5 text-[#0F1F33]/70">Butuh info survei atau ketersediaan? Chat WhatsApp — kami bantu carikan kunci yang paling cocok.</p>
              </div>

              <button type="button" className="mx-auto flex items-center gap-1.5 font-mono text-xs text-[#0F1F33]/50 underline decoration-[#0F1F33]/20 underline-offset-4 hover:text-[#0F1F33]">
                <Flag className="h-3 w-3" /> Laporkan listing
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 sm:px-6 lg:px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan · {property.name}</p>
          <p className="max-w-[44ch] font-mono text-xs leading-5 text-[#0F1F33]/50">Foto & harga diperbarui manual. Tanya papan kunci real-time sebelum transfer.</p>
        </div>
      </footer>

      {/* Mobile bottom bar — ledger strip */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0F1F33]/50">Mulai dari</p>
            <p className="truncate font-display text-[18px] font-black tracking-tight">
              {formatRupiah(property.monthlyPriceFrom.toNumber())}
              <span className="ml-1 font-mono text-xs font-medium text-[#0F1F33]/50">/bulan</span>
            </p>
          </div>
          <a href="#daftar-unit" className="shrink-0 border-[1.5px] border-[#0F1F33] bg-white px-4 py-2.5 font-mono text-xs font-bold">
Unit Tersedia
          </a>
          <a href={waUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 bg-[#0F1F33] px-5 py-2.5 font-mono text-xs font-bold text-white">
            <PhoneCall className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
