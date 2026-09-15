import { z } from 'zod'
import { rupiahAmountSchema } from './common'
import { sanitizeText, stripHtmlTags } from './sanitizer'

export const createPropertySchema = z.object({
  name: z
    .string()
    .min(2, 'Nama kontrakan minimal 2 karakter')
    .max(100, 'Nama kontrakan maksimal 100 karakter')
    .transform(val => sanitizeText(val)),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)')
    .trim(),
  address: z
    .string()
    .min(5, 'Alamat lengkap minimal 5 karakter')
    .max(500, 'Alamat maksimal 500 karakter')
    .transform(val => sanitizeText(val)),
  description: z
    .string()
    .max(2000, 'Deskripsi maksimal 2000 karakter')
    .optional()
    .or(z.literal(''))
    .transform(val => (val ? stripHtmlTags(val) : '')),
  monthlyPriceFrom: rupiahAmountSchema,
  status: z
    .enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .default('DRAFT'),
  facilities: z
    .array(z.string().trim().min(1).max(50))
    .default([]),
  coverImageUrl: z
    .string()
    .nullish()
    .refine(
      val => !val || val.startsWith('/') || /^https?:\/\//.test(val),
      'Format URL atau lokasi cover gambar tidak valid'
    )
    .optional(),
  coverImageUrls: z
    .array(
      z
        .string()
        .refine(
          val => !val || val.startsWith('/') || /^https?:\/\//.test(val),
          'Format URL gambar tidak valid'
        )
    )
    .max(5, 'Maksimal 5 foto per kontrakan (1 sampul + 4 galeri)')
    .optional()
    .default([]),
})

export const updatePropertySchema = createPropertySchema.partial().extend({
  coverImageUrls: z
    .array(
      z.string().refine(val => !val || val.startsWith('/') || /^https?:\/\//.test(val), 'Format URL gambar tidak valid')
    )
    .max(5, 'Maksimal 5 foto per kontrakan (1 sampul + 4 galeri)')
    .optional(),
  facilities: z.array(z.string().trim().min(1).max(50)).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
