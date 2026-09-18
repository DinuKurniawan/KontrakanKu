'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { adminResetPasswordAction, TenantActionState } from './actions'
import { X, KeyRound, Loader2, Eye, EyeOff, TriangleAlert } from 'lucide-react'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tenant?: any | null
}

export default function ResetPasswordModal({ isOpen, onClose, tenant }: ResetPasswordModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<TenantActionState | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function close() {
    if (isPending) return
    setState(null)
    setNewPassword('')
    setConfirmPassword('')
    setShowNew(false)
    setShowConfirm(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tenant) return
    setState(null)

    const formData = new FormData()
    formData.append('userId', tenant.id)
    formData.append('newPassword', newPassword)
    formData.append('confirmPassword', confirmPassword)

    startTransition(async () => {
      const res = await adminResetPasswordAction(undefined, formData)
      if (res?.success) {
        toast.success(`Kata sandi ${tenant.name} berhasil direset.`, { toastId: 'password-reset' })
        close()
        router.refresh()
      } else {
        setState(res || { error: 'Terjadi kesalahan saat mereset kata sandi' })
      }
    })
  }

  if (!isOpen || !tenant) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget) close() }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-stone-900">Reset Kata Sandi</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Penyewa: <span className="font-semibold text-stone-800">{tenant.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={close}
            disabled={isPending}
            aria-label="Tutup modal"
            className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {state?.error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
              {state.error}
            </div>
          )}

          <div className="flex gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-800">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            <p>
              Kata sandi <span className="font-semibold">{tenant.email}</span> langsung
              berubah. Sampaikan kata sandi baru ke penyewa melalui WhatsApp.
            </p>
          </div>

          <div>
            <label htmlFor="rp-new" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Kata sandi baru
            </label>
            <div className="relative">
              <input
                id="rp-new"
                type={showNew ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 karakter, huruf + angka"
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                tabIndex={-1}
                aria-label={showNew ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {state?.fieldErrors?.newPassword && (
              <p className="mt-1.5 text-xs text-rose-600">{state.fieldErrors.newPassword[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="rp-confirm" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Konfirmasi kata sandi baru
            </label>
            <div className="relative">
              <input
                id="rp-confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {state?.fieldErrors?.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-600">{state.fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700 disabled:opacity-60 cursor-pointer"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Reset kata sandi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
