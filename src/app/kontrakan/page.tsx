import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PropertyStatus } from '@prisma/client'
import PropertyCatalog, { SerializedPublicProperty } from './property-catalog'
import PublicLayout from '@/components/public-layout'
import { ChevronLeft, MessageCircle } from 'lucide-react'

export default async function PropertyListingPage() {
  const rawProperties = await prisma.property.findMany({
    where: { status: PropertyStatus.PUBLISHED },
    include: {
      images: { where: { isCover: true }, take: 1 },
      units: { select: { status: true, monthlyRent: true, name: true, facilities: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const properties: SerializedPublicProperty[] = rawProperties.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    address: p.address,
    description: p.description,
    monthlyPriceFrom: p.monthlyPriceFrom.toNumber(),
    coverImageUrl: p.images[0]?.url || null,
    facilities: p.facilities || [],
    totalUnits: p.units.length,
    availableUnits: p.units.filter((u) => u.status === 'AVAILABLE').length,
    units: p.units.map((u) => ({ name: u.name, monthlyRent: u.monthlyRent.toNumber(), status: u.status, facilities: u.facilities || [] })),
  }))

  const totalAvailable = properties.reduce((s, p) => s + p.availableUnits, 0)

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="w-full border-b hairline bg-paper">
        <div className="shell flex w-full items-center justify-between gap-3 py-3.5">
          <nav className="breadcrumbs p-0 text-sm" aria-label="Breadcrumb">
            <ul>
              <li>
                <Link href="/" className="inline-flex items-center gap-1.5 text-bark hover:text-pine">
                  <ChevronLeft className="h-4 w-4" /> Beranda
                </Link>
              </li>
              <li className="font-semibold text-ink">Katalog Unit</li>
            </ul>
          </nav>
          <p className="tick flex items-center gap-2 text-[13px] text-fog">
            {properties.length} kontrakan ·
            <span className="stamp stamp-open !py-1">{totalAvailable} tersedia</span>
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative w-full overflow-x-clip border-b hairline">
        <div className="shell relative w-full pb-8 pt-10 sm:pt-14">
          <p className="eyebrow">Katalog unit</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            Pilih hunian yang <em className="font-light italic text-moss">masih tersedia.</em>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-bark">
            Semua foto dan harga diperbarui berkala. Hubungi pengelola via
            WhatsApp untuk memastikan ketersediaan real-time sebelum survei.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="w-full bg-cream/40">
        <div className="shell w-full py-8 lg:py-12">
          <PropertyCatalog properties={properties} />
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 rounded-[1.75rem] border hairline bg-white px-6 py-7 text-center shadow-warm sm:flex-row sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine text-paper">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="flex-1 text-sm leading-6 text-bark">
              Butuh bantuan memilih? Chat pengelola di{' '}
              <a
                href="https://wa.me/6281384634526"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-pine underline underline-offset-4"
              >
                0813-8463-4526
              </a>{' '}
              — respon {"<1 jam"}.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
