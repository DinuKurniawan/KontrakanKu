'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCheck, Receipt, Info, AlertTriangle, CreditCard, Bell, ArrowUpRight } from 'lucide-react'

export type NotifItem = {
  id: string
  title: string
  message: string
  type: string
  linkUrl: string | null
  isRead: boolean
  createdAt: string
}

function iconForType(type: string) {
  if (type === 'INVOICE') return Receipt
  if (type === 'PAYMENT') return CreditCard
  if (type === 'WARNING') return AlertTriangle
  return Info
}

export default function NotificationList({ initial }: { initial: NotifItem[] }) {
  const [items, setItems] = useState(initial)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const unread = items.filter((i) => !i.isRead).length

  async function markAll() {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' })
      if (res.ok) {
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function openItem(item: NotifItem) {
    if (!item.isRead) {
      try {
        await fetch(`/api/notifications/${item.id}/read`, { method: 'POST' })
        setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)))
      } catch {
        // abaikan
      }
    }
    if (item.linkUrl) {
      router.push(item.linkUrl)
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
          <Bell className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada pemberitahuan</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
          Setiap tagihan baru yang dibuat admin akan muncul di sini secara otomatis.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
          <span className={`h-1.5 w-1.5 rounded-full ${unread > 0 ? 'bg-emerald-500' : 'bg-stone-300'}`} />
          {unread > 0 ? `${unread} belum dibaca` : 'Semua sudah dibaca'}
        </p>
        <button
          type="button"
          onClick={markAll}
          disabled={loading || unread === 0}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
        >
          <CheckCheck className="h-4 w-4" />
          Tandai semua dibaca
        </button>
      </div>

      {items.map((item) => {
        const Icon = iconForType(item.type)
        const inner = (
            <div
              className={`flex w-full gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                !item.isRead
                  ? 'border-emerald-200/80 bg-emerald-50/50 ring-1 ring-emerald-600/10 hover:border-emerald-300 hover:ring-emerald-600/20'
                  : 'border-stone-200/80 hover:border-stone-300'
              }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                !item.isRead ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-stone-900">{item.title}</p>
                {!item.isRead && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Baru
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">{item.message}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] tabular-nums text-stone-400">
                <span>
                  {new Intl.DateTimeFormat('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(item.createdAt))}
                </span>
                {item.linkUrl ? (
                  <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
                    <span aria-hidden>·</span> Klik untuk lihat tagihan
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        )

        return item.linkUrl ? (
          <button key={item.id} type="button" onClick={() => openItem(item)} className="group w-full rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50">
            {inner}
          </button>
        ) : (
          <div key={item.id}>{inner}</div>
        )
      })}

      <p className="px-2 pt-2 text-center text-[11px] leading-relaxed text-stone-400">
        Menampilkan {items.length} pemberitahuan terbaru. Lihat{' '}
        <Link href="/dashboard/tagihan" className="font-semibold text-emerald-700 hover:underline">
          Tagihan Sewa
        </Link>{' '}
        untuk detail pembayaran.
      </p>
    </div>
  )
}
