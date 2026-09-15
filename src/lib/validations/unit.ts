import { z } from 'zod'

// ponytail: trim saja tanpa sanitizeText — nilai dari picker tetap harus round-trip persis,
// escape HTML (&amp; / &#x2F;) merusak pencocokan saat edit
const facilityItemSchema = z.string().trim().min(1).max(50)

export const createUnitSchema = z.object({
  propertyId: z.string().min(1, 'Properti kontrakan wajib dipilih'),
  name: z
    .string()
    .min(1, 'Nama unit/kamar wajib diisi')
    .max(50, 'Nama unit maksimal 50 karakter')
    .trim(),
  description: z
    .string()
    .max(1000, 'Deskripsi unit maksimal 1000 karakter')
    .optional()
    .or(z.literal('')),
  monthlyRent: z.coerce
    .number()
    .positive('Harga sewa bulanan harus lebih dari 0'),
  status: z
    .enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE'])
    .default('AVAILABLE'),
  facilities: z
    .array(facilityItemSchema)
    .default([]),
})

// partial + extend tanpa default agar update tanpa fasilitas tidak menghapus data
export const updateUnitSchema = createUnitSchema.partial().extend({
  facilities: z.array(facilityItemSchema).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE']).optional(),
})

export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>
