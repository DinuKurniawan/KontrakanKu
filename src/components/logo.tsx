interface LogoProps {
  /** Ukuran sisi logo dalam px */
  size?: number
  className?: string
}

/**
 * Logo "Kontrakan" — monogram K putih di atas rounded-square emerald.
 * SVG inline agar tajam di semua ukuran tanpa request tambahan.
 */
export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kk-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#kk-logo-bg)" />
        <path
          d="M26 16v32M44 16 26 32l19 16"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function LogoWithText({
  size = 40,
  textClassName = 'text-xl font-semibold text-stone-800 tracking-tight',
}: {
  size?: number
  textClassName?: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logo size={size} />
      <span className={textClassName}>Kontrakan</span>
    </span>
  )
}
