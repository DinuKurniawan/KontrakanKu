import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AccountManagement from './account-management'
import AdminProfileSettings from './admin-profile-settings'
import { Settings, User, Wallet } from 'lucide-react'

export default async function AdminPengaturanPage() {
  const admin = await requireAdmin()

  const rawAccounts = await prisma.paymentAccount.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Format accounts for client component
  const accounts = rawAccounts.map((acc) => ({
    id: acc.id,
    bankName: acc.bankName,
    accountNumber: acc.accountNumber,
    accountName: acc.accountName,
    qrCodeUrl: acc.qrCodeUrl,
    isActive: acc.isActive,
    createdAt: acc.createdAt.toISOString(),
  }))

  const adminData = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
  }

  const activeAccounts = accounts.filter((acc) => acc.isActive).length

  return (
    <div className="w-full space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 200px at 12% 0%, rgba(16,185,129,0.12), transparent 70%), radial-gradient(420px 200px at 95% 10%, rgba(14,165,233,0.10), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <Settings className="h-3.5 w-3.5" />
              Pengaturan
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Pengaturan
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Kelola rekening tujuan transfer, profil pemilik, dan keamanan akun admin dalam satu
              tempat.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-3 rounded-2xl bg-stone-900 px-5 py-4 text-white shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums tracking-tight">{activeAccounts}</p>
                <p className="text-[11px] font-medium text-stone-400">
                  rekening aktif dari {accounts.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 1: Pengelolaan Rekening Bank Penerima (PRD Sec 18 & 39) */}
      <section>
        <AccountManagement initialAccounts={accounts} />
      </section>

      {/* Bagian 2: Profil Pengelola & Kontak WhatsApp (PRD Sec 4.1 & 8) */}
      <section className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-stone-900">
              Pengaturan Akun & Kontak
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Konfigurasi profil pemilik dan kontak WhatsApp pengelola untuk calon penyewa
            </p>
          </div>
        </div>

        <AdminProfileSettings admin={adminData} />
      </section>
    </div>
  )
}
