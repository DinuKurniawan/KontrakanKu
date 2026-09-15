import { userRepository } from '@/repositories/user.repository'
import { auditRepository } from '@/repositories/audit.repository'
import { rentalService } from '@/services/rental.service'
import { hashPassword, verifyPassword } from '@/lib/password'
import {
  updateProfileSchema,
  changePasswordSchema,
  adminCreateTenantSchema,
  UpdateProfileInput,
  ChangePasswordInput,
  AdminCreateTenantInput,
} from '@/lib/validations/user'
import { ActionResult } from '@/types'
import { UserRole } from '@prisma/client'

export const userService = {
  /**
   * Update Profile Pengguna (PRD Sec 4.1 & 4.2)
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<ActionResult> {
    const validated = updateProfileSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi profil gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    try {
      const user = await userRepository.update(userId, {
        name: validated.data.name,
        phone: validated.data.phone,
        avatarUrl: validated.data.avatarUrl,
      })

      await auditRepository.log({
        action: 'USER_UPDATED',
        entityType: 'User',
        entityId: userId,
        userId: userId,
        metadata: { name: user.name, phone: user.phone },
      })

      return { success: true, data: user }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil'
      return { success: false, error: message }
    }
  },

  /**
   * Ubah Password Pengguna (PRD Sec 28 & 43.6)
   */
  async changePassword(userId: string, input: ChangePasswordInput): Promise<ActionResult> {
    const validated = changePasswordSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validasi kata sandi gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const user = await userRepository.findWithPasswordHash(userId)
    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan.' }
    }

    const isMatch = await verifyPassword(validated.data.currentPassword, user.passwordHash)
    if (!isMatch) {
      return {
        success: false,
        error: 'Kata sandi saat ini salah.',
        fieldErrors: { currentPassword: ['Kata sandi saat ini tidak sesuai'] },
      }
    }

    try {
      const newHash = await hashPassword(validated.data.newPassword)
      await userRepository.updatePassword(userId, newHash)

      await auditRepository.log({
        action: 'PASSWORD_CHANGED',
        entityType: 'User',
        entityId: userId,
        userId: userId,
      })

      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah kata sandi'
      return { success: false, error: message }
    }
  },

  /**
   * Admin Membuat Akun Penyewa Baru (PRD Sec 12 & 61)
   */
  async adminCreateTenant(adminUserId: string, input: AdminCreateTenantInput): Promise<ActionResult> {
    const validated = adminCreateTenantSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validasi data penyewa gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const existing = await userRepository.findByEmail(validated.data.email)
    if (existing) {
      return {
        success: false,
        error: `Alamat email "${validated.data.email}" sudah ada dalam sistem.`,
        fieldErrors: { email: ['Email sudah digunakan oleh akun lain'] },
      }
    }

    // Gunakan password yang ditentukan admin atau fallback default yang aman
    const rawPassword = validated.data.initialPassword || 'Penyewa123!'
    const passwordHash = await hashPassword(rawPassword)

    try {
      const newUser = await userRepository.create({
        name: validated.data.name,
        email: validated.data.email,
        passwordHash,
        role: UserRole.USER,
        phone: validated.data.phone,
      })

      await auditRepository.log({
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: newUser.id,
        userId: adminUserId,
        metadata: { name: newUser.name, email: newUser.email },
      })

      // Jika langsung ditugaskan ke unit (PRD Sec 61 Main Workflow - New Tenant)
      if (validated.data.unitId) {
        const rentalResult = await rentalService.assignTenant(
          {
            userId: newUser.id,
            unitId: validated.data.unitId,
            startDate: validated.data.startDate || new Date(),
            generateInitialInvoice: true,
          },
          adminUserId
        )

        return {
          success: true,
          data: {
            user: newUser,
            rental: rentalResult.data,
          },
        }
      }

      return { success: true, data: { user: newUser } }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat akun penyewa'
      return { success: false, error: message }
    }
  },
}
