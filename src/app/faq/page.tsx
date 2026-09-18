'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ArrowUpRight, RotateCcw } from 'lucide-react'
import WhatsAppIcon from '@/components/whatsapp-icon'
import PublicLayout from '@/components/public-layout'

interface FAQItem {
  question: string
  answer: string
  category: 'unit' | 'payment' | 'account'
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'unit',
    question: 'Apakah unit kontrakan dan kamar sudah siap huni?',
    answer: 'Ya, seluruh unit berstatus tersedia telah dibersihkan, diperiksa kondisinya, dan siap langsung ditempati.',
  },
  {
    category: 'unit',
    question: 'Bagaimana cara melakukan survei langsung ke lokasi?',
    answer: 'Pilih kontrakan di halaman Unit, lalu klik Hubungi Pengelola via WhatsApp untuk menentukan jadwal survei.',
  },
  {
    category: 'unit',
    question: 'Berapa minimal periode sewa?',
    answer: 'Periode sewa dihitung bulanan dan dapat diperpanjang setiap bulan. Riwayat pembayaran tersimpan rapi.',
  },
  {
    category: 'unit',
    question: 'Apakah biaya sewa sudah termasuk listrik dan air?',
    answer: 'Air dan WiFi sudah termasuk. Listrik memakai meteran token mandiri per kamar — bayar sesuai pakai.',
  },
  {
    category: 'payment',
    question: 'Metode pembayaran apa saja yang diterima?',
    answer: 'Transfer bank manual ke rekening resmi (BCA, Mandiri, BNI, BRI). Nomor rekening resmi tercantum saat Anda membayar.',
  },
  {
    category: 'payment',
    question: 'Format berkas bukti transfer apa yang didukung?',
    answer: 'Foto atau screenshot JPG, JPEG, PNG serta PDF mobile banking, maksimal 5 MB.',
  },
  {
    category: 'payment',
    question: 'Kapan tagihan bulanan diterbitkan?',
    answer: 'Tagihan dibuat otomatis sebelum jatuh tempo dan dapat dicek kapan saja di dashboard penyewa.',
  },
  {
    category: 'payment',
    question: 'Berapa lama verifikasi bukti transfer?',
    answer: 'Diverifikasi berkala oleh pengelola. Setelah disetujui, status berubah menjadi LUNAS dan tercatat di riwayat.',
  },
  {
    category: 'account',
    question: 'Bagaimana cara mendapatkan akun penyewa?',
    answer: 'Akun dibuatkan pengelola saat Anda mulai menempati unit. Masuk dengan email yang diberikan pengelola.',
  },
  {
    category: 'account',
    question: 'Apakah saya bisa melihat riwayat pembayaran?',
    answer: 'Ya, tersedia riwayat lengkap: tanggal, nominal, status verifikasi, dan salinan bukti transfer.',
  },
  {
    category: 'account',
    question: 'Bagaimana jika ada kerusakan di kamar?',
    answer: 'Hubungi WhatsApp pengelola di 0813-8463-4526 untuk penanganan perbaikan dengan cepat.',
  },
]

const CATEGORY_LABEL: Record<FAQItem['category'], string> = {
  unit: 'Unit & Sewa',
  payment: 'Tagihan & Pembayaran',
  account: 'Akun Penyewa',
}

const CATEGORIES = [
  { key: 'all', label: 'Semua' },
  { key: 'unit', label: 'Unit & Sewa' },
  { key: 'payment', label: 'Tagihan' },
  { key: 'account', label: 'Akun' },
] as const

const WA_LINK = 'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20seputar%20kontrakan'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | FAQItem['category']>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return FAQ_DATA.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory
      const matchSearch = q === '' || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative w-full overflow-x-clip border-b hairline">
        <div className="shell relative w-full pb-10 pt-10 sm:pt-14">
          <p className="eyebrow">Pusat bantuan</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            Ada yang bisa <em className="font-light italic text-moss">kami bantu?</em>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-bark">
            Cari jawaban cepat seputar unit, pembayaran, dan akun penyewa.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-fog" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari: listrik, bukti transfer, survei..."
              className="field !rounded-full !py-4 pl-12 !text-[15px] shadow-warm"
              aria-label="Cari pertanyaan"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Kategori pertanyaan">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`chip !px-5 !py-2.5 !text-sm font-semibold ${activeCategory === cat.key ? 'chip-on' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="w-full border-t hairline bg-cream/40">
        <div className="shell grid w-full grid-cols-1 gap-6 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="w-full min-w-0">
            <p className="tick mb-4 text-[13px] text-fog" aria-live="polite">
              {filteredFAQs.length} jawaban ditemukan
            </p>
            {filteredFAQs.length === 0 ? (
              <div className="rounded-[1.75rem] border-2 border-dashed border-line bg-paper px-6 py-16 text-center">
                <p className="font-display text-xl font-semibold text-ink">Tidak ada hasil untuk “{searchQuery}”</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-bark">
                  Coba kata kunci lain atau ubah kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                  className="btn-elegant-primary mt-6"
                >
                  <RotateCcw className="h-4 w-4" /> Reset filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((item, i) => (
                  <details
                    key={`${item.category}-${item.question}`}
                    className="group rounded-[1.25rem] border hairline bg-white transition-shadow duration-300 open:shadow-warm"
                    {...(i === 0 ? { open: true } : {})}
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-5 pr-6 text-left [&::-webkit-details-marker]:hidden">
                      <span className="tick hidden shrink-0 rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-bark sm:block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="mb-1.5 inline-block rounded-full bg-pine px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper">
                          {CATEGORY_LABEL[item.category]}
                        </span>
                        <span className="block text-[15px] font-bold leading-6 text-ink">
                          {item.question}
                        </span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hairline text-xl font-light leading-none transition-transform duration-300 group-open:rotate-45 group-open:bg-pine group-open:text-paper" aria-hidden>
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pl-5 sm:pl-[4.25rem]">
                      <p className="border-l-2 border-moss/30 pl-4 text-sm leading-6 text-bark">{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit w-full min-w-0 overflow-hidden rounded-[1.75rem] bg-pine p-6 text-paper shadow-warm sm:p-7 lg:sticky lg:top-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">Butuh jawaban cepat?</p>
            <p className="mt-3 font-display text-2xl font-medium leading-snug">
              Chat langsung ke pengelola.
            </p>
            <p className="mt-2 text-sm leading-6 text-paper/70">
              Tanpa bot, dibalas manusia — biasanya di bawah 1 jam.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-bold text-pine transition hover:bg-goldsoft"
            >
              <WhatsAppIcon className="h-4 w-4" /> 0813-8463-4526
            </a>
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">08.00–18.00 · Setiap hari</p>
            <div className="mt-5 border-t border-paper/15 pt-5">
              <Link
                href="/kontrakan"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-paper ring-1 ring-paper/30 transition hover:bg-paper/10"
              >
                Lihat unit tersedia <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}
