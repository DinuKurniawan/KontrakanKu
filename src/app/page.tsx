import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import {
  Building2,
  MapPin,
  ArrowUpRight,
  PhoneCall,
  Check,
  KeyRound,
  Droplets,
  Wifi,
  Car,
  Clock3,
  Receipt,
  Stamp,
  FileText,
  ArrowRight,
  Quote,
} from "lucide-react";
import { PropertyStatus, RentalStatus, UnitStatus } from "@prisma/client";
import { SR } from "@/components/scroll-reveal-wrapper";
import AutoReveal from "@/components/auto-reveal";

// No navbar import — custom header for distinctive identity

const WA_LINK =
  "https://wa.me/6281384634526?text=Halo%20Pengelola%20Kelola%20Kontrakan%2C%20saya%20ingin%20bertanya%20seputar%20sewa%20kontrakan";

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "Unit", href: "/kontrakan" },
  { label: "Tentang", href: "/tentang" },
  { label: "FAQ", href: "/faq" },
];

const FACILITIES = [
  {
    icon: KeyRound,
    door: "bg-[#115E59]",
    name: "Pintu Teal",
    title: "Kunci masing-masing",
    desc: "Gembok brass per unit, duplikat tercatat di buku.",
  },
  {
    icon: Wifi,
    door: "bg-[#C8A46A]",
    name: "Pintu Brass",
    title: "WiFi stabil",
    desc: "Router tiap kontrakan, bukan tether HP.",
  },
  {
    icon: Droplets,
    door: "bg-[#0F1F33]",
    name: "Pintu Ink",
    title: "Air & listrik mandiri",
    desc: "Token meter per kamar — adil, transparan.",
  },
  {
    icon: Car,
    door: "bg-[#E9E5DD]",
    name: "Pintu Concrete",
    title: "Parkir & akses",
    desc: "Jalan lebar, motor + mobil, bebas banjir.",
    dark: true,
  },
];

const STEPS = [
  {
    no: "01",
    title: "Pilih di katalog",
    desc: "Foto asli, harga mulai real, sisa unit ter-update manual — bukan stok fiktif.",
  },
  {
    no: "02",
    title: "Survei + WhatsApp",
    desc: "Chat pengelola, janjian hari yang sama. Cek air, listrik, dan tetangga langsung.",
  },
  {
    no: "03",
    title: "Akad & portal",
    desc: "Transfer manual → upload bukti → cap LUNAS terverifikasi di portal penyewa.",
  },
];

const TESTIMONIALS = [
  {
    name: "Andi Pratama",
    unit: "A-01 · Mawar",
    text: "Dari survei sampai akad bening. Kamar bersih, token mandiri jadi gak rebutan listrik. Tagihan bisa dicek sendiri — gak perlu nagih.",
    date: "Sept 2025",
  },
  {
    name: "Siti Rahayu",
    unit: "Kamar 5 · Melati",
    text: "Lingkungan tertata dan aman. Pernah wastafel mampet, WA jam 9 pagi — sore sudah beres. Seperti rumah sendiri.",
    date: "Agu 2025",
  },
  {
    name: "Budi Santoso",
    unit: "B-02 · Anggrek",
    text: "Bayar sewa tinggal transfer lalu foto bukti dari HP. Besoknya sudah cap terverifikasi. Riwayatnya rapi kalau mau perpanjangan.",
    date: "Jul 2025",
  },
];

const FAQ_ITEMS = [
  {
    q: "Apakah unit benar-benar siap huni?",
    a: "TERSEDIA artinya sudah dibersihkan, cek listrik & air. Kami foto ulang tiap unit keluar — bukan foto 2 tahun lalu.",
  },
  {
    q: "Bagaimana cara survei?",
    a: "Buka /kontrakan → pilih kontrakan → tombol Hubungi Pengelola. Kita janjian, bisa hari yang sama 08–18 WIB.",
  },
  {
    q: "Pembayaran bagaimana?",
    a: "Transfer manual ke rekening resmi (BCA/Mandiri/BNI/BRI) yang tertera di portal. Upload bukti, admin verifikasi manual — cap LUNAS.",
  },
  {
    q: "Perlu akun dulu?",
    a: "Akun dibuatkan pengelola saat akad. Login pakai email, cek tagihan bulanan dari HP.",
  },
];

