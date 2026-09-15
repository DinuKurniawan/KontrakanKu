import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'
import PropertyCatalog, { SerializedPublicProperty } from './property-catalog'
import { KeyRound, PhoneCall, ArrowUpRight, ArrowLeft, Search, Filter, DoorOpen, Building2 } from 'lucide-react'
import AutoReveal from '@/components/auto-reveal'

const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%20Kelola%20Kontrakan%2C%20saya%20ingin%20bertanya%20seputar%20sewa%20kontrakan'

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
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

  const totalAvailable = properties.reduce((s, p) => s + p.availableUnits, 0)
  const totalUnits = properties.reduce((s, p) => s + p.totalUnits, 0)

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0F1F33] flex flex-col selection:bg-[#C8A46A]/30">
      {/* Top ink rule */}
      <div className="h-[6px] w-full bg-[#0F1F33] relative">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#C8A46A]/60" />
      </div>

      {/* Header — identical to home */}
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
                  l.href === '/kontrakan'
                    ? 'border-[#0F1F33] bg-[#0F1F33] text-white'
                    : 'border-transparent hover:border-[#0F1F33] hover:bg-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-[#D93D30] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c2362b] transition"
            >
              Masuk
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 border border-[#E9E5DD] bg-white px-3 py-2.5 font-mono text-xs hover:border-[#0F1F33] transition"
            >
              <PhoneCall className="h-3.5 w-3.5" /> 0813-8463-4526
            </a>
          </div>
        </div>
        <div className="flex md:hidden items-center gap-1 border-t border-[#0F1F33]/10 bg-white px-4 py-2 overflow-x-auto">
          {NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${
                l.href === '/kontrakan' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#E9E5DD] bg-[#FFFBF0]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0 font-mono text-xs underline underline-offset-4">
            Masuk
          </Link>
        </div>
      </header>

      <main className="w-full flex-1">
        <AutoReveal />
        {/* Masthead ledger bar */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-[#0F1F33] py-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:underline underline-offset-4">
              <ArrowLeft className="h-3 w-3" /> Kembali · Beranda
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 text-[#0F1F33]/60">
              <span className="h-2 w-2 bg-[#D93D30]" aria-hidden /> Katalog / 03 — Daftar hunian
            </span>
            <span className="sm:hidden">Katalog / 03</span>
            <span className="tabular-nums font-semibold">
              {properties.length} kontrakan · {totalAvailable} kunci tersedia
            </span>
          </div>
        </div>

        {/* Hero — Rak Kunci */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 py-8 lg:py-10">
            {/* Left: headline */}
            <div className="col-span-12 lg:col-span-7">
              <p className="inline-flex items-center gap-2 border border-[#0F1F33]/15 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
                <Building2 className="h-3 w-3" /> Rak Kunci — inventaris fisik
                <span className="hidden sm:inline text-[#0F1F33]/40">· update manual harian</span>
              </p>
              <h1 className="mt-4 font-display text-[38px] sm:text-[48px] lg:text-[54px] font-[900] leading-[0.88] tracking-[-0.045em]">
                Pilih
                <br />
                <span className="text-outline">kunci</span> yang
                <br />
                masih tersedia<span className="text-[#D93D30]">.</span>
              </h1>
              <p className="mt-4 max-w-[44ch] text-[14px] leading-6 text-[#0F1F33]/70">
                Di kantor kami tiap unit punya gantungan kunci brass di papan kayu. Kalau kosong, kuncinya tersedia. Kalau terisi, kuncinya sedang dipakai penyewa. Katalog ini adalah foto papan itu — <span className="font-semibold text-[#0F1F33]">real, tanpa stok fiktif</span>.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 border-[1.5px] border-[#0F1F33] bg-white px-3 py-1.5">
                  <span className="h-1.5 w-1.5 bg-[#115E59]" aria-hidden /> {properties.length} properti tayang
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#115E59] px-3 py-1.5 text-white">
                  <DoorOpen className="h-3 w-3" /> {totalAvailable}/{totalUnits} kunci tersedia
                </span>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1.5 underline decoration-[#C8A46A] decoration-2 underline-offset-4"
                >
                  Tanya stok real-time <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right: Papan Kunci illustration — signature */}
            <div className="col-span-12 lg:col-span-5">
              <div className="relative border-[1.5px] border-[#0F1F33] bg-[#E9E5DD] p-3 sm:p-4 shadow-[6px_6px_0_rgba(15,31,51,0.12)]">
                {/* wood grain top bar */}
                <div className="flex items-center justify-between border border-[#0F1F33]/15 bg-[#0F1F33] px-3 py-2 text-white">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Papan Kunci · Cilandak</span>
                  <span className="font-mono text-[10px] opacity-60">No. 03 — Katalog</span>
                </div>

                {/* key hooks grid — visual inventory */}
                <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3 bg-[#FFFBF0] border border-[#0F1F33]/10 p-3 sm:p-4">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const isAvailable = i < totalAvailable || (properties.length === 0 && i < 4)
                    const label = String.fromCharCode(65 + Math.floor(i / 2)) + String(i % 2 === 0 ? '01' : '02')
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        {/* hook */}
                        <span className="h-2 w-2 rounded-full bg-[#0F1F33] border border-[#0F1F33] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" aria-hidden />
                        <span className="h-3 w-px bg-[#C8A46A]" aria-hidden />
                        {/* key tag */}
                        <span
                          className={`relative flex h-[44px] w-full items-center justify-center border-[1.5px] ${
                            isAvailable ? 'bg-white border-[#0F1F33] text-[#0F1F33]' : 'bg-[#0F1F33]/5 border-[#0F1F33]/15 text-[#0F1F33]/30'
                          }`}
                        >
                          <KeyRound className={`h-5 w-5 ${isAvailable ? 'text-[#115E59] -rotate-45' : 'text-[#0F1F33]/20 -rotate-45'}`} />
                          {isAvailable && (
                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#D93D30] ring-2 ring-white" aria-hidden />
                          )}
                        </span>
                        <span className="font-mono text-[10px] font-semibold tracking-wide">{label}</span>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wide px-1.5 py-0.5 border text-center leading-none ${
                            isAvailable ? 'border-[#115E59] bg-[#115E59] text-white' : 'border-[#0F1F33]/15 bg-white text-[#0F1F33]/40'
                          }`}
                        >
                          {isAvailable ? 'gantung' : 'terisi'}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between bg-white border border-[#0F1F33]/10 px-3 py-2">
                  <span className="font-mono text-[11px] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-[#115E59]" aria-hidden /> Tersedia = siap huni
                  </span>
                  <span className="font-mono text-[11px] text-[#0F1F33]/50">{totalAvailable} kunci di papan</span>
                </div>

                <p className="mt-2 text-center font-mono text-[10px] leading-4 text-[#0F1F33]/60">
                  Illustrasi papan kunci — foto unit asli ada di kartu di bawah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog — filter + grid */}
        <PropertyCatalog properties={properties} />
      </main>

      <footer className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] mt-8">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 py-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#0F1F33] text-white">
                <KeyRound className="h-4 w-4 -rotate-45" />
              </span>
              <span className="font-display text-sm font-[800] tracking-tight">Kelola Kontrakan</span>
            </Link>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-[#0F1F33]/65">Foto & harga diperbarui manual. Tanya papan kunci real-time via WhatsApp sebelum transfer.</p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">Navigasi</p>
            <ul className="mt-3 space-y-1.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Unit', href: '/kontrakan' },
                { label: 'Tentang', href: '/tentang' },
                { label: 'FAQ', href: '/faq' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-mono text-xs hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-[1.5px] border-[#0F1F33] bg-white p-4 hover:bg-[#0F1F33] hover:text-white group transition"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D93D30] text-white group-hover:bg-[#C8A46A] group-hover:text-[#0F1F33] transition">
              <PhoneCall className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-wide opacity-60">Chat pengelola</span>
              <span className="block font-mono text-sm font-bold">0813-8463-4526</span>
            </span>
            <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100" />
          </a>
        </div>
        <div className="border-t border-[#0F1F33]/10">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-4 sm:px-6 lg:px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan</p>
            <p className="font-mono text-[11px] text-[#0F1F33]/45">Papan kunci diperbarui harian · Data tidak dibagikan</p>
          </div>
        </div>
      </footer>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 border-[1.5px] border-[#0F1F33] bg-[#25D366] px-4 py-3 text-white shadow-[3px_3px_0_rgba(15,31,51,0.18)] hover:shadow-[4px_4px_0_rgba(15,31,51,0.22)] hover:translate-y-[-1px] transition-all sm:bottom-6 sm:right-6"
      >
        <PhoneCall className="h-4 w-4" />
        <span className="hidden font-mono text-xs font-bold sm:inline">WhatsApp</span>
        <span className="font-mono text-xs font-semibold">0813-8463-4526</span>
      </a>
    </div>
  )
}
