'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  LayoutGrid,
  Wallet,
  Droplets,
  Gavel,
  KeyRound,
  ChevronDown,
  CheckCircle2,
  Zap,
  Trash2,
  CreditCard,
  BadgePercent,
  PawPrint,
  Info,
  Lock,
  Users,
  Car,
  Bike,
  PiggyBank,
  BadgeCheck,
  CalendarDays,
  MessageCircle,
  Phone,
  Clock3,
  MapPin,
  Lightbulb,
  ShieldCheck,
  Leaf,
  CircleHelp,
  SearchX,
  TrainFront,
  Store,
  Hospital,
  Handshake,
  Ban,
  VolumeX,
  Recycle,
  IdCard,
} from 'lucide-react'
import WhatsAppIcon from '@/components/whatsapp-icon'
import PublicLayout from '@/components/public-layout'

type Category = 'biaya' | 'fasilitas' | 'tatatertib' | 'prosedur'

interface Faq {
  q: string
  categories: Category[]
  keywords: string
  icon: typeof Wallet
  answer: React.ReactNode
}

const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20seputar%20kontrakan'

const CATEGORIES: { key: 'all' | Category; label: string; icon: typeof Wallet }[] = [
  { key: 'all', label: 'Semua', icon: LayoutGrid },
  { key: 'biaya', label: 'Biaya & Pembayaran', icon: Wallet },
  { key: 'fasilitas', label: 'Fasilitas & Utilitas', icon: Droplets },
  { key: 'tatatertib', label: 'Tata Tertib Hunian', icon: Gavel },
  { key: 'prosedur', label: 'Prosedur Masuk & Keluar', icon: KeyRound },
]

