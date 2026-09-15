'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Users,
  Receipt,
  CreditCard,
  Settings,
  History,
  ShieldAlert,
  Bell,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard, exact: true },
  { href: '/admin/kontrakan', label: 'Kontrakan', icon: Building2 },
  { href: '/admin/unit', label: 'Unit & Kamar', icon: DoorOpen },
  { href: '/admin/penyewa', label: 'Data Penyewa', icon: Users },
  { href: '/admin/tagihan', label: 'Tagihan Sewa', icon: Receipt },
  { href: '/admin/pembayaran', label: 'Verifikasi Bayar', icon: CreditCard },
  { href: '/admin/notifikasi', label: 'Pemberitahuan', icon: Bell },
  { href: '/admin/riwayat', label: 'Riwayat Transaksi', icon: History },
  { href: '/admin/pengaturan', label: 'Pengaturan & Bank', icon: Settings },
  { href: '/admin/audit-log', label: 'Log Aktivitas', icon: ShieldAlert },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="p-4 space-y-1 flex-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-emerald-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-white'}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
