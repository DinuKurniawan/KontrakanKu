'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { adminCreateTenantAction, TenantActionState } from './actions'
import { UserPlus, Loader2, Eye, EyeOff, X } from 'lucide-react'

interface TenantModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableUnits: any[]
}

const DEFAULT_PASSWORD = 'Penyewa123!'

export default function TenantModal({ isOpen, onClose, availableUnits }: TenantModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<TenantActionState | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [initialPassword, setInitialPassword] = useState(DEFAULT_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [unitId, setUnitId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, isPending, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState(null)
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('phone', phone)
    fd.append('initialPassword', initialPassword)
    if (unitId) {
      fd.append('unitId', unitId)
      fd.append('startDate', startDate)
    }
    startTransition(async () => {
      const res = await adminCreateTenantAction(undefined, fd)
      if (res?.success) {
        toast.success('Penyewa baru berhasil dibuat.', { toastId: 'tenant-created' })
        onClose()
        router.refresh()
      } else {
        setState(res || { error: 'Terjadi kesalahan sistem' })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4 backdrop-blur-[6px]"
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tenant-modal-title"
        className="modal-pop flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)]"
      >
        {/* header — icon + title + desc seperti Payment success + X di kanan atas */}
        <div className="relative px-7 pb-2 pt-7 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Tutup modal"
            className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500/70 bg-white text-emerald-600">
            <UserPlus className="h-[18px] w-[18px]" />
          </div>
          <h2 id="tenant-modal-title" className="mt-7 text-[18px] font-semibold tracking-tight text-stone-900">
            Tambah Penyewa
          </h2>
          <p className="mt-2 text-[14px] leading-[22px] text-stone-500">
            Buat akun penyewa baru. Isi data di bawah — pilih kamar jika ingin langsung ditempatkan.
          </p>
        </div>

        {/* form — scroll */}
        <form
          id="tenant-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-7 pb-1 pt-5 sm:px-8"
        >
          {state?.error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] font-medium leading-5 text-rose-700">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="tm-name" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                Nama lengkap
              </label>
              <input
                id="tm-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              {state?.fieldErrors?.name && (
                <p className="mt-1.5 text-xs text-rose-600">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="tm-email" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                Email
              </label>
              <input
                id="tm-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="budi@email.com"
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              {state?.fieldErrors?.email && (
                <p className="mt-1.5 text-xs text-rose-600">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="tm-phone" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                No. WhatsApp <span className="font-normal text-stone-400">(opsional)</span>
              </label>
              <input
                id="tm-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] tabular-nums text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              />
              {state?.fieldErrors?.phone && (
                <p className="mt-1.5 text-xs text-rose-600">{state.fieldErrors.phone[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="tm-pw" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                Kata sandi awal
              </label>
              <div className="relative">
                <input
                  id="tm-pw"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={initialPassword}
                  onChange={e => setInitialPassword(e.target.value)}
                  placeholder="Penyewa123!"
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 pr-10 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-stone-400">Untuk login pertama — penghuni bisa ganti di profil.</p>
            </div>

            <div>
              <label htmlFor="tm-unit" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                Kamar <span className="font-normal text-stone-400">(opsional)</span>
              </label>
              {availableUnits.length === 0 ? (
                <p className="rounded-lg bg-stone-50 px-3.5 py-2.5 text-[13px] text-stone-500 ring-1 ring-stone-200">
                  Tidak ada kamar kosong — bisa ditugaskan nanti.
                </p>
              ) : (
                <select
                  id="tm-unit"
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] font-medium text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  <option value="">Jangan tugaskan sekarang</option>
                  {availableUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.property.name} — {u.name}</option>
                  ))}
                </select>
              )}
            </div>

            {unitId && (
              <div>
                <label htmlFor="tm-start" className="mb-1.5 block text-[13px] font-medium text-stone-900">
                  Tanggal mulai sewa
                </label>
                <input
                  id="tm-start"
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-[14px] text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>
            )}
          </div>
        </form>

        {/* footer — primary + link seperti gambar */}
        <div className="flex items-center gap-4 px-7 pb-7 pt-5 sm:px-8">
          <button
            type="submit"
            form="tenant-form"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-4 py-2.5 text-[14px] font-medium text-white shadow-sm transition hover:bg-[#4e44e6] disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Buat penyewa
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-stone-500 hover:text-stone-900"
          >
            Batal <span aria-hidden className="text-stone-400">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
