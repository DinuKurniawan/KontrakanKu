import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  Sprout,
  Mountain,
  Droplets,
  Zap,
  Home,
  Quote,
  Building2,
  ShieldCheck,
  Handshake,
  Wrench,
  Users,
  Video,
  MapPin,
  MessageCircle,
  Phone,
  Clock3,
  TrainFront,
  Car,
  Navigation,
  CalendarDays,
  ChevronRight,
  Timer,
  CircleCheck,
} from 'lucide-react'
import PublicLayout from '@/components/public-layout'
import GriyaTestimonials from '../griya-testimonials'

export const metadata = {
  title: 'Tentang Kami — Kelola Kontrakan',
  description: 'Cerita dan dedikasi pengelola — hunian asri yang dirawat sepenuh hati seperti rumah sendiri.',
}

const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20mengenai%20kontrakan'

const METRICS = [
  { v: '12+', l: 'Tahun Melayani Keluarga', s: 'Sejak 2012', icon: BadgeCheck },
  { v: '100%', l: 'Bebas Banjir Alami', s: 'Dataran tinggi', icon: Mountain },
  { v: '0 Rupiah', l: 'Biaya Iuran Air Sumur', s: 'Sumur bor jernih', icon: Droplets },
  { v: '15 Menit', l: 'Rata-rata Respon Kendala', s: 'Pengelola siaga', icon: Zap },
]

const PILLARS = [
  {
    no: 'Pilar 01',
    icon: Users,
    bg: 'bg-[#bdeddb] text-[#013428]',
    foot: 'Komunitas Santun',
    title: 'Ketulusan & Kekeluargaan',
    desc: 'Menghilangkan jarak kaku antara pemilik dan penyewa. Hubungan kekeluargaan yang saling menghormati privasi namun selalu sigap saat saling membutuhkan.',
  },
  {
    no: 'Pilar 02',
    icon: Wrench,
    bg: 'bg-[#ffdbce] text-[#974723]',
    foot: 'Perawatan Rutin',
    title: 'Kualitas Bangunan Terjaga',
    desc: 'Perawatan berkala instalasi pipa air, kelistrikan yang aman, dinding anti rembes, dan sirkulasi udara optimal di setiap unit kamar.',
  },
  {
    no: 'Pilar 03',
    icon: Handshake,
    bg: 'bg-[#a1d0bf] text-[#013428]',
    foot: 'Langsung ke Pengelola',
    title: 'Transparansi Tanpa Calo',
    desc: 'Harga sewa terang benderang dari awal, perjanjian tertulis resmi, tanpa biaya perantara yang membebani kantong keluarga muda.',
  },
  {
    no: 'Pilar 04',
    icon: ShieldCheck,
    bg: 'bg-[#ffdeae] text-[#3f2900]',
    foot: 'Aman Terkendali',
    title: 'Lingkungan Aman & Nyaman',
    desc: 'Sistem gerbang satu pintu dengan pantauan CCTV. Aturan jam malam pengunjung demi kenyamanan anak tidur nyenyak dan privasi penghuni.',
  },
]

const AREA_FEATURES = [
  {
    icon: Droplets,
    title: 'Air Bersih Sumur Bor',
    desc: 'Kedalaman 40 meter, jernih, tidak berbau, lancar 24 jam dengan tandon kapasitas besar. Bebas tagihan bulanan tambahan.',
  },
  {
    icon: Mountain,
    title: '100% Bebas Banjir',
    desc: 'Kontur tanah dataran tinggi alami dengan saluran drainase lebar yang selalu dirawat setiap musim hujan.',
  },
  {
    icon: Car,
    title: 'Jalan Paving Lebar 5m',
    desc: 'Akses masuk paving blok rapi. Mobil leluasa berselisihan, parkir motor aman di setiap depan unit kontrakan.',
  },
  {
    icon: Navigation,
    title: 'Akses Cepat KRL & Tol',
    desc: 'Dekat stasiun KRL, pasar dan minimarket, serta akses cepat menuju gerbang tol.',
  },
]

