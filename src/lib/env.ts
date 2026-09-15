import { z } from 'zod'

/**
 * Environment Variables Schema Validation (PRD Sec 44)
 * Ensures required secrets and configurations are validated on startup.
 */
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL wajib dikonfigurasi.')
    .refine(
      val => val.startsWith('postgres://') || val.startsWith('postgresql://'),
      'DATABASE_URL harus menggunakan protokol PostgreSQL valid.'
    ),
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET harus memiliki panjang minimal 32 karakter untuk memastikan enkripsi JWT aman.'),
  SESSION_COOKIE_NAME: z.string().default('kk_session'),
  CRON_SECRET: z.string().default('kontrakan-cron-secret-key'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ FATAL: Konfigurasi Environment Variable tidak valid:')
    for (const [key, errors] of Object.entries(result.error.flatten().fieldErrors)) {
      console.error(`   - ${key}: ${errors?.join(', ')}`)
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Aplikasi gagal booting karena ketidaksesuaian Environment Variables.')
    }
  }

  return (
    result.data || {
      DATABASE_URL: process.env.DATABASE_URL || '',
      AUTH_SECRET: process.env.AUTH_SECRET || 'kelola-kontrakan-super-secret-key-32-chars!',
      SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'kk_session',
      CRON_SECRET: process.env.CRON_SECRET || 'kontrakan-cron-secret-key',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    }
  )
}

export const env = validateEnv()
