import 'server-only'
import sharp from 'sharp'

export interface ProcessImageOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
}

export interface ProcessedFileResult {
  buffer: Buffer
  mimeType: string
  extension: string
  isConverted: boolean
  originalSize: number
  processedSize: number
}

const CONVERTIBLE_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

/**
 * Memeriksa apakah MIME type termasuk gambar yang dapat diproses dan dikonversi ke WebP
 */
export function isConvertibleImageMime(mimeType: string): boolean {
  return (CONVERTIBLE_IMAGE_MIMES as readonly string[]).includes(mimeType.toLowerCase())
}

/**
 * Memproses berkas yang diunggah untuk penyimpanan teroptimasi:
 * - Gambar (JPG, JPEG, PNG, WEBP): Dikonversi otomatis ke format WebP terkompresi dengan auto-rotation (EXIF) dan pembatasan dimensi maksimum.
 * - Berkas Dokumen (PDF): Dipertahankan dalam format aslinya tanpa modifikasi biner.
 */
export async function processFileForStorage(
  buffer: Buffer,
  declaredOrDetectedMime: string,
  options?: ProcessImageOptions
): Promise<ProcessedFileResult> {
  const mime = declaredOrDetectedMime.toLowerCase()
  const originalSize = buffer.length

  // Jika berkas adalah PDF, pertahankan apa adanya
  if (mime === 'application/pdf') {
    return {
      buffer,
      mimeType: 'application/pdf',
      extension: 'pdf',
      isConverted: false,
      originalSize,
      processedSize: originalSize,
    }
  }

  // Jika berkas adalah gambar yang didukung
  if (isConvertibleImageMime(mime)) {
    try {
      const quality = options?.quality ?? 80
      const maxWidth = options?.maxWidth ?? 1920
      const maxHeight = options?.maxHeight ?? 1920

      // Pipeline Sharp:
      // 1. rotate(): Mengikuti orientasi EXIF kamera smartphone (mencegah foto landscape/portrait terbalik)
      // 2. resize(): Membatasi resolusi maksimum tanpa pembesaran (withoutEnlargement: true)
      // 3. webp(): Mengompresi ke format WebP standar web modern
      const processedBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 4, // Rasio kompresi seimbang vs kecepatan CPU
        })
        .toBuffer()

      return {
        buffer: processedBuffer,
        mimeType: 'image/webp',
        extension: 'webp',
        isConverted: true,
        originalSize,
        processedSize: processedBuffer.length,
      }
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'Unknown image error'
      throw new Error(`Gagal memproses dan mengonversi gambar ke format WebP: ${detail}`)
    }
  }

  // Fallback jika ada ekstensi lain yang lolos validasi awal
  return {
    buffer,
    mimeType: mime,
    extension: 'bin',
    isConverted: false,
    originalSize,
    processedSize: originalSize,
  }
}
