import { NextRequest, NextResponse } from 'next/server'
import { billingService } from '@/services/billing.service'
import { getCurrentUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

import { env } from '@/lib/env'
import { timingSafeEqualString } from '@/lib/security'

export async function POST(req: NextRequest) {
  // Verifikasi otorisasi: Secret cron token ATAU sesi Admin aktif (PRD Sec 43 & 64)
  const authHeader = req.headers.get('authorization')
  const expectedHeader = `Bearer ${env.CRON_SECRET}`

  const hasValidSecret = authHeader ? timingSafeEqualString(authHeader, expectedHeader) : false

  if (!hasValidSecret) {
    const user = await getCurrentUser()
    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Tidak memiliki otorisasi untuk menjalankan sinkronisasi' },
        { status: 403 }
      )
    }
  }

  try {
    const updatedCount = await billingService.syncOverdueInvoices()
    return NextResponse.json({
      success: true,
      message: `Sinkronisasi tagihan jatuh tempo selesai. ${updatedCount} tagihan diperbarui ke status OVERDUE.`,
      updatedCount,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal sinkronisasi tagihan jatuh tempo'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  // Mengizinkan pemeriksaan status lewat GET dengan proteksi sama
  return POST(req)
}
