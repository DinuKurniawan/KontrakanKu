import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'
import {
  MapPin,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  BadgeCheck,
  Star,
  ShieldCheck,
  Clock,
  Navigation,
  Wifi,
  Car,
  Zap,
  Droplets,
  Wind,
  Tv,
  Refrigerator,
  BedDouble,
  Bath,
} from 'lucide-react'
import { PropertyStatus, UserRole } from '@prisma/client'
import GalleryViewer from './gallery-viewer'
import WhatsAppIcon from '@/components/whatsapp-icon'
import { HeaderActions } from './detail-actions'
import PublicLayout from '@/components/public-layout'

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    address: property.address,
    priceRange: formatRupiah(property.monthlyPriceFrom.toNumber()),
  }

  const highlights = [
    { icon: ShieldCheck, title: 'Bebas banjir & aman', desc: 'Lingkungan tertata dan akses jalan lebar.' },
    { icon: MapPin, title: 'Lokasi strategis', desc: 'Dekat stasiun, minimarket, dan sarana ibadah.' },
    { icon: Clock, title: 'Respon cepat', desc: 'Siap bantu survei di hari yang sama.' },
  ]

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="w-full border-b hairline bg-paper">
        <div className="shell flex w-full items-center justify-between gap-3 py-3 text-sm">
          <nav className="breadcrumbs p-0 text-sm" aria-label="Breadcrumb">
            <ul>
              <li>
                <Link href="/kontrakan" className="inline-flex items-center gap-1 text-bark hover:text-pine">
                  <ChevronLeft className="h-4 w-4" /> Semua unit
                </Link>
              </li>
              <li className="max-w-[200px] truncate font-semibold text-ink sm:max-w-xs">{property.name}</li>
            </ul>
          </nav>
          <span className={`stamp ${availableCount > 0 ? 'stamp-open' : 'stamp-muted'}`}>
            {availableCount}/{totalUnits} tersedia
          </span>
        </div>
      </div>

      <div className="shell w-full min-w-0 pb-24 pt-8 sm:pt-10 lg:pb-16">
        {/* Title */}
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">Kontrakan · Cilandak</p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {property.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5 font-bold text-ink">
                <Star className="h-4 w-4 fill-gold text-gold" /> 4.9
                <span className="font-normal text-fog">· 18 ulasan</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5 text-bark">
                <MapPin className="h-4 w-4 shrink-0 text-fog" />
                <span className="truncate">{property.address}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-moss">
                <DoorOpen className="h-4 w-4" />
                {availableCount} dari {totalUnits} tersedia
              </span>
            </div>
          </div>
          <div className="hidden shrink-0 lg:block">
            <HeaderActions title={property.name} url={`/kontrakan/${property.slug}`} />
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-7">
          <GalleryViewer images={property.images} propertyName={property.name} />
        </div>

        <div className="mt-10 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* Left */}
          <div className="min-w-0 space-y-8">
            {/* Host */}
            <section className="card-dossier !transform-none p-5 sm:p-6" aria-label="Pengelola">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine font-display text-sm font-bold text-paper" aria-hidden>
                    {(admin?.name || property.name).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-bold text-ink">Dikelola oleh {admin?.name || 'Pengelola'}</h2>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">Sejak 2018 · Respon &lt; 1 jam</p>
                  </div>
                </div>
                <span className="stamp stamp-open hidden shrink-0 sm:inline-flex">
                  <BadgeCheck className="h-4 w-4" /> Terverifikasi
                </span>
              </div>
            </section>

            {/* Highlights */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Keunggulan">
              {highlights.map((h) => {
                const Icon = h.icon
                return (
                  <div key={h.title} className="rounded-[1.5rem] border hairline bg-cream/60 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine text-paper">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-ink">{h.title}</p>
                    <p className="mt-1 text-[13px] leading-5 text-bark">{h.desc}</p>
                  </div>
                )
              })}
            </section>

            {/* Description */}
            <section className="card-dossier !transform-none p-6 sm:p-7">
              <p className="eyebrow">Tentang tempat ini</p>
              <p className="mt-4 whitespace-pre-line font-display text-lg leading-8 text-ink sm:text-xl sm:leading-9">
                {property.description || 'Kontrakan nyaman, asri, bebas banjir dengan sirkulasi udara baik. Lokasi strategis dekat stasiun, minimarket, dan sarana ibadah.'}
              </p>
            </section>

            {/* Facilities */}
            {(property.units.some((u) => (u.facilities?.length ?? 0) > 0) || property.facilities.length > 0) && (
              <section>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="eyebrow">Fasilitas</p>
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink">Yang tersedia di unit</h3>
                  </div>
                  <p className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-fog sm:block">Dapat berbeda tiap tipe</p>
                </div>
                <div className="mt-5 space-y-5">
                  {property.units.map((unit) => {
                    const facs = unit.facilities?.length ? unit.facilities : property.facilities
                    if (facs.length === 0) return null
                    const isAvailable = unit.status === 'AVAILABLE'
                    return (
                      <div key={unit.id} className="card-dossier !transform-none p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-ink">
                            {unit.name}{' '}
                            <span className="tick font-normal text-fog">
                              · {formatRupiah(unit.monthlyRent.toNumber())}/bln
                            </span>
                          </p>
                          <span className={`stamp ${isAvailable ? 'stamp-open' : 'stamp-muted'}`}>
                            {isAvailable ? 'Tersedia' : 'Terisi'}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {facs.map((fac) => {
                            const Icon = facilityIcon(fac)
                            return (
                              <div
                                key={`${unit.id}-${fac}`}
                                className="flex items-center gap-3 rounded-xl bg-cream/60 px-3.5 py-3"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-moss" />
                                <span className="text-sm font-medium text-ink">{fac}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Units */}
            <section id="unit-tersedia" className="scroll-mt-24">
              <p className="eyebrow">Pilih unit</p>
              <div className="mt-3 flex items-end justify-between">
                <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                  {availableCount} tersedia <span className="text-fog">dari {totalUnits}</span>
                </h3>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {property.units.map((unit) => {
                  const isAvailable = unit.status === 'AVAILABLE'
                  return (
                    <div
                      key={unit.id}
                      className={`rounded-[1.5rem] border p-5 transition ${
                        isAvailable ? 'hairline bg-white shadow-warm' : 'border-line/60 bg-cream/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-ink">{unit.name}</p>
                        <span className={`stamp ${isAvailable ? 'stamp-open' : 'stamp-muted'}`}>
                          {isAvailable ? 'Tersedia' : 'Terisi'}
                        </span>
                      </div>
                      <p className="tick mt-2 font-display text-xl font-semibold tracking-tight text-pine">
                        {formatRupiah(unit.monthlyRent.toNumber())}
                        <span className="font-sans text-sm font-normal text-fog">/bln</span>
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                        {isAvailable ? 'Siap huni' : 'Sedang dihuni'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Location */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow">Lokasi</p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink">Di mana tepatnya?</h3>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-bark">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                    <span className="min-w-0">{property.address}</span>
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="chip hidden font-semibold sm:inline-flex"
                >
                  Buka di Google Maps <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {['Bebas banjir', 'Dekat stasiun', 'Minimarket', 'Sarana ibadah'].map((chip) => (
                  <span key={chip} className="stamp stamp-muted">
                    <Check className="h-3 w-3 text-fern" /> {chip}
                  </span>
                ))}
              </div>

              <div className="mr-auto mt-4 w-full max-w-3xl overflow-hidden rounded-[1.75rem] border hairline bg-sand shadow-warm">
                <div className="relative bg-sand">
                  <iframe
                    title={`Peta lokasi ${property.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&z=15&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[220px] w-full border-0 sm:h-[280px] lg:h-[320px]"
                  />
                  <div className="absolute left-4 top-4 hidden max-w-xs rounded-2xl border hairline bg-paper/95 p-4 shadow-lift backdrop-blur md:block">
                    <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-fog">
                      <MapPin className="h-3.5 w-3.5 text-moss" /> Lokasi unit
                    </p>
                    <p className="mt-1.5 text-sm font-bold leading-6 text-ink">
                      {property.name}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-bark">
                      {property.address}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-elegant-primary mt-3 w-full !py-2.5 !text-[13px]"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Lihat rute
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-3 bg-white px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{property.name}</p>
                    <p className="mt-0.5 truncate text-[13px] text-fog">{property.address}</p>
                  </div>
                  <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="chip justify-center font-semibold"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Rute
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-elegant-primary !py-2.5 !text-[13px]"
                    >
                      Buka Maps <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — booking card */}
          <div className="min-w-0">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="card-dossier !transform-none overflow-hidden p-6 sm:p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">Mulai dari</p>
                <p className="mt-1.5 font-display text-[2rem] font-semibold tracking-tight text-pine">
                  {formatRupiah(property.monthlyPriceFrom.toNumber())}
                  <span className="font-sans text-base font-normal text-fog">/bulan</span>
                </p>

                <div className="mt-5 rounded-2xl bg-cream/70 p-4">
                  <div className="flex items-center justify-between text-sm font-bold text-ink">
                    <span>{availableCount} unit tersedia</span>
                    <span className="tick font-semibold text-fog">
                      {availableCount}/{totalUnits}
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-moss to-fern"
                      style={{ width: `${totalUnits ? Math.round((availableCount / totalUnits) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-xs leading-5 text-bark">
                    {availableCount > 0
                      ? 'Stok terbatas minggu ini — amankan jadwal survei Anda.'
                      : 'Saat ini penuh. Hubungi kami untuk waiting list.'}
                  </p>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-elegant-primary mt-5 w-full !py-3.5"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Hubungi pengelola
                </a>
                <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fog">Balas &lt;1 jam · Gratis survei</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href="#unit-tersedia" className="chip justify-center font-semibold">
                    Lihat unit
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="chip justify-center font-semibold"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Rute
                  </a>
                </div>

                <ul className="mt-5 space-y-2.5 border-t hairline pt-5 text-[13px] text-bark">
                  {['Pembayaran manual terverifikasi', 'Bukti dicek admin satu per satu', 'Tagihan terpantau otomatis'].map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mist">
                        <Check className="h-3 w-3 text-moss" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className="mt-5 block text-center text-[13px] font-bold text-pine underline underline-offset-4 hover:text-moss"
                >
                  Sudah penyewa? Masuk
                </Link>
              </div>

              <div className="rounded-[1.75rem] bg-pine p-6 text-paper shadow-warm">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper font-display text-sm font-bold text-pine" aria-hidden>
                    {(admin?.name || 'AD').slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{admin?.name || 'Pengelola'}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/60">Host sejak 2018</p>
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-6 text-paper/75">
                  Butuh info survei atau ketersediaan? Chat WhatsApp — kami bantu carikan unit yang paling cocok.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 w-full max-w-full border-t hairline bg-paper/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6 lg:hidden">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Mulai dari</p>
            <p className="tick truncate font-display text-lg font-semibold tracking-tight text-pine">
              {formatRupiah(property.monthlyPriceFrom.toNumber())}
              <span className="ml-1 font-sans text-xs font-normal text-fog">/bln</span>
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-elegant-primary shrink-0 !py-3"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