export default async function HomePage() {
  let stats: {
    publishedProperties: number;
    totalUnits: number;
    availableUnits: number;
    activeRentals: number;
  } | null = null;
  try {
    const [publishedProperties, totalUnits, availableUnits, activeRentals] =
      await Promise.all([
        prisma.property.count({ where: { status: PropertyStatus.PUBLISHED } }),
        prisma.unit.count(),
        prisma.unit.count({ where: { status: UnitStatus.AVAILABLE } }),
        prisma.rental.count({ where: { status: RentalStatus.ACTIVE } }),
      ]);
    stats = { publishedProperties, totalUnits, availableUnits, activeRentals };
  } catch {
    stats = null;
  }

  const featuredProperties = await prisma.property
    .findMany({
      where: { status: PropertyStatus.PUBLISHED },
      take: 3,
      include: {
        images: { where: { isCover: true }, take: 1 },
        units: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0F1F33] flex flex-col selection:bg-[#C8A46A]/30">
      {/* Top ink rule with brass hairline */}
      <div className="h-[6px] w-full bg-[#0F1F33] relative">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#C8A46A]/60" />
      </div>

      {/* Header — ledger tab style */}
      <header className="sticky top-0 z-30 bg-[#FFFBF0]/92 backdrop-blur-[10px] border-b-[1.5px] border-[#0F1F33]">
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo — brass key + wordmark */}
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
                  l.href === '/' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-transparent hover:border-[#0F1F33] hover:bg-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-[#D93D30] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white hover:bg-[#c2362b] transition shadow-[0_1px_0_rgba(15,31,51,0.12)]"
            >
              Masuk
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 border border-[#E9E5DD] bg-white px-3 py-2.5 font-mono text-xs hover:border-[#0F1F33] transition"
            >
              <PhoneCall className="h-3.5 w-3.5" /> 0813-8463-4526
            </a>
          </div>
        </div>
        {/* nav mobile row under header */}
        <div className="flex md:hidden items-center gap-1 border-t border-[#0F1F33]/10 bg-white px-4 py-2 overflow-x-auto">
          {NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${l.href === '/' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#E9E5DD] bg-[#FFFBF0]'}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="ml-auto shrink-0 font-mono text-xs underline underline-offset-4">
            Masuk
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <AutoReveal />
        {/* HERO — 12 col ledger */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
          {/* eyebrow ledger rule */}
          <SR direction="up" duration={540} delay={0}>
            <div className="flex items-center gap-3 border-b-[1.5px] border-[#0F1F33] pb-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="h-2 w-2 bg-[#D93D30]" aria-hidden />
                Buku Kontrakan — No. 008
                <span className="hidden sm:inline text-[#0F1F33]/40"> / Cilandak Barat · Jakarta Selatan 12430</span>
              </span>
              <span className="ml-auto hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/55">
                <Receipt className="h-3 w-3" /> Arsip manual · Diverifikasi manusia
              </span>
            </div>
          </SR>

          <div className="grid grid-cols-12 gap-6 lg:gap-8 pt-6 lg:pt-8">
            {/* Left — headline */}
            <div className="col-span-12 lg:col-span-7">
              <SR direction="up" duration={560} delay={80}>
                <h1 className="font-display text-[42px] sm:text-[58px] lg:text-[68px] font-[900] leading-[0.86] tracking-[-0.045em]">
                  <span className="block">Tertata.</span>
                  <span className="block text-outline">Terbuka.</span>
                  <span className="block">
                    Terjaga<span className="text-[#D93D30]">.</span>
                  </span>
                </h1>
              </SR>
              <SR direction="up" duration={540} delay={150}>
                <p className="mt-5 max-w-[44ch] text-[15.5px] leading-7 text-[#0F1F33]/75">
                  Kontrakan keluarga di Cilandak yang dikelola seperti buku tulis — setiap kunci, tagihan, dan bukti transfer dicatat rapi. Penyewa pegang portal, pengelola pegang verifikasi.
                </p>
              </SR>

              <SR direction="up" duration={540} delay={210}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/kontrakan"
                    className="inline-flex items-center justify-center bg-[#0F1F33] px-6 py-[13px] text-sm font-semibold text-white hover:bg-[#115E59] transition"
                  >
                    Lihat kontrakan <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center border-[1.5px] border-[#0F1F33] bg-white px-6 py-[13px] text-sm font-semibold hover:bg-[#0F1F33] hover:text-white transition"
                  >
                    Portal penyewa
                  </Link>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs underline decoration-[#C8A46A] decoration-2 underline-offset-4 hover:decoration-[#0F1F33]"
                  >
                    Chat WhatsApp <PhoneCall className="h-3 w-3" />
                  </a>
                </div>
              </SR>

              {/* Mini ledger stats — looks like handwritten table */}
              {stats && (
                <SR direction="up" duration={540} delay={260}>
                  <div className="mt-8 border-[1.5px] border-[#0F1F33] bg-white card-lift">
                    <div className="flex items-center justify-between border-b border-[#0F1F33]/10 bg-[#E9E5DD]/50 px-3 py-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Buku besar · Ringkasan</span>
                      <span className="font-mono text-[10px] text-[#0F1F33]/60">Update manual</span>
                    </div>
                    <div className="grid grid-cols-4 divide-x divide-[#0F1F33]/10">
                      {[
                        { v: stats.publishedProperties, l: "Tayang", sub: "properti" },
                        { v: stats.totalUnits, l: "Total", sub: "unit" },
                        { v: stats.availableUnits, l: "Tersedia", sub: "kunci" },
                        { v: stats.activeRentals, l: "Dihuni", sub: "aktif" },
                      ].map((s) => (
                        <div key={s.l} className="px-3 py-3 text-center sm:px-4 sm:py-4">
                          <p className="font-display text-[22px] sm:text-[26px] font-[800] leading-none tracking-tighter">{s.v}</p>
                          <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wide">{s.l}</p>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/50">{s.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </SR>
              )}

              <SR direction="up" duration={520} delay={300}>
                <p className="mt-3 hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#0F1F33]/55">
                  <span className="h-px w-6 bg-[#0F1F33]/20" /> Semua foto & harga diperbarui manual. Tanya stok real-time sebelum transfer.
                </p>
              </SR>
            </div>

            {/* Right — THE SIGNATURE: Kwitansi Hidup */}
            <div className="col-span-12 lg:col-span-5 lg:pl-2">
              <SR direction="up" duration={640} delay={280}>
                <div className="relative">
                  {/* hanging brass key */}
                  <div
                    className="absolute -top-3 right-10 z-10 hidden sm:flex flex-col items-center hero-key"
                    aria-hidden
                  >
                    <span className="h-8 w-px bg-[#C8A46A]" />
                    <span className="flex h-9 w-9 items-center justify-center rounded-full key-shine border border-[#B8935A] shadow-sm">
                      <KeyRound className="h-4 w-4 text-[#0F1F33] -rotate-45" />
                    </span>
                    <span className="mt-1 h-1.5 w-6 rounded-full bg-[#0F1F33]/10 blur-[2px]" />
                  </div>

                {/* Kwitansi card */}
                <div className="relative overflow-hidden border-[1.5px] border-[#0F1F33] bg-white shadow-[6px_6px_0px_rgba(15,31,51,0.12)]">
                  {/* perforated left */}
                  <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-white border-r border-dashed border-[#0F1F33]/30 flex flex-col justify-around items-center py-3">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span key={i} className="h-[7px] w-[7px] rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                    ))}
                  </div>

                  <div className="pl-[22px]">
                    {/* header */}
                    <div className="flex items-start justify-between border-b border-[#0F1F33] px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center bg-[#0F1F33] text-white">
                          <FileText className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">Kwitansi</p>
                          <p className="font-display text-sm font-bold leading-none">INV-2026-09-014</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/60">Jatuh tempo</p>
                        <p className="font-mono text-xs font-semibold">10 Sep 2026</p>
                      </div>
                    </div>

                    {/* rows */}
                    <div className="px-4 sm:px-5 py-4 space-y-3">
                      <div className="grid grid-cols-[96px_1fr] gap-2 text-sm">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Kontrakan</span>
                        <span className="font-medium">Kontrakan Melati — Cilandak</span>
                      </div>
                      <div className="grid grid-cols-[96px_1fr] gap-2 text-sm">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Unit</span>
                        <span className="font-mono text-sm">A-01 · Lantai 1</span>
                      </div>
                      <div className="grid grid-cols-[96px_1fr] gap-2 text-sm">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Penyewa</span>
                        <span>Budi Santoso</span>
                      </div>
                      <div className="grid grid-cols-[96px_1fr] gap-2 text-sm">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Periode</span>
                        <span className="font-mono">September 2026</span>
                      </div>

                      <div className="my-3 border-t border-dashed border-[#0F1F33]/20" />

                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Tagihan</span>
                        <span className="font-display text-[22px] font-[800] tracking-tighter">Rp1.500.000</span>
                      </div>
                      <div className="flex items-baseline justify-between -mt-1">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/50">Transfer</span>
                        <span className="font-mono text-sm font-semibold">Rp1.500.000 · BCA</span>
                      </div>

                      {/* stamp */}
                      <div className="relative h-[54px] mt-2 flex items-center justify-center">
                        <div className="stamp animate-stamp inline-flex flex-col items-center px-5 py-1.5 bg-white">
                          <span className="font-mono text-[11px] font-black uppercase tracking-[0.18em]">LUNAS</span>
                          <span className="font-mono text-[8px] uppercase tracking-[0.16em]">TERVERIFIKASI · 08 SEP 2026</span>
                        </div>
                        {/* signature line */}
                        <div className="absolute right-0 bottom-0 text-right">
                          <div className="font-display italic text-[13px] leading-none text-[#115E59]">Hj. Aminah</div>
                          <div className="h-px w-[92px] bg-[#0F1F33] mt-1" />
                          <div className="font-mono text-[9px] uppercase tracking-wide text-[#0F1F33]/60">Pengelola</div>
                        </div>
                      </div>
                    </div>

                    {/* footer dotted */}
                    <div className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0] px-4 sm:px-5 py-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide">
                        <span className="h-1.5 w-1.5 bg-emerald-600" aria-hidden /> Bukti tersimpan
                      </span>
                      <span className="font-mono text-[10px] text-[#0F1F33]/60">Portal penyewa → Riwayat</span>
                    </div>
                  </div>
                </div>

                {/* Below kwitansi — availability ledger */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="border border-[#0F1F33]/12 bg-[#115E59] px-3 py-3 text-white text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">Tersedia</p>
                    <p className="font-display text-lg font-bold leading-none mt-1">{stats?.availableUnits ?? "—"}</p>
                  </div>
                  <div className="border border-[#0F1F33]/12 bg-white px-3 py-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/60">Dihuni</p>
                    <p className="font-display text-lg font-bold leading-none mt-1">{stats?.activeRentals ?? "—"}</p>
                  </div>
                  <div className="border border-[#0F1F33]/12 bg-[#C8A46A] px-3 py-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest">BCA · BRI · BNI</p>
                    <p className="font-mono text-[11px] font-bold leading-none mt-1">Manual</p>
                  </div>
                </div>
                <p className="mt-2 text-center font-mono text-[11px] leading-4 text-[#0F1F33]/60 sm:text-left">
                  Cap <span className="font-semibold text-[#D93D30]">LUNAS</span> hanya keluar setelah admin cek bukti — bukan otomatis.
                </p>
              </div>
              </SR>
            </div>
          </div>
        </section>

        {/* BANK + TRUST STRIP */}
        <SR direction="up" duration={540} delay={80}>
          <div className="mt-8 border-y-[1.5px] border-[#0F1F33] bg-white">
            <div className="mx-auto flex w-full max-w-[1180px] flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0F1F33]/70 text-center sm:text-left">
                Transfer manual — <span className="font-bold text-[#0F1F33]">BCA · Mandiri · BNI · BRI</span> <span className="hidden sm:inline">· Verifikasi &lt; 24 jam</span>
              </p>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="hidden sm:inline text-[#0F1F33]/50">Respon</span>
                <span className="inline-flex items-center gap-1.5 border border-[#0F1F33] bg-[#FFFBF0] px-2.5 py-1">
                  <Clock3 className="h-3 w-3" /> &lt;1 jam
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#0F1F33] px-2.5 py-1 text-white">
                  <Check className="h-3 w-3" /> Tanpa perantara
                </span>
              </div>
            </div>
          </div>
        </SR>

        {/* FACILITIES — Pintu */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <SR direction="up" duration={520} delay={0}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">01 — Pintu yang kami jaga</p>
                <h2 className="mt-2 font-display text-[26px] sm:text-[30px] font-[800] tracking-[-0.03em] leading-none">
                  Bukan janji brosur<span className="text-[#C8A46A]">.</span>
                </h2>
                <p className="mt-2 max-w-[46ch] text-sm leading-6 text-[#0F1F33]/65">Tiap pintu punya warna, gembok, dan meterannya sendiri. Penyewa pegang kendali.</p>
              </div>
              <span className="hidden sm:inline-flex h-7 items-center border border-[#0F1F33]/15 bg-white px-3 font-mono text-[11px] uppercase tracking-wide">
                4 fasilitas inti
              </span>
            </div>
          </SR>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr items-stretch">
            {FACILITIES.map((f, i) => {
              const Icon = f.icon;
              return (
                <SR key={f.title} direction="up" duration={520} delay={i * 80} className="flex h-full">
                  <div className="group relative flex h-full w-full flex-col overflow-hidden border-[1.5px] border-[#0F1F33] bg-white card-lift">
                  {/* door color block */}
                  <div className={`relative h-[112px] shrink-0 ${f.door} flex items-center justify-center`}>
                    {/* door frame line */}
                    <div className="absolute inset-3 border border-white/20" aria-hidden />
                    {/* handle — brass dot */}
                    <span className={`absolute right-5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border ${f.dark ? "bg-[#C8A46A] border-[#C8A46A]" : "bg-[#FFFBF0] border-white"} shadow-sm`} aria-hidden />
                    <Icon className={`h-6 w-6 ${f.dark ? "text-[#0F1F33]" : "text-white/95"}`} />
                    <span className={`absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.14em] ${f.dark ? "text-[#0F1F33]/70" : "text-white/70"}`}>{f.name}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-display text-[15px] font-bold leading-tight min-h-[38px] lg:min-h-[22px]">{f.title}</p>
                    <p className="mt-1 flex-1 min-h-[40px] text-xs leading-5 text-[#0F1F33]/65">{f.desc}</p>
                  </div>
                </div>
                </SR>
              );
            })}
          </div>
        </section>

        {/* FEATURED — Folder / Map */}
        <section className="bg-white border-y-[1.5px] border-[#0F1F33]">
          <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <SR direction="up" duration={520} delay={0}>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-[#0F1F33] pb-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">02 — Map kontrakan</p>
                  <h2 className="mt-2 font-display text-[26px] sm:text-[30px] font-[800] tracking-[-0.03em] leading-none">Pilihan terawat</h2>
                  <p className="mt-1.5 text-sm text-[#0F1F33]/60">3 map terbaru — foto asli, siap survei minggu ini.</p>
                </div>
                <Link href="/kontrakan" className="hidden sm:inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition">
                  Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </SR>

            {featuredProperties.length === 0 ? (
              <div className="mt-6 border border-dashed border-[#0F1F33]/20 bg-[#FFFBF0] px-6 py-14 text-center">
                <Building2 className="mx-auto h-6 w-6 text-[#0F1F33]/20" />
                <p className="mt-2 font-mono text-sm text-[#0F1F33]/60">Belum ada kontrakan tayang. Hubungi pengelola untuk info stok.</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredProperties.map((p, idx) => {
                  const available = p.units.filter((u) => u.status === "AVAILABLE").length;
                  const total = p.units.length;
                  return (
                    <article
                      key={p.id}
                      className="group relative flex h-full flex-col bg-[#FFFBF0] border-[1.5px] border-[#0F1F33] shadow-[4px_4px_0_rgba(15,31,51,0.10)] hover:shadow-[6px_6px_0_rgba(15,31,51,0.14)] hover:-translate-y-[1px] transition-all"
                    >
                      {/* folder tab */}
                      <div className="flex items-center justify-between bg-white border-b-[1.5px] border-[#0F1F33] px-3 py-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                          <span className="h-2 w-2 rounded-full bg-[#D93D30]" aria-hidden />
                          MAP — No. 0{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] text-[#0F1F33]/60">{total} unit</span>
                      </div>

                      <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E5DD] border-b-[1.5px] border-[#0F1F33]">
                        {p.images[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Building2 className="h-8 w-8 text-[#0F1F33]/20" />
                          </div>
                        )}
                        {/* price tag — stamp style */}
                        <span className="absolute bottom-2 left-2 bg-[#0F1F33] px-2.5 py-1.5 font-mono text-xs font-bold tracking-tight text-white">
                          {formatRupiah(p.monthlyPriceFrom.toNumber())}
                          <span className="font-normal opacity-70"> /bln</span>
                        </span>
                        {/* availability — top right */}
                        <span
                          className={`absolute right-2 top-2 inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${
                            available > 0 ? "bg-white border-[#0F1F33] text-[#115E59]" : "bg-[#0F1F33] border-[#0F1F33] text-white"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 ${available > 0 ? "bg-[#115E59]" : "bg-white"}`} aria-hidden />
                          {available} tersedia
                        </span>
                        {/* brass fastener */}
                        <span className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full key-shine border border-[#B8935A] shadow-sm" aria-hidden />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-display text-[17px] font-[800] leading-tight tracking-[-0.02em]">{p.name}</h3>
                        <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#0F1F33]/60">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{p.address}</span>
                        </p>
                        {p.description && <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#0F1F33]/70">{p.description}</p>}

                        <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#0F1F33]/15 pt-3">
                          <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/60">
                            {available}/{total} kunci
                          </span>
                          <Link
                            href={`/kontrakan/${p.slug}`}
                            className="inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition"
                          >
                            Lihat detail <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <Link
              href="/kontrakan"
              className="mt-5 inline-flex sm:hidden w-full items-center justify-center gap-1 border-[1.5px] border-[#0F1F33] bg-white py-3 font-mono text-xs font-semibold uppercase tracking-wide"
            >
              Lihat semua kontrakan <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* STEPS — Ledger entries */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <SR direction="up" duration={500} delay={0}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">03 — Cara kerja</span>
              <span className="h-px flex-1 bg-[#0F1F33]/15" aria-hidden />
              <span className="hidden sm:inline font-mono text-[11px] text-[#0F1F33]/40">3 langkah, tanpa ribet</span>
            </div>
          </SR>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-fr items-stretch">
            {STEPS.map((s, i) => (
              <SR key={s.no} direction="up" duration={520} delay={i * 90} className="flex h-full">
                <div className="relative flex h-full w-full flex-col border-[1.5px] border-[#0F1F33] bg-white p-5 sm:p-6 card-lift">
                {/* ledger hole + line */}
                <div className="absolute left-0 top-0 bottom-0 w-[18px] border-r border-dashed border-[#0F1F33]/15 flex flex-col items-center justify-start gap-3 pt-4">
                  <span className="h-2 w-2 rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                  <span className="h-2 w-2 rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15" />
                  <span className="h-2 w-2 rounded-full bg-[#FFFBF0] border border-[#0F1F33]/15 hidden sm:block" />
                </div>
                <div className="pl-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[42px] font-[900] leading-none tracking-tighter text-[#0F1F33]">{s.no}</span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/45">/ 03</span>
                    {i !== 2 && <span className="ml-auto hidden lg:block h-px w-10 bg-[#0F1F33]/15" aria-hidden />}
                  </div>
                  <h3 className="mt-3 font-display text-[17px] font-bold leading-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#0F1F33]/70">{s.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[#115E59]">
                    <Check className="h-3 w-3" /> Manual & tercatat
                  </div>
                </div>
              </div>
              </SR>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS — Ledger paper with lines — carousel berjalan */}
        <section className="bg-[#0F1F33] text-[#FFFBF0] border-y-[1.5px] border-[#0F1F33] overflow-hidden">
          <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <SR direction="up" duration={520} delay={0}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-[22px] sm:text-[26px] font-[800] tracking-[-0.02em]">Apa kata penyewa</h2>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-white/60">3 kutipan · buku tamu · berjalan otomatis</span>
              </div>
            </SR>

            {/* Carousel — equal height cards + infinite marquee */}
            <div
              className="testimonial-marquee-paused group relative mt-6 -mx-4 sm:mx-0"
              aria-roledescription="carousel"
              aria-label="Testimoni penyewa berjalan otomatis — hover untuk jeda"
            >
              <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none] motion-reduce:pb-2 motion-reduce:scrollbar-thin">
                <div className="animate-testimonial-marquee flex w-max gap-4 pr-4 sm:gap-6 sm:pr-6 motion-reduce:animate-none">
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                    <div
                      key={`${t.name}-${idx}`}
                      aria-hidden={idx >= TESTIMONIALS.length}
                      className="shrink-0"
                    >
                      <div className="relative flex h-[278px] w-[86vw] max-w-[360px] shrink-0 flex-col overflow-hidden border border-[#C8A46A]/30 bg-[#FFFBF0] text-[#0F1F33] sm:w-[340px] sm:h-[270px] lg:w-[360px] lg:h-[270px]">
                        {/* paper header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-[#0F1F33]/10 bg-white px-4 py-2.5">
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">{t.unit}</span>
                          <span className="font-mono text-[10px] text-[#0F1F33]/40">{t.date}</span>
                        </div>
                        <div className="ledger-lines flex flex-1 flex-col px-5 py-4">
                          <Quote className="h-4 w-4 shrink-0 text-[#C8A46A] mb-2" />
                          <p className="font-display flex-1 italic text-[15px] leading-7 line-clamp-4">“{t.text}”</p>
                          <div className="mt-auto flex shrink-0 items-center gap-2 border-t border-dashed border-[#0F1F33]/15 pt-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#0F1F33] font-mono text-[11px] font-bold text-white">
                              {t.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                            <span className="font-mono text-xs font-semibold">{t.name}</span>
                            <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/50">
                              <Stamp className="h-3 w-3" /> Terverifikasi
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* fade hint — hidden when reduced motion */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0F1F33] to-transparent motion-reduce:hidden" aria-hidden />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0F1F33] to-transparent motion-reduce:hidden" aria-hidden />
            </div>

            {/* Fallback grid untuk reduced-motion & no-JS — terlihat hanya saat motion-reduce */}
            <div className="mt-6 hidden auto-rows-fr grid-cols-1 gap-4 motion-reduce:grid lg:grid-cols-3 lg:items-stretch">
              {TESTIMONIALS.map((t) => (
                <div
                  key={`fallback-${t.name}`}
                  className="relative flex h-full min-h-[270px] flex-col overflow-hidden border border-[#C8A46A]/30 bg-[#FFFBF0] text-[#0F1F33]"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-[#0F1F33]/10 bg-white px-4 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0F1F33]/60">{t.unit}</span>
                    <span className="font-mono text-[10px] text-[#0F1F33]/40">{t.date}</span>
                  </div>
                  <div className="ledger-lines flex flex-1 flex-col px-5 py-4">
                    <Quote className="h-4 w-4 shrink-0 text-[#C8A46A] mb-2" />
                    <p className="font-display flex-1 italic text-[15px] leading-7">“{t.text}”</p>
                    <div className="mt-auto flex shrink-0 items-center gap-2 border-t border-dashed border-[#0F1F33]/15 pt-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#0F1F33] font-mono text-[11px] font-bold text-white">
                        {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                      <span className="font-mono text-xs font-semibold">{t.name}</span>
                      <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-[#0F1F33]/50">
                        <Stamp className="h-3 w-3" /> Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 hidden items-center gap-2 font-mono text-[11px] text-white/50 sm:flex motion-reduce:hidden">
              <span className="h-px w-6 bg-white/20" /> Hover / fokus untuk jeda — geser otomatis setiap 32 detik
            </p>
          </div>
        </section>

        {/* FAQ — Form style */}
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            <SR direction="up" duration={520} delay={0} className="col-span-12 lg:col-span-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">04 — FAQ · Formulir</p>
                <h2 className="mt-2 font-display text-[26px] font-[800] tracking-[-0.03em] leading-none">
                  Pertanyaan
                  <br />
                  cepat<span className="text-[#D93D30]">.</span>
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#0F1F33]/65">Jawaban singkat seperti mengisi formulir — jelas, tidak bertele-tele.</p>
                <Link
                  href="/faq"
                  className="mt-5 hidden lg:inline-flex items-center gap-1 border-[1.5px] border-[#0F1F33] bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition"
                >
                  Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </SR>

            <SR direction="up" duration={540} delay={100} className="col-span-12 lg:col-span-8">
              <div className="border-[1.5px] border-[#0F1F33] bg-white divide-y divide-[#0F1F33]/10">
                {FAQ_ITEMS.map((f, i) => (
                  <div key={f.q} className="grid grid-cols-12 gap-3 px-4 sm:px-5 py-4">
                    <span className="col-span-12 sm:col-span-1 font-mono text-xs font-bold text-[#C8A46A]">0{i + 1}</span>
                    <div className="col-span-12 sm:col-span-11">
                      <p className="font-mono text-[13px] font-semibold leading-6 tracking-tight">{f.q}</p>
                      <p className="mt-1 text-sm leading-6 text-[#0F1F33]/65">{f.a}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-[#FFFBF0] px-4 sm:px-5 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[#0F1F33]/60">Masih ada pertanyaan?</span>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold underline decoration-[#D93D30] decoration-2 underline-offset-4"
                  >
                    Chat WhatsApp <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <Link
                href="/faq"
                className="mt-3 inline-flex w-full justify-center border-[1.5px] border-[#0F1F33] bg-white py-3 font-mono text-xs font-semibold uppercase tracking-wide lg:hidden"
              >
                Lihat semua FAQ
              </Link>
              </SR>
          </div>
        </section>

        {/* FINAL CTA — Ink block */}
        <SR direction="up" duration={560} delay={60}>
        <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="relative overflow-hidden border-[1.5px] border-[#0F1F33] bg-[#0F1F33] px-6 py-8 sm:px-8 sm:py-10">
            {/* brass corner accent */}
            <div className="absolute right-0 top-0 h-24 w-24 bg-[#C8A46A]/15" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} aria-hidden />
            <div className="absolute left-6 top-6 hidden sm:block h-px w-16 bg-white/15" aria-hidden />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">Siap cek kunci?</p>
                <h2 className="mt-2 font-display text-[28px] sm:text-[32px] font-[800] leading-none tracking-[-0.03em] text-white">
                  Survei minggu ini,
                  <br />
                  <span className="text-[#C8A46A]">bayar rapi bulan depan.</span>
                </h2>
                <p className="mt-2 max-w-[42ch] text-sm leading-6 text-white/70">Pilih kontrakan, janjian WA, kelola tagihan dari HP — semua tercatat di buku.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kontrakan"
                  className="inline-flex items-center justify-center bg-[#C8A46A] px-6 py-3 text-sm font-bold text-[#0F1F33] hover:bg-[#dfbd8a] transition"
                >
                  Lihat kontrakan <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border border-white/25 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0F1F33] transition"
                >
                  Portal penyewa
                </Link>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 font-mono text-[11px] text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#C8A46A]" /> Cilandak Barat
              </span>
              <span>·</span>
              <span>Senin–Minggu 08–18 WIB</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Respon &lt;1 jam</span>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                0813-8463-4526 <PhoneCall className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>
        </SR>
      </main>

      <footer className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 py-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#0F1F33] text-white">
                <KeyRound className="h-4 w-4 -rotate-45" />
              </span>
              <span className="font-display text-sm font-[800] tracking-tight">Kelola Kontrakan</span>
            </Link>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-[#0F1F33]/65">Kelola tagihan & bukti transfer tanpa ribet. Dikelola keluarga di Cilandak sejak 2018 — bukan broker.</p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">Navigasi</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:block sm:space-y-1.5">
              {[
                { label: "Beranda", href: "/" },
                { label: "Unit", href: "/kontrakan" },
                { label: "Tentang", href: "/tentang" },
                { label: "FAQ", href: "/faq" },
                { label: "Masuk", href: "/login" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="font-mono text-xs hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-[1.5px] border-[#0F1F33] bg-white p-4 hover:bg-[#0F1F33] hover:text-white group transition"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D93D30] text-white group-hover:bg-[#C8A46A] group-hover:text-[#0F1F33] transition">
              <PhoneCall className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-wide opacity-60">Chat pengelola</span>
              <span className="block font-mono text-sm font-bold">0813-8463-4526</span>
            </span>
            <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100" />
          </a>
        </div>
        <div className="border-t border-[#0F1F33]/10">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-4 sm:px-6 lg:px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan</p>
            <p className="font-mono text-[11px] text-[#0F1F33]/45">Data penyewa tidak dibagikan · Buku besar disimpan permanen</p>
          </div>
        </div>
      </footer>

      {/* Floating WA — slab style */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 border-[1.5px] border-[#0F1F33] bg-[#25D366] px-4 py-3 text-white shadow-[3px_3px_0_rgba(15,31,51,0.18)] hover:shadow-[4px_4px_0_rgba(15,31,51,0.22)] hover:translate-y-[-1px] transition-all sm:bottom-6 sm:right-6"
      >
        <PhoneCall className="h-4 w-4" />
        <span className="hidden font-mono text-xs font-bold sm:inline">WhatsApp</span>
        <span className="font-mono text-xs font-semibold">0813-8463-4526</span>
      </a>
    </div>
  );
}
