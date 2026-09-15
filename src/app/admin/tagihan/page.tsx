import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RentalStatus } from '@prisma/client'
import InvoiceManagement from './invoice-management'

export default async function AdminTagihanPage() {
  await requireAdmin()

  const [rawInvoices, rawActiveRentals] = await Promise.all([
    prisma.invoice.findMany({
      include: {
        rental: {
          include: {
            user: true,
            unit: { include: { property: true } },
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { dueDate: 'desc' },
    }),
    prisma.rental.findMany({
      where: { status: RentalStatus.ACTIVE },
      include: {
        user: true,
        unit: { include: { property: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Serialize Decimals for Client Component
  const invoices = rawInvoices.map(inv => ({
    ...inv,
    amount: inv.amount.toNumber(),
    rental: {
      ...inv.rental,
      monthlyRent: inv.rental.monthlyRent.toNumber(),
      unit: {
        ...inv.rental.unit,
        monthlyRent: inv.rental.unit.monthlyRent.toNumber(),
        property: {
          ...inv.rental.unit.property,
          monthlyPriceFrom: inv.rental.unit.property.monthlyPriceFrom.toNumber(),
        },
      },
    },
    payments: inv.payments.map(p => ({
      ...p,
      amount: p.amount.toNumber(),
    })),
  }))

  const activeRentals = rawActiveRentals.map(r => ({
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
  }))

  return (
    <div>
      <InvoiceManagement initialInvoices={invoices} activeRentals={activeRentals} />
    </div>
  )
}
