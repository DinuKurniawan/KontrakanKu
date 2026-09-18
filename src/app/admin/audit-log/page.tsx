import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { History, Shield, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 15

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

/** Nomor halaman yang ditampilkan: 1 … current-1 current current+1 … last */
function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, 2, current - 1, current, current + 1, total - 1, total])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

export default async function AdminAuditLogPage({ searchParams }: PageProps) {
  await requireAdmin()

  const { page: pageParam } = await searchParams
  const requestedPage = Number.parseInt(pageParam ?? '', 10)

  const totalCount = await prisma.auditLog.count()
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages)

  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  })

  const startIndex = (currentPage - 1) * PAGE_SIZE

  return (
    <div className="w-full space-y-6">
      {/* Hero */}
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
              <Shield className="h-3.5 w-3.5" />
              Jejak audit
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Log Aktivitas Sistem
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Pencatatan jejak audit aktivitas krusial sistem untuk transparansi dan keamanan (PRD Sec 41 & 73)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-3 rounded-2xl bg-stone-900 px-5 py-4 text-white shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums tracking-tight">{totalCount}</p>
                <p className="text-[11px] font-medium text-stone-400">total aktivitas tercatat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {totalCount === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <History className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-700">Belum ada catatan aktivitas</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
              Aktivitas krusial seperti verifikasi pembayaran dan perubahan data akan tercatat di
              sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-3.5">Waktu</th>
                  <th className="px-6 py-3.5">Aktor</th>
                  <th className="px-6 py-3.5">Aksi</th>
                  <th className="px-6 py-3.5">Target Entitas</th>
                  <th className="px-6 py-3.5">Detail / Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="transition hover:bg-stone-50/80">
                    <td className="whitespace-nowrap px-6 py-4 tabular-nums text-stone-500">
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 font-sans">
                      {log.user ? (
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[11px] font-bold text-white">
                            {log.user.name
                              .split(' ')
                              .map((part: string) => part.charAt(0))
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-stone-900">
                              {log.user.name}
                            </span>
                            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                              {log.user.role}
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span className="italic text-stone-400">Sistem</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          log.action.includes('APPROVED')
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action.includes('REJECTED')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            log.action.includes('APPROVED')
                              ? 'bg-emerald-500'
                              : log.action.includes('REJECTED')
                              ? 'bg-rose-500'
                              : 'bg-stone-400'
                          }`}
                        />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {log.entityType} #{log.entityId.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-stone-500 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white px-6 py-4 shadow-sm sm:flex-row">
          <p className="text-xs text-stone-500">
            Menampilkan{' '}
            <span className="font-semibold tabular-nums text-stone-700">
              {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalCount)}
            </span>{' '}
            dari <span className="font-semibold tabular-nums text-stone-700">{totalCount}</span> aktivitas
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={currentPage <= 1 ? '/admin/audit-log' : `/admin/audit-log?page=${currentPage - 1}`}
              aria-disabled={currentPage <= 1}
              aria-label="Halaman sebelumnya"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200/80 text-stone-500 transition hover:bg-stone-50 ${
                currentPage <= 1 ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            {pageNumbers(currentPage, totalPages).map((page, idx) =>
              page === '…' ? (
                <span key={`gap-${idx}`} className="px-1 text-xs font-semibold text-stone-400">
                  …
                </span>
              ) : (
                <Link
                  key={page}
                  href={page === 1 ? '/admin/audit-log' : `/admin/audit-log?page=${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold tabular-nums transition ${
                    page === currentPage
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-stone-200/80 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {page}
                </Link>
              )
            )}
            <Link
              href={currentPage >= totalPages ? `/admin/audit-log?page=${totalPages}` : `/admin/audit-log?page=${currentPage + 1}`}
              aria-disabled={currentPage >= totalPages}
              aria-label="Halaman berikutnya"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200/80 text-stone-500 transition hover:bg-stone-50 ${
                currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
