import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import { logoutAction } from '@/app/(auth)/login/actions'
import { LogOut } from 'lucide-react'
import Logo from '@/components/logo'
import TenantNav from './tenant-nav'
import NotificationBell from '@/components/notification-bell'

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row [color-scheme:light]">
      {/* Mobile / Desktop Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-200 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen">
        <div className="p-5 flex items-center justify-between border-b border-stone-800">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">Portal Penyewa</span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">Kontrakan</span>
            </div>
          </Link>
        </div>

        <TenantNav />


        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-xs font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-stone-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 w-full min-w-0 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <div className="w-full">
          <div className="flex justify-end mb-6">
            <NotificationBell />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
