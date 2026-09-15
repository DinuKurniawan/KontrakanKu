'use client'

import { useState, useTransition } from 'react'
import { updateAdminProfileAction, changeAdminPasswordAction } from './actions'
import { User, Phone, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface AdminProfileSettingsProps {
  admin: {
    id: string
    name: string
    email: string
    phone?: string | null
    role: string
  }
}

export default function AdminProfileSettings({ admin }: AdminProfileSettingsProps) {
  // State Profile
  const [name, setName] = useState(admin.name)
  const [phone, setPhone] = useState(admin.phone || '')
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
      const res = await updateAdminProfileAction(undefined, formData)
      if (res?.success) {
        setProfileMsg({ type: 'success', text: res.message || 'Profil berhasil disimpan.' })
      } else {
        setProfileMsg({ type: 'error', text: res?.error || 'Gagal menyimpan profil.' })
      }
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg(null)

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' })
      return
    }

    const formData = new FormData()
    formData.append('currentPassword', currentPassword)
    formData.append('newPassword', newPassword)
    formData.append('confirmPassword', confirmPassword)

    startPasswordTransition(async () => {
      const res = await changeAdminPasswordAction(undefined, formData)
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Kartu Profil & WhatsApp Pengelola */}
      <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        <div>
          <div className="p-6 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-stone-900">Profil & WhatsApp Kontak</h3>
              <p className="text-xs text-stone-500">Identitas pemilik & nomor WhatsApp publik</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
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
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nama Pengelola / Pemilik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Pemilik"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span>Email Login</span>
                <span className="text-[11px] text-stone-400 font-normal">Hanya baca</span>
              </label>
              <input
                type="email"
                disabled
                value={admin.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nomor WhatsApp Kontak Pengelola
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5">
                💡 Nomor WhatsApp ini otomatis ditautkan ke tombol <strong className="text-stone-700">&quot;Hubungi Pengelola&quot;</strong> pada katalog publik kamar kontrakan (PRD Sec 8).
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profilePending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {profilePending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Simpan Profil & Kontak
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Kartu Ganti Kata Sandi */}
      <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        <div>
          <div className="p-6 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-stone-900">Keamanan & Kata Sandi</h3>
              <p className="text-xs text-stone-500">Perbarui kata sandi akun admin berkala</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
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
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kata Sandi Saat Ini <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700 disabled:opacity-50"
              >
                {passwordPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
