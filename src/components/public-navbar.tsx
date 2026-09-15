'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Logo from './logo'

export default function PublicNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Tutup menu mobile saat navigasi rute berubah
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Unit', href: '/kontrakan' },
    { label: 'Tentang', href: '/tentang' },
    { label: 'FAQ', href: '/faq' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex min-w-0 items-center justify-between gap-2">
        {/* Sisi Kiri: Logo */}
        <div className="flex min-w-0 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5 group">
            <Logo size={36} className="transition group-hover:opacity-90" />
            <span className="truncate font-bold text-base sm:text-lg text-stone-900 tracking-tight">Kontrakan</span>
          </Link>
        </div>

        {/* Sisi Tengah: Menu Publik (Beranda & Unit) */}
        <nav className="hidden md:flex shrink-0 items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                  active
                    ? 'text-emerald-800 bg-emerald-50 shadow-sm ring-1 ring-inset ring-emerald-600/10'
                    : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Sisi Kanan: Menu Login & Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 sm:px-4 py-2 rounded-xl shadow-sm transition"
          >
            Masuk
          </Link>

          {/* Tombol Hamburger Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="md:hidden flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition cursor-pointer ml-0.5 sm:ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Publik Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-stone-200/80 bg-white/95 backdrop-blur px-4 py-3 space-y-1 shadow-sm">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-[44px] min-w-0 items-center break-words px-3 py-2.5 text-sm font-semibold rounded-xl transition ${
                  active
                    ? 'text-emerald-800 bg-emerald-50 ring-1 ring-inset ring-emerald-600/10'
                    : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
