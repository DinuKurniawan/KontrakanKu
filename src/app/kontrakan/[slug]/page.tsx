import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/utils'
import {
  MapPin,
  DoorOpen,
  ChevronRight,
  Check,
  BadgeCheck,
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
  Home,
  LayoutGrid,
  Wallet,
  Sparkles,
  Images,
  TrainFront,
  Store,
  Hospital,
  Phone,
  CircleCheck,
  Handshake,
  FileText,
  Wrench,
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

  const [property, admin, similar] = await Promise.all([
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
    prisma.property.findMany({
      where: { status: PropertyStatus.PUBLISHED, slug: { not: slug } },
      take: 2,
      include: {
        images: { where: { isCover: true }, take: 1 },
        units: { select: { status: true, monthlyRent: true } },
      },
      orderBy: { createdAt: 'desc' },
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
  const allFacilities = Array.from(
    new Set([
      ...property.facilities,
      ...property.units.flatMap((u) => u.facilities ?? []),
    ])
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    address: property.address,
    priceRange: formatRupiah(property.monthlyPriceFrom.toNumber()),
  }

  const specCards = [
    { icon: LayoutGrid, label: 'Total Unit', value: `${totalUnits} unit`, sub: 'Dalam satu lokasi' },
    { icon: DoorOpen, label: 'Siap Huni', value: `${availableCount} tersedia`, sub: availableCount > 0 ? 'Bisa survei minggu ini' : 'Masuk waiting list' },
    { icon: Wallet, label: 'Harga Mulai', value: formatRupiah(property.monthlyPriceFrom.toNumber()), sub: 'Per bulan' },
    { icon: Sparkles, label: 'Fasilitas', value: `${allFacilities.length} item`, sub: 'Tercatat per unit' },
    { icon: Images, label: 'Foto Unit', value: `${property.images.length} foto`, sub: 'Foto asli lokasi' },
    { icon: ShieldCheck, label: 'Pengelola', value: 'Terverifikasi', sub: 'Respon < 1 jam' },
  ]

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ——— Breadcrumb & status bar ——— */}
      <section className="w-full bg-[#f1f4f1] py-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-[#404945]">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#013428]">
              <Home className="h-[18px] w-[18px]" />
              Beranda
            </Link>
            <span className="text-[#c0c8c3]">/</span>
            <Link href="/kontrakan" className="transition-colors hover:text-[#013428]">
              Pilihan Unit
            </Link>
            <span className="text-[#c0c8c3]">/</span>
            <span className="font-semibold text-[#013428]">{property.name}</span>
          </nav>
          <div className="flex items-center gap-1 text-xs text-[#404945]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#013428]" />
            {availableCount > 0 ? `${availableCount} unit tersedia` : 'Saat ini penuh'}
          </div>
        </div>
      </section>

      {/* ——— Title & tags ——— */}
      <section className="w-full bg-[#f7faf6] py-4 lg:py-6">
        <div className="w-full px-4 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#bdeddb] px-3 py-1 text-sm font-semibold text-[#002018] shadow-sm">
                  <span className={`h-2 w-2 rounded-full ${availableCount > 0 ? 'bg-[#013428]' : 'bg-[#ba1a1a]'}`} />
                  {availableCount > 0 ? `Tersedia ${availableCount} Unit (Siap Huni)` : 'Penuh (Waiting List)'}
                </span>
                {['Bebas Banjir', 'Akses Mobil', 'Portal Keamanan'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#e6e9e5] px-3 py-1 text-xs text-[#404945]"
                  >
                    <BadgeCheck className="h-4 w-4 text-[#013428]" />
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
                {property.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#404945]">
                <div className="flex items-center gap-1 font-medium text-[#013428]">
                  <MapPin className="h-[18px] w-[18px]" />
                  {property.address}
                </div>
              </div>
            </div>
            <div className="shrink-0 self-start lg:self-auto">
              <HeaderActions title={property.name} url={`/kontrakan/${property.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Gallery ——— */}
      <section className="w-full bg-[#f7faf6] pb-6">
        <div className="w-full px-4 lg:px-8">
          <GalleryViewer images={property.images} propertyName={property.name} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1 text-sm text-[#404945]">
              <Images className="h-5 w-5 text-[#013428]" />
              Foto asli {property.images.length > 0 ? `${property.images.length} foto` : 'menyusul'} — tanpa rekayasa lensa berlebih
            </div>
          </div>
        </div>
      </section>

      {/* ——— Main 2-column ——— */}
      <section className="w-full bg-[#f7faf6] py-4">
        <div className="w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <div className="flex flex-col gap-10 lg:col-span-8">
              {/* Ringkasan spesifikasi */}
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-[#013428]">
                    <LayoutGrid className="h-6 w-6 text-[#013428]" />
                    Ringkasan Spesifikasi Unit
                  </h2>
                  <span className="rounded-full bg-[#f1f4f1] px-2.5 py-1 text-xs font-medium text-[#404945]">
                    {totalUnits} tipe unit
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {specCards.map((s) => {
                    const Icon = s.icon
                    return (
                      <div key={s.label} className="flex items-start gap-1 rounded-xl bg-[#f1f4f1] p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#013428] shadow-sm">
                          <Icon className="h-[22px] w-[22px]" />
                        </div>
                        <div>
                          <span className="block text-xs text-[#404945]">{s.label}</span>
                          <span className="font-semibold text-[#181c1b]">{s.value}</span>
                          <span className="block text-xs text-[#717975]">{s.sub}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tentang */}
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-6">
                <h2 className="text-lg font-bold text-[#013428]">Tentang tempat ini</h2>
                <p className="whitespace-pre-line text-base leading-7 text-[#181c1b]">
                  {property.description || 'Kontrakan nyaman, asri, bebas banjir dengan sirkulasi udara baik. Lokasi strategis dekat stasiun, minimarket, dan sarana ibadah.'}
                </p>
              </div>

              {/* Fasilitas */}
              {allFacilities.length > 0 && (
                <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-6">
                  <h2 className="text-lg font-bold text-[#013428]">Fasilitas Rumah & Lingkungan</h2>
                  <p className="text-base text-[#404945]">
                    Setiap sudut didesain agar penghuni bisa langsung menata perabot tanpa perlu renovasi tambahan.
                  </p>
                  <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                    {allFacilities.map((fac) => {
                      const Icon = facilityIcon(fac)
                      return (
                        <div key={fac} className="flex items-start gap-1">
                          <Check className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#013428]" />
                          <div>
                            <span className="block text-base font-semibold text-[#181c1b]">{fac}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {property.units.some((u) => (u.facilities?.length ?? 0) > 0) && (
                    <div className="space-y-2 pt-2">
                      {property.units.map((unit) => {
                        const facs = unit.facilities?.length ? unit.facilities : []
                        if (facs.length === 0) return null
                        return (
                          <div key={unit.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f1f4f1] p-3 text-sm">
                            <span className="font-bold text-[#013428]">{unit.name}</span>
                            {facs.map((f) => (
                              <span key={`${unit.id}-${f}`} className="rounded-md bg-white px-2 py-1 text-xs text-[#404945]">
                                {f}
                              </span>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Daftar unit & harga */}
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#013428]">Daftar Unit & Harga</h2>
                  <span className="text-xs text-[#404945]">{availableCount}/{totalUnits} tersedia</span>
                </div>
                <div className="space-y-1">
                  {property.units.map((unit, i) => {
                    const isAvailable = unit.status === 'AVAILABLE'
                    return (
                      <div key={unit.id} className="flex items-center justify-between rounded-xl bg-[#f7faf6] p-3">
                        <div className="flex items-center gap-1">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bdeddb] text-xs font-bold text-[#002018]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <span className="block text-base font-semibold text-[#181c1b]">{unit.name}</span>
                            <span className={`text-sm ${isAvailable ? 'font-semibold text-[#013428]' : 'text-[#717975]'}`}>
                              {isAvailable ? 'Tersedia — siap huni' : 'Terisi'}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#013428]">
                          {formatRupiah(unit.monthlyRent.toNumber())}
                          <span className="text-sm font-normal text-[#404945]">/bln</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Akses & lokasi */}
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#013428]">
                  <Navigation className="h-6 w-6 text-[#013428]" />
                  Akses & Fasilitas Publik Sekitar
                </h2>
                <p className="text-sm text-[#404945]">
                  Terletak di kawasan yang tenang namun dekat dengan kebutuhan harian:
                </p>
                <div className="relative h-[440px] w-full overflow-hidden rounded-xl shadow-inner">
                  <iframe
                    title={`Peta lokasi ${property.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&z=15&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                  <div className="pointer-events-none absolute bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-3 shadow-md backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#013428]">
                      <MapPin className="h-[18px] w-[18px]" />
                      {property.name}
                    </div>
                    <p className="mt-1 text-sm text-[#404945]">{property.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: Store, value: 'Dekat', label: 'Minimarket & ATM' },
                    { icon: TrainFront, value: 'Dekat', label: 'Stasiun KRL' },
                    { icon: Hospital, value: 'Dekat', label: 'Klinik & Apotek' },
                    { icon: Car, value: 'Akses', label: 'Jalan mobil lebar' },
                  ].map((c) => {
                    const Icon = c.icon
                    return (
                      <div key={c.label} className="flex items-center gap-1 rounded-xl bg-[#f7faf6] p-3">
                        <Icon className="h-[26px] w-[26px] text-[#974723]" />
                        <div>
                          <span className="font-bold text-[#181c1b]">{c.value}</span>
                          <span className="block text-sm text-[#404945]">{c.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tata tertib */}
              <div className="space-y-4 rounded-2xl bg-[#f1f4f1] p-4 shadow-sm lg:p-6">
                <div className="flex items-center gap-1 text-[#013428]">
                  <FileText className="h-7 w-7" />
                  <h2 className="font-bold">Ketentuan & Tata Tertib Penghuni</h2>
                </div>
                <p className="text-sm text-[#404945]">
                  Demi menjaga kenyamanan, keamanan, dan ketenangan bersama seluruh penghuni:
                </p>
                <div className="space-y-2">
                  {[
                    'Penghuni resmi: dikhususkan bagi keluarga atau karyawan/karyawati berkelakuan baik dengan identitas jelas.',
                    'Hewan peliharaan: hewan besar yang berpotensi mengganggu tetangga tidak diperkenankan tanpa izin pengelola.',
                    'Jam ketenangan & tamu: batas kunjungan tamu luar pukul 22.00 WIB, jaga volume suara setelah pukul 21.00 WIB.',
                    'Keamanan bersama: kunci gerbang dipegang masing-masing penghuni, tamu wajib lapor kepada pengelola.',
                  ].map((rule, i) => (
                    <div key={rule} className="flex items-start gap-1">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#bdeddb] text-xs font-bold text-[#013428]">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-[#181c1b]">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT sticky */}
            <div className="space-y-4 lg:col-span-4 lg:sticky lg:top-24">
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-md lg:p-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#404945]">Tarif Sewa Terbuka</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#013428]">
                      {formatRupiah(property.monthlyPriceFrom.toNumber())}
                    </span>
                    <span className="text-sm text-[#404945]">/ bulan</span>
                  </div>
                  <span className="block text-sm font-medium text-[#974723]">
                    {availableCount > 0 ? `${availableCount} unit siap huni` : 'Masuk daftar tunggu'}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-[#404945]">
                      <DoorOpen className="h-4 w-4" /> Unit tersedia
                    </span>
                    <span className="font-semibold text-[#181c1b]">{availableCount}/{totalUnits}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#404945]">Survei lokasi</span>
                    <span className="font-semibold text-[#013428]">GRATIS</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#404945]">Respon pengelola</span>
                    <span className="font-semibold text-[#013428]">&lt; 1 jam</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1F8A4D] px-4 text-center text-base font-semibold text-white shadow-md transition-all hover:bg-[#16693a] hover:shadow-lg"
                  >
                    <WhatsAppIcon className="h-6 w-6 shrink-0" />
                    Jadwalkan Survei via WhatsApp
                  </a>
                  <p className="flex items-center justify-center gap-1 text-center text-xs text-[#404945]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#013428]" />
                    Respons cepat langsung oleh pengelola
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#f1f4f1] p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1e4b3e] text-white font-bold">
                    {(admin?.name || property.name).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate font-bold text-[#181c1b]">{admin?.name || 'Pengelola'}</span>
                      <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-[#013428]" />
                    </div>
                    <span className="block text-xs text-[#404945]">Pengelola & Pemilik Langsung (Tanpa Perantara)</span>
                    <span className="block text-xs font-medium text-[#013428]">Biasanya membalas &lt; 15 menit</span>
                  </div>
                </div>
                <div className="pt-1 text-center">
                  <a
                    href={admin?.phone ? `tel:${admin.phone}` : waUrl}
                    className="inline-flex items-center gap-1 text-sm text-[#404945] transition-colors hover:text-[#013428]"
                  >
                    <Phone className="h-[18px] w-[18px]" />
                    Atau hubungi via telepon
                  </a>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-[#f1f4f1] p-4 shadow-sm">
                <span className="flex items-center gap-1.5 font-bold text-[#013428]">
                  <ShieldCheck className="h-5 w-5" />
                  Jaminan Transparansi
                </span>
                <div className="space-y-1 text-sm text-[#404945]">
                  <div className="flex items-start gap-2">
                    <Handshake className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#013428]" />
                    <span><strong>100% Tanpa Biaya Calo:</strong> berurusan langsung dengan pengelola.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#013428]" />
                    <span><strong>Tagihan tercatat rapi:</strong> bukti dicek admin satu per satu.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#013428]" />
                    <span><strong>Garansi servis awal sewa:</strong> kendala di awal masa sewa dibantu perbaikan.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white p-4 text-sm text-[#404945] shadow-sm">
                <Clock className="h-5 w-5 shrink-0 text-[#013428]" />
                Survei terbuka setiap hari pukul 08.00 – 18.00 WIB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Rekomendasi serupa ——— */}
      {similar.length > 0 && (
        <section className="w-full bg-[#f1f4f1] py-10">
          <div className="w-full space-y-6 px-4 lg:px-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#974723]">Pilihan Alternatif</span>
                <h2 className="text-2xl font-bold text-[#013428]">Unit Lain di Kawasan Ini</h2>
                <p className="text-base text-[#404945]">Mungkin Anda membutuhkan ruangan lebih luas atau tipe yang lebih ringkas</p>
              </div>
              <Link
                href="/kontrakan"
                className="inline-flex items-center gap-1 text-base font-semibold text-[#013428] transition-colors hover:text-[#1e4b3e]"
              >
                Lihat Semua Pilihan Unit
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {similar.map((p) => {
                const avail = p.units.filter((u) => u.status === 'AVAILABLE').length
                const minPrice = p.units.length
                  ? p.units.reduce((m, u) => Math.min(m, Number(u.monthlyRent)), Number(p.units[0].monthlyRent))
                  : Number(property.monthlyPriceFrom)
                return (
                  <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="relative h-[680px] w-full overflow-hidden">
                      {p.images[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#ecefeb]">
                          <Home className="h-8 w-8 text-[#717975]" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${avail > 0 ? 'bg-[#EBF5EF] text-[#1E6548]' : 'bg-[#FBEBEB] text-[#B83A3A]'}`}>
                          <span className={`h-2 w-2 rounded-full ${avail > 0 ? 'bg-[#1E6548]' : 'border border-[#B83A3A]'}`} />
                          {avail > 0 ? `Tersedia ${avail} Unit` : 'Terisi (Waiting List)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-[#181c1b] transition-colors group-hover:text-[#013428]">
                          {p.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-[#404945]">
                          {truncateDescription(`Di ${p.address}. ${avail} dari ${p.units.length} unit tersedia.`, 120)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#ecefeb] pt-3">
                        <div>
                          <span className="block text-xs text-[#404945]">Harga Sewa</span>
                          <span className="font-semibold text-[#013428]">
                            {formatRupiah(minPrice)} <span className="text-xs font-normal text-[#404945]">/bln</span>
                          </span>
                        </div>
                        <Link
                          href={`/kontrakan/${p.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#ecefeb] px-4 py-2 text-sm font-semibold text-[#013428] transition-colors hover:bg-[#e6e9e5]"
                        >
                          Rincian Unit
                          <ChevronRight className="h-[18px] w-[18px]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 w-full max-w-full border-t hairline bg-paper/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6 lg:hidden">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Mulai dari</p>
            <p className="tick truncate font-display text-lg font-semibold tracking-tight text-gold">
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

      {/* Info kontak ringkas */}
      <section className="w-full bg-[#f7faf6]">
        <div className="grid w-full gap-4 px-4 pb-14 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#bdeddb] text-[#013428]">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="truncate font-bold text-[#013428]">{property.name}</p>
              <p className="truncate text-[#717975]">{property.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdbce] text-[#974723]">
              <Phone className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold text-[#013428]">{admin?.name || 'Pengelola'}</p>
              <p className="text-[#717975]">Respon cepat via WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdeae] text-[#281900]">
              <Clock className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold text-[#013428]">Survei 08.00 - 18.00 WIB</p>
              <p className="flex items-center gap-1 text-[#717975]">
                <CircleCheck className="h-3.5 w-3.5" /> Kabari 1 jam sebelumnya
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
