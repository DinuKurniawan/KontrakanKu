import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { checkRateLimit, RATE_LIMIT_RULES } from '@/lib/validations/rate-limiter'
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  generateSafeFileName,
  validateMagicBytes,
} from '@/lib/validations/file'

export async function POST(req: NextRequest) {
  // 1. Authentication Guard (PRD Sec 42: Akses file harus melalui authorization)
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak: Anda harus login untuk mengunggah berkas.' },
      { status: 401 }
    )
  }

  // 2. CSRF & Cross-Origin Guard (PRD Sec 43.3)
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Permintaan lintas domain (Cross-Origin) tidak diizinkan.' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'Header origin tidak valid.' },
        { status: 400 }
      )
    }
  }

  // 3. Rate Limiting (PRD Sec 43.4)
  const rateLimitKey = `upload:${user.id}`
  const rateCheck = checkRateLimit(rateLimitKey, RATE_LIMIT_RULES.FILE_UPLOAD)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: rateCheck.error || 'Terlalu banyak permintaan unggah. Coba lagi nanti.' },
      { status: 429 }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'Berkas bukti pembayaran tidak ditemukan dalam form data.' },
        { status: 400 }
      )
    }

    const categoryRaw = formData.get('category') as string | null
    const category: 'proof' | 'property' = categoryRaw === 'property' ? 'property' : 'proof'

    if (category === 'property' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Hanya pengelola yang dapat mengunggah foto kontrakan.' },
        { status: 403 }
      )
    }

    // 4. Validasi Ukuran Berkas (PRD Sec 42 & 55: <= 5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 5 MB.`,
        },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Berkas kosong tidak dapat diunggah.' },
        { status: 400 }
      )
    }

    // 5. Validasi MIME Type Dinyatakan (PRD Sec 42: JPG, JPEG, PNG, WEBP, PDF)
    const mimeType = file.type.toLowerCase()
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format berkas tidak didukung. Harap gunakan format JPG, JPEG, PNG, WEBP, atau PDF.',
        },
        { status: 400 }
      )
    }

    // 6. Verifikasi Binary Magic Bytes (Anti-Spoofing File Disguise Prevention)
    const bytes = await file.arrayBuffer()
    const rawBuffer = Buffer.from(bytes)

    const magicByteCheck = validateMagicBytes(rawBuffer)
    if (!magicByteCheck.valid) {
      return NextResponse.json(
        { success: false, error: magicByteCheck.error },
        { status: 400 }
      )
    }

    // 7. Konversi Otomatis Gambar ke Format WebP (Optimasi Ukuran & Kinerja)
    // Berkas gambar (JPG, PNG, WEBP) dikonversi ke WebP, sedangkan PDF tetap dipertahankan
    const { processFileForStorage } = await import('@/lib/storage/image-processor')
    const processed = await processFileForStorage(rawBuffer, magicByteCheck.detectedMime || mimeType)

    // 8. Server-side Safe Filename Generation & Storage Provider Upload (PRD Sec 42)
    const prefix = category === 'property' ? 'prop' : 'proof'
    const safeFilename = generateSafeFileName(file.name, prefix, processed.extension)

    const { storage } = await import('@/lib/storage')
    const uploadResult = await storage.upload(processed.buffer, safeFilename, processed.mimeType, {
      category,
      isPublic: category === 'property',
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      fileName: safeFilename,
      originalName: file.name,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      isConvertedToWebp: processed.isConverted,
      originalSize: file.size,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memproses unggahan berkas'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
