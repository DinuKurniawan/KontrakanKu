import { z } from 'zod'
import { idSchema, emailSchema, phoneSchema } from './common'
import { sanitizeText } from './sanitizer'

/**
 * Validasi Perubahan Profil Pengguna (PRD Sec 4.1, 4.2 & 151)
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .transform(val => sanitizeText(val)),
  phone: z
    .string()
    .nullish()
    .transform(val => (val ? val.trim() : undefined))
    .pipe(
      z
        .string()
        .refine(val => {
          if (!val) return true
          const parsed = phoneSchema.safeParse(val)
          return parsed.success
        }, 'Format nomor telepon tidak valid (contoh: 081234567890)')
        .optional()
    ),
  avatarUrl: z
    .string()
    .url('Format URL foto profil tidak valid')
    .nullish()
    .transform(val => (val ? val.trim() : undefined))
    .optional(),
})

/**
 * Validasi Ubah Kata Sandi / Password (PRD Sec 28 & 43.6)
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Kata sandi saat ini wajib diisi'),
    newPassword: z
      .string()
      .min(1, 'Kata sandi baru wajib diisi')
      .min(8, 'Kata sandi baru minimal 8 karakter')
      .max(128, 'Kata sandi baru maksimal 128 karakter')
      .regex(/[a-zA-Z]/, 'Kata sandi harus mengandung minimal satu huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal satu angka'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'Kata sandi baru tidak boleh sama dengan kata sandi saat ini',
    path: ['newPassword'],
  })

/**
 * Validasi Reset Kata Sandi Penyewa oleh Admin (dashboard admin)
 * Admin tidak perlu tahu password lama — cukup password baru + konfirmasi.
 */
export const adminResetPasswordSchema = z
  .object({
    userId: idSchema,
    newPassword: z
      .string()
      .min(1, 'Kata sandi baru wajib diisi')
      .min(8, 'Kata sandi baru minimal 8 karakter')
      .max(128, 'Kata sandi baru maksimal 128 karakter')
      .regex(/[a-zA-Z]/, 'Kata sandi harus mengandung minimal satu huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal satu angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru',
    path: ['confirmPassword'],
  })

/**
 * Validasi Pembuatan Penyewa oleh Admin (PRD Sec 12 & 61)
 */
export const adminCreateTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .transform(val => sanitizeText(val)),
  email: emailSchema,
  phone: z
    .string()
    .nullish()
    .transform(val => (val ? val.trim() : undefined))
    .pipe(
      z
        .string()
        .refine(val => {
          if (!val) return true
          const parsed = phoneSchema.safeParse(val)
          return parsed.success
        }, 'Format nomor telepon tidak valid (contoh: 081234567890)')
        .optional()
    ),
  initialPassword: z
    .string()
    .min(8, 'Password awal minimal 8 karakter')
    .max(128, 'Password awal maksimal 128 karakter')
    .regex(/[a-zA-Z]/, 'Password harus mengandung minimal satu huruf')
    .regex(/[0-9]/, 'Password harus mengandung minimal satu angka')
    .optional(),
  unitId: idSchema.optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>
export type AdminCreateTenantInput = z.infer<typeof adminCreateTenantSchema>
