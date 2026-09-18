import { requireAdmin } from '@/lib/auth'
import { logoutAction } from '@/app/(auth)/login/actions'
import { LogOut, ShieldAlert } from 'lucide-react'
import Logo from '@/components/logo'
import AdminNav from './admin-nav'
import NotificationBell from '@/components/notification-bell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-stone-100 flex [color-scheme:light]">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col shrink-0 border-r border-stone-800">
        <div className="p-5 flex items-center gap-3 border-b border-stone-800">
          <Logo size={36} />
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight">Kontrakan</h1>
            <span className="text-[11px] text-emerald-400 font-medium px-1.5 py-0.5 bg-emerald-950/60 rounded-sm">
              PORTAL ADMIN
            </span>
          </div>
        </div>

        <AdminNav />

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-xs font-bold">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-xs text-stone-400 truncate">{admin.email}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-stone-200 h-16 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2 text-stone-600 text-sm">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Mode Pengelola Properti</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell
              seeAllHref="/admin/notifikasi"
              emptyHint="Bukti pembayaran baru dari penyewa akan muncul di sini."
            />
            <div className="text-xs text-stone-500">
              Terhubung sebagai <span className="font-semibold text-stone-800">{admin.email}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
