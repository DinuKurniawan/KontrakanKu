import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  Quote,
} from 'lucide-react'
import PublicLayout from '@/components/public-layout'

export const metadata = {
  title: 'Tentang Kami — Kelola Kontrakan',
  description: 'Kelola Kontrakan — hunian terawat di Jakarta Selatan dengan tagihan tercatat rapi, pembayaran mudah, dan respon cepat.',
}

const WA_LINK =
  'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20mengenai%20kontrakan'

const METRICS = [
  { v: '2018', l: 'Berdiri sejak', s: 'Dikelola keluarga' },
  { v: '120+', l: 'Penyewa tercatat', s: 'Tertib administrasi' },
  { v: '<1 jam', l: 'Rata-rata balasan', s: 'Chat langsung direspons' },
  { v: '4.9/5', l: 'Skor kepuasan', s: 'Dari ulasan terverifikasi' },
]

const PRINCIPLES = [
  {
    title: 'Transparansi penuh',
    desc: 'Tagihan tercatat otomatis. Bukti transfer tersimpan dan diverifikasi admin satu per satu.',
    points: ['Riwayat lengkap', 'Bukti terarsip', 'Tanpa biaya siluman'],
  },
  {
    title: 'Kemandirian penyewa',
    desc: 'Token listrik per kamar, air bersih, WiFi stabil, dan parkir yang aman untuk motor maupun mobil.',
    points: ['Meteran mandiri', 'WiFi stabil', 'Parkir aman'],
  },
  {
    title: 'Komunikasi langsung',
    desc: 'Langsung WhatsApp ke pengelola — bukan bot, bukan perantara. Perbaikan ditangani cepat.',
    points: ['Balasan <1 jam', 'Survei hari yang sama', 'Bantuan pemeliharaan'],
  },
]

export default function TentangPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative w-full overflow-x-clip border-b hairline">
        <div className="shell relative grid w-full grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
          <div className="min-w-0">
            <p className="eyebrow">Tentang kami</p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Tempat tinggal yang dirawat <em className="font-light italic text-moss">seperti rumah sendiri.</em>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-bark">
              Bukan kos massal. Kami sengaja menjaga skala tetap kecil agar
              setiap kamar terawat dan setiap penyewa kenal siapa yang dihubungi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/kontrakan" className="btn-elegant-primary !px-7 !py-3.5 !text-[15px]">
                Lihat unit <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-elegant-outline !px-7 !py-3.5 !text-[15px]"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
          <div className="card-dossier !transform-none bg-cream/50 p-7 sm:p-9">
            <p className="eyebrow">Yang membedakan</p>
            <ul className="mt-6 space-y-5">
              {[
                { t: 'Token listrik per kamar', d: 'Pemakaian adil, bayar sesuai pakai.' },
                { t: 'Kontrak bulanan fleksibel', d: 'Perpanjang dari HP tanpa ribet.' },
                { t: 'Lingkungan tertata', d: 'Akses jalan lebar, bebas banjir.' },
              ].map((x, i) => (
                <li key={x.t} className="flex items-start gap-4 rounded-2xl border hairline bg-white p-4">
                  <span className="tick flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine font-mono text-xs font-bold text-paper">
                    0{i + 1}
                  </span>
                  <div>
                    <span className="block text-[15px] font-bold text-ink">{x.t}</span>
                    <span className="mt-0.5 block text-sm text-bark">{x.d}</span>
                  </div>
                  <Check className="ml-auto mt-1 h-4 w-4 shrink-0 text-fern" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="w-full bg-pine">
        <div className="shell w-full py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.l} className="border-l border-paper/15 pl-5">
                <p className="font-display text-4xl font-medium tracking-tight text-paper sm:text-5xl">{m.v}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">{m.l}</p>
                <p className="mt-1 text-[13px] text-paper/60">{m.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="w-full bg-paper">
        <div className="shell w-full py-14 sm:py-20">
          <p className="eyebrow">Prinsip kami</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-3xl font-medium tracking-tight sm:text-[2.75rem] sm:leading-[1.05]">
              Tiga hal yang selalu kami jaga.
            </h2>
            <Link href="/faq" className="btn-elegant-ghost !px-2 font-bold text-pine">
              Baca FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((item, i) => (
              <div key={item.title} className="card-dossier animate-fade-up p-7" style={{ animationDelay: `${i * 90}ms` }}>
                <span className="font-display text-5xl font-light text-sand" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-bark">{item.desc}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.points.map((p) => (
                    <span key={p} className="stamp stamp-muted">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="w-full border-y hairline bg-cream/50">
        <div className="shell grid w-full grid-cols-1 gap-5 py-14 sm:py-20 lg:grid-cols-2">
          <div className="card-dossier !transform-none p-7 sm:p-9">
            <p className="eyebrow">Kantor pengelola</p>
            <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Cilandak Barat No. 28
            </h2>
            <p className="mt-3 text-sm leading-6 text-bark">
              Datang survei atau ambil kunci — konfirmasi jadwal dulu via WhatsApp agar kami siap menyambut.
            </p>
            <dl className="mt-7 space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream">
                  <MapPin className="h-4 w-4 text-moss" />
                </span>
                <span className="pt-1.5 text-bark">Jl. Cilandak Barat No. 28, Jakarta Selatan 12430</span>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream">
                  <Clock className="h-4 w-4 text-moss" />
                </span>
                <span className="pt-1.5 text-bark">Senin – Minggu, 08.00 – 18.00</span>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream">
                  <Phone className="h-4 w-4 text-moss" />
                </span>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="pt-1.5 font-bold text-pine underline underline-offset-4">
                  0813-8463-4526
                </a>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream">
                  <Mail className="h-4 w-4 text-moss" />
                </span>
                <span className="pt-1.5 text-bark">pengelola@kontrakan.com</span>
              </div>
            </dl>
            <a
              href="https://maps.google.com/?q=Jl.%20Cilandak%20Barat%20No.%2028%20Jakarta%20Selatan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-elegant-primary mt-8"
            >
              Buka di Google Maps <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="min-h-[320px] w-full overflow-hidden rounded-[1.75rem] border hairline shadow-warm sm:min-h-[400px]">
            <iframe
              title="Peta Lokasi Kantor Pengelola Kontrakan"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.08581702456!2d106.73880497746162!3d-6.283915159049103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1e164bbd90d%3A0x6b801a61f4c7d0d0!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320, height: '100%' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="w-full bg-paper">
        <div className="mx-auto w-full max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <Quote className="mx-auto h-8 w-8 fill-goldsoft text-gold" aria-hidden />
          <blockquote>
            <p className="mt-5 font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-[2rem] sm:leading-[1.3]">
              “Kami sengaja jaga tetap kecil — supaya tiap kamar tetap terawat,
              dan tiap penyewa kenal siapa yang dihubungi.”
            </p>
            <footer className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-fog">
              <span className="font-bold normal-case tracking-normal text-ink text-sm">Pengelola Kontrakan</span>
              <br />Cilandak, sejak 2018
            </footer>
          </blockquote>
        </div>
      </section>
    </PublicLayout>
  )
}
