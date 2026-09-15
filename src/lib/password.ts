import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/**
 * Hash password secara aman menggunakan bcrypt dengan 12 salt rounds (PRD Sec 28 & 43.6)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verifikasi password plaintext terhadap hash bcrypt
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
