'use client'

import { useState, useTransition } from 'react'
import { updateProfileAction, changePasswordAction } from './actions'
import { formatDateID } from '@/lib/utils'
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    role: string
    createdAt: string
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  // State Profile
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [profilePending, startProfileTransition] = useTransition()
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // State Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordPending, startPasswordTransition] = useTransition()
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone)

    startProfileTransition(async () => {
      const res = await updateProfileAction(undefined, formData)
      if (res?.success) {
        setProfileMsg({ type: 'success', text: res.message || 'Profil berhasil diperbarui.' })
      } else {
        setProfileMsg({ type: 'error', text: res?.error || 'Gagal memperbarui profil.' })
      }
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' })
      return
    }

    const formData = new FormData()
    formData.append('currentPassword', currentPassword)
    formData.append('newPassword', newPassword)
    formData.append('confirmPassword', confirmPassword)

    startPasswordTransition(async () => {
      const res = await changePasswordAction(undefined, formData)
      if (res?.success) {
        setPasswordMsg({ type: 'success', text: res.message || 'Kata sandi berhasil diubah.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg({ type: 'error', text: res?.error || 'Gagal mengubah kata sandi.' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 200px at 12% 0%, rgba(16,185,129,0.12), transparent 70%), radial-gradient(420px 200px at 95% 10%, rgba(14,165,233,0.10), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="truncate text-xl font-bold tracking-tight text-stone-900">{name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user.role === 'USER' ? 'PENYEWA' : user.role}
              </span>
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
              <span className="truncate">{user.email}</span>
              <span aria-hidden className="text-stone-300">
                •
              </span>
              <span>Bergabung sejak {formatDateID(user.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Card 1: Ubah Data Profil */}
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
          <div>
            <div className="flex items-center gap-3 border-b border-stone-100 bg-stone-50/60 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold tracking-tight text-stone-900">Data Pengguna</h4>
                <p className="text-xs text-stone-500">Nama lengkap & kontak WhatsApp penyewa</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5 p-6">
              {profileMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  <span>Alamat Email</span>
                  <span className="text-[11px] font-normal normal-case tracking-normal text-stone-400">Identitas akun login</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full cursor-not-allowed rounded-xl border border-stone-200/80 bg-stone-50 px-3.5 py-2.5 pr-10 text-sm text-stone-500"
                  />
                  <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Nomor Telepon / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                  />
                  <Phone className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-stone-500">
                  Digunakan oleh pengelola untuk verifikasi dan konfirmasi tagihan sewa.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profilePending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
                >
                  {profilePending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 2: Ubah Kata Sandi */}
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
          <div>
            <div className="flex items-center gap-3 border-b border-stone-100 bg-stone-50/60 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold tracking-tight text-stone-900">Keamanan Akun</h4>
                <p className="text-xs text-stone-500">Perbarui kata sandi login secara berkala</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5 p-6">
              {passwordMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Kata Sandi Saat Ini <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama..."
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter..."
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
                >
                  {passwordPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Ubah Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
