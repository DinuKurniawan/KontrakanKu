/**
 * Logo resmi bank / e-wallet Indonesia (berkas SVG lokal di `public/banks/`,
 * bersumber dari Wikimedia Commons — logo milik masing-masing penerbit).
 * Dipakai di daftar rekening agar tiap bank tampil dengan logo aslinya.
 */
export interface BankBrand {
  /** Path logo lokal (mis. "/banks/bca.svg"). Kosong bila tidak ada logo. */
  logo?: string
  /** Kode singkat untuk fallback tile, mis. "BCA" */
  code: string
  /** Kelas warna tile fallback (bg + text) */
  tile: string
}

const RULES: { keywords: string[]; brand: BankBrand }[] = [
  { keywords: ['qris'], brand: { logo: '/banks/qris.svg', code: 'QRIS', tile: 'bg-red-600 text-white' } },
  { keywords: ['e-wallet', 'e wallet', 'ewallet'], brand: { code: 'E-W', tile: 'bg-violet-600 text-white' } },
  { keywords: ['bca'], brand: { logo: '/banks/bca.svg', code: 'BCA', tile: 'bg-blue-800 text-white' } },
  { keywords: ['mandiri'], brand: { logo: '/banks/mandiri.svg', code: 'MDR', tile: 'bg-blue-900 text-amber-300' } },
  { keywords: ['bri'], brand: { logo: '/banks/bri.svg', code: 'BRI', tile: 'bg-sky-700 text-white' } },
  { keywords: ['bni'], brand: { logo: '/banks/bni.svg', code: 'BNI', tile: 'bg-orange-600 text-white' } },
  { keywords: ['bsi', 'syariah'], brand: { logo: '/banks/bsi.svg', code: 'BSI', tile: 'bg-emerald-700 text-white' } },
  { keywords: ['cimb', 'niaga'], brand: { logo: '/banks/cimb.svg', code: 'CIMB', tile: 'bg-red-600 text-white' } },
  { keywords: ['permata'], brand: { logo: '/banks/permata.svg', code: 'PRM', tile: 'bg-teal-600 text-white' } },
  { keywords: ['danamon'], brand: { logo: '/banks/danamon.svg', code: 'DNM', tile: 'bg-yellow-500 text-stone-900' } },
  { keywords: ['jago'], brand: { logo: '/banks/jago.svg', code: 'JGO', tile: 'bg-amber-300 text-stone-900' } },
  { keywords: ['jenius'], brand: { code: 'JNS', tile: 'bg-cyan-500 text-white' } },
  { keywords: ['seabank', 'sea bank'], brand: { code: 'SEA', tile: 'bg-red-500 text-white' } },
  { keywords: ['btn'], brand: { logo: '/banks/btn.svg', code: 'BTN', tile: 'bg-blue-500 text-white' } },
  { keywords: ['mega'], brand: { code: 'MEGA', tile: 'bg-amber-600 text-white' } },
  { keywords: ['panin'], brand: { code: 'PNB', tile: 'bg-sky-600 text-white' } },
  { keywords: ['ocbc'], brand: { code: 'OCBC', tile: 'bg-red-700 text-white' } },
  { keywords: ['maybank', 'may bank'], brand: { code: 'MBM', tile: 'bg-amber-400 text-stone-900' } },
  { keywords: ['uob'], brand: { code: 'UOB', tile: 'bg-blue-700 text-white' } },
  { keywords: ['bjb'], brand: { code: 'BJB', tile: 'bg-emerald-600 text-white' } },
  { keywords: ['dana'], brand: { logo: '/banks/dana.svg', code: 'DANA', tile: 'bg-sky-500 text-white' } },
  { keywords: ['ovo'], brand: { logo: '/banks/ovo.svg', code: 'OVO', tile: 'bg-purple-700 text-white' } },
  { keywords: ['gopay', 'go-pay', 'go pay'], brand: { logo: '/banks/gopay.svg', code: 'GP', tile: 'bg-teal-500 text-white' } },
  { keywords: ['shopee', 'shopeepay'], brand: { code: 'SP', tile: 'bg-orange-500 text-white' } },
  { keywords: ['linkaja', 'link aja'], brand: { code: 'LA', tile: 'bg-red-500 text-white' } },
]

/**
 * Petakan nama bank/saluran menjadi brand (logo + fallback).
 * Fallback: inisial kata (maks 3 huruf) dengan tile gelap netral.
 */
export function getBankBrand(bankName: string): BankBrand {
  const normalized = (bankName ?? '').toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.brand
    }
  }
  const initials = (bankName ?? '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3)
  return {
    code: initials || 'BNK',
    tile: 'bg-stone-900 text-white',
  }
}
