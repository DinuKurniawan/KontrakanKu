import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Handshake,
  MapPin,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Trees,
  TrainFront,
  Store,
  Hospital,
  GraduationCap,
  Map as MapIcon,
  Phone,
  Clock3,
  CircleCheck,
  Users,
} from "lucide-react";
import { PropertyStatus } from "@prisma/client";
import PublicLayout from "@/components/public-layout";
import GriyaHero from "./griya-hero";
import GriyaTestimonials from "./griya-testimonials";

const STATS = [
  { value: "18 Unit", title: "Pilihan Hunian", desc: "Asri, sejuk & nyaman keluarga" },
  { value: "98%", title: "Tingkat Hunian", desc: "Penyewa betah & puas bertahan" },
  { value: "5 Menit", title: "Akses Kilat", desc: "Ke KRL stasiun & minimarket" },
  { value: "100%", title: "Dikelola Langsung", desc: "Tanpa perantara & bebas calo" },
];

const VALUES = [
  {
    icon: Trees,
    bg: "bg-[#bdeddb] text-[#013428]",
    title: "Lingkungan Asri & Ramah Anak",
    desc: "Dikelilingi pepohonan rimbun, sirkulasi angin segar, serta halaman dalam tertutup yang aman bagi balita dan anak-anak bermain santai tanpa lalu-lalang kendaraan cepat.",
  },
  {
    icon: Navigation,
    bg: "bg-[#ffdbce] text-[#974723]",
    title: "Akses Fasilitas Lengkap",
    desc: "Hanya 3 menit jalan kaki ke minimarket (Alfamart/Indomaret), 5 menit ke Pasar Tradisional dan Stasiun Commuter Line, mempermudah mobilitas harian Anda.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-[#bdeddb] text-[#013428]",
    title: "Keamanan 24 Jam & Portal",
    desc: "Pintu gerbang satu akses (one gate system), portal malam tertutup rapat, serta pantauan CCTV aktif 24 jam di titik masuk dan lorong bersama untuk ketenangan tidur Anda.",
  },
  {
    icon: Handshake,
    bg: "bg-[#ffdeae] text-[#281900]",
    title: "Pengelola Siaga & Tanggap",
    desc: "Rumah pemilik berada di kompleks yang sama. Segala kendala seperti pompa air, lampu taman, atau perbaikan kecil langsung tertangani cepat tanpa birokrasi berbelit.",
  },
];

