import { z, ZodSchema } from 'zod'
import { ActionResult } from '@/types'

/**
 * Helper untuk memvalidasi input terhadap skema Zod dan mengembalikan format ActionResult yang seragam
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): ActionResult<T> {
  const result = schema.safeParse(data)

  if (!result.success) {
    const flattened = result.error.flatten()
    const firstErrorMessage =
      result.error.issues[0]?.message || 'Data yang dimasukkan tidak valid.'

    return {
      success: false,
      error: firstErrorMessage,
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
