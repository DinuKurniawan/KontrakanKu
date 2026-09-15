import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database: admin only...')

  const adminPasswordHash = await bcrypt.hash('Admin123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kontrakan.com' },
    update: {
      name: 'Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: 'Admin',
      email: 'admin@kontrakan.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  })

  console.log(`Seed done. Admin ready: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
