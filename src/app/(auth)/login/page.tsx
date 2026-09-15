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
  ArrowUpRight,
  Receipt,
  FileText,
  ShieldCheck,
  KeyRound,
  Check,
  Clock3,
  PhoneCall,
} from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Receipt, title: 'Tagihan transparan', desc: 'Nominal & jatuh tempo jelas — cek kapan saja dari HP.' },
  { icon: FileText, title: 'Bukti terarsip', desc: 'Upload transfer, status LUNAS tercatat permanen.' },
  { icon: ShieldCheck, title: 'Akses pribadi', desc: 'Hanya Anda yang bisa lihat tagihan & riwayat Anda.' },
]

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const redirectedRef = useRef(false)

  // Toast gagal: email/password salah, validasi, rate-limit
  useEffect(() => {
    if (state?.error && !state?.success) {
      toast.error(state.error, { toastId: 'login-error' })
    }
  }, [state?.error, state?.success])

  // Toast sukses admin & user, lalu redirect sesuai role
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
    // Reset flag jika state kembali error (user coba lagi)
    if (!state?.success) {
      redirectedRef.current = false
    }
  }, [state?.success, state?.redirectUrl, state?.message, router])

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0F1F33] flex flex-col selection:bg-[#C8A46A]/30">
      {/* ink rule */}
      <div className="h-[6px] w-full bg-[#0F1F33] relative shrink-0">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#C8A46A]/60" />
      </div>

      {/* Header — same identity as homepage */}
      <header className="sticky top-0 z-30 bg-[#FFFBF0]/92 backdrop-blur-[10px] border-b-[1.5px] border-[#0F1F33]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[11px] bg-[#0F1F33] text-[#FFFBF0] shadow-[0_2px_10px_rgba(15,31,51,0.18)] group-hover:bg-[#115E59] transition-colors">
              <KeyRound className="h-[18px] w-[18px] -rotate-45" strokeWidth={2.2} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#C8A46A] ring-2 ring-[#FFFBF0]" aria-hidden />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[17px] font-[800] tracking-[-0.02em]">Kelola Kontrakan</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#0F1F33]/60">Cilandak · Est 2018</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 border border-[#E9E5DD] bg-white px-3 py-2.5 font-mono text-xs hover:border-[#0F1F33] transition"
          >
            <ArrowUpRight className="h-3.5 w-3.5 rotate-180" /> Beranda
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* ledger eyebrow */}
          <div className="flex flex-wrap items-center gap-3 border-b-[1.5px] border-[#0F1F33] pb-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="h-2 w-2 bg-[#D93D30]" aria-hidden />
              Buku Kontrakan — Portal Penyewa
              <span className="hidden sm:inline text-[#0F1F33]/40"> / Masuk untuk kelola tagihan</span>
            </span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/60">
              <Clock3 className="h-3 w-3" /> Sesi 7 hari · HttpOnly
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-8 pt-6 sm:pt-8">
            {/* LEFT — editorial */}
            <div className="col-span-12 lg:col-span-7">
              <h1 className="font-display text-[42px] sm:text-[56px] lg:text-[62px] font-[900] leading-[0.86] tracking-[-0.045em]">
                <span className="block">Masuk.</span>
                <span className="block text-outline">Kelola.</span>
                <span className="block">
                  Tertata<span className="text-[#D93D30]">.</span>
                </span>
              </h1>
              <p className="mt-4 max-w-[48ch] text-[15.5px] leading-7 text-[#0F1F33]/70">
                Portal pribadi penyewa — cek tagihan bulanan, kirim bukti transfer dari HP, dan lihat arsip cap <span className="font-semibold text-[#D93D30]">LUNAS</span> setelah diverifikasi admin. Tanpa grup WA yang tenggelam.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 border border-[#0F1F33] bg-white px-2.5 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#115E59]" /> Enkripsi bcrypt 12-round
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#0F1F33] px-2.5 py-1.5 text-white">
                  <Check className="h-3.5 w-3.5 text-[#C8A46A]" /> Verifikasi manusia &lt;24 jam
                </span>
                <a
                  href="https://wa.me/6281384634526?text=Halo%20Pengelola%20Kelola%20Kontrakan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#C8A46A] bg-[#FFFBF0] px-2.5 py-1.5 hover:border-[#0F1F33] transition"
                >
                  <PhoneCall className="h-3 w-3" /> Butuh bantuan? WA pengelola
                </a>
              </div>

              {/* highlights as ledger cards */}
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HIGHLIGHTS.map((h) => {
                  const Icon = h.icon
                  return (
                    <li key={h.title} className="border-[1.5px] border-[#0F1F33] bg-white p-3.5 flex flex-col gap-2">
                      <span className="flex h-8 w-8 items-center justify-center bg-[#0F1F33] text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-display text-sm font-bold leading-tight">{h.title}</span>
                      <span className="text-xs leading-5 text-[#0F1F33]/65">{h.desc}</span>
                    </li>
                  )
                })}
              </ul>

              {/* Mini kwitansi preview — visual trust */}
              <div className="mt-6 hidden sm:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0F1F33]/60 mb-2">Preview setelah masuk →</p>
                <div className="relative overflow-hidden border-[1.5px] border-[#0F1F33] bg-white shadow-[4px_4px_0_rgba(15,31,51,0.10)] max-w-[420px]">
                  <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-white border-r border-dashed border-[#0F1F33]/25 flex flex-col justify-around items-center py-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="h-[6px] w-[6px] rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                    ))}
                  </div>
                  <div className="pl-[18px]">
                    <div className="flex items-center justify-between border-b border-[#0F1F33] px-3 py-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                        <span className="h-2 w-2 bg-[#D93D30]" /> INV-2026-09-014
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-600 px-1.5 py-0.5 font-bold text-white">BELUM BAYAR</span>
                    </div>
                    <div className="px-3 py-3 space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Periode</span><span className="font-mono text-xs font-semibold">September 2026</span></div>
                      <div className="flex justify-between"><span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Jatuh tempo</span><span className="font-mono text-xs">10 Sep 2026</span></div>
                      <div className="flex items-baseline justify-between border-t border-dashed border-[#0F1F33]/15 pt-2 mt-2">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Tagihan</span><span className="font-display text-lg font-[800]">Rp1.500.000</span>
                      </div>
                    </div>
                    <div className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-3 py-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wide">Tap untuk bayar → upload bukti</span>
                      <span className="font-mono text-[10px] text-[#0F1F33]/50">Portal penyewa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form card */}
            <div className="col-span-12 lg:col-span-5 lg:pl-2">
              <div className="relative">
                <div className="relative overflow-hidden border-[1.5px] border-[#0F1F33] bg-white shadow-[6px_6px_0_rgba(15,31,51,0.12)]">
                  {/* perforated */}
                  <div className="absolute left-0 top-0 bottom-0 hidden sm:flex w-[14px] bg-white border-r border-dashed border-[#0F1F33]/25 flex-col justify-around items-center py-3">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span key={i} className="h-[7px] w-[7px] rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                    ))}
                  </div>

                  <div className="sm:pl-[18px]">
                    {/* card header */}
                    <div className="flex items-center justify-between border-b-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-4 sm:px-5 py-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                        <span className="flex h-6 w-6 items-center justify-center bg-[#0F1F33] text-white">
                          <FileText className="h-3 w-3" />
                        </span>
                        Formulir Masuk
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/50">No. RM-01 · 2026</span>
                    </div>

                    <div className="px-4 sm:px-6 py-6 sm:py-7">
                      <h2 className="font-display text-[20px] font-[800] tracking-[-0.02em] leading-none">Masuk ke akun Anda</h2>
                      <p className="mt-1.5 text-sm leading-6 text-[#0F1F33]/60">Gunakan email yang terdaftar saat akad sewa.</p>

                      {state?.error && (
                        <div className="mt-5 flex gap-2.5 border-l-[3px] border-[#D93D30] bg-[#D93D30]/[0.06] px-3.5 py-3">
                          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#D93D30]" />
                          <div className="text-sm leading-6 text-[#0F1F33]">
                            <span className="font-bold">Gagal masuk — </span>
                            <span className="text-[#0F1F33]/80">{state.error}</span>
                          </div>
                        </div>
                      )}

                      <form action={formAction} className="mt-6 space-y-4">
                        <div>
                          <label htmlFor="email" className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F1F33]">
                            <span>Alamat Email</span>
                            <span className="text-[10px] font-normal tracking-wide text-[#0F1F33]/40">wajib</span>
                          </label>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1F33]/35" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              placeholder="nama@email.com"
                              defaultValue={(state as unknown as { values?: { email?: string } })?.values?.email ?? ''}
                              aria-invalid={!!state?.fieldErrors?.email}
                              aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
                              className="block w-full border-[1.5px] border-[#0F1F33] bg-white py-[11px] pl-10 pr-3 font-mono text-sm text-[#0F1F33] placeholder:text-[#0F1F33]/30 focus:bg-[#FFFBF0] focus:outline-none focus:ring-0 transition"
                            />
                          </div>
                          {state?.fieldErrors?.email && (
                            <p id="email-error" className="mt-1.5 font-mono text-xs text-[#D93D30]">{state.fieldErrors.email[0]}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="password" className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0F1F33]">
                            <span>Kata Sandi</span>
                            <span className="text-[10px] font-normal tracking-wide text-[#0F1F33]/40">min. 6 karakter</span>
                          </label>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1F33]/35" />
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              required
                              placeholder="••••••••"
                              aria-invalid={!!state?.fieldErrors?.password}
                              aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
                              className="block w-full border-[1.5px] border-[#0F1F33] bg-white py-[11px] pl-10 pr-10 font-mono text-sm text-[#0F1F33] placeholder:text-[#0F1F33]/30 focus:bg-[#FFFBF0] focus:outline-none focus:ring-0 transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#0F1F33]/40 hover:text-[#0F1F33] transition"
                              tabIndex={-1}
                              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {state?.fieldErrors?.password && (
                            <p id="password-error" className="mt-1.5 font-mono text-xs text-[#D93D30]">{state.fieldErrors.password[0]}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isPending}
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-[#0F1F33] px-5 py-[13px] font-mono text-sm font-bold uppercase tracking-wide text-white hover:bg-[#115E59] disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Memverifikasi...
                            </>
                          ) : (
                            <>
                              Masuk ke Portal <ArrowUpRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <p className="text-center font-mono text-[11px] leading-5 text-[#0F1F33]/50">
                          Dengan masuk, Anda menyetujui pencatatan sesi aman selama 7 hari.
                        </p>
                      </form>

                      <div className="mt-6 flex items-center gap-3 border-t border-dashed border-[#0F1F33]/15 pt-5 font-mono text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#0F1F33]/60">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#115E59]" /> Koneksi aman
                        </span>
                      </div>
                    </div>

                    {/* footer dotted */}
                    <div className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-4 sm:px-6 py-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 bg-emerald-600" aria-hidden /> Buku besar disimpan permanen
                      </span>
                      <span className="font-mono text-[10px] text-[#0F1F33]/50">Cilandak · Jakarta</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center font-mono text-[11px] leading-4 text-[#0F1F33]/50 sm:text-left">
                  Admin demo: <span className="font-semibold text-[#0F1F33]">admin@kontrakan.com / Admin123!</span> → /admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-6 border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-4 sm:px-6 lg:px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan</p>
          <p className="font-mono text-[11px] text-[#0F1F33]/45">Data penyewa tidak dibagikan · Audit log tercatat</p>
        </div>
      </footer>
    </div>
  )
}
