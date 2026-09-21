'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, KeyRound, ArrowUpRight } from 'lucide-react'

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
]

export const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%20Kelola%20Kontrakan%2C%20saya%20ingin%20bertanya%20seputar%20sewa%20kontrakan'

export function SiteLogo({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Kelola Kontrakan — Beranda">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-pine text-white shadow-warm transition-transform duration-300 group-hover:-rotate-6">
        <KeyRound className="h-[18px] w-[18px] -rotate-45" strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-paper" aria-hidden />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[17px] font-semibold tracking-tight ${onDark ? 'text-ink' : 'text-ink'}`}>
          Kelola Kontrakan
        </span>
        {!compact && (
          <span className={`mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] ${onDark ? 'text-ink/60' : 'text-bark/80'}`}>
            Cilandak · Est. 2018
          </span>
        )}
      </span>
    </Link>
  )
}

export default function PublicNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (prevPath !== pathname) {
      setPrevPath(pathname)
      setOpen(false)
    }
  }, [pathname, prevPath])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b hairline bg-paper/90 shadow-warm backdrop-blur-xl'
            : 'border-b border-transparent bg-paper'
        }`}
      >
        <div className="shell flex h-[72px] w-full items-center justify-between gap-4">
          <SiteLogo />

          <nav className="hidden items-center gap-1 rounded-full border hairline bg-cream/70 p-1.5 backdrop-blur md:flex" aria-label="Navigasi utama">
            {NAV.map((l) => {
              const active = isActive(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-pine text-white shadow-warm'
                      : 'text-bark hover:bg-sand hover:text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-elegant-primary hidden !px-6 !py-2.5 sm:inline-flex">
              Masuk
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline bg-cream text-ink md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="w-full border-t hairline bg-paper px-4 py-4 sm:px-6 md:hidden animate-slide-up"
            aria-label="Navigasi mobile"
          >
            <div className="grid w-full gap-1.5">
              {NAV.map((l, i) => {
                const active = isActive(l.href)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center justify-between rounded-2xl px-5 py-3.5 transition ${
                      active
                        ? 'bg-pine text-white'
                        : 'bg-cream text-ink border hairline'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-[15px] font-semibold">
                      <span className="font-mono text-[11px] text-fog">0{i + 1}</span>
                      {l.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-60" />
                  </Link>
                )
              })}
              <Link href="/login" className="btn-elegant-primary mt-1 w-full !py-3.5">
                Masuk
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