const FACILITIES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDud47LpIS0psfJqqvzd8fYBrrCuSmXG1kxLbw5Ic8-2dWvEG7Ng2CrHb2DND6U_3V9qiCcI-4tkR27q1fg2qfq-v6eazjYSCVshlBf9qzSTX7Cjkofn_mMSQqhxVXtIfLjRwieDyuz_VpKHRfRFUUMJAyifE1uBaVS-IkJPv3UNhzofvbDIZvR8kXk7_JA4nUhdxOK9QOp_ZR959RypmPB1y5t_L7kUoWNk-aVkOU",
    alt: "Taman tengah dan gazebo warga",
    tag: "Area Hijau & Santai",
    title: "Taman Tengah & Gazebo Warga",
    desc: "Tempat bersantai sore, membaca buku, atau sekadar menghirup udara segar bersama keluarga.",
    span: "md:col-span-7",
    h: "h-[440px]",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBEvQqCJ_Lk3ijzenJdy_NwqnHAo91Qy89qRE9ec5UFwq8bAa6LkYNgQwrFi5nyL1RcELEQZZyouHpyIRTe-Q2xI8oAcyO3aZoGGB2xYxqwIAHDqPlAiobJg0jCpCzBGQog8_c1V8ZbgLPejbP-2ssFuE3Jgl_x8KIgTNOKmig3fQoLCU7xnSDLtSEfL-V8-Oe3E20OOlcdfsQAFAfpllTLHfdAcWU4tsz72ZD8j0",
    alt: "Parkiran motor berkanopi",
    tag: "Parkir Rapi",
    title: "Parkiran Motor Berkanopi",
    desc: "Terlindung dari hujan terik dan diawasi CCTV 24 jam non-stop.",
    span: "md:col-span-5",
    h: "h-[440px]",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvzN_w2VgVNxCQ3tg1kl0MsJ-z_KxI3U_ZhtlHgGnSRIIEdpAAdafIi8lbokg9_csjoVQDosyZCTsPZZzV3C_uZuHiFlOKMGee6fUzKcGdLQ5p-IAZZRkB4m24TtwgfY7USU87FIdDfq5e-FEMFPiW-DdoSlL3cRMcuOEklRTS10eVWE0utwgGkvA9_7F2y7HNQRyv0djrwcRIDlYBBQ-6OJ6vWWehNkedhWnaKfg",
    alt: "Area jemuran terlindung",
    tag: "Area Jemuran Terlindung",
    title: "Bebas Khawatir Hujan",
    desc: "Jemuran cepat kering berkat atap transparan.",
    span: "md:col-span-4",
    h: "h-[380px]",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh43x-hiE1fhKauyHARFZdehdYAyXWOFUjy3upZrnvYLLQZQg8BPNJon8mit8xv9C1nWIR8OjT_5EkiJvYwEHak1DW1wgxEOsG0L-XQrsDo8sJlY2SJocL7Q-0ev1d7dgYq3XlabdO1A4OolcMrdCgghPVQbqn7P3xUsTIlLxdLlnjCMFD7bAyFkIUEUdULe-Y2VTa9DfqGLyL0i-kD64cyTDUxIJfsS4IWrFsRRo",
    alt: "Mushola dekat lokasi",
    tag: "Mushola Dekat",
    title: "1 Menit Jalan Kaki",
    desc: "Ibadah harian berjamaah lebih mudah dan tenang.",
    span: "md:col-span-4",
    h: "h-[380px]",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Or2ybH3wzARyCSN1aeZLQ4vfN87qWnwtemZvcBVEhkuE-PStCnyX-Vw-aJbecyXb6oqyTVUxUEu2IiGXKIstdmMj1RTiKeE6bonjhPcO85hpfcPVJwbgxMm-fahtt9a2r_fLYIvdXhsne81jx6u4XrYcSIXOmUn6kPgKZrWeb7iH8mUiVyAEYFrEN2rqY9O8yqBQoxNC_h2NCB1QBya_0aDoT7L0YE6FIp9AKko",
    alt: "Gerbang dan CCTV keamanan",
    tag: "Pantauan Keamanan",
    title: "CCTV & Portal Gerbang",
    desc: "Tamu wajib lapor, lingkungan aman terlindungi.",
    span: "md:col-span-4",
    h: "h-[380px]",
  },
];

const ACCESS = [
  {
    icon: TrainFront,
    bg: "bg-[#bdeddb] text-[#013428]",
    title: "5 Menit ke Stasiun Commuter Line",
    desc: "Mudah akses harian menuju Jakarta, Sudirman, dan Bogor tanpa macet.",
  },
  {
    icon: Store,
    bg: "bg-[#ffdbce] text-[#974723]",
    title: "3 Menit ke Minimarket & ATM",
    desc: "Alfamart, Indomaret, apotek, dan anjungan ATM 24 jam siap jalan kaki.",
  },
  {
    icon: Hospital,
    bg: "bg-[#ffdeae] text-[#281900]",
    title: "7 Menit ke Rumah Sakit & Klinik",
    desc: "Fasilitas kesehatan rujukan 24 jam untuk kesiapsiagaan seluruh anggota keluarga.",
  },
  {
    icon: GraduationCap,
    bg: "bg-[#e6e9e5] text-[#013428]",
    title: "4 Menit ke SD, SMP, & TK Islam",
    desc: "Sangat ramah anak, antar-jemput sekolah lebih hemat waktu dan bahan bakar.",
  },
];

