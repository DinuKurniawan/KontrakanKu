import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PropertyManagement from './property-management'

export default async function AdminKontrakanPage() {
  await requireAdmin()

  const rawProperties = await prisma.property.findMany({
    include: {
      units: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize Decimals for Client Component
  const properties = rawProperties.map(p => ({
    ...p,
    monthlyPriceFrom: p.monthlyPriceFrom.toNumber(),
    units: p.units.map(u => ({
      ...u,
      monthlyRent: u.monthlyRent.toNumber(),
    })),
  }))

  return (
    <div className="w-full">
      <PropertyManagement initialProperties={properties} />
    </div>
  )
}
