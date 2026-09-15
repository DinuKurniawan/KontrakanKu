import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NotificationList from './notification-list'
import Link from 'next/link'
import { Bell, ArrowRight } from 'lucide-react'

export default async function NotificationPage() {
  const user = await requireAuth()

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

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
              <Bell className="h-3.5 w-3.5" />
              Pusat pemberitahuan
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Pemberitahuan
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Tagihan baru yang diterbitkan admin akan langsung muncul di sini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/tagihan"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Lihat tagihan
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <NotificationList
        initial={notifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          linkUrl: n.linkUrl,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