export default async function HomePage() {
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
    <PublicLayout>
      {/* ————— HERO BANNER CAROUSEL FULL WIDTH ————— */}
      <GriyaHero />

      {/* ————— STATS OVERLAP ————— */}
      <section className="relative z-20 -mt-10 mb-6 w-full bg-[#f7faf6] px-4 lg:px-8">
        <div className="w-full">
          <div className="rounded-2xl border border-[#e0e3e0] bg-white p-4 shadow-lg sm:p-6">
            <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.title}
                  className={`flex flex-col items-center p-2 text-center ${
                    i > 0 ? "md:border-l md:border-[#e0e3e0]" : ""
                  }`}
                >
                  <span className="text-2xl font-bold tracking-tight text-[#013428]">
                    {s.value}
                  </span>
                  <span className="mt-0.5 text-lg font-semibold text-[#013428]">
                    {s.title}
                  </span>
                  <p className="text-sm text-[#404945]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————— KEUNGGULAN ————— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Keunggulan Hunian
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
              Kenyamanan Seperti Rumah Sendiri
            </h2>
            <p className="mt-1 max-w-2xl text-base text-[#404945]">
              Kami mendesain dan mengelola Griya Teduh dengan mengedepankan
              keamanan anak-anak, privasi tiap keluarga, dan kebersihan
              lingkungan harian.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${v.bg}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-[#013428]">
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#404945]">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————— PILIHAN UNIT ————— */}
      <section className="w-full bg-[#f7faf6] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <span className="mb-1 block text-sm font-semibold uppercase tracking-wider text-[#974723]">
                Ketersediaan Unit
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
                Pilihan Tipe Unit Populer
              </h2>
            </div>
            <Link
              href="/kontrakan"
              className="inline-flex items-center gap-1 text-base font-semibold text-[#013428] transition-colors hover:text-[#1e4b3e]"
            >
              Lihat Seluruh Tipe & Spesifikasi
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#c0c8c3] bg-white px-6 py-16 text-center">
              <Building2 className="mx-auto h-6 w-6 text-[#717975]" />
              <p className="mt-3 text-sm text-[#404945]">
                Belum ada kontrakan tayang. Hubungi pengelola untuk info stok.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((p) => {
                const available = p.units.filter(
                  (u) => u.status === "AVAILABLE"
                ).length;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {p.images[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#ecefeb]">
                          <Building2 className="h-8 w-8 text-[#717975]" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#013428] shadow-sm backdrop-blur-sm">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            available > 0 ? "bg-[#1e4b3e]" : "bg-[#ba1a1a]"
                          }`}
                        />
                        {available > 0
                          ? `Tersedia ${available} Unit`
                          : "Penuh (Antrian Buka)"}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-1 flex items-baseline justify-between">
                        <h3 className="text-lg font-bold text-[#013428]">
                          {p.name}
                        </h3>
                        <div className="text-right">
                          <span className="text-xl font-bold text-[#013428]">
                            {formatRupiah(p.monthlyPriceFrom.toNumber())}
                          </span>
                          <span className="-mt-1 block text-sm text-[#404945]">
                            /bulan
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 flex items-center gap-1.5 text-sm text-[#717975]">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{p.address}</span>
                      </p>
                      {p.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-[#404945]">
                          {p.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-2">
                        <Link
                          href={`/kontrakan/${p.slug}`}
                          className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#013428] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1e4b3e]"
                        >
                          Detail Unit
                        </Link>
                        <a
                          href="https://wa.me/6281234567890"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Tanya via WA"
                          className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ecefeb] text-[#013428] transition-colors hover:bg-[#e6e9e5]"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ————— FASILITAS BENTO ————— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Fasilitas Bersama
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
              Suasana Sejuk, Tenang, & Terawat
            </h2>
            <p className="mt-1 max-w-2xl text-base text-[#404945]">
              Setiap sudut dirancang agar Anda bisa beristirahat tenang setelah
              lelah beraktivitas seharian di luar rumah.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {FACILITIES.map((f) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm ${f.span} ${f.h}`}
              >
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#013428]/90 via-[#013428]/30 to-transparent p-6 text-white">
                  <span className="mb-1 inline-flex items-center gap-1 text-sm font-semibold text-[#bdeddb]">
                    {f.tag}
                  </span>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="max-w-md text-sm text-[#e6e9e5]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— TESTIMONI ————— */}
      <section className="w-full bg-[#f7faf6] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Kisah Penghuni
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#013428]">
              Apa Kata Mereka yang Sudah Tinggal?
            </h2>
            <p className="mt-1 max-w-xl text-base text-[#404945]">
              Bukan sekadar hubungan penyewa dan pemilik, kami saling menjaga
              rasa hormat dan kenyamanan bertetangga.
            </p>
          </div>
          <div className="mt-2">
            <GriyaTestimonials />
          </div>
        </div>
      </section>

      {/* ————— LOKASI & AKSES ————— */}
      <section className="w-full bg-[#f1f4f1] py-10">
        <div className="grid w-full grid-cols-1 items-center gap-6 px-4 lg:grid-cols-12 lg:px-8">
          <div className="flex flex-col lg:col-span-6">
            <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#974723]">
              Lokasi & Akses
            </span>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#013428]">
              Semua Kebutuhan Hidup Berada Dalam Jangkauan Singkat
            </h2>
            <p className="mb-6 leading-relaxed text-[#404945]">
              Berada di kawasan pemukiman Sukamaju, Cilodong yang tenang namun
              hanya hitungan menit dari jalur utama arteri dan sentra
              transportasi publik.
            </p>
            <div className="space-y-2">
              {ACCESS.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.bg}`}
                    >
                      <Icon className="h-[22px] w-[22px]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold leading-tight text-[#013428]">
                        {a.title}
                      </h4>
                      <p className="text-sm text-[#404945]">{a.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col lg:col-span-6">
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="relative h-[420px] w-full overflow-hidden rounded-xl shadow-inner">
                <iframe
                  title="Peta lokasi Griya Teduh"
                  src="https://maps.google.com/maps?q=Jl.%20Melati%20Indah%20Sukamaju%20Cilodong%20Depok&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-[#f7faf6]/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                  <MapPin className="h-[18px] w-[18px] text-[#013428]" />
                  <span className="text-xs font-semibold text-[#181c1b]">
                    Griya Teduh, Cilodong
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start justify-between gap-2 pt-1 sm:flex-row sm:items-center">
                <div className="flex items-start gap-1 text-sm text-[#404945]">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#013428]" />
                  Jl. Melati Indah No. 14, RT 03 / RW 07, Sukamaju, Depok
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Jl.+Melati+Indah+Sukamaju+Cilodong+Depok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#013428] hover:text-[#1e4b3e]"
                >
                  Buka Petunjuk Arah
                  <MapIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— CTA SURVEI ————— */}
      <section className="w-full bg-[#f7faf6] py-10">
        <div className="w-full px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#013428] p-6 text-white shadow-xl sm:p-10">
            <div className="relative z-10 flex max-w-2xl flex-col items-start">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#bdeddb]/20 px-3 py-1 text-[#bdeddb]">
                <Users className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  Survei Terbuka Setiap Hari (08.00 - 18.00 WIB)
                </span>
              </div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">
                Tertarik atau Ingin Melihat Suasana Langsung?
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-[#e6e9e5]">
                Datang dan rasakan sendiri keteduhan lingkungan Griya Teduh.
                Tanpa perantara calo, langsung disambut oleh Bapak/Ibu
                pengelola dengan secangkir teh hangat.
              </p>
              <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Pak%20Rahman,%20saya%20mau%20janjian%20survei%20ke%20Griya%20Teduh%20hari%20ini/besok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-bold text-[#013428] shadow-md transition-all hover:bg-[#f1f4f1]"
                >
                  <MessageCircle className="h-[22px] w-[22px]" />
                  Hubungi Pengelola via WhatsApp
                </a>
                <div className="flex items-center justify-center gap-1 text-xs text-[#e6e9e5] sm:justify-start">
                  <CircleCheck className="h-[18px] w-[18px]" />
                  Survei Bebas Biaya (Gratis)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— INFO KONTAK RINGKAS ————— */}
      <section className="w-full bg-[#f7faf6]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-4 px-4 pb-14 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#bdeddb] text-[#013428]">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold text-[#013428]">Jl. Melati Indah No. 14</p>
              <p className="text-[#717975]">Sukamaju, Cilodong, Depok</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdbce] text-[#974723]">
              <Phone className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold text-[#013428]">(0812) 3456-7890</p>
              <p className="text-[#717975]">Bpk. H. Rahman & Ibu Siti</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e0] bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdeae] text-[#281900]">
              <Clock3 className="h-5 w-5" />
            </span>
            <div className="text-sm">
              <p className="font-bold text-[#013428]">Survei 08.00 - 18.00 WIB</p>
              <p className="flex items-center gap-1 text-[#717975]">
                <BadgeCheck className="h-3.5 w-3.5" /> Mohon kabari 1 jam
                sebelumnya
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
