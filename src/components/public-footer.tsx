import Link from 'next/link'
import { KeyRound, MapPin, ArrowUpRight, Clock } from 'lucide-react'
import WhatsAppIcon from './whatsapp-icon'
import { WA_LINK } from './public-navbar'

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Masuk', href: '/login' },
]

export default function PublicFooter() {
  return (
    <footer className="w-full bg-pine text-ink">
      <div className="shell w-full pb-10 pt-14 sm:pt-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow eyebrow-on-dark">Cilandak · Jakarta Selatan</p>
            <p className="mt-4 font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
              Rumah yang dirawat,
              <br />
              <em className="font-light text-ink/85">pengelola yang dikenal.</em>
            </p>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-[1.75rem] bg-ink/[0.07] p-4 pr-6 ring-1 ring-ink/15 backdrop-blur transition-all duration-300 hover:bg-gold hover:text-[#121212]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-[#121212] transition-transform duration-300 group-hover:scale-105">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 group-hover:text-[#121212]/60">
                Chat pengelola langsung
              </span>
              <span className="mt-0.5 block text-lg font-bold tracking-tight">
                0813-8463-4526
              </span>
            </span>
            <ArrowUpRight className="ml-2 h-5 w-5 text-ink/50 transition-all group-hover:translate-x-0.5 group-hover:text-[#121212]" />
          </a>
        </div>

        <div className="mt-12 grid w-full gap-10 border-t border-paper/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="Kelola Kontrakan — Beranda">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-[#121212]">
                <KeyRound className="h-[18px] w-[18px] -rotate-45" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-[17px] font-semibold tracking-tight">
                  Kelola Kontrakan
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
                  Est. 2018
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink/70">
              Hunian keluarga terawat di Cilandak. Tagihan tercatat rapi,
              respon cepat, dikelola langsung — bukan perantara.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Jelajah
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink/80 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Kunjungi
            </p>
            <address className="mt-4 space-y-3 text-sm not-italic leading-6 text-ink/80">
              <p className="flex gap-2.5">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                <span>Jl. Cilandak Barat No. 28, Jakarta Selatan 12430</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-gold" />
                Senin–Minggu · 08.00–18.00
              </p>
            </address>
          </div>

          <div className="rounded-[1.75rem] bg-ink/[0.06] p-6 ring-1 ring-ink/12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Jam survei
            </p>
            <p className="mt-3 font-display text-2xl font-medium leading-snug">
              Datang lihat unit,
              <br />
              putuskan dengan tenang.
            </p>
            <Link href="/kontrakan" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-[#121212] transition hover:bg-[#e6c75a]">
              Lihat katalog <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-paper/12">
        <div className="shell flex w-full flex-col gap-1 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Kelola Kontrakan</p>
          <p>Data penyewa tidak dibagikan</p>
        </div>
      </div>
    </footer>
  )
}
