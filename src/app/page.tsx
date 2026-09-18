import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import {
  Building2,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  KeyRound,
  Droplets,
  Wifi,
  Car,
  Clock3,
  Star,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { PropertyStatus } from "@prisma/client";
import PublicLayout from "@/components/public-layout";
import HeroCarousel from "@/components/hero-carousel";
import TestimonialCarousel from "./testimonial-carousel";

const FACILITIES = [
  {
    icon: Wifi,
    title: "WiFi tiap blok",
    desc: "Router sendiri per blok kontrakan — cukup untuk kerja dan kuliah daring dari kamar.",
    tag: "Konektivitas",
  },
  {
    icon: KeyRound,
    title: "Kunci tercatat",
    desc: "Gembok dan duplikat dicatat di buku. Serah terima kunci dicek bersama saat masuk dan keluar.",
    tag: "Keamanan",
  },
  {
    icon: Droplets,
    title: "Air & token mandiri",
    desc: "Air bersih sudah termasuk. Token listrik per kamar — bayar sesuai pakai, tidak patungan.",
    tag: "Utilitas",
  },
  {
    icon: Car,
    title: "Parkir & jalan lebar",
    desc: "Motor dan mobil bisa masuk. Lingkungan bebas banjir, dekat stasiun dan minimarket.",
    tag: "Lokasi",
  },
];

const STEPS = [
  {
    no: "01",
    title: "Pilih di katalog",
    desc: "Foto asli, harga mulai yang jelas, sisa unit diperbarui berkala. Yang tertulis tersedia memang tersedia.",
  },
  {
    no: "02",
    title: "Survei di hari yang sama",
    desc: "Chat 0813-8463-4526, janjian pukul 08.00–18.00, lalu cek air, listrik, dan tetangga langsung di lokasi.",
  },
  {
    no: "03",
    title: "Akad & pantau tagihan",
    desc: "Transfer ke BCA, Mandiri, BNI, atau BRI, upload bukti dari HP, pantau status sampai LUNAS.",
  },
];

const TESTIMONIALS = [
  {
    code: "A-01",
    name: "Andi Pratama",
    unit: "Mawar · 2 tahun",
    text: "Token mandiri jadi tidak rebutan listrik dengan kamar sebelah. Tagihan bisa dicek sendiri, tidak perlu nagih ke siapa-siapa.",
  },
  {
    code: "K-5",
    name: "Siti Rahayu",
    unit: "Melati · 1 tahun",
    text: "Wastafel mampet, lapor jam 9 pagi lewat WA, sore sudah beres. Selama ini begitu terus — cepat ditangani.",
  },
  {
    code: "B-02",
    name: "Budi Santoso",
    unit: "Anggrek · 3 tahun",
    text: "Bayar sewa tinggal transfer lalu foto bukti dari HP. Besoknya status sudah LUNAS. Riwayatnya rapi kalau mau perpanjang.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Apakah unit benar-benar siap huni?",
    a: "Unit dengan status tersedia sudah dibersihkan serta dicek listrik dan airnya sebelum ditawarkan.",
  },
  {
    q: "Bagaimana cara survei?",
    a: "Buka halaman Unit, pilih kontrakan, lalu hubungi pengelola via WhatsApp untuk jadwal survei 08.00–18.00 WIB.",
  },
  {
    q: "Bagaimana pembayarannya?",
    a: "Transfer ke rekening resmi (BCA / Mandiri / BNI / BRI), upload bukti, lalu diverifikasi admin.",
  },
  {
    q: "Perlu akun dulu?",
    a: "Akun dibuatkan pengelola saat akad. Masuk dengan email untuk memantau tagihan bulanan.",
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
      {/* ————— HERO ————— */}
      <section className="relative w-full overflow-x-clip border-b hairline">
        <div className="shell relative grid w-full gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="min-w-0">
            <p className="eyebrow">Cilandak · Dikelola sejak 2018</p>
            <h1 className="mt-5 font-display text-[2.75rem] font-medium leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]">
              Tinggal tenang
              <br />
              di <em className="font-light italic text-moss">selatan</em> Jakarta.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-bark sm:text-lg sm:leading-8">
              Kontrakan keluarga yang terawat — token mandiri per kamar,
              tagihan tercatat satu per satu, dan pengelola yang menjawab
              langsung via WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/kontrakan" className="btn-elegant-primary !px-7 !py-3.5 !text-[15px]">
                Lihat unit tersedia <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-elegant-outline !px-7 !py-3.5 !text-[15px]">
                Masuk
              </Link>
            </div>
            <dl className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
                <dt className="sr-only">Skor ulasan</dt>
                <dd><span className="font-bold text-ink">4.9/5</span> <span className="text-fog">· 18 ulasan</span></dd>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block" aria-hidden />
              <div className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-moss" aria-hidden />
                <dt className="sr-only">Waktu respon</dt>
                <dd className="font-semibold text-ink">Respon {"<1 jam"}</dd>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block" aria-hidden />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-moss" aria-hidden />
                <dd className="font-semibold text-ink">Langsung pengelola</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -inset-3 rounded-[2.5rem] border hairline" aria-hidden />
            <HeroCarousel />
            <div className="absolute -left-3 top-8 z-20 sm:-left-6">
              <div className="stamp stamp-live -rotate-2 shadow-lift !px-4 !py-2.5 ring-1 ring-[#121212]/30">
                <span className="inline-block h-2 w-2 rounded-full bg-[#121212]" aria-hidden />
                Siap survei minggu ini
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 right-5 z-20 sm:left-8 sm:right-auto">
              <div className="flex items-center gap-3 rounded-2xl border hairline bg-cream/95 px-4 py-3 shadow-lift backdrop-blur">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist">
                  <BadgeCheck className="h-5 w-5 text-moss" />
                </span>
                <div className="text-[13px] leading-tight">
                  <p className="font-bold text-ink">Difoto ulang tiap unit keluar</p>
                  <p className="text-fog">Bukan foto stok lama</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-y hairline bg-cream/60">
          <div className="shell flex w-full flex-col items-center justify-between gap-2 py-3.5 text-[13px] sm:flex-row">
            <p className="text-bark">
              Pembayaran transfer manual —{" "}
              <span className="font-bold text-ink">BCA · Mandiri · BNI · BRI</span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
              Bukti terverifikasi admin · tercatat rapi
            </p>
          </div>
        </div>
      </section>

      {/* ————— STATS ————— */}
      <section className="w-full bg-paper">
        <div className="shell w-full py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border hairline bg-line shadow-warm lg:grid-cols-4">
            {[
              { v: "2018", l: "Berdiri sejak", s: "Dikelola keluarga" },
              { v: "120+", l: "Penyewa tercatat", s: "Tertib administrasi" },
              { v: "<1 jam", l: "Rata-rata balasan", s: "Chat langsung direspons" },
              { v: "4.9/5", l: "Skor kepuasan", s: "Dari ulasan terverifikasi" },
            ].map((s) => (
              <div key={s.l} className="bg-cream px-6 py-7 sm:px-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">{s.l}</p>
                <p className="mt-2 font-display text-4xl font-medium tracking-tight text-gold sm:text-[2.75rem]">
                  {s.v}
                </p>
                <p className="mt-1 text-[13px] text-fog">{s.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— FACILITIES BENTO ————— */}
      <section className="w-full bg-paper">
        <div className="shell w-full pb-14 sm:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow">Fasilitas</p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.05]">
                Semua yang Anda butuhkan, sudah tersedia.
              </h2>
            </div>
            <Link href="/kontrakan" className="btn-elegant-ghost !px-2 text-gold">
              Jelajahi unit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FACILITIES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card-dossier animate-fade-up group p-6 sm:p-7"
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-[#121212]">
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bark">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————— FEATURED ————— */}
      <section className="w-full border-y hairline bg-cream/50">
        <div className="shell w-full py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Unit pilihan</p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
                Tersedia minggu ini
              </h2>
              <p className="mt-2 text-sm text-bark">
                Foto asli, siap survei kapan saja.
              </p>
            </div>
            <Link href="/kontrakan" className="btn-elegant-outline hidden sm:inline-flex">
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="mt-8 rounded-[1.75rem] border-2 border-dashed border-line bg-paper px-6 py-16 text-center">
              <Building2 className="mx-auto h-6 w-6 text-fog" />
              <p className="mt-3 text-sm text-bark">
                Belum ada kontrakan tayang. Hubungi pengelola untuk info stok.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featuredProperties.map((p, idx) => {
                const available = p.units.filter((u) => u.status === "AVAILABLE").length;
                const total = p.units.length;
                return (
                  <article
                    key={p.id}
                    className="card-dossier animate-fade-up overflow-hidden"
                    style={{ animationDelay: `${idx * 90}ms` }}
                  >
                    <figure className="relative m-0 aspect-[16/10] overflow-hidden bg-sand">
                      {p.images[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Building2 className="h-8 w-8 text-fog" />
                        </div>
                      )}
                      <span className={`stamp absolute right-4 top-4 shadow-warm ${
                        available > 0 ? "stamp-open" : "stamp-muted"
                      }`}>
                        {available > 0 && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
                        )}
                        {available > 0 ? `${available} tersedia` : "Penuh"}
                      </span>
                    </figure>
                    <div className="p-6">
                      <p className="font-display text-[1.4rem] font-semibold tracking-tight text-gold">
                        {formatRupiah(p.monthlyPriceFrom.toNumber())}
                        <span className="font-sans text-sm font-normal text-fog"> /bulan</span>
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold tracking-tight text-ink">
                        {p.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-fog">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{p.address}</span>
                      </p>
                      {p.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-bark">
                          {p.description}
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between border-t hairline pt-4">
                        <span className="tick text-xs text-fog">
                          {available}/{total} unit tersedia
                        </span>
                        <Link
                          href={`/kontrakan/${p.slug}`}
                          className="btn-elegant-ghost !p-0 font-bold text-gold"
                        >
                          Detail <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <Link href="/kontrakan" className="btn-elegant-outline mt-6 w-full sm:hidden">
            Lihat semua unit
          </Link>
        </div>
      </section>

      {/* ————— STEPS ————— */}
      <section className="w-full bg-paper">
        <div className="shell w-full py-14 sm:py-20">
          <p className="eyebrow">Cara sewa</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
            Tiga langkah sampai serah terima kunci.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, idx) => (
              <div
                key={s.no}
                className="card-dossier animate-fade-up p-7"
                style={{ animationDelay: `${idx * 90}ms` }}
              >
                <span className="tick text-xs font-semibold text-moss">Langkah {s.no} / 03</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-bark">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— TESTIMONIALS ————— */}
      <section className="w-full bg-pine">
        <div className="shell w-full py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Cerita penyewa</p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.05]">
                Dipercaya sejak 2018.
              </h2>
            </div>
            <p className="tick text-sm text-ink/60">18 ulasan · rata-rata 4.9</p>
          </div>

          <div className="mt-10" aria-label="Testimoni penyewa">
            <TestimonialCarousel items={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {/* ————— FAQ PREVIEW ————— */}
      <section className="w-full bg-paper">
        <div className="shell grid w-full gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Pertanyaan yang sering ditanyakan.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-bark">
              Tidak menemukan jawaban? Hubungi kami langsung via WhatsApp — dibalas manusia, bukan bot.
            </p>
            <Link href="/faq" className="btn-elegant-primary mt-6">
              Lihat semua FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-[1.25rem] border hairline bg-cream transition-shadow duration-300 open:shadow-warm"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 pr-6 text-left font-semibold text-[15px] text-ink [&::-webkit-details-marker]:hidden">
                  <span className="tick shrink-0 rounded-full bg-cream px-2.5 py-1 text-[11px] text-bark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{f.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hairline text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45 group-open:bg-gold group-open:text-[#121212]" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pl-[4.25rem] text-sm leading-6 text-bark">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CTA ————— */}
      <section className="w-full bg-paper">
        <div className="shell w-full pb-16 sm:pb-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-pine bg-pine px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink/60">
                Jl. Cilandak Barat No. 28
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl sm:leading-[1.05]">
                Lihat unitnya langsung <em className="font-light italic">minggu ini.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-bark">
                Survei pukul 08.00–18.00, setiap hari. Janjian via WhatsApp,
                putuskan dengan tenang setelah lihat sendiri.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/kontrakan"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[15px] font-bold text-[#121212] transition hover:bg-[#e6c75a] sm:w-auto"
                >
                  Lihat kontrakan <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-ink ring-1 ring-ink/40 transition hover:bg-ink/10 sm:w-auto"
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
