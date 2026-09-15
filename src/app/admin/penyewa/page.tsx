import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, UnitStatus } from '@prisma/client'
import TenantManagement from './tenant-management'

export default async function AdminPenyewaPage() {
  await requireAdmin()

  const [rawTenants, rawAvailableUnits] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.USER },
      include: {
        rentals: {
          include: {
            unit: {
              include: { property: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.unit.findMany({
      where: { status: UnitStatus.AVAILABLE },
      include: { property: true },
      orderBy: { name: 'asc' },
    }),
  ])

  // Serialize Decimals for Client Component
  const tenants = rawTenants.map(t => ({
    ...t,
    rentals: t.rentals.map(r => ({
      ...r,
      monthlyRent: r.monthlyRent.toNumber(),
      unit: {
        ...r.unit,
        monthlyRent: r.unit.monthlyRent.toNumber(),
        property: {
          ...r.unit.property,
          monthlyPriceFrom: r.unit.property.monthlyPriceFrom.toNumber(),
        },
      },
    })),
  }))

  const availableUnits = rawAvailableUnits.map(u => ({
    ...u,
    monthlyRent: u.monthlyRent.toNumber(),
    property: {
      ...u.property,
      monthlyPriceFrom: u.property.monthlyPriceFrom.toNumber(),
    },
  }))

  return (
    <div className="w-full">
      <TenantManagement initialTenants={tenants} availableUnits={availableUnits} />
    </div>
  )
}
