'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { loginAction } from './actions'
import {
  ArrowLeft,
  ArrowRight,
  Home,
  ShieldCheck,
  ReceiptText,
  Zap,
  Shield,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CircleAlert,
  Smartphone,
  KeyRound,
  CircleHelp,
  MessageCircle,
  Leaf,
} from 'lucide-react'

const WA_RESET =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20lupa%20email%20atau%20kata%20sandi%20akun%20saya'

type Role = 'penyewa' | 'pengelola'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>('penyewa')
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0b1f19]">
      {/* ——— Background foto + glow ——— */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <img
          alt=""
          src="https://lh3.googleusercontent.com/aida/AEtjO1UWCFlz3JNvfA5FgXjuqlGrvKgZAoRANeE3lqtQ-M7fvCWidhwK9Ng5RB_faT6aNX_RZk6M0mW2_Mr5DWT2PfFvWhw2rqywgxVvOVQjpHbHedl796affrMZ8hjQaByGFfiY7C1LjCubF1NTEhaxrDXg6xDnGypMu-bpRfOHx9fQbsLDhkVitBc4kddWUrfKuevVJHxGuBXz9joGSNjaWd5Ik4GtDHBOnFdl9xOFVXI"
          className="h-full w-full scale-105 object-cover object-center opacity-35 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f19]/90 via-[#0b1f19]/80 to-[#0b1f19]/95" />
      </div>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 h-[480px] w-[480px] rounded-full bg-amber-400/15 blur-[140px]" />
        <div className="absolute -bottom-24 left-1/3 h-[600px] w-[600px] rounded-full bg-teal-600/20 blur-[130px]" />
      </div>

      {/* ——— Nav kaca ——— */}
      <div className="z-20 mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 pb-2 pt-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex transform items-center gap-2 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-[13px] font-semibold text-[#013428] shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:-translate-x-0.5 hover:border-white hover:bg-white"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
          Kembali ke Beranda Utama
        </Link>
        <div className="hidden items-center gap-2.5 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Cilandak, Jakarta Selatan
        </div>
      </div>

      {/* ——— Kartu utama ——— */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-6 lg:px-8 lg:py-10">
        <div className="w-full max-w-[1140px] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all">
          <div className="grid min-h-[660px] grid-cols-1 lg:grid-cols-12">
            {/* ——— Kiri: showcase ——— */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#013428] via-[#084536] to-[#0d5342] p-6 text-white lg:col-span-5 lg:p-8">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[17px] font-bold leading-tight tracking-wide text-white">
                        KELOLA KONTRAKAN
                      </span>
                      <span className="text-[11px] font-medium text-emerald-200/90">
                        Cilandak, Jakarta Selatan
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                    Portal Resmi
                  </span>
                </div>

                <div className="mt-1 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-300">
                    <Leaf className="h-4 w-4" />
                    Hunian Terawat & Bersahabat
                  </div>
                  <h1 className="text-[26px] font-bold leading-tight tracking-tight text-white lg:text-[28px]">
                    Selamat Datang di Portal Hunian
                  </h1>
                  <p className="text-[13px] leading-relaxed text-emerald-100/80">
                    Pusat kelola sewa terpadu, konfirmasi pembayaran bulanan,
                    pantau tagihan, serta keamanan hunian keluarga terpercaya.
                  </p>
                </div>

                <div className="mt-1 flex flex-col gap-2.5">
                  {[
                    { icon: ReceiptText, grad: 'from-emerald-400 to-teal-600', t: 'Transparansi Tagihan', s: 'Histori & bukti pembayaran tersimpan rapi' },
                    { icon: Zap, grad: 'from-amber-400 to-orange-500', t: 'Verifikasi < 24 Jam', s: 'Bukti dicek pengelola satu per satu' },
                    { icon: Shield, grad: 'from-teal-400 to-emerald-700', t: 'Akses Aman Terverifikasi', s: 'Akun dibuatkan pengelola saat akad' },
                  ].map((v) => {
                    const Icon = v.icon
                    return (
                      <div
                        key={v.t}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.08] p-2.5 backdrop-blur-md transition-all hover:bg-white/[0.12]"
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${v.grad} shadow-sm`}>
                          <Icon className="h-[18px] w-[18px] text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-white">{v.t}</span>
                          <span className="text-[11px] text-emerald-100/70">{v.s}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="relative z-10 mt-5 rounded-xl border-t border-white/15 bg-white/[0.06] p-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br from-amber-400 to-[#974723] text-sm font-bold text-white shadow-md">
                    PG
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-bold text-white">
                        Pengelola Kontrakan
                      </span>
                      <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] italic text-emerald-100/80">
                      &ldquo;Kenyamanan dan ketenteraman penghuni adalah amanah
                      utama kami.&rdquo;
                    </p>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Pengelola Langsung & Siap Dihubungi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ——— Kanan: form ——— */}
            <div className="flex flex-col justify-center bg-white/95 p-6 backdrop-blur-md lg:col-span-7 lg:p-8">
              <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <div className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-[#013428]">
                    <Lock className="h-[18px] w-[18px]" />
                    Portal Masuk Terverifikasi
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#181c1b] lg:text-[26px]">
                    Masuk ke Akun Anda
                  </h2>
                  <p className="text-[13.5px] text-[#404945]">
                    Pilih peran akun untuk membuka akses unit hunian Anda
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[#c0c8c3]/40 bg-[#f1f4f1] p-1.5 shadow-inner" role="tablist" aria-label="Jenis akun">
                  {(
                    [
                      { key: 'penyewa', label: 'Penghuni / Warga', icon: Home },
                      { key: 'pengelola', label: 'Pengelola / Pemilik', icon: ShieldCheck },
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon
                    const active = role === tab.key
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRole(tab.key)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
                          active
                            ? 'border border-emerald-900/10 bg-white text-[#013428] shadow-sm'
                            : 'text-[#404945] hover:bg-white/50 hover:text-[#181c1b]'
                        }`}
                      >
                        <Icon className="h-[19px] w-[19px]" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50 px-3 py-1.5 text-[12.5px] text-emerald-900">
                  <span className="flex items-center gap-2">
                    <KeyRound className="h-[17px] w-[17px] text-[#013428]" />
                    <span className="font-medium">
                      {role === 'penyewa'
                        ? 'Portal Penghuni Unit Kontrakan'
                        : 'Konsol Administrasi Pengelola'}
                    </span>
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-[#013428]">
                    Tersinkronisasi
                  </span>
                </div>

                {state?.error && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div className="text-sm leading-6 text-red-950">
                      <span className="font-bold">Gagal masuk — </span>
                      {state.error}
                    </div>
                  </div>
                )}

                <form action={formAction} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="flex items-center justify-between text-[13px] font-semibold text-[#181c1b]">
                      {role === 'penyewa' ? 'Email Penghuni' : 'Email Pengelola'}
                      <span className="rounded bg-[#bdeddb]/30 px-2 py-0.5 text-[11px] font-medium text-[#013428]">
                        Wajib Diisi
                      </span>
                    </label>
                    <div className="group relative flex items-center">
                      <div className="pointer-events-none absolute left-3.5 flex items-center text-emerald-900/50 transition-colors group-focus-within:text-[#013428]">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="nama@email.com"
                        defaultValue={(state as unknown as { values?: { email?: string } })?.values?.email ?? ''}
                        aria-invalid={!!state?.fieldErrors?.email}
                        className="w-full rounded-xl border border-[#c0c8c3]/60 bg-white py-2.5 pl-11 pr-4 text-[14px] text-[#181c1b] shadow-sm outline-none transition-all placeholder:text-[#717975]/60 focus:border-[#1e4b3e] focus:ring-2 focus:ring-[#1e4b3e]/20"
                      />
                    </div>
                    {state?.fieldErrors?.email && (
                      <p className="text-xs font-medium text-red-600">{state.fieldErrors.email[0]}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-[13px] font-semibold text-[#181c1b]">
                        Kata Sandi
                      </label>
                      <a
                        href={WA_RESET}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#013428] transition-colors hover:text-emerald-800"
                      >
                        <CircleHelp className="h-[15px] w-[15px]" />
                        Lupa Sandi?
                      </a>
                    </div>
                    <div className="group relative flex items-center">
                      <div className="pointer-events-none absolute left-3.5 flex items-center text-emerald-900/50 transition-colors group-focus-within:text-[#013428]">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        placeholder="Masukkan kata sandi akun Anda"
                        className="w-full rounded-xl border border-[#c0c8c3]/60 bg-white py-2.5 pl-11 pr-11 text-[14px] text-[#181c1b] shadow-sm outline-none transition-all placeholder:text-[#717975]/60 focus:border-[#1e4b3e] focus:ring-2 focus:ring-[#1e4b3e]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                        className="absolute right-3 flex items-center justify-center rounded-md p-1 text-[#404945] transition-colors hover:text-[#181c1b]"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {state?.fieldErrors?.password && (
                      <p className="text-xs font-medium text-red-600">{state.fieldErrors.password[0]}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex cursor-pointer select-none items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-[#c0c8c3] bg-white text-[#013428] focus:ring-[#013428] focus:ring-offset-0"
                      />
                      <span className="text-[13px] font-medium text-[#404945]">
                        Ingat saya di perangkat ini
                      </span>
                    </label>
                    <span className="flex items-center gap-1 text-[12px] font-medium text-[#404945]/80">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Enkripsi SSL 256-bit
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group mt-1 flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#013428] px-6 py-3 text-[15px] font-bold text-white shadow-[0_6px_20px_-3px_rgba(1,52,40,0.4)] transition-all hover:bg-[#084536] hover:shadow-[0_8px_25px_-2px_rgba(1,52,40,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Memverifikasi Akun...
                      </>
                    ) : (
                      <>
                        {role === 'penyewa' ? 'Masuk Sebagai Penghuni' : 'Masuk Dashboard Pengelola'}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-50/70 to-teal-50/60 p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-[18px] w-[18px] text-[#013428]" />
                        <span className="text-[12.5px] font-bold text-[#013428]">
                          Kendala Akses atau Lupa Akun?
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-800">Layanan Cepat</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#404945]">
                      Untuk menjaga privasi dan keamanan hunian, pemulihan akun
                      dilakukan langsung melalui verifikasi pengelola.
                    </p>
                    <a
                      href={WA_RESET}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-900/15 bg-white px-3 py-2 text-[12.5px] font-semibold text-[#013428] shadow-sm transition-all hover:bg-emerald-800 hover:text-white"
                    >
                      <MessageCircle className="h-[17px] w-[17px] text-emerald-600" />
                      Hubungi Pengelola via WhatsApp
                    </a>
                  </div>
                </form>

                <div className="pt-1 text-center">
                  <span className="text-[12.5px] text-[#404945]">
                    Belum memiliki akun sewa unit?{' '}
                  </span>
                  <Link
                    href="/kontrakan"
                    className="text-[12.5px] font-bold text-[#013428] hover:underline"
                  >
                    Tanya Ketersediaan Unit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Footer ringkas ——— */}
      <footer className="z-10 mt-auto w-full border-t border-white/10 bg-black/40 py-4 text-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-2 px-4 text-[12.5px] sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Kelola Kontrakan</span>
            <span className="text-white/40">•</span>
            <span>Dikelola langsung pengelola</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <span>Cilandak, Jakarta Selatan</span>
            <span className="text-white/40">•</span>
            <span>WhatsApp: 0813-8463-4526</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
