import { requireAuth } from '@/lib/auth'
import ProfileForm from './profile-form'
import { User } from 'lucide-react'

export default async function TenantProfilPage() {
  const user = await requireAuth()

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }

  return (
    <div className="w-full space-y-6">
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
              <User className="h-3.5 w-3.5" />
              Akun penyewa
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Profil Saya
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Kelola data pribadi akun dan pengaturan kata sandi Anda
            </p>
          </div>
        </div>
      </section>

      <ProfileForm user={userData} />
    </div>
  )
}
