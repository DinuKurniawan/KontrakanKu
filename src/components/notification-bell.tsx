'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, Receipt, Info, AlertTriangle, CreditCard } from 'lucide-react'

type NotificationItem = {
  id: string
  title: string
  message: string
  type: string
  linkUrl: string | null
  isRead: boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} hari lalu`
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function iconForType(type: string) {
  if (type === 'INVOICE') return Receipt
  if (type === 'PAYMENT') return CreditCard
  if (type === 'WARNING') return AlertTriangle
  return Info
}

export default function NotificationBell({
  seeAllHref = '/dashboard/notifikasi',
  emptyHint = 'Tagihan baru dari admin akan muncul di sini.',
}: {
  seeAllHref?: string
  emptyHint?: string
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Dropdown hanya menampilkan yang BELUM dibaca. Yang sudah dibaca
  // tetap tersimpan sebagai riwayat di halaman "Lihat semua pemberitahuan"
  // dan tidak akan muncul lagi (termasuk setelah refresh) karena isRead
  // tersimpan permanen di database.
  const unreadItems = notifications.filter((n) => !n.isRead)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch {
      // Abaikan error jaringan agar tidak mengganggu dashboard
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    const onFocus = () => fetchNotifications()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchNotifications])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  async function handleMarkAllRead() {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications/read-all', { method: 'POST' })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleClickItem(item: NotificationItem) {
    setOpen(false)
    if (!item.isRead) {
      try {
        await fetch(`/api/notifications/${item.id}/read`, { method: 'POST' })
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((c) => Math.max(0, c - 1))
      } catch {
        // tetap navigasi walau gagal menandai dibaca
      }
    }
    if (item.linkUrl) {
      router.push(item.linkUrl)
      router.refresh()
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          if (!open) fetchNotifications()
        }}
        aria-label="Notifikasi"
        className="relative w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-3rem)] bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/60 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-bold text-stone-900">Pemberitahuan</p>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={loading || unreadCount === 0}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 disabled:text-stone-300 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tandai dibaca
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
            {unreadItems.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-500">Tidak ada pemberitahuan baru</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  {emptyHint}
                </p>
              </div>
            ) : (
              unreadItems.map((item) => {
                const Icon = iconForType(item.type)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClickItem(item)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-stone-50 transition ${
                      !item.isRead ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        !item.isRead
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-stone-900 truncate">{item.title}</p>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1">{timeAgo(item.createdAt)}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <Link
            href={seeAllHref}
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50 py-2.5 border-t border-stone-100 transition"
          >
            Lihat semua pemberitahuan
          </Link>
        </div>
      )}
    </div>
  )
}
