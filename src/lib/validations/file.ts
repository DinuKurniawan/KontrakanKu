import { z } from 'zod'

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 Megabytes (PRD Sec 42 & 55)

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const

export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'] as const

/**
 * Validasi metadata berkas unggahan
 */
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'Nama berkas tidak boleh kosong'),
  fileSize: z
    .number()
    .positive('Ukuran berkas harus lebih dari 0')
    .max(MAX_FILE_SIZE_BYTES, 'Ukuran bukti pembayaran maksimal 5 MB'),
  mimeType: z
    .string()
    .refine(
      mime => (ALLOWED_MIME_TYPES as readonly string[]).includes(mime.toLowerCase()),
      'Format berkas harus berupa JPG, JPEG, PNG, WEBP, atau PDF'
    ),
})

/**
 * Generate nama file aman di server untuk mencegah directory traversal dan file collision (PRD Sec 42)
 * Memastikan ekstensi berada di dalam whitelist ekstensi aman.
 */
export function generateSafeFileName(originalName: string, prefix = 'proof', forcedExt?: string): string {
  const rawExt = forcedExt || originalName.split('.').pop()?.toLowerCase() || 'bin'
  const sanitizedExtension = rawExt.replace(/[^a-z0-9]/g, '')

  const isSafeExt = (ALLOWED_FILE_EXTENSIONS as readonly string[])
    .map(ext => ext.replace('.', ''))
    .includes(sanitizedExtension)

  const finalExt = isSafeExt ? sanitizedExtension : 'bin'
  const timestamp = Date.now()
  const randomSuffix = crypto.randomUUID().slice(0, 8)
  return `${prefix}_${timestamp}_${randomSuffix}.${finalExt}`
}

/**
 * Verifikasi signature/magic bytes berkas biner untuk mencegah file spoofing (PRD Sec 42)
 */
export function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string; error?: string } {
  if (buffer.length < 4) {
    return { valid: false, error: 'Berkas terlalu kecil atau rusak.' }
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' }
  }

  // 2. PNG: 89 50 4E 47 (\x89PNG)
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, detectedMime: 'image/png' }
  }

  // 3. WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, detectedMime: 'image/webp' }
  }

  // 4. PDF: %PDF (25 50 44 46)
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return { valid: true, detectedMime: 'application/pdf' }
  }

  return {
    valid: false,
    error: 'Format isi berkas tidak valid atau tidak sesuai dengan jenis berkas yang diizinkan (Magic Bytes mismatch).',
  }
}
