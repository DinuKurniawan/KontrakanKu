import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatRupiah, formatDateID } from '@/lib/utils'
import Link from 'next/link'
import {
  Building,
  MapPin,
  Calendar,
  Check,
  PhoneCall,
  CreditCard,
  Receipt,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { RentalStatus, UserRole } from '@prisma/client'

export default async function TenantKontrakanSayaPage() {
  const user = await requireAuth()

  const [rental, admin] = await Promise.all([
    prisma.rental.findFirst({
      where: {
        userId: user.id,
        status: RentalStatus.ACTIVE,
      },
      include: {
        unit: {
          include: {
            property: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    }),
    prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
      select: { name: true, phone: true },
    }),
  ])

  if (!rental) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
            <Building className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-base font-bold tracking-tight text-stone-900">
            Belum Ada Unit Kontrakan Aktif
          </h2>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-stone-500">
            Akun Anda belum dihubungkan dengan unit kontrakan oleh pemilik. Silakan hubungi
            pengelola untuk proses penugasan unit kamar.
          </p>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { unit } = rental
  const { property } = unit

  // Format WhatsApp Link
  let waNumber = admin?.phone ? admin.phone.replace(/\D/g, '') : ''
  if (waNumber.startsWith('0')) {
    waNumber = '62' + waNumber.slice(1)
  }
  const waText = encodeURIComponent(
    `Halo ${admin?.name || 'Pengelola'}, saya penyewa unit ${unit.name} (${property.name}). Saya ingin menanyakan perihal kontrakan.`
  )
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : null

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
        <div className="relative flex flex-col gap-4 p-6 sm:p-8">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sewa aktif
          </p>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Kontrakan Saya
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-stone-500">
              Informasi detail unit kamar dan masa aktif sewa Anda (PRD Sec 26)
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
        {/* Cover Image Gallery Banner jika ada */}
        {property.images && property.images.length > 0 && (
          <div className="h-52 sm:h-64 w-full relative overflow-hidden bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.images[0].url}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Unit Aktif Anda
              </span>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight drop-shadow-sm">{property.name}</h3>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-6 sm:flex-row sm:items-center">
            <div className="min-w-0">
              {(!property.images || property.images.length === 0) && (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    SEWA AKTIF
                  </span>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
                    {property.name}
                  </h3>
                </>
              )}
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {property.address}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left sm:text-right">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Nomor Kamar / Unit
              </span>
              <span className="mt-1 block font-mono text-2xl font-bold tabular-nums tracking-tight text-emerald-950">
                {unit.name}
              </span>
            </div>
          </div>

          {/* Grid Informasi Sewa */}
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 transition hover:shadow-sm">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <CreditCard className="h-3.5 w-3.5" />
                Biaya Sewa Bulanan
              </span>
              <span className="mt-2 block font-mono text-lg font-bold tabular-nums tracking-tight text-stone-900">
                {formatRupiah(rental.monthlyRent.toNumber())}
              </span>
              <span className="mt-0.5 block text-[11px] text-stone-500">Per bulan</span>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 transition hover:shadow-sm">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <Calendar className="h-3.5 w-3.5" />
                Tanggal Mulai Sewa
              </span>
              <span className="mt-2 block text-sm font-semibold tabular-nums text-stone-900">
                {formatDateID(rental.startDate)}
              </span>
              <span className="mt-0.5 block text-[11px] text-stone-500">Kontrak Aktif</span>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 transition hover:shadow-sm">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <Clock className="h-3.5 w-3.5" />
                Jatuh Tempo Bulanan
              </span>
              <span className="mt-2 block text-sm font-semibold tabular-nums text-stone-900">
                Setiap Tanggal {new Date(rental.startDate).getDate()}
              </span>
              <span className="mt-0.5 block text-[11px] text-stone-500">
                Siklus pembayaran rutin
              </span>
            </div>
          </div>

          {/* Fasilitas Properti */}
          {property.facilities && property.facilities.length > 0 && (
            <div className="pt-2">
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Fasilitas Properti & Kamar
              </h4>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {property.facilities.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-stone-200/80 bg-stone-50 p-3 text-xs text-stone-700 transition hover:shadow-sm"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions & Hubungi Pengelola */}
          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard/tagihan"
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-700"
              >
                <Receipt className="h-3.5 w-3.5" />
                Lihat Tagihan Saya
              </Link>
              <Link
                href="/dashboard/pembayaran"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Kirim Pembayaran
              </Link>
            </div>

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                Hubungi Pengelola ({admin?.name || 'Admin'})
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
