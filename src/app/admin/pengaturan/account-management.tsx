'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PaymentAccountModal from './payment-account-modal'
import { togglePaymentAccountAction, deletePaymentAccountAction } from './actions'
import { getBankBrand } from '@/lib/bank-brand'
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  QrCode,
} from 'lucide-react'

interface AccountManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialAccounts: any[]
}

export default function AccountManagement({ initialAccounts }: AccountManagementProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null)

  function openCreate() {
    setSelectedAccount(null)
    setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function openEdit(account: any) {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  async function handleToggle(id: string) {
    await togglePaymentAccountAction(id)
    router.refresh()
  }

  async function handleDelete(id: string, bankName: string) {
    if (confirm(`Hapus atau nonaktifkan rekening ${bankName}?`)) {
      await deletePaymentAccountAction(id)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-stone-900">Rekening Pembayaran</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Rekening bank tujuan transfer yang ditampilkan kepada penyewa pada saat bayar sewa
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Rekening
        </button>
      </div>

      {/* List Rekening */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {initialAccounts.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada rekening bank</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              Belum ada rekening bank yang dikonfigurasi. Klik &quot;Tambah Rekening&quot; untuk menambahkan rekening penerima.
            </p>
            <button
              onClick={openCreate}
              className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Rekening
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {initialAccounts.map(acc => {
              const brand = getBankBrand(acc.bankName)
              return (
              <div key={acc.id} className="flex flex-col gap-4 p-5 transition hover:bg-stone-50/80 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {brand.logo ? (
                    <div
                      title={acc.bankName}
                      className="flex h-11 w-16 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white p-1.5 shadow-sm"
                    >
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
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${brand.tile}`}
                    >
                      <span className="px-1 text-center text-[11px] font-extrabold leading-none tracking-tight">
                        {brand.code}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-sm">{acc.bankName}</h3>
                      {acc.qrCodeUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <QrCode className="h-3 w-3" /> QRIS
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-base font-semibold tabular-nums tracking-tight text-stone-800">{acc.accountNumber}</p>
                    <p className="text-xs text-stone-500">Atas nama: {acc.accountName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => handleToggle(acc.id)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition ${
                      acc.isActive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                    title="Klik untuk mengubah status aktif/nonaktif"
                  >
                    {acc.isActive ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aktif
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Nonaktif
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openEdit(acc)}
                    className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                    title="Edit Rekening"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(acc.id, acc.bankName)}
                    className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <PaymentAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          router.refresh()
        }}
        account={selectedAccount}
      />
    </div>
  )
}
