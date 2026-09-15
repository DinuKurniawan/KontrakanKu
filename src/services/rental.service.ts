import { rentalRepository } from '@/repositories/rental.repository'
import { unitRepository } from '@/repositories/unit.repository'
import { userRepository } from '@/repositories/user.repository'
import { assignTenantSchema, endRentalSchema, AssignTenantInput, EndRentalInput } from '@/lib/validations/rental'
import { ActionResult } from '@/types'

export const rentalService = {
  /**
   * Menugaskan Penyewa ke Unit Kamar (PRD Sec 13, 60 Rule 1 & Sec 61)
   */
  async assignTenant(input: AssignTenantInput, adminUserId: string): Promise<ActionResult> {
    const validated = assignTenantSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi data penugasan sewa gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const { userId, unitId, startDate, endDate, monthlyRent, notes, generateInitialInvoice } = validated.data

    // 1. Cek user
    const tenant = await userRepository.findById(userId)
    if (!tenant) {
      return { success: false, error: 'Penyewa yang dipilih tidak ditemukan.' }
    }

    // 2. Cek unit
    const unit = await unitRepository.findById(unitId)
    if (!unit) {
      return { success: false, error: 'Unit kamar yang dipilih tidak ditemukan.' }
    }

    // 3. Rule 1 Occupancy Check
    if (unit.status === 'OCCUPIED') {
      return {
        success: false,
        error: `Unit "${unit.name}" sedang berstatus TERISI (Occupied) dan tidak dapat disewakan lagi.`,
      }
    }

    const finalRent = monthlyRent !== undefined ? monthlyRent : unit.monthlyRent.toNumber()

    try {
      const rental = await rentalRepository.assignTenantTransaction({
        userId,
        unitId,
        startDate,
        endDate,
        monthlyRent: finalRent,
        notes,
        generateInitialInvoice,
        adminUserId,
      })

      return { success: true, data: rental }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menugaskan penyewa'
      return { success: false, error: message }
    }
  },

  /**
   * Mengakhiri Kontrak Sewa (PRD Sec 36 & 60)
   */
  async endRental(input: EndRentalInput, adminUserId: string): Promise<ActionResult> {
    const validated = endRentalSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validasi gagal.',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    try {
      const rental = await rentalRepository.endRentalTransaction(
        validated.data.rentalId,
        adminUserId,
        validated.data.reason
      )
      return { success: true, data: rental }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengakhiri kontrak sewa'
      return { success: false, error: message }
    }
  },
}
