import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'
import PropertyCatalog, { SerializedPublicProperty } from './property-catalog'
import PublicLayout from '@/components/public-layout'
import {
  BadgeCheck,
  CalendarDays,
  CircleHelp,
  House,
  MessageCircle,
} from 'lucide-react'

const STEPS = [
  {
    no: '1',
    bg: 'bg-[#bdeddb] text-[#013428]',
    title: 'Pilih Unit & Cek Ketersediaan',
    desc: 'Pilih unit yang sesuai dengan anggaran dan kebutuhan ruang keluarga Anda pada katalog di atas.',
  },
  {
    no: '2',
    bg: 'bg-[#bdeddb] text-[#013428]',
    title: 'Jadwalkan Kunjungan Survei',
    desc: 'Hubungi pengelola lewat WhatsApp untuk melihat langsung kondisi fisik kamar, pencahayaan, dan lingkungan sekitar.',
  },
  {
    no: '3',
    bg: 'bg-[#ffdbce] text-[#974723]',
    title: 'Amankan Unit Pilihan',
    desc: 'Cocok dengan unitnya? Hubungi pengelola untuk mengunci unit pilihan Anda sebelum didahului penyewa lain.',
  },
  {
    no: '4',
    bg: 'bg-[#1e4b3e] text-white',
    title: 'Serah Kunci & Masuk',
    desc: 'Selesaikan administrasi sewa bulan pertama dan langsung serah terima kunci unit Anda.',
  },
]

const COMPARE_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'Meteran Listrik', values: ['Token sendiri', 'Token sendiri', 'Token sendiri'] },
  { label: 'Air Bersih', values: ['Gratis tanpa iuran', 'Gratis tanpa iuran', 'Gratis tanpa iuran'] },
  { label: 'Iuran Sampah & Keamanan', values: ['Sudah termasuk', 'Sudah termasuk', 'Sudah termasuk'] },
  { label: 'Kamar Mandi Dalam', values: ['Sesuai tipe', 'Sesuai tipe', 'Sesuai tipe'] },
  { label: 'Parkir Kendaraan', values: ['Motor', 'Motor + area bersama', 'Mobil + motor'] },
]

export default async function PropertyListingPage() {
  const rawProperties = await prisma.property.findMany({
    where: { status: PropertyStatus.PUBLISHED },
    include: {
      images: { where: { isCover: true }, take: 1 },
      units: { select: { status: true, monthlyRent: true, name: true, facilities: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const properties: SerializedPublicProperty[] = rawProperties.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    address: p.address,
    description: p.description,
    monthlyPriceFrom: p.monthlyPriceFrom.toNumber(),
    coverImageUrl: p.images[0]?.url || null,
    facilities: p.facilities || [],
    totalUnits: p.units.length,
    availableUnits: p.units.filter((u) => u.status === 'AVAILABLE').length,
    units: p.units.map((u) => ({ name: u.name, monthlyRent: u.monthlyRent.toNumber(), status: u.status, facilities: u.facilities || [] })),
  }))

  return (
    <PublicLayout>
      {/* ——— Intro ——— */}
      <section className="w-full bg-[#f7faf6] pb-6 pt-10">
        <div className="w-full px-4 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#bdeddb] px-3 py-1 text-xs font-semibold text-[#002018]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#013428]" />
                Status Ketersediaan Real-Time • Pemilik Langsung
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#013428] sm:text-5xl">
                Pilihan Unit Kontrakan Nyaman
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-[#404945]">
                Temukan hunian keluarga yang asri, tenang, dan tertata rapi.
                Tanpa perantara atau biaya siluman. Hubungi pengelola untuk
                memastikan ketersediaan sebelum survei.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-[#f1f4f1] p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#974723] text-white">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#181c1b]">Bebas Biaya Admin</span>
                <span className="text-sm text-[#404945]">Air bersih & sampah gratis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Catalog ——— */}
      <section className="w-full bg-[#f7faf6] pb-10">
        <div className="w-full px-4 lg:px-8">
          <PropertyCatalog properties={properties} />
        </div>
      </section>

      {/* ——— Comparison ——— */}
      <section className="w-full bg-[#f7faf6] pb-10">
        <div className="w-full px-4 lg:px-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm lg:p-8">
            <div className="mb-6 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#974723]">
                Transparan & Tanpa Biaya Tersembunyi
              </span>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
                Standar Fasilitas Semua Tipe Unit
              </h2>
              <p className="mt-2 text-base text-[#404945]">
                Setiap unit memiliki privasi penuh dengan meteran listrik
                terpisah dan garansi kebersihan air.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#f1f4f1] font-semibold text-[#181c1b]">
                    <th className="rounded-l-lg p-4">Fasilitas / Fitur</th>
                    <th className="p-4">Unit Kecil</th>
                    <th className="p-4">Unit Sedang</th>
                    <th className="rounded-r-lg p-4">Unit Keluarga</th>
                  </tr>
                </thead>
                <tbody className="text-[#404945]">
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-t border-[#ecefeb] transition-colors hover:bg-[#f1f4f1]/50">
                      <td className="flex items-center gap-1 p-4 font-semibold text-[#181c1b]">
                        <House className="h-5 w-5 text-[#013428]" />
                        {row.label}
                      </td>
                      {row.values.map((v, i) => (
                        <td key={i} className="p-4">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Steps ——— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#974723]">
              Proses Mudah & Aman
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
              4 Langkah Menghuni Unit Kami
            </h2>
            <p className="mt-2 text-base text-[#404945]">
              Kami mengutamakan kejujuran dan kenyamanan bersama dari awal
              survei hingga serah terima kunci.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.no}
                className="flex flex-col items-start rounded-xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${s.bg}`}>
                  {s.no}
                </div>
                <h3 className="mb-1 font-semibold text-[#013428]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#404945]">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#013428] p-6 text-white shadow-md lg:p-8 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
                <CircleHelp className="h-8 w-8 text-[#bdeddb]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Ingin survei unit di luar jam kerja?</h3>
                <p className="mt-1 text-sm text-[#bdeddb]">
                  Pengelola siap menemani survei sampai pukul 18.30 WIB dengan konfirmasi terlebih dahulu.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a
                href="https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20jadwal%20survei%20unit%20kontrakan."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#974723] px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#772f0d]"
              >
                <CalendarDays className="h-5 w-5" />
                Jadwalkan Kunjungan
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-white/10 px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                Lihat FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