const FAQS: Faq[] = [
  {
    q: 'Apakah biaya sewa sudah termasuk listrik dan air?',
    categories: ['fasilitas', 'biaya'],
    keywords: 'listrik air sumur token kebersihan sampah gratis',
    icon: Droplets,
    answer: (
      <div className="flex flex-col gap-3 rounded-lg bg-[#f1f4f1] p-4">
        <p className="text-base leading-relaxed">
          Sistem utilitas kami hemat dan transparan:
        </p>
        <div className="grid grid-cols-1 gap-1 pt-1 sm:grid-cols-3">
          {[
            { icon: CheckCircle2, title: 'Air Bersih', desc: 'Air tanah bersih dengan tandon mandiri, tanpa iuran tambahan.' },
            { icon: Zap, title: 'Listrik Token', desc: 'Meteran token mandiri per unit — isi sesuai pemakaian sendiri.' },
            { icon: Trash2, title: 'Iuran Kebersihan', desc: 'Sampah lingkungan diangkut rutin oleh petugas kebersihan.' },
          ].map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="rounded-lg bg-white p-3">
                <span className="flex items-center gap-1 text-sm font-semibold text-[#013428]">
                  <Icon className="h-4 w-4 text-[#013428]" /> {c.title}
                </span>
                <span className="mt-1 block text-sm text-[#404945]">{c.desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    ),
  },
  {
    q: 'Bagaimana sistem pembayarannya? Bisa bulanan atau harus tahunan?',
    categories: ['biaya'],
    keywords: 'pembayaran bulanan tahunan sistem diskon tempo sewa transfer bank',
    icon: CreditCard,
    answer: (
      <div className="flex flex-col gap-3 rounded-lg bg-[#f1f4f1] p-4">
        <p className="text-base leading-relaxed">
          Sistem fleksibel: sewa dihitung <strong>bulanan</strong> dan dapat
          diperpanjang setiap bulan. Pembayaran via <strong>transfer bank
          manual</strong> ke rekening resmi (BCA, Mandiri, BNI, BRI), lalu
          upload bukti transfer (JPG/PNG/PDF, maks 5 MB) untuk diverifikasi
          pengelola sampai status LUNAS.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 rounded-lg bg-white p-3">
            <span className="mb-1 block text-sm font-semibold text-[#013428]">Skema Sewa Bulanan</span>
            <p className="text-sm text-[#404945]">
              Tagihan dibuat otomatis sebelum jatuh tempo dan dapat dicek kapan
              saja di dashboard penyewa.
            </p>
          </div>
          <div className="flex-1 rounded-lg bg-[#ffdbce]/40 p-3">
            <div className="mb-1 inline-block rounded bg-[#974723] px-2 py-0.5 text-xs font-semibold text-white">
              Promo Hemat
            </div>
            <span className="mb-1 block text-sm font-semibold text-[#772f0d]">Skema Sewa Tahunan</span>
            <p className="text-sm text-[#772f0d]">
              Tanya pengelola untuk potongan khusus pembayaran langsung di muka
              masa sewa 1 tahun.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    q: 'Apakah boleh membawa hewan peliharaan?',
    categories: ['tatatertib'],
    keywords: 'hewan peliharaan piaraan kucing anjing burung ikan hias',
    icon: PawPrint,
    answer: (
      <div className="space-y-1 rounded-lg bg-[#f1f4f1] p-4 text-base leading-relaxed">
        <p>Untuk menjaga kenyamanan bersama, berlaku aturan berikut:</p>
        <div className="flex items-start gap-1 rounded-lg bg-white p-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#013428]" />
          <span className="text-sm"><strong>Ikan hias & burung kecil:</strong> diperbolehkan selama dirawat baik dan tidak menimbulkan bau.</span>
        </div>
        <div className="flex items-start gap-1 rounded-lg bg-white p-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#974723]" />
          <span className="text-sm"><strong>Kucing peliharaan:</strong> wajib di dalam unit (indoor) dengan kotak pasir mandiri, tidak berkeliaran di lorong atau teras tetangga.</span>
        </div>
      </div>
    ),
  },
  {
    q: 'Bagaimana aturan jam malam dan tamu menginap?',
    categories: ['tatatertib'],
    keywords: 'jam malam gerbang tamu menginap kunci keamanan portal',
    icon: Lock,
    answer: (
      <div className="space-y-2 rounded-lg bg-[#f1f4f1] p-4">
        <div className="flex items-start gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#bdeddb] text-[#013428]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-[#013428]">Akses Gerbang dengan Kunci Mandiri</span>
            <p className="mt-0.5 text-sm text-[#404945]">
              Gerbang utama ditutup pukul <strong>23.00 WIB</strong> demi
              keamanan lingkungan. Setiap penghuni memegang kunci akses
              masing-masing sehingga tetap fleksibel.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffdbce] text-[#974723]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-[#974723]">Ketentuan Tamu Menginap</span>
            <p className="mt-0.5 text-sm text-[#404945]">
              Keluarga atau kerabat boleh menginap dengan melapor terlebih
              dahulu via WhatsApp ke pengelola demi tertib administrasi
              lingkungan.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    q: 'Apakah ada fasilitas parkir untuk mobil dan motor?',
    categories: ['fasilitas'],
    keywords: 'parkir mobil motor kanopi carport biaya tambahan kendaraan',
    icon: Car,
    answer: (
      <div className="rounded-lg bg-[#f1f4f1] p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex flex-col justify-between rounded-lg bg-white p-3">
            <div>
              <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-[#013428]">
                <Bike className="h-5 w-5" /> Parkir Sepeda Motor
              </div>
              <p className="text-sm text-[#404945]">
                Area parkir aman dan teduh, terpisah dari akses kendaraan besar.
              </p>
            </div>
            <span className="mt-2 text-xs font-semibold text-[#013428]">Termasuk dalam sewa</span>
          </div>
          <div className="flex flex-col justify-between rounded-lg bg-white p-3">
            <div>
              <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-[#974723]">
                <Car className="h-5 w-5" /> Parkir Mobil
              </div>
              <p className="text-sm text-[#404945]">
                Jalan lingkungan lebar, mobil bisa masuk. Tanyakan slot carport
                yang tersedia kepada pengelola.
              </p>
            </div>
            <span className="mt-2 text-xs font-semibold text-[#974723]">Konfirmasi ke pengelola</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    q: 'Apakah memerlukan uang jaminan (deposit)?',
    categories: ['biaya', 'prosedur'],
    keywords: 'jaminan deposit uang kunci kebersihan pengembalian masuk keluar',
    icon: PiggyBank,
    answer: (
      <div className="space-y-2 rounded-lg bg-[#f1f4f1] p-4 text-base leading-relaxed">
        <p>
          Ya, berlaku <strong>deposit jaminan kunci & pemeliharaan</strong> yang
          dibayarkan satu kali di awal masa huni. Besarannya dikonfirmasi
          pengelola sesuai tipe unit.
        </p>
        <div className="flex items-start gap-2 rounded-lg bg-white p-3">
          <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#013428]" />
          <div>
            <span className="block text-sm font-semibold text-[#181c1b]">Dikembalikan penuh saat keluar</span>
            <p className="mt-0.5 text-sm text-[#404945]">
              Deposit dikembalikan pada hari penyerahan kunci, selama unit
              bersih, tidak ada tunggakan, dan tanpa kerusakan yang disengaja.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    q: 'Bagaimana cara menjadwalkan survei ke lokasi?',
    categories: ['prosedur'],
    keywords: 'survei lihat lokasi jadwal janji temu whatsapp pengelola',
    icon: CalendarDays,
    answer: (
      <div className="space-y-2 rounded-lg bg-[#f1f4f1] p-4">
        <p className="text-base leading-relaxed">Caranya mudah tanpa perantara:</p>
        <div className="space-y-1">
          {[
            'Kirim pesan WhatsApp dengan menyebutkan hari dan jam rencana kedatangan Anda.',
            'Konfirmasi minimal 2 jam sebelumnya agar pengelola bisa bersiap membukakan unit.',
            'Datang ke lokasi dan cek air, listrik, serta lingkungan sekitar secara langsung.',
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-2 rounded-lg bg-white p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#013428] text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
        <div className="pt-1">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[#013428] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1e4b3e]"
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            Jadwalkan Survei via WhatsApp
          </a>
        </div>
      </div>
    ),
  },
  {
    q: 'Bagaimana cara mendapatkan akun penyewa?',
    categories: ['prosedur'],
    keywords: 'akun penyewa login email dashboard masuk',
    icon: KeyRound,
    answer: (
      <div className="rounded-lg bg-[#f1f4f1] p-4">
        <p className="text-base leading-relaxed">
          Akun dibuatkan pengelola saat Anda mulai menempati unit. Masuk dengan
          email yang diberikan pengelola, lalu pantau tagihan bulanan, upload
          bukti transfer, dan lihat riwayat pembayaran di dashboard.
        </p>
      </div>
    ),
  },
]

const RULES = [
  {
    icon: IdCard,
    bg: 'bg-[#013428] text-white',
    title: '1. Identitas Lengkap',
    desc: 'Menyerahkan fotokopi KTP dan Kartu Keluarga (KK) yang masih berlaku sebelum menempati unit untuk pelaporan data ke RT setempat.',
    foot: 'Wajib saat serah kunci',
    footOk: true,
  },
  {
    icon: VolumeX,
    bg: 'bg-[#013428] text-white',
    title: '2. Jam Istirahat Warga',
    desc: 'Menjaga ketenangan suara musik atau aktivitas mulai pukul 22.00 - 06.00 WIB demi kenyamanan balita dan warga yang beristirahat.',
    foot: 'Saling menghargai waktu istirahat',
    footOk: true,
  },
  {
    icon: Ban,
    bg: 'bg-[#ba1a1a] text-white',
    title: '3. Bebas Miras & Narkoba',
    desc: 'Dilarang keras membawa, mengonsumsi, atau memperjualbelikan minuman beralkohol, narkotika, dan perjudian dalam bentuk apapun.',
    foot: 'Sanksi pemutusan sewa sepihak',
    footOk: false,
  },
  {
    icon: Recycle,
    bg: 'bg-[#013428] text-white',
    title: '4. Pengelolaan Sampah',
    desc: 'Membuang sampah rumah tangga dalam kantong tertutup di tempat yang disediakan. Dilarang membakar sampah atau menumpuk barang di selasar.',
    foot: 'Diangkut rutin petugas',
    footOk: true,
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all')
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.map((f, i) => ({ ...f, index: i })).filter((f) => {
      const matchCat = activeCategory === 'all' || f.categories.includes(activeCategory)
      const hay = `${f.q} ${f.keywords}`.toLowerCase()
      return matchCat && (q === '' || hay.includes(q))
    })
  }, [activeCategory, query])

  return (
    <PublicLayout>
      <div className="relative w-full overflow-hidden bg-[#f7faf6]">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[340px] w-[760px] -translate-x-1/2 rounded-full bg-[#bdeddb]/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-48 h-80 w-80 rounded-full bg-[#ffdbce]/40 blur-3xl" aria-hidden />

        {/* ——— Header ——— */}
        <section className="w-full px-4 pb-6 pt-10 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#e6e9e5] px-3 py-1 text-sm font-semibold text-[#013428] shadow-sm">
                <CircleHelp className="h-[18px] w-[18px]" />
                Pusat Informasi & Transparansi Hunian
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#013428]">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h1>
              <p className="mt-1 text-lg leading-relaxed text-[#404945]">
                Segala hal yang perlu calon penghuni ketahui tentang sewa,
                fasilitas, tata tertib, dan prosedur secara terbuka.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl bg-white p-3 shadow-sm md:self-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#bdeddb] text-[#013428]">
                <Leaf className="h-[26px] w-[26px]" />
              </div>
              <div>
                <div className="font-semibold text-[#013428]">98% Transparan</div>
                <div className="text-xs text-[#404945]">Tanpa biaya terselubung</div>
              </div>
            </div>
          </div>

          <div className="relative mb-6 w-full max-w-3xl">
            <div className="flex items-center rounded-xl bg-white p-1 shadow-md transition-shadow focus-within:shadow-xl">
              <Search className="ml-3 h-6 w-6 shrink-0 text-[#717975]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pertanyaan seputar listrik, deposit, tamu, parkir..."
                aria-label="Cari pertanyaan"
                className="w-full bg-transparent px-3 py-3 text-base text-[#181c1b] outline-none placeholder:text-[#717975]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  title="Bersihkan pencarian"
                  aria-label="Bersihkan pencarian"
                  className="mr-1 rounded-lg p-1 text-[#717975] transition-colors hover:text-[#181c1b]"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => {
              const Icon = c.icon
              const active = activeCategory === c.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(c.key)
                    setOpenIndex(0)
                  }}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-4 py-1 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#013428] text-white shadow-sm'
                      : 'bg-[#ecefeb] text-[#404945] hover:bg-[#e6e9e5] hover:text-[#181c1b]'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {c.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* ——— Main ——— */}
        <section className="w-full px-4 pb-10 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-2 lg:col-span-8">
              <p className="text-[13px] text-[#717975]" aria-live="polite">
                {filtered.length} jawaban ditemukan
              </p>
              {filtered.map((f) => {
                const Icon = f.icon
                const open = openIndex === f.index
                return (
                  <div
                    key={f.q}
                    className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(open ? null : f.index)}
                      className="group flex w-full cursor-pointer select-none items-center justify-between gap-4 p-4 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecefeb] text-[#013428] transition-colors group-hover:bg-[#013428] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-semibold text-[#181c1b] transition-colors group-hover:text-[#013428]">
                          {f.q}
                        </span>
                      </div>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecefeb] text-[#404945] transition-transform ${open ? 'rotate-180' : ''}`}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pt-0 text-[#404945]">{f.answer}</div>
                    )}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-sm">
                  <SearchX className="mb-1 h-12 w-12 text-[#c0c8c3]" />
                  <div className="font-semibold text-[#013428]">Pertanyaan Tidak Ditemukan</div>
                  <p className="mb-4 mt-1 max-w-sm text-sm text-[#404945]">
                    Kata kunci yang Anda cari belum ada di daftar FAQ kami.
                    Tanyakan langsung kepada pengelola.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setActiveCategory('all')
                    }}
                    className="rounded-lg bg-[#ecefeb] px-4 py-1 text-sm font-semibold text-[#013428] transition-colors hover:bg-[#e6e9e5]"
                  >
                    Tampilkan Semua Pertanyaan
                  </button>
                </div>
              )}
            </div>

            {/* ——— Sidebar ——— */}
            <div className="flex flex-col gap-4 lg:col-span-4">
              <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md">
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#bdeddb]/30" aria-hidden />
                <div className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wider text-[#013428]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#013428]" />
                  Respons Langsung Pengelola
                </div>
                <h2 className="mb-3 font-semibold text-[#013428]">Butuh Penjelasan Langsung?</h2>
                <p className="mb-4 text-sm leading-relaxed text-[#404945]">
                  Silakan berkunjung untuk mengobrol santai sambil melihat
                  suasana hunian. Tanpa bot — dibalas manusia, biasanya di
                  bawah 1 jam.
                </p>
                <div className="mb-4 space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-[#181c1b]">
                    <Clock3 className="h-5 w-5 shrink-0 text-[#013428]" />
                    Waktu konsultasi: <strong>08.00 - 20.00 WIB</strong>
                  </div>
                  <div className="flex items-center gap-1 text-[#181c1b]">
                    <Zap className="h-5 w-5 shrink-0 text-[#013428]" />
                    Respons rata-rata: <strong>&lt; 15 menit</strong>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-1 rounded-lg bg-[#013428] text-sm font-semibold text-white transition-all hover:bg-[#1e4b3e]"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Hubungi via WhatsApp
                  </a>
                  <a
                    href="tel:081384634526"
                    className="flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-[#ecefeb] text-sm font-semibold text-[#013428] transition-colors hover:bg-[#e6e9e5]"
                  >
                    <Phone className="h-[18px] w-[18px]" />
                    Telepon Langsung
                  </a>
                  <Link
                    href="/kontrakan"
                    className="flex h-10 w-full items-center justify-center gap-1 rounded-lg text-sm font-semibold text-[#013428] transition-colors hover:bg-[#f1f4f1]"
                  >
                    <MapPin className="h-[18px] w-[18px]" />
                    Lihat Unit Tersedia
                  </Link>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-semibold text-[#013428]">Kesiapan Huni</div>
                  <span className="rounded-full bg-[#bdeddb] px-2 py-0.5 text-xs font-semibold text-[#002018]">
                    Siap Pakai
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Kebersihan & Sanitasi Unit', value: '100% Bersih' },
                    { label: 'Kelayakan Saluran Air Bersih', value: 'Air tanah jernih' },
                    { label: 'Keamanan Lingkungan', value: 'Terkendali' },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="mb-1 flex justify-between text-xs text-[#404945]">
                        <span>{m.label}</span>
                        <span className="font-semibold text-[#013428]">{m.value}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#ecefeb]">
                        <div className="h-full w-full rounded-full bg-[#013428]" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 rounded-lg bg-[#f1f4f1] p-3 text-[#404945]">
                  <Lightbulb className="h-5 w-5 shrink-0 text-[#974723]" />
                  <span className="text-[13px] leading-tight">
                    Seluruh saklar, kran air, dan kunci pintu dicek ulang setiap
                    unit keluar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Tata tertib ——— */}
        <section className="w-full px-4 pb-10 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm lg:p-8">
            <div className="mb-6 max-w-3xl">
              <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#ffdbce]/60 px-3 py-1 text-sm font-semibold text-[#772f0d]">
                <ShieldCheck className="h-[18px] w-[18px]" />
                Harmoni & Ketenteraman Lingkungan
              </div>
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-[#013428]">
                Tata Tertib & Etika Bertetangga
              </h2>
              <p className="text-base leading-relaxed text-[#404945]">
                Aturan hunian disusun demi ruang hidup yang damai, aman bagi
                anak-anak, dan nyaman untuk semua warga.
              </p>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {RULES.map((r) => {
                const Icon = r.icon
                return (
                  <div
                    key={r.title}
                    className="flex flex-col justify-between rounded-xl bg-[#f1f4f1] p-4 transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${r.bg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className={`mb-1 font-semibold ${r.footOk ? 'text-[#013428]' : 'text-[#ba1a1a]'}`}>
                        {r.title}
                      </div>
                      <p className="text-sm leading-relaxed text-[#404945]">{r.desc}</p>
                    </div>
                    <div className={`mt-3 flex items-center gap-1 pt-1 text-xs ${r.footOk ? 'text-[#013428]' : 'font-semibold text-[#ba1a1a]'}`}>
                      {r.footOk ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      {r.foot}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-[#ffdbce]/30 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2">
                <Handshake className="mt-0.5 h-7 w-7 shrink-0 text-[#974723]" />
                <div>
                  <div className="font-semibold text-[#772f0d]">Musyawarah & Kekeluargaan</div>
                  <p className="text-sm leading-relaxed text-[#772f0d]">
                    Setiap kendala fasilitas atau perselisihan diselesaikan
                    secara musyawarah dengan bantuan pengelola langsung.
                  </p>
                </div>
              </div>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 whitespace-nowrap rounded-lg bg-[#974723] px-4 py-1 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#772f0d]"
              >
                Konsultasikan Kebutuhan
              </a>
            </div>
          </div>
        </section>

        {/* ——— Map teaser ——— */}
        <section className="w-full px-4 pb-10 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 rounded-2xl bg-[#f1f4f1] p-4 lg:grid-cols-12 lg:p-6">
            <div className="space-y-2 lg:col-span-6">
              <div className="inline-flex items-center gap-1 text-xs text-[#013428]">
                <MapPin className="h-4 w-4" />
                Aksesibilitas Strategis
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#013428]">
                Lokasi Dekat Fasilitas Umum Namun Suasana Tenang
              </h2>
              <p className="text-base leading-relaxed text-[#404945]">
                Dekat stasiun, pasar tradisional, minimarket, dan fasilitas
                kesehatan — dengan lingkungan tempat tinggal yang aman dan
                tertata.
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { icon: TrainFront, label: 'Dekat Stasiun KRL' },
                  { icon: Store, label: 'Dekat Pasar & Minimarket' },
                  { icon: Hospital, label: 'Dekat Faskes' },
                ].map((c) => {
                  const Icon = c.icon
                  return (
                    <span
                      key={c.label}
                      className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-[#181c1b] shadow-sm"
                    >
                      <Icon className="h-4 w-4 text-[#013428]" /> {c.label}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="w-full lg:col-span-6">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-md sm:h-[440px]">
                <iframe
                  title="Peta lokasi kontrakan"
                  src="https://maps.google.com/maps?q=Cilandak%20Jakarta%20Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