export default function TentangPage() {
  return (
    <PublicLayout>
      <div className="relative w-full overflow-hidden bg-[#f7faf6]">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-[#bdeddb]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute right-10 top-48 h-96 w-96 rounded-full bg-[#ffdbce]/25 blur-3xl" aria-hidden />

        {/* ——— Header ——— */}
        <section className="w-full px-4 pb-6 pt-6 lg:px-8 lg:pt-10">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-[#404945]">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-[#013428]">
              <Home className="h-[18px] w-[18px]" />
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4 text-[#c0c8c3]" />
            <span className="font-semibold text-[#013428]">Tentang Kami</span>
          </nav>

          <div className="flex max-w-3xl flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#bdeddb] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#002018] shadow-sm">
              <Leaf className="h-[18px] w-[18px] text-[#013428]" />
              Cerita & Dedikasi Pengelola
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#013428] md:text-5xl">
              Hunian Asri yang Dirawat Sepenuh Hati Seperti Rumah Sendiri
            </h1>
            <p className="mt-1 text-lg leading-relaxed text-[#404945]">
              Berawal dari niat sederhana menyediakan ruang bernaung yang
              tenteram. Kami percaya rumah kontrakan bukan sekadar dinding
              sewa, melainkan tempat tumbuh rasa aman, kehangatan keluarga,
              dan istirahat berkualitas sepulang dari hiruk-pikuk kota.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {METRICS.map((m) => {
              const Icon = m.icon
              return (
                <div key={m.l} className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
                  <span className="text-3xl font-bold text-[#974723] first:text-[#974723]">
                    {m.v}
                  </span>
                  <span className="mt-1 text-sm text-[#404945]">{m.l}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-medium text-[#013428]">
                    <Icon className="h-4 w-4" /> {m.s}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* ——— Kisah & mosaic ——— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-lg font-semibold text-[#974723]">
                <span className="h-0.5 w-6 rounded-full bg-[#974723]" />
                Awal Cerita 2012
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
                Berawal dari Empati Menyediakan Hunian yang Manusiawi dan Jujur
              </h2>
              <div className="space-y-3 text-base leading-relaxed text-[#404945]">
                <p>
                  Berawal dari keprihatinan melihat pencari kontrakan yang
                  kerap mengalami kesulitan: biaya tersembunyi lewat perantara
                  tidak resmi, kualitas air bermasalah tanpa penanganan, hingga
                  lingkungan bising dan kurang aman bagi anak kecil.
                </p>
                <p>
                  Dengan tekad menghadirkan kawasan kontrakan yang layak huni,
                  asri, dan teratur, kami menerapkan prinsip tanpa calo,
                  perjanjian tertulis yang transparan, dan pemeliharaan bangunan
                  secara berkala sejak hari pertama.
                </p>
                <p>
                  Bagi kami, setiap keluarga yang tinggal adalah tetangga
                  terhormat. Kami mendengarkan setiap masukan, memelihara
                  kebun rindang bersama, dan menjaga ketenteraman seperti
                  tinggal di kampung halaman sendiri.
                </p>
              </div>
              <div className="relative mt-1 overflow-hidden rounded-xl bg-white p-6 shadow-sm">
                <Quote className="pointer-events-none absolute bottom-0 right-2 h-16 w-16 text-[#ff996e]/25" aria-hidden />
                <p className="relative z-10 italic text-[#181c1b]">
                  &ldquo;Kami merawat setiap atap, keran, dan sudut halaman
                  seperti merawat kediaman kami sendiri. Kebahagiaan kami
                  adalah saat melihat anak-anak penyewa bermain aman di
                  pekarangan yang bersih.&rdquo;
                </p>
                <div className="relative z-10 mt-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bdeddb] font-semibold text-[#013428]">
                    HB
                  </div>
                  <div>
                    <span className="block font-semibold leading-tight text-[#013428]">
                      Bapak Pengelola & Keluarga
                    </span>
                    <span className="block text-xs text-[#404945]">
                      Pendiri & Pengelola Langsung
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-6">
              <div className="group relative overflow-hidden rounded-2xl shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzvPHRy70nJQ1JyBsuaukCjnr4HZtQkvzuImYlski48-EkCStnCj8_DyhGo__V75rSUAI1tPOL6jbfM5h1LawigV42bQxPNkjxK4SbgksK_Fn8QEvO0z0ldv-2vhHEqevAVsMp1IRCNp_0KKk-6K83Hv7XnQlSkpra5VdmztMcR9Qid8bB2vi9MSXclVekTR-PdVBU7vAqdw1RwMHAvleDMy9uNdFY1dw_7M-VzFk"
                  alt="Pekarangan utama yang asri dan terawat"
                  loading="lazy"
                  className="h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#013428]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="mb-1 inline-block rounded bg-[#974723] px-2 py-1 text-xs font-semibold">
                    Pekarangan Utama
                  </span>
                  <p className="font-semibold">Ruang Terbuka Hijau & Area Bersama</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwN_eed0peWVfj7WQmDTM-fKGz8T-kXVRhzCvl1ZYfkELy8pCZ4zz8W2rlZdqEITHgVNh-MGMvEqTmU_VJYlv_GypH5GiLQNUHzeRe6tvf-R2OxokH5wKVofdnWVsun7K-8vBPi7b5Cg-bIhlWBh5bYmoh8BkcE_ZyNl-8O0-L6KXAFc_xMvjjMQJxODYx7Te7omjUo_yaG3EcZ03Kdf1FKfsSUqy_sFTIIzvRr3U',
                    alt: 'Teras depan unit yang rindang',
                    label: 'Teras Depan Rindang',
                  },
                  {
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_MDLBFBm7uwCN6ucTyrVYhtpwuk24k1qHwnV6vdgPCGKqUsMNVY7vJjrSQQAvoXK0IwFRwUEkPBrx5SoW_XUbJn5GJrmz1ppYkBv2ZUVYZe1qV3otTNuuaIVi4HF0OmyG1CQgv195FoJiYiUn8zWzo2Mc8p4JiZnkdCMotC-5dV6zjAMxd5eqQ1ZOe0xH-xMaBJfyqF_6wDI1YVvq0vtk4jt_x_Qh0rbevTVmm54',
                    alt: 'Gerbang dan keamanan lingkungan',
                    label: 'Gerbang Aman Terpantau',
                  },
                ].map((img) => (
                  <div key={img.label} className="group relative h-56 overflow-hidden rounded-xl shadow-sm">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
                      <span className="text-sm font-medium text-white">{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 4 Pilar ——— */}
      <section className="w-full bg-[#f7faf6] px-4 py-10 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="block text-sm font-semibold uppercase tracking-wider text-[#974723]">
            Landasan Komitmen Kami
          </span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
            4 Pilar Kenyamanan Keluarga
          </h2>
          <p className="mt-2 text-base text-[#404945]">
            Kami merawat setiap detail operasional harian agar Anda dan keluarga
            dapat beristirahat dengan damai tanpa pusing memikirkan masalah
            hunian.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${p.bg}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#974723]">
                    {p.no}
                  </span>
                  <h3 className="mb-1 mt-1 font-semibold text-[#013428]">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[#404945]">{p.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#013428]">
                  <CircleCheck className="h-4 w-4" />
                  {p.foot}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ——— Profil pengelola ——— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 rounded-2xl bg-white p-6 shadow-md md:p-8 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-tr from-[#ffdbce]/60 to-[#bdeddb]/60 blur-md" aria-hidden />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9gLVAqNAhTiCxUwuLeE8gdAOpWiLaqittGbS2B7wBGuUnXgGb2HcdzMwHXV_t8a1ATs7VYfuKTzzAu3MCd9xP2BJIgr-vdIULeCz9YfnUzow17_hulKYU4mvkU8ap8pM9DeeKLATbsNiLO9AxEFzqCK-iIn5Owc8IfoE2w5SWSC05wbOg4CqwvUc7cZhyIRmhXZ4-gqokmhoC3rau_dW01agSkFecQC32SEXEgHk"
                  alt="Pengelola kontrakan yang ramah"
                  loading="lazy"
                  className="h-96 w-full rounded-xl object-cover shadow-md"
                />
                <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-xl bg-[#013428] px-4 py-2 text-white shadow-lg">
                  <BadgeCheck className="h-5 w-5 text-[#bdeddb]" />
                  <div>
                    <span className="block text-xs font-bold leading-none">Pengelola Terverifikasi</span>
                    <span className="text-[11px] leading-tight opacity-90">Sejak 2012</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:col-span-7">
              <div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#e6e9e5] px-3 py-1 text-xs font-semibold text-[#013428]">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#013428]" />
                Tinggal Berdekatan dengan Unit
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
                Kenali Kami: Pengelola Anda
              </h2>
              <p className="leading-relaxed text-[#404945]">
                Kami tinggal berdekatan dengan unit kelolaan. Kedekatan ini
                menjamin segala kendala teknis — seperti pompa air, lampu
                selasar, atau kebutuhan darurat penghuni — bisa langsung
                ditangani dengan cepat.
              </p>
              <div className="my-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-start gap-1 rounded-lg bg-[#f1f4f1] p-3">
                  <Timer className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#013428]" />
                  <div>
                    <span className="block text-sm font-semibold text-[#013428]">Respon Rata-rata</span>
                    <span className="text-sm text-[#404945]">Membalas pesan &lt; 15 menit saat jam operasional.</span>
                  </div>
                </div>
                <div className="flex items-start gap-1 rounded-lg bg-[#f1f4f1] p-3">
                  <CalendarDays className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#974723]" />
                  <div>
                    <span className="block text-sm font-semibold text-[#974723]">Waktu Ramah Survei</span>
                    <span className="text-sm text-[#404945]">Setiap hari: 08.00 - 18.00 WIB (kabar via WA).</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-1 rounded-lg bg-[#013428] px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#1e4b3e]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Hubungi via WhatsApp
                </a>
                <a
                  href="tel:081384634526"
                  className="inline-flex h-12 items-center gap-1 rounded-lg px-4 text-base font-semibold text-[#013428] transition-colors hover:bg-[#ecefeb]"
                >
                  <Phone className="h-5 w-5" />
                  (0813) 8463-4526
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Fasilitas kawasan ——— */}
      <section className="w-full bg-[#f7faf6] px-4 py-10 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="block text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Kenyamanan Lokasi
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
              Fasilitas Kawasan & Lingkungan yang Mendukung
            </h2>
            <p className="mt-1 text-base text-[#404945]">
              Bukan sekadar bangunan kokoh — lokasi strategis memudahkan
              mobilitas harian Anda.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-[#bdeddb]/40 px-4 py-2 text-sm font-semibold text-[#013428]">
            <MapPin className="h-5 w-5" />
            Cilandak, Jakarta Selatan
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {AREA_FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e6e9e5] text-[#013428]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold text-[#013428]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#404945]">{f.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl shadow-sm">
          <div className="h-[560px] w-full">
            <iframe
              title="Peta lokasi kontrakan"
              src="https://maps.google.com/maps?q=Cilandak%20Jakarta%20Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-md md:left-auto md:right-4">
            <div>
              <span className="block font-semibold text-[#013428]">Cilandak, Jakarta Selatan</span>
              <span className="text-sm text-[#404945]">Titik akurat dikirim via WhatsApp untuk navigasi.</span>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Cilandak+Jakarta+Selatan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#013428] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e4b3e]"
            >
              Buka Google Maps
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ——— Testimoni ——— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="block text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Suara Keluarga Penghuni
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#013428]">
              Cerita Mereka yang Menjadikan Hunian Ini Rumahnya
            </h2>
            <p className="mt-2 text-base text-[#404945]">
              Kepercayaan Anda adalah amanah terbesar bagi kami. Inilah
              pengalaman nyata keluarga yang telah tinggal bersama kami.
            </p>
          </div>
          <GriyaTestimonials />
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="w-full bg-[#f7faf6] px-4 py-10 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#1e4b3e] p-6 text-white shadow-xl lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[#bdeddb]/10 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#974723]/20 blur-2xl" aria-hidden />
          <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-1 lg:col-span-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#013428] px-3 py-1 text-xs font-semibold text-[#bdeddb]">
                <span className="h-2 w-2 rounded-full bg-[#bdeddb]" />
                Keluarga Baru Selalu Disambut Hangat
              </div>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                Ingin Mengetahui Ketersediaan Unit atau Berbincang Langsung?
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-[#bdeddb]">
                Pintu kami selalu terbuka untuk Anda yang ingin melihat langsung
                lingkungan hunian. Tanpa perantara — langsung berbicara dengan
                pengelola.
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-[#bdeddb]/80">
                <Clock3 className="h-4 w-4" /> Survei 08.00 – 18.00 WIB, setiap hari
                <span className="hidden sm:inline">·</span>
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <Sprout className="h-4 w-4" /> Lingkungan asri & terawat
                </span>
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:flex-row lg:col-span-4 lg:flex-col">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-1 rounded-lg bg-[#974723] px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-[#772f0d]"
              >
                <CalendarDays className="h-5 w-5" />
                Jadwalkan Kunjungan Survei
              </a>
              <Link
                href="/kontrakan"
                className="inline-flex h-12 items-center justify-center gap-1 rounded-lg bg-[#013428] px-6 text-base font-semibold text-white transition-colors hover:bg-black"
              >
                <Building2 className="h-5 w-5" />
                Lihat Pilihan Unit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Kontak ringkas ——— */}
      <section className="w-full bg-[#f7faf6]">
        <div className="grid w-full gap-4 px-4 pb-14 sm:grid-cols-3 lg:px-8">
          {[
            { icon: MapPin, bg: 'bg-[#bdeddb] text-[#013428]', t: 'Cilandak, Jakarta Selatan', s: 'Lokasi strategis & bebas banjir' },
            { icon: Phone, bg: 'bg-[#ffdbce] text-[#974723]', t: '(0813) 8463-4526', s: 'Chat WhatsApp respon cepat' },
            { icon: TrainFront, bg: 'bg-[#ffdeae] text-[#3f2900]', t: 'Dekat Transportasi', s: 'Akses KRL & jalan utama' },
          ].map((c) => {
            const Icon = c.icon
            return (
              <div key={c.t} className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${c.bg}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="text-sm">
                  <p className="font-bold text-[#013428]">{c.t}</p>
                  <p className="text-[#717975]">{c.s}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </PublicLayout>
  )
}
