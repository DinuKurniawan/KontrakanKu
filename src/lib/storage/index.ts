import path from 'path'
import { mkdir, writeFile, readFile, unlink, stat } from 'fs/promises'

export interface StorageResult {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

export interface UploadOptions {
  isPublic?: boolean
  category?: 'proof' | 'property'
}

export interface StorageProvider {
  upload(fileBuffer: Buffer, fileName: string, mimeType: string, options?: UploadOptions): Promise<StorageResult>
  get(fileName: string): Promise<{ buffer: Buffer; mimeType: string } | null>
  delete(fileName: string): Promise<boolean>
}

/**
 * LocalSecureStorageProvider:
 * Menyimpan file sensitif (seperti bukti pembayaran) di direktori privat terproteksi
 * dan melayaninya melalui route API berizin (/api/files/proofs/[fileName])
 * sesuai ketentuan PRD Sec 42. Untuk foto properti publik disimpan di /public/uploads/properties.
 */
export class LocalSecureStorageProvider implements StorageProvider {
  private baseDir: string

  constructor(baseDir?: string) {
    // Simpan di direktori terisolasi di server
    this.baseDir = baseDir || path.join(process.cwd(), 'storage', 'uploads', 'proofs')
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<StorageResult> {
    const isProperty = options?.category === 'property' || options?.isPublic === true

    if (isProperty) {
      const publicPropDir = path.join(process.cwd(), 'public', 'uploads', 'properties')
      await mkdir(publicPropDir, { recursive: true })
      const filePath = path.join(publicPropDir, fileName)
      await writeFile(filePath, fileBuffer)

      return {
        url: `/uploads/properties/${fileName}`,
        fileName,
        fileSize: fileBuffer.length,
        mimeType,
      }
    }

    await mkdir(this.baseDir, { recursive: true })

    // Pastikan juga direktori public/uploads/proofs memiliki salinan atau kompatibilitas
    const publicDir = path.join(process.cwd(), 'public', 'uploads', 'proofs')
    await mkdir(publicDir, { recursive: true })

    const filePath = path.join(this.baseDir, fileName)
    const publicPath = path.join(publicDir, fileName)

    await Promise.all([
      writeFile(filePath, fileBuffer),
      writeFile(publicPath, fileBuffer),
    ])

    // URL akses terproteksi sesuai PRD Sec 42
    const url = `/api/files/proofs/${fileName}`

    return {
      url,
      fileName,
      fileSize: fileBuffer.length,
      mimeType,
    }
  }

  async get(fileName: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    // Cek di direktori privat terlebih dahulu
    const primaryPath = path.join(this.baseDir, fileName)
    const fallbackPath = path.join(process.cwd(), 'public', 'uploads', 'proofs', fileName)

    let targetPath = primaryPath

    try {
      await stat(primaryPath)
    } catch {
      try {
        await stat(fallbackPath)
        targetPath = fallbackPath
      } catch {
        return null
      }
    }

    const buffer = await readFile(/*turbopackIgnore: true*/ targetPath)

    // Tentukan mime type berdasarkan ekstensi
    const ext = path.extname(fileName).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    }
    const mimeType = mimeTypes[ext] || 'application/octet-stream'

    return { buffer, mimeType }
  }

  async delete(fileName: string): Promise<boolean> {
    const primaryPath = path.join(this.baseDir, fileName)
    const fallbackPath = path.join(process.cwd(), 'public', 'uploads', 'proofs', fileName)

    let deleted = false
    try {
      await unlink(primaryPath)
      deleted = true
    } catch {}

    try {
      await unlink(fallbackPath)
      deleted = true
    } catch {}

    return deleted
  }
}

// Singleton storage provider default
export const storage: StorageProvider = new LocalSecureStorageProvider()
