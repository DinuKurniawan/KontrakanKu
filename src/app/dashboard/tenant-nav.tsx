'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building,
  Receipt,
  UploadCloud,
  History,
  User,
  Bell,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/kontrakan-saya', label: 'Kontrakan Saya', icon: Building },
  { href: '/dashboard/tagihan', label: 'Tagihan Sewa', icon: Receipt },
  { href: '/dashboard/pembayaran', label: 'Kirim Pembayaran', icon: UploadCloud },
  { href: '/dashboard/riwayat', label: 'Riwayat Transaksi', icon: History },
  { href: '/dashboard/notifikasi', label: 'Pemberitahuan', icon: Bell },
  { href: '/dashboard/profil', label: 'Profil Saya', icon: User },
]

export default function TenantNav() {
  const pathname = usePathname()

  return (
    <nav className="p-3 sm:p-4 space-y-1 flex-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-stone-300 font-medium hover:text-white hover:bg-emerald-600'
            }`}
          >
            <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-white'}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
