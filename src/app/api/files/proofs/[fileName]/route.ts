import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { assertCanAccessProofFile } from '@/lib/authorization'
import { storage } from '@/lib/storage'
import { hasDirectoryTraversal } from '@/lib/security'

interface RouteProps {
  params: Promise<{ fileName: string }>
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  // 1. Authentication Check (PRD Sec 42: Akses berkas harus melalui otentikasi)
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Akses Ditolak: Anda harus login untuk mengakses berkas ini.' },
      { status: 401 }
    )
  }

  const { fileName } = await params

  // 2. Cegah Directory Traversal pada nama file
  if (!fileName || hasDirectoryTraversal(fileName)) {
    return NextResponse.json(
      { success: false, error: 'Nama berkas tidak valid.' },
      { status: 400 }
    )
  }

  // 3. Object-Level Authorization (PRD Sec 31 & 42: Hanya Admin atau pemilik sewa yang berhak)
  try {
    await assertCanAccessProofFile(user, fileName)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Akses ditolak'
    return NextResponse.json(
      { success: false, error: message },
      { status: 403 }
    )
  }

  // 4. Ambil buffer berkas melalui Storage Provider
  const fileData = await storage.get(fileName)
  if (!fileData) {
    return NextResponse.json(
      { success: false, error: 'Berkas bukti pembayaran tidak ditemukan.' },
      { status: 404 }
    )
  }

  // 5. Kembalikan berkas dengan header privasi
  return new NextResponse(new Uint8Array(fileData.buffer), {
    status: 200,
    headers: {
      'Content-Type': fileData.mimeType,
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'private, max-age=3600, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
