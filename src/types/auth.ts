import { UserRole } from '@prisma/client'

export interface SessionPayload {
  userId: string
  role: UserRole
  email: string
  sessionId: string
  expiresAt: string // ISO string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string | null
  avatarUrl?: string | null
  createdAt: Date
}

export interface AuthResult {
  success: boolean
  user?: CurrentUser
  error?: string
}
