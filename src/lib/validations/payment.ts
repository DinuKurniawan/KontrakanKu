import { z } from 'zod'
import { idSchema, rupiahAmountSchema } from './common'
import { sanitizeText } from './sanitizer'

export const submitPaymentSchema = z.object({
  invoiceId: idSchema,
  paymentAccountId: idSchema.optional().nullable(),
  amount: rupiahAmountSchema,
  transferDate: z.coerce
    .date({ message: 'Tanggal transfer tidak valid' })
    .refine(
      date => {
        // Toleransi buffer 24 jam untuk perbedaan zona waktu
        const futureLimit = new Date(Date.now() + 24 * 60 * 60 * 1000)
        return date <= futureLimit
      },
      'Tanggal transfer tidak boleh berada di masa depan'
    ),
  senderBank: z
    .string()
    .min(2, 'Nama bank pengirim minimal 2 karakter')
    .max(50, 'Nama bank pengirim maksimal 50 karakter')
    .transform(val => sanitizeText(val)),
  senderName: z
    .string()
    .min(2, 'Nama pemilik rekening pengirim minimal 2 karakter')
    .max(100, 'Nama pemilik rekening pengirim maksimal 100 karakter')
    .transform(val => sanitizeText(val)),
  proofFileUrl: z
    .string()
    .min(1, 'Bukti transfer wajib diunggah')
    .refine(
      val => val.startsWith('/') || /^https?:\/\//.test(val),
      'Format URL atau lokasi berkas bukti transfer tidak valid'
    ),
  notes: z
    .string()
    .max(500, 'Catatan pembayaran maksimal 500 karakter')
    .nullish()
    .transform(val => (val ? sanitizeText(val) : undefined))
    .optional(),
})

export const verifyPaymentSchema = z.object({
  paymentId: idSchema,
  action: z.enum(['APPROVE', 'REJECT']),
  rejectionReason: z
    .string()
    .optional()
    .transform(val => (val ? sanitizeText(val) : '')),
}).refine(data => {
  if (data.action === 'REJECT') {
    return !!data.rejectionReason && data.rejectionReason.trim().length >= 5
  }
  return true
}, {
  message: 'Alasan penolakan wajib diisi (minimal 5 karakter)',
  path: ['rejectionReason'],
})

export const paymentAccountSchema = z.object({
  bankName: z
    .string()
    .min(2, 'Nama bank minimal 2 karakter')
    .max(50, 'Nama bank maksimal 50 karakter')
    .transform(val => sanitizeText(val)),
  accountNumber: z
    .string()
    .min(5, 'Nomor rekening minimal 5 digit')
    .max(30, 'Nomor rekening maksimal 30 digit')
    .regex(/^[0-9-]+$/, 'Nomor rekening hanya boleh berisi angka dan tanda hubung')
    .trim(),
  accountName: z
    .string()
    .min(2, 'Nama pemilik rekening minimal 2 karakter')
    .max(100, 'Nama pemilik rekening maksimal 100 karakter')
    .transform(val => sanitizeText(val)),
  qrCodeUrl: z
    .string()
    .nullish()
    .refine(
      val => !val || val.startsWith('/') || /^https?:\/\//.test(val),
      'Format URL atau lokasi QR Code tidak valid'
    )
    .optional(),
  isActive: z.boolean().default(true),
})

export const updatePaymentAccountSchema = paymentAccountSchema.partial()

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
export type PaymentAccountInput = z.infer<typeof paymentAccountSchema>
export type UpdatePaymentAccountInput = z.infer<typeof updatePaymentAccountSchema>

