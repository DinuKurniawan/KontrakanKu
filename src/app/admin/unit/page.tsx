import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UnitManagement from './unit-management'

export default async function AdminUnitPage() {
  await requireAdmin()

  const [rawUnits, properties] = await Promise.all([
    prisma.unit.findMany({
      include: {
        property: true,
        rentals: {
          where: { status: 'ACTIVE' },
          include: {
            user: true,
            invoices: {
              orderBy: { dueDate: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.property.findMany({
      select: { id: true, name: true, address: true },
      orderBy: { name: 'asc' },
    }),
  ])

  // Serialize Decimals for Client Component
  const units = rawUnits.map(u => ({
    ...u,
    monthlyRent: u.monthlyRent.toNumber(),
    property: {
      ...u.property,
      monthlyPriceFrom: u.property.monthlyPriceFrom.toNumber(),
    },
    rentals: u.rentals.map(r => ({
      ...r,
      monthlyRent: r.monthlyRent.toNumber(),
      startDate: r.startDate.toISOString(),
      endDate: r.endDate ? r.endDate.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      invoices: r.invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        billingPeriod: inv.billingPeriod,
        amount: inv.amount.toNumber(),
        dueDate: inv.dueDate.toISOString(),
        status: inv.status,
      })),
    })),
  }))

  return (
    <div className="w-full">
      <UnitManagement initialUnits={units} properties={properties} />
    </div>
  )
}
