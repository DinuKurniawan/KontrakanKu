'use client'

import { useState, useActionState, useRef } from 'react'
import { submitPaymentAction } from './actions'
import { formatRupiah, formatBillingPeriod } from '@/lib/utils'
import { getBankBrand } from '@/lib/bank-brand'
import {
  UploadCloud,
  AlertCircle,
  Check,
  Copy,
  QrCode,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

interface PaymentFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentAccounts: any[]
  selectedInvoiceId?: string
  defaultSenderName?: string
}

const COMMON_BANKS = [
  'Bank BCA',
  'Bank Mandiri',
  'Bank BRI',
  'Bank BNI',
  'Bank Syariah Indonesia (BSI)',
  'Bank CIMB Niaga',
  'Bank Jago',
  'SeaBank',
  'DANA',
  'GoPay',
  'OVO',
]

export default function PaymentForm({
  invoices,
  paymentAccounts,
  selectedInvoiceId,
  defaultSenderName = '',
}: PaymentFormProps) {
  const [state, formAction, isPending] = useActionState(submitPaymentAction, undefined)

  // Selected Invoice & Nominal state
  const initialInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0]
  const [selectedInvId, setSelectedInvId] = useState(initialInvoice?.id || '')
  const currentInvoice = invoices.find((inv) => inv.id === selectedInvId) || invoices[0]

  const initialAmount = currentInvoice ? String(currentInvoice.amount.toNumber ? currentInvoice.amount.toNumber() : currentInvoice.amount) : ''
  const [amount, setAmount] = useState(initialAmount)

  // Selected Payment Account & Copied state
  const [selectedAccountId, setSelectedAccountId] = useState(paymentAccounts[0]?.id || '')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showQrisModal, setShowQrisModal] = useState<string | null>(null)

  // File Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [proofFileUrl, setProofFileUrl] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  // Handle invoice change: auto-fill amount
  function handleInvoiceChange(invId: string) {
    setSelectedInvId(invId)
    const inv = invoices.find((i) => i.id === invId)
    if (inv) {
      const numericAmount = inv.amount.toNumber ? inv.amount.toNumber() : inv.amount
      setAmount(String(numericAmount))
    }
  }

  // Format digit polos menjadi tampilan titik ribuan ala Indonesia (1500000 -> 1.500.000)
  function formatThousand(digits: string): string {
    if (!digits) return ''
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Ketik bebas (termasuk paste "Rp 1.500.000") -> simpan digit saja,
  // tampilkan bertitik, jaga posisi kursor agar tidak loncat ke ujung.
  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target
    const caret = el.selectionStart ?? el.value.length
    const digitsBeforeCaret = el.value.slice(0, caret).replace(/\D/g, '').length
    const digits = el.value.replace(/\D/g, '')
    setAmount(digits)
    requestAnimationFrame(() => {
      const node = amountRef.current
      if (!node) return
      const formatted = formatThousand(digits)
      let pos = formatted.length
      if (digitsBeforeCaret === 0) {
        pos = 0
      } else {
        let seen = 0
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) seen++
          if (seen === digitsBeforeCaret) {
            pos = i + 1
            break
          }
        }
      }
      try {
        node.setSelectionRange(pos, pos)
      } catch {
        // abaikan jika browser tidak mendukung
      }
    })
  }

  // Copy Account Number
  async function handleCopy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      // Fallback
    }
  }

  // Handle File Upload to /api/upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success && data.url) {
        setProofFileUrl(data.url)
        setUploadedFileName(file.name)
        setUploadedFileSize(file.size)
      } else {
        setUploadError(data.error || 'Gagal mengunggah berkas bukti pembayaran')
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat mengunggah')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemoveFile() {
    setProofFileUrl('')
    setUploadedFileName('')
    setUploadedFileSize(null)
  }

  // Check nominal difference for PRD Section 20 warning
  const currentInvoiceNumeric = currentInvoice
    ? currentInvoice.amount.toNumber
      ? currentInvoice.amount.toNumber()
      : Number(currentInvoice.amount)
    : 0
  const isAmountDifferent = amount && Number(amount) !== currentInvoiceNumeric

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {/* 1. Pilih Tagihan (Invoice) */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <label htmlFor="invoiceId" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Tagihan yang Akan Dibayar <span className="text-rose-500">*</span>
        </label>
        <select
          id="invoiceId"
          name="invoiceId"
          required
          value={selectedInvId}
          onChange={(e) => handleInvoiceChange(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
        >
          {invoices.map((inv) => {
            const num = inv.amount.toNumber ? inv.amount.toNumber() : inv.amount
            return (
              <option key={inv.id} value={inv.id} className="text-stone-900 bg-white">
                {inv.invoiceNumber} — Tagihan {formatBillingPeriod(inv.billingPeriod)} ({formatRupiah(num)})
              </option>
            )
          })}
        </select>
      </div>

      {/* 2. Rekening Bank Tujuan Transfer */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Pilih Rekening Tujuan Transfer <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {paymentAccounts.map((acc) => {
            const isChecked = selectedAccountId === acc.id
            const isCopied = copiedId === acc.id
            const brand = getBankBrand(acc.bankName)

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isChecked
                    ? 'border-emerald-600 bg-emerald-50/60 ring-4 ring-emerald-600/10'
                    : 'border-stone-200/80 bg-white hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentAccountId"
                      value={acc.id}
                      checked={isChecked}
                      onChange={() => setSelectedAccountId(acc.id)}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    {brand.logo ? (
                      <div
                        title={acc.bankName}
                        className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white p-1"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={brand.logo}
                          alt={`Logo ${acc.bankName}`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        title={acc.bankName}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${brand.tile}`}
                      >
                        {brand.code}
                      </div>
                    )}
                    <span className="text-sm font-bold text-stone-900">{acc.bankName}</span>
                  </div>

                  {acc.qrCodeUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowQrisModal(acc.qrCodeUrl)
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-200"
                      title="Lihat Kode QRIS"
                    >
                      <QrCode className="h-3 w-3" />
                      QRIS
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-stone-200/80 bg-white p-2.5">
                  <div>
                    <span className="block font-mono text-sm font-bold tabular-nums tracking-wide text-stone-900">
                      {acc.accountNumber}
                    </span>
                    <span className="block text-xs text-stone-500">a.n {acc.accountName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(acc.accountNumber, acc.id)
                    }}
                    className="rounded-lg p-1.5 text-stone-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                    title="Salin Nomor Rekening"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Form Rincian Transfer */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Rincian Transfer
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Nominal Transfer (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              required
              ref={amountRef}
              value={formatThousand(amount)}
              onChange={handleAmountChange}
              placeholder="Contoh: 1.500.000"
              autoComplete="off"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 font-mono text-sm tabular-nums text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            />
            {/* Yang dikirim ke server: digit polos tanpa titik */}
            <input type="hidden" name="amount" value={amount} />
            <p className="mt-1 text-[11px] tabular-nums text-stone-500">
              = {formatRupiah(Number(amount) || 0)}
            </p>
            {isAmountDifferent && (
              <div className="mt-1.5 flex items-start gap-1.5 rounded-xl border border-amber-200 bg-amber-50 p-2 text-[11px] leading-relaxed text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>
                  <strong>Perhatian:</strong> Nominal transfer berbeda dengan tagihan ({formatRupiah(currentInvoiceNumeric)}). Admin akan memverifikasi kesesuaian pembayaran Anda.
                </span>
              </div>
            )}
            {state?.fieldErrors?.amount && (
              <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.amount[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="transferDate" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Tanggal Transfer <span className="text-rose-500">*</span>
            </label>
            <input
              id="transferDate"
              name="transferDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            />
          </div>

          <div>
            <label htmlFor="senderBank" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Bank Pengirim Anda <span className="text-rose-500">*</span>
            </label>
            <input
              id="senderBank"
              name="senderBank"
              type="text"
              required
              list="common-banks"
              placeholder="Pilih atau ketik bank pengirim..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            />
            <datalist id="common-banks">
              {COMMON_BANKS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="senderName" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Nama Pemilik Rekening Pengirim <span className="text-rose-500">*</span>
            </label>
            <input
              id="senderName"
              name="senderName"
              type="text"
              required
              defaultValue={defaultSenderName}
              placeholder="Nama sesuai rekening bank..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            />
          </div>
        </div>
      </div>

      {/* 4. Unggah Bukti Transfer (Direct File Upload & URL) */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Bukti Transfer (Foto Struk / Screenshot Transfer) <span className="text-rose-500">*</span>
        </label>

        {/* Hidden input untuk URL bukti transfer yang dikirim ke Server Action */}
        <input
          type="hidden"
          name="proofFileUrl"
          value={proofFileUrl}
          required
        />

        {proofFileUrl ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 text-emerald-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofFileUrl}
                  alt="Bukti Transfer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-stone-900">
                  {uploadedFileName || 'Bukti_Transfer_Terpilih.jpg'}
                </p>
                <p className="text-[11px] font-medium text-emerald-700">
                  {uploadedFileSize ? `${(uploadedFileSize / 1024).toFixed(0)} KB • ` : ''}Siap dikirim
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="cursor-pointer rounded-xl p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-700"
              title="Ganti Berkas"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-stone-300 bg-white p-6 text-center shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 transition group-hover:bg-emerald-100 group-hover:text-emerald-800">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>
              <p className="text-xs font-semibold text-stone-800 group-hover:text-emerald-800">
                {isUploading ? 'Mengunggah Berkas...' : 'Klik untuk Pilih Foto / Struk Transfer'}
              </p>
              <p className="mt-1 text-[11px] text-stone-400">
                Format: JPG, PNG, WEBP, atau PDF (Maksimal 5 MB)
              </p>
            </div>

            {uploadError && (
              <p className="text-xs font-medium text-rose-600">{uploadError}</p>
            )}
          </div>
        )}
      </div>

      {/* 5. Catatan Tambahan */}
      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <label htmlFor="notes" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Catatan Tambahan (Opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Tulis pesan atau keterangan tambahan jika ada..."
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || isUploading || !proofFileUrl}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengirim Pembayaran...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Kirim Konfirmasi Pembayaran
          </>
        )}
      </button>

      {/* Modal QRIS Preview */}
      {showQrisModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowQrisModal(null) }} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm">
          <div onClick={e => e.stopPropagation()} className="my-8 w-full max-w-sm space-y-4 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-sm font-bold tracking-tight text-stone-900">Kode QRIS Pembayaran</h4>
              <button
                type="button"
                onClick={() => setShowQrisModal(null)}
                className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="inline-block rounded-2xl border border-stone-200/80 bg-stone-50 p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={showQrisModal}
                alt="QRIS Code"
                className="mx-auto max-h-72 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-stone-500">
              Pindai kode QRIS di atas menggunakan aplikasi mobile banking atau e-wallet Anda.
            </p>
            <button
              type="button"
              onClick={() => setShowQrisModal(null)}
              className="w-full rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
