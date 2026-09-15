import { z } from 'zod'
import { emailSchema } from './common'

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter')
    .max(128, 'Password maksimal 128 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>
