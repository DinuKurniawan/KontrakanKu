import { z } from 'zod'
import { idSchema } from './common'
import { sanitizeText } from './sanitizer'

/**
 * Validasi Gambar Galeri Kontrakan / Foto Unit (PRD Sec 40)
 */
export const propertyImageSchema = z.object({
  propertyId: idSchema,
  url: z
    .string()
    .min(1, 'Lokasi berkas gambar wajib diisi')
    .refine(
      val => val.startsWith('/') || /^https?:\/\//.test(val),
      'Format URL atau lokasi berkas gambar tidak valid'
    ),
  altText: z
    .string()
    .max(150, 'Teks alternatif gambar maksimal 150 karakter')
    .nullish()
    .transform(val => (val ? sanitizeText(val) : undefined))
    .optional(),
  sortOrder: z.coerce
    .number()
    .int('Urutan gambar harus bilangan bulat')
    .min(0, 'Urutan gambar minimal 0')
    .default(0),
  isCover: z.boolean().default(false),
})

export const updatePropertyImageSchema = propertyImageSchema.partial().omit({ propertyId: true })

export type PropertyImageInput = z.infer<typeof propertyImageSchema>
export type UpdatePropertyImageInput = z.infer<typeof updatePropertyImageSchema>
