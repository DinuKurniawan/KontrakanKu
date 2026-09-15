import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number | string | bigint | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp0'
  const numeric = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (isNaN(numeric)) return 'Rp0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function formatDateID(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatBillingPeriod(period: string): string {
  // input: "2026-09" -> "September 2026"
  if (!period || !period.includes('-')) return period
  const [year, month] = period.split('-')
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}
