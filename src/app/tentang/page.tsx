import Link from 'next/link'
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Check,
  KeyRound,
  PhoneCall,
  Stamp,
  FileText,
  Archive,
  PenLine,
} from 'lucide-react'
import AutoReveal from '@/components/auto-reveal'

export const metadata = {
  title: 'Tentang Kami — Kelola Kontrakan',
  description: 'Kelola Kontrakan — hunian terawat di Jakarta Selatan dengan pengelolaan transparan, pembayaran mudah, dan respon cepat.',
}

const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20mengenai%20kontrakan'

const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
]

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0F1F33] flex flex-col selection:bg-[#C8A46A]/30">
      <div className="h-[6px] w-full bg-[#0F1F33] relative">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#C8A46A]/60" />
      </div>

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
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`rounded-none border px-4 py-2 font-mono text-[13px] font-medium tracking-wide transition ${
                  l.href === '/tentang' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-transparent hover:border-[#0F1F33] hover:bg-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex items-center justify-center bg-[#D93D30] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c2362b] transition">
              Masuk
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex items-center gap-1.5 border border-[#E9E5DD] bg-white px-3 py-2.5 font-mono text-xs hover:border-[#0F1F33] transition">
              <PhoneCall className="h-3 w-3" /> 0813-8463-4526
            </a>
          </div>
        </div>
        <div className="flex md:hidden items-center gap-1 border-t border-[#0F1F33]/10 bg-white px-4 py-2 overflow-x-auto">
          {NAV.map((l) => (
            <Link key={l.label} href={l.href} className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${l.href === '/tentang' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#E9E5DD] bg-[#FFFBF0]'}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0 font-mono text-xs underline underline-offset-4">Masuk</Link>
        </div>
      </header>

      <main className="w-full flex-1">
        <AutoReveal />
        {/* Masthead */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#0F1F33] py-3 font-mono text-[11px] uppercase tracking-[0.14em]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 bg-[#D93D30]" aria-hidden /> Tentang — Arsip / 01
            </span>
            <span className="hidden sm:inline text-[#0F1F33]/50">Kelola Kontrakan — Cilandak</span>
            <span className="inline-flex items-center gap-1.5 text-[#0F1F33]/60">
              <span className="h-1.5 w-1.5 bg-emerald-600" aria-hidden /> Est. 2018
            </span>
          </div>
        </div>

        {/* Hero — Meja Pengelola */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 py-8 lg:py-12">
            <div className="col-span-12 lg:col-span-7">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">
                <Archive className="h-3 w-3" /> Arsip keluarga — bukan brosur properti
              </p>
              <h1 className="mt-3 font-display text-[40px] sm:text-[52px] lg:text-[62px] font-[900] leading-[0.86] tracking-[-0.045em]">
                Tempat tinggal
                <br />
                <span className="text-outline">yang dirawat</span>
                <br />
                seperti rumah
                <br />
                sendiri<span className="text-[#D93D30]">.</span>
              </h1>
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">
                <span className="h-px w-8 bg-[#0F1F33]/20" aria-hidden /> Bukan kos massal. Satu meja, satu buku.
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="relative border-[1.5px] border-[#0F1F33] bg-white p-4 sm:p-5 shadow-[6px_6px_0_rgba(15,31,51,0.12)]">
                {/* desk surface */}
                <div className="bg-[#E9E5DD] border border-[#0F1F33]/10 p-3">
                  <div className="bg-[#FFFBF0] border-[1.5px] border-[#0F1F33] p-0 overflow-hidden">
                    {/* ledger open */}
                    <div className="grid grid-cols-2 divide-x divide-[#0F1F33]/15">
                      <div className="p-3">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[#0F1F33]/50">Kiri — Penerimaan</p>
                        <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-dotted border-[#0F1F33]/20 py-1">
                            <span>A-01 Budi</span>
                            <span className="font-bold">1.500.000</span>
                          </div>
                          <div className="flex justify-between border-b border-dotted border-[#0F1F33]/20 py-1">
                            <span>B-02 Siti</span>
                            <span className="font-bold">1.350.000</span>
                          </div>
                          <div className="flex justify-between py-1 text-[#115E59] font-semibold">
                            <span>LUNAS</span>
                            <span>✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[#0F1F33]/50">Kanan — Pengeluaran</p>
                        <div className="mt-2 space-y-1.5 font-mono text-[11px] text-[#0F1F33]/70">
                          <div className="flex justify-between py-1">Cat dinding — 420k</div>
                          <div className="flex justify-between py-1">Service AC — 250k</div>
                          <div className="flex justify-between py-1">Galon — 60k</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t-[1.5px] border-[#0F1F33] bg-white px-3 py-2">
                      <span className="font-mono text-[10px] uppercase tracking-wide">Buku Tulis No. 008</span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#D93D30] font-bold">
                        <Stamp className="h-3 w-3" /> TERTIB
                      </span>
                    </div>
                  </div>

                  {/* brass lamp + pen */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full key-shine border border-[#B8935A]">
                      <PenLine className="h-4 w-4 text-[#0F1F33]" />
                    </span>
                    <div>
                      <p className="font-mono text-xs font-semibold leading-none">Ditulis tangan, diverifikasi mata</p>
                      <p className="font-mono text-[11px] text-[#0F1F33]/60">Bukan auto-gateway · Admin cek satu per satu</p>
                    </div>
                    <span className="ml-auto hidden sm:inline-flex h-7 items-center border border-[#0F1F33]/15 bg-white px-2 font-mono text-[10px] uppercase tracking-wide">Arsip fisik</span>
                  </div>
                </div>

                <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-[#0F1F33]/60">
                  <FileText className="h-3 w-3" /> Semua kwitansi disimpan 7 tahun — bisa diminta kapan saja.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/kontrakan" className="inline-flex items-center justify-center bg-[#0F1F33] px-4 py-3 text-sm font-semibold text-white hover:bg-[#115E59] transition">
                  Lihat unit <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border-[1.5px] border-[#0F1F33] bg-white px-4 py-3 text-sm font-semibold hover:bg-[#0F1F33] hover:text-white transition">
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics — stamped ledger */}
        <div className="border-y-[1.5px] border-[#0F1F33] bg-white">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 divide-x divide-[#0F1F33]/15 divide-y lg:grid-cols-4 lg:divide-y-0">
            {[
              { k: 'Sejak', v: '2018', sub: '7+ tahun mengelola' },
              { k: 'Penyewa', v: '120+', sub: 'tercatat rapi' },
              { k: 'Respon', v: '<1 jam', sub: 'rata-rata balasan' },
              { k: 'Kepuasan', v: '4.9/5', sub: '18 ulasan terverifikasi' },
            ].map((m) => (
              <div key={m.k} className="relative px-5 py-6 lg:px-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">{m.k}</p>
                <p className="mt-2 font-display text-[28px] font-[800] leading-none tracking-tighter">{m.v}</p>
                <p className="mt-1 font-mono text-xs text-[#0F1F33]/60">{m.sub}</p>
                <span className="absolute right-3 top-3 h-1.5 w-1.5 bg-[#C8A46A]" aria-hidden />
              </div>
            ))}
          </div>
        </div>

        {/* Visual strip — blueprint + ops */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-8 border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[320px]">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/60">
                  <Building2 className="h-3 w-3" /> Cilandak Barat — site
                </span>
                <span className="font-mono text-[10px] text-[#0F1F33]/40">12430 · Jakarta Selatan</span>
              </div>
              <div>
                <div className="grid grid-cols-[72px_1fr] gap-4 border-t-[1.5px] border-[#0F1F33] pt-6">
                  <div className="font-mono text-[10px] uppercase leading-4 tracking-widest text-[#0F1F33]/50">
                    Apa yang
                    <br />
                    beda:
                  </div>
                  <ul className="space-y-2 text-sm leading-6">
                    <li className="flex gap-2">
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#115E59]" />
                      <span><span className="font-semibold">Token listrik per kamar</span> — pemakaian adil, tagihan transparan.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#115E59]" />
                      <span><span className="font-semibold">Kontrak bulanan fleksibel</span>, perpanjang dari HP tanpa ribet.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#115E59]" />
                      <span><span className="font-semibold">Lingkungan tertata</span>, akses jalan lebar, bebas banjir.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-3">
              <div className="border-[1.5px] border-[#0F1F33] bg-white p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Operasional</p>
                <p className="mt-3 font-display text-sm font-bold leading-tight">Survei bisa hari yang sama</p>
                <p className="mt-1 text-xs leading-5 text-[#0F1F33]/60">Konfirmasi via WhatsApp. Kami antar lihat unit, cek air & listrik langsung.</p>
                <div className="mt-4 inline-flex items-center gap-1 border-b border-[#0F1F33] pb-0.5 font-mono text-xs font-medium">
                  <Clock className="h-3 w-3" /> Senin–Minggu, 08:00–18:00
                </div>
              </div>
              <div className="border-[1.5px] border-[#0F1F33] bg-[#0F1F33] p-5 text-white">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">Sistem pembayaran</p>
                <p className="mt-3 font-display text-sm font-bold leading-tight">Transfer manual, verifikasi manusia</p>
                <p className="mt-1 text-xs leading-5 text-white/60">Bukan gateway otomatis. Admin cek bukti satu per satu — kecil kemungkinan salah catat.</p>
                <p className="mt-4 font-mono text-[11px] text-[#C8A46A]">BCA · Mandiri · BNI · BRI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Principles — ARSIP tabs */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">Arsip Prinsip — 03 file</span>
            <span className="h-px flex-1 bg-[#0F1F33]/15" aria-hidden />
            <span className="hidden font-mono text-[11px] text-[#0F1F33]/40 sm:inline">Tiga hal yang kami jaga</span>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                no: 'ARSIP-01',
                title: 'Transparansi penuh',
                desc: 'Tagihan bulanan tercatat di portal. Bukti transfer tersimpan permanen dan diverifikasi admin — bukan otomatis.',
                points: ['Riwayat lengkap', 'Bukti terarsip', 'Tanpa biaya siluman'],
              },
              {
                no: 'ARSIP-02',
                title: 'Kemandirian penyewa',
                desc: 'Listrik token per kamar, air bersih, WiFi, dan parkir aman. Penyewa pegang kendali pemakaian sendiri.',
                points: ['Meteran masing-masing', 'WiFi stabil', 'Parkir motor & mobil'],
              },
              {
                no: 'ARSIP-03',
                title: 'Komunikasi langsung',
                desc: 'Langsung WhatsApp ke pengelola. Perbaikan kecil ditangani cepat tanpa form berlapis.',
                points: ['Balasan <1 jam', 'Survei hari yang sama', 'Bantuan pemeliharaan'],
              },
            ].map((item) => (
              <div key={item.no} className="border-[1.5px] border-[#0F1F33] bg-white flex flex-col">
                <div className="flex items-center justify-between bg-[#FFFBF0] border-b-[1.5px] border-[#0F1F33] px-3 py-2">
                  <span className="font-mono text-[10px] font-bold tracking-widest">{item.no}</span>
                  <span className="h-2 w-2 bg-[#D93D30]" aria-hidden />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[17px] font-bold leading-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#0F1F33]/70">{item.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.points.map((p) => (
                      <span key={p} className="border border-[#0F1F33]/10 bg-[#E9E5DD]/60 px-2 py-1 font-mono text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 overflow-hidden border-[1.5px] border-[#0F1F33] bg-white">
            <div className="col-span-12 lg:col-span-5">
              <div className="border-b-[1.5px] border-[#0F1F33] px-6 py-6 lg:px-8 bg-[#FFFBF0]">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">Lokasi — Kantor Pengelola</span>
                <h2 className="mt-3 font-display text-[22px] font-[800] tracking-tight">Cilandak Barat No. 28</h2>
                <p className="mt-1 text-sm leading-6 text-[#0F1F33]/60">Datang survei atau ambil kunci — konfirmasi jadwal dulu via WhatsApp.</p>
              </div>
              <dl className="divide-y divide-[#0F1F33]/10">
                <div className="grid grid-cols-[88px_1fr] gap-4 px-6 py-5 lg:px-8">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50"><MapPin className="h-3 w-3" /> Alamat</dt>
                  <dd className="text-sm font-medium leading-6">Jl. Cilandak Barat No. 28, RT 04/RW 02<br /><span className="font-normal text-[#0F1F33]/70">Jakarta Selatan 12430</span></dd>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-4 px-6 py-5 lg:px-8">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50"><Clock className="h-3 w-3" /> Jam</dt>
                  <dd className="text-sm leading-6"><span className="font-medium">Senin – Minggu, 08:00 – 18:00</span><br /><span className="text-xs text-[#0F1F33]/60">Konfirmasi via WA sebelum datang</span></dd>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-4 px-6 py-5 lg:px-8">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50"><Phone className="h-3 w-3" /> WA</dt>
                  <dd>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold underline decoration-[#C8A46A] decoration-2 underline-offset-4">0813-8463-4526</a>
                    <br />
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium hover:underline"><PhoneCall className="h-3 w-3" /> Chat langsung</a>
                  </dd>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-4 px-6 py-5 lg:px-8">
                  <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50"><Mail className="h-3 w-3" /> Email</dt>
                  <dd className="font-mono text-sm">pengelola@kontrakan.com</dd>
                </div>
              </dl>
              <div className="flex items-center justify-between border-t-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-6 py-3 text-white lg:px-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Peta interaktif →</span>
                <a href="https://maps.google.com/?q=Jl.%20Cilandak%20Barat%20No.%2028%20Jakarta%20Selatan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs font-semibold hover:gap-1.5 transition-all">
                  Buka di Google Maps <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="col-span-12 min-h-[380px] border-t-[1.5px] border-[#0F1F33] bg-[#E9E5DD] lg:col-span-7 lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b-[1.5px] border-[#0F1F33] bg-white px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest">Map — Jakarta Selatan</span>
                  <span className="font-mono text-[10px] text-[#0F1F33]/40">Drag · Zoom · Satellite</span>
                </div>
                <div className="relative flex-1">
                  <iframe
                    title="Peta Lokasi Kantor Pengelola Kontrakan"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.08581702456!2d106.73880497746162!3d-6.283915159049103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1e164bbd90d%3A0x6b801a61f4c7d0d0!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                    width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.05)' }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-12 gap-6 border-t-[1.5px] border-[#0F1F33] pt-10">
            <div className="col-span-12 lg:col-span-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#0F1F33]/50"><PenLine className="h-3 w-3" /> Catatan pengelola</span>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <blockquote>
                <p className="max-w-[28ch] font-display text-[28px] sm:text-[36px] lg:text-[42px] font-[700] leading-[0.95] tracking-[-0.03em]">
                  “Kami sengaja jaga tetap kecil —<span className="font-normal tracking-tight text-[#0F1F33]/60"> supaya tiap kamar tetap terawat, dan tiap penyewa kenal siapa yang dihubungi.</span>”
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-[#0F1F33] font-mono text-[11px] font-bold text-white">PK</span>
                  <span className="text-sm"><span className="font-semibold">Pengelola Kontrakan</span><span className="text-[#0F1F33]/60"> — Cilandak, 2018→</span></span>
                  <span className="ml-2 hidden sm:inline-flex stamp px-2 py-1 text-[10px] font-bold bg-white">TERVERIFIKASI</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <div className="border-y-[1.5px] border-[#0F1F33] bg-white">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-[18px] font-bold tracking-tight">Tertarik lihat unit?</h3>
              <p className="mt-1 text-sm text-[#0F1F33]/60">Cek ketersediaan real-time atau tanya dulu via WhatsApp.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/kontrakan" className="inline-flex items-center justify-center bg-[#0F1F33] px-6 py-3 text-sm font-semibold text-white hover:bg-[#115E59] transition">Lihat unit<ArrowUpRight className="ml-1.5 h-4 w-4" /></Link>
              <Link href="/faq" className="inline-flex items-center justify-center border-[1.5px] border-[#0F1F33] bg-white px-6 py-3 text-sm font-semibold hover:bg-[#0F1F33] hover:text-white transition">Baca FAQ</Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-3 font-mono text-xs font-semibold underline decoration-[#C8A46A] decoration-2 underline-offset-4">0813-8463-4526 <ArrowUpRight className="h-3 w-3" /></a>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 sm:px-6 lg:px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan · Jakarta Selatan</p>
          <p className="max-w-[40ch] text-xs leading-5 text-[#0F1F33]/50">Dikelola keluarga, bukan korporat. Data penyewa tidak dibagikan.</p>
        </div>
      </footer>
    </div>
  )
}
