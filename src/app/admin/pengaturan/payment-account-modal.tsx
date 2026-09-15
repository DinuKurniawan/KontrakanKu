'use client'

import { useState, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  createPaymentAccountAction,
  updatePaymentAccountAction,
  PaymentAccountActionState,
} from './actions'
import { X, CreditCard, QrCode, Loader2 } from 'lucide-react'

interface PaymentAccountModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account?: any
}

const COMMON_BANKS = [
  'Bank BCA',
  'Bank Mandiri',
  'Bank BRI',
  'Bank BNI',
  'Bank Syariah Indonesia (BSI)',
  'Bank CIMB Niaga',
  'Bank Permata',
  'Bank Danamon',
  'Bank Jago',
  'SeaBank',
  'DANA / OVO / GoPay (E-Wallet)',
]

export default function PaymentAccountModal({
  isOpen,
  onClose,
  account,
}: PaymentAccountModalProps) {
  const isEdit = !!account
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<PaymentAccountActionState | null>(null)

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted guard agar portal hanya dirender di client
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (account) {
      setBankName(account.bankName || '')
      setAccountNumber(account.accountNumber || '')
      setAccountName(account.accountName || '')
      setQrCodeUrl(account.qrCodeUrl || '')
      setIsActive(account.isActive ?? true)
    } else {
      setBankName('Bank BCA')
      setAccountNumber('')
      setAccountName('')
      setQrCodeUrl('')
      setIsActive(true)
    }
    setState(null)
  }, [account, isOpen])

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

    const formData = new FormData()
    formData.append('bankName', bankName)
    formData.append('accountNumber', accountNumber)
    formData.append('accountName', accountName)
    formData.append('qrCodeUrl', qrCodeUrl)
    formData.append('isActive', String(isActive))

    startTransition(async () => {
      let res: PaymentAccountActionState | undefined
      if (isEdit) {
        res = await updatePaymentAccountAction(account.id, undefined, formData)
      } else {
        res = await createPaymentAccountAction(undefined, formData)
      }

      if (res?.success) {
        onClose()
      } else {
        setState(res || { error: 'Terjadi kesalahan sistem' })
      }
    })
  }

  if (!isOpen || !mounted) return null

  // Portal ke document.body agar overlay selalu fullscreen mengikuti viewport,
  // tidak terkungkung ukuran/posisi section induk (Rekening Pembayaran).
  return createPortal(
    <div onClick={e => { if (e.target === e.currentTarget && !isPending) onClose() }} className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-xs">
      <div onClick={e => e.stopPropagation()} className="m-auto w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-stone-900">
                {isEdit ? 'Edit Rekening Pembayaran' : 'Tambah Rekening Bank'}
              </h3>
              <p className="text-xs text-stone-500">Rekening tujuan transfer manual bagi penyewa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Nama Bank */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nama Bank / Saluran Pembayaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="bank-suggestions"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="Pilih atau ketik nama bank..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
              <datalist id="bank-suggestions">
                {COMMON_BANKS.map(b => (
                  <option key={b} value={b} />
                ))}
              </datalist>
              {state?.fieldErrors?.bankName && (
                <p className="text-[11px] text-rose-600 mt-1">{state.fieldErrors.bankName[0]}</p>
              )}
            </div>

            {/* Nomor Rekening */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nomor Rekening / Virtual Account <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Contoh: 1234-5678-90"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
              {state?.fieldErrors?.accountNumber && (
                <p className="text-[11px] text-rose-600 mt-1">{state.fieldErrors.accountNumber[0]}</p>
              )}
            </div>

            {/* Atas Nama */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Atas Nama Pemilik Rekening <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="Contoh: Ibu Hj. Aminah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
              {state?.fieldErrors?.accountName && (
                <p className="text-[11px] text-rose-600 mt-1">{state.fieldErrors.accountName[0]}</p>
              )}
            </div>

            {/* URL QRIS (opsional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-stone-500" />
                URL Gambar QRIS (Opsional)
              </label>
              <input
                type="text"
                value={qrCodeUrl}
                onChange={e => setQrCodeUrl(e.target.value)}
                placeholder="https://... atau /uploads/qris.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Status Aktif */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-600"
              />
              <span>Aktifkan rekening ini (Ditampilkan pada halaman pembayaran penyewa)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Tambah Rekening'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
