/**
 * Input Sanitizer & Normalizer Utility (PRD Sec 43.2 XSS & Sec 69 Data Validation)
 */

/**
 * Sanitize string terhadap potensi serangan XSS dengan meng-escape karakter berbahaya
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Strip tag HTML berbahaya dari input teks panjang (seperti deskripsi properti)
 */
export function stripHtmlTags(input: string | null | undefined): string {
  if (!input) return ''
  return input.replace(/<\/?[^>]+(>|$)/g, '').trim()
}

/**
 * Normalisasi format nomor telepon Indonesia (PRD Sec 69)
 * Contoh: "0812-3456-7890" -> "081234567890"
 * "+6281234567890" -> "081234567890"
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ''
  let cleaned = phone.replace(/[\s-]/g, '').trim()
  if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2)
  }
  return cleaned
}

/**
 * Generate slug URL ramah SEO dari teks (PRD Sec 10.1 & 74)
 * Contoh: "Kontrakan Melati Indah Blok B" -> "kontrakan-melati-indah-blok-b"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter non-alphanumeric selain spasi dan minus
    .replace(/\s+/g, '-')         // Ubah spasi menjadi dash
    .replace(/-+/g, '-')         // Hapus dash beruntun
    .replace(/^-+|-+$/g, '')     // Hapus dash di awal atau akhir
}
