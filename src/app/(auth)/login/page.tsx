'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { loginAction } from './actions'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  CircleAlert,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Check,
} from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (state?.error && !state?.success) {
      toast.error(state.error, { toastId: 'login-error' })
    }
  }, [state?.error, state?.success])

  useEffect(() => {
    if (state?.success && state?.redirectUrl && !redirectedRef.current) {
      redirectedRef.current = true
      toast.success(state.message || 'Login berhasil! Selamat datang kembali.', {
        toastId: 'login-success',
      })
      const target = state.redirectUrl
      const t = setTimeout(() => router.push(target), 1200)
      return () => clearTimeout(t)
    }
    if (!state?.success) {
      redirectedRef.current = false
    }
  }, [state?.success, state?.redirectUrl, state?.message, router])

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-paper lg:flex-row">
      {/* Left — brand panel */}
      <div className="relative hidden w-full min-w-0 flex-col justify-between overflow-hidden border-r hairline bg-pine p-10 text-ink lg:flex lg:w-[46%] xl:w-[44%] xl:p-14">
        <Link href="/" className="relative z-[2] flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-[#121212]">
            <KeyRound className="h-[18px] w-[18px] -rotate-45" strokeWidth={2.2} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#121212] ring-2 ring-gold" aria-hidden />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[17px] font-semibold tracking-tight">Kelola Kontrakan</span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
              Cilandak · Est. 2018
            </span>
          </span>
        </Link>

        <div className="relative z-[2]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">Masuk</p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-medium leading-[1.06] tracking-tight xl:text-5xl">
            Tagihan kontrakan, <em className="font-light italic text-gold">tanpa ribet.</em>
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-7 text-ink/70">
            Cek tagihan bulanan, upload bukti transfer dari HP, dan pantau
            status verifikasi — semua tercatat rapi.
          </p>
          <ul className="mt-8 space-y-3.5">
            {['Tagihan tercatat & real-time', 'Bukti terarsip permanen', 'Verifikasi manual <24 jam'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-ink/85">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 ring-1 ring-ink/20">
                  <Check className="h-3.5 w-3.5 text-gold" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-[2] font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
          Dikelola keluarga · Sejak 2018
        </p>
      </div>

      {/* Right — form */}
      <div className="flex w-full min-w-0 flex-1 flex-col">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="chip font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Beranda
          </Link>
          <span className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fog sm:inline-flex">
            <ShieldCheck className="h-4 w-4 text-fern" /> Koneksi aman
          </span>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="w-full min-w-0 max-w-md lg:max-w-lg">
            <Link href="/" className="flex items-center gap-2.5 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-[#121212]">
                <KeyRound className="h-[18px] w-[18px] -rotate-45" />
              </span>
              <span className="font-display text-[17px] font-semibold tracking-tight">Kelola Kontrakan</span>
            </Link>

            <p className="eyebrow mt-8 lg:mt-0">Selamat datang kembali</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
              Masuk.
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-bark">
              Gunakan email yang terdaftar saat akad sewa.
            </p>

            {state?.error && (
              <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div className="text-sm leading-6 text-red-950">
                  <span className="font-bold">Gagal masuk — </span>
                  {state.error}
                </div>
              </div>
            )}

            <form action={formAction} className="card-dossier !transform-none mt-7 space-y-5 p-6 sm:p-7">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
                  Alamat email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@email.com"
                    defaultValue={(state as unknown as { values?: { email?: string } })?.values?.email ?? ''}
                    aria-invalid={!!state?.fieldErrors?.email}
                    className="field pl-11 !py-3.5"
                  />
                </div>
                {state?.fieldErrors?.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink">
                  Kata sandi
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="field pl-11 pr-12 !py-3.5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-fog transition hover:bg-cream hover:text-ink"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {state?.fieldErrors?.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{state.fieldErrors.password[0]}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-elegant-primary w-full !py-3.5 !text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>

              <div className="rounded-2xl bg-cream/70 px-4 py-3.5 text-center">
                <p className="text-[13px] leading-5 text-bark">
                  Lupa email atau kata sandi?{' '}
                  <a
                    href="https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20lupa%20email%20atau%20kata%20sandi%20akun%20saya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gold underline underline-offset-4"
                  >
                    Hubungi pengelola
                  </a>
                </p>
              </div>
            </form>

            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
              © 2026 Kelola Kontrakan · Data tidak dibagikan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
