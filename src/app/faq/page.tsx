'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Plus, Minus, ArrowUpRight, MessageCircle, KeyRound, PhoneCall, FileQuestion, Archive } from 'lucide-react'
import AutoReveal from '@/components/auto-reveal'

interface FAQItem {
  question: string
  answer: string
  category: 'unit' | 'payment' | 'account'
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'unit',
    question: 'Apakah unit kontrakan dan kamar sudah siap huni?',
    answer: 'Ya, seluruh unit yang berstatus TERSEDIA (AVAILABLE) di katalog telah dibersihkan, diperiksa kondisinya, dan siap untuk langsung ditempati oleh penyewa baru.',
  },
  {
    category: 'unit',
    question: 'Bagaimana cara melakukan survei langsung ke lokasi kontrakan?',
    answer: 'Anda dapat memilih kontrakan yang diminati di halaman Unit, lalu klik tombol "Hubungi Pengelola" via WhatsApp untuk menentukan jadwal kunjungan survei fisik bersama tim kami.',
  },
  {
    category: 'unit',
    question: 'Berapa minimal periode waktu sewa kontrakan?',
    answer: 'Secara default, periode sewa dihitung secara bulanan (1 bulan) yang dapat diperpanjang secara berkelanjutan setiap bulannya melalui portal tagihan penyewa.',
  },
  {
    category: 'unit',
    question: 'Apakah biaya sewa sudah termasuk listrik dan air?',
    answer: 'Fasilitas air (PDAM/Sumur) dan WiFi sudah termasuk dalam biaya bulanan. Untuk listrik menggunakan meteran token mandiri pada masing-masing kamar agar pemakaian listrik transparan dan terkontrol oleh penyewa sendiri.',
  },
  {
    category: 'payment',
    question: 'Metode pembayaran apa saja yang diterima?',
    answer: 'Pembayaran dilakukan melalui transfer bank manual ke rekening resmi pengelola (BCA, Mandiri, BNI, BRI, dsb). Nomor rekening tujuan tercantum secara detail di portal pembayaran penyewa.',
  },
  {
    category: 'payment',
    question: 'Format berkas bukti transfer apa yang didukung?',
    answer: 'Sistem kami menerima foto bukti transfer atau tangkapan layar (screenshot) berformat JPG, JPEG, PNG (yang otomatis dikompresi ke WebP berkecepatan tinggi) serta berkas PDF resmi dari aplikasi mobile banking dengan ukuran maksimal 5 MB.',
  },
  {
    category: 'payment',
    question: 'Kapan tagihan sewa bulanan diterbitkan?',
    answer: 'Tagihan bulanan dibuat secara otomatis oleh sistem sebelum tanggal jatuh tempo sewa Anda dan dapat dicek setiap saat di dashboard portal penyewa.',
  },
  {
    category: 'payment',
    question: 'Berapa lama proses verifikasi bukti transfer setelah diunggah?',
    answer: 'Pengelola memverifikasi bukti pembayaran secara berkala. Begitu disetujui oleh pengelola, status tagihan Anda langsung berubah menjadi LUNAS seketika dan tercatat di riwayat pembayaran.',
  },
  {
    category: 'account',
    question: 'Bagaimana cara mendapatkan akun penyewa di aplikasi ini?',
    answer: 'Akun penyewa dibuatkan oleh pengelola kontrakan saat Anda mulai menempati unit. Setelah akun siap, masuk lewat tombol "Masuk" memakai email yang diberikan pengelola.',
  },
  {
    category: 'account',
    question: 'Apakah saya bisa melihat riwayat seluruh transaksi pembayaran saya?',
    answer: 'Tentu! Portal penyewa menyediakan menu Riwayat Pembayaran lengkap dengan tanggal bayar, nominal transfer, status verifikasi, dan salinan bukti transfer Anda.',
  },
  {
    category: 'account',
    question: 'Bagaimana jika ada kerusakan fasilitas atau kendala di kamar kontrakan?',
    answer: 'Penyewa dapat langsung menghubungi nomor WhatsApp pengelola kontrakan di 0813-8463-4526 untuk penanganan perbaikan fasilitas dengan cepat.',
  },
]

const CATEGORY_LABEL: Record<FAQItem['category'], string> = {
  unit: 'Unit & Sewa',
  payment: 'Tagihan & Pembayaran',
  account: 'Akun Penyewa',
}

const CATEGORY_ORDER: FAQItem['category'][] = ['unit', 'payment', 'account']
const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Unit', href: '/kontrakan' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'FAQ', href: '/faq' },
]

const WA_LINK = 'https://wa.me/6281384634526?text=Halo%20Pengelola%2C%20saya%20ingin%20bertanya%20seputar%20kontrakan'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | FAQItem['category']>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndices, setOpenIndices] = useState<number[]>([0])

  const filteredFAQs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return FAQ_DATA.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory
      const matchSearch = q === '' || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  function toggleFAQ(index: number) {
    setOpenIndices((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const counts = useMemo(() => {
    return {
      all: FAQ_DATA.length,
      unit: FAQ_DATA.filter((i) => i.category === 'unit').length,
      payment: FAQ_DATA.filter((i) => i.category === 'payment').length,
      account: FAQ_DATA.filter((i) => i.category === 'account').length,
    }
  }, [])

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
                  l.href === '/faq' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-transparent hover:border-[#0F1F33] hover:bg-white'
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
            <Link key={l.label} href={l.href} className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-wide ${l.href === '/faq' ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#E9E5DD] bg-[#FFFBF0]'}`}>
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
              <span className="h-2 w-2 bg-[#D93D30]" aria-hidden /> FAQ — Kartu Katalog / 02
            </span>
            <span className="hidden sm:inline text-[#0F1F33]/50">Buku Pertanyaan · update Des 2026</span>
            <span className="tabular-nums">{FAQ_DATA.length} kartu</span>
          </div>
        </div>

        {/* Hero — typewriter */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 py-8 lg:py-10">
            <div className="col-span-12 lg:col-span-7">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0F1F33]/60">
                <FileQuestion className="h-3 w-3" /> Kotak pertanyaan — ketik, cari, buka
              </p>
              <h1 className="mt-3 font-display text-[38px] sm:text-[48px] lg:text-[54px] font-[900] leading-[0.86] tracking-[-0.045em]">
                Pertanyaan
                <br />
                <span className="text-outline">yang sering</span>
                <br />
                ditanya<span className="text-[#D93D30]">.</span>
              </h1>
              <p className="mt-4 max-w-[42ch] text-[14px] leading-6 text-[#0F1F33]/70">
                Jawaban langsung tanpa bertele-tele. Kartu katalog di sebelah kanan bisa dibuka satu per satu — seperti laci kartu perpustakaan.
              </p>
              <div className="mt-5 hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#0F1F33]/50">
                <span className="h-px w-8 bg-[#0F1F33]/20" /> Ketik kata kunci atau pilih laci kategori
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div className="border-[1.5px] border-[#0F1F33] bg-white p-4 shadow-[6px_6px_0_rgba(15,31,51,0.10)]">
                <div className="flex items-center justify-between border-b border-[#0F1F33]/10 pb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">Mesin Ketik — Cari kartu</span>
                  <span className="font-mono text-[10px] text-[#0F1F33]/40">⌘ K</span>
                </div>
                <label htmlFor="faq-search" className="sr-only">Cari pertanyaan</label>
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1F33]/40" />
                  <input
                    id="faq-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari: listrik, bukti transfer, survei..."
                    className="w-full border-[1.5px] border-[#0F1F33] bg-[#FFFBF0] py-3 pl-10 pr-16 font-mono text-sm text-[#0F1F33] placeholder:text-[#0F1F33]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A46A]/30"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 border border-[#0F1F33]/20 bg-white px-2 py-1 font-mono text-[11px] hover:border-[#0F1F33]"
                    >
                      hapus
                    </button>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Coba:</span>
                  {['listrik', 'bukti transfer', 'survei'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSearchQuery(s)}
                      className="border border-[#0F1F33]/15 bg-[#FFFBF0] px-2 py-1 font-mono text-xs hover:border-[#0F1F33] hover:bg-white transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-dashed border-[#0F1F33]/15 pt-3 font-mono text-[11px] text-[#0F1F33]/60">
                  <Archive className="h-3 w-3" /> {filteredFAQs.length} / {FAQ_DATA.length} kartu ditemukan
                  {searchQuery && <span className="ml-auto text-[#D93D30]">· filter aktif</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content — catalog drawer + cards */}
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Sidebar — card catalog drawers */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-[84px] space-y-4">
                <div className="border-[1.5px] border-[#0F1F33] bg-white overflow-hidden">
                  <div className="bg-[#0F1F33] px-3 py-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white">Laci Kategori</span>
                    <span className="h-1.5 w-6 rounded-full bg-[#C8A46A]/60" aria-hidden />
                  </div>
                  <nav className="p-2 flex flex-row lg:flex-col gap-2 overflow-x-auto">
                    {(
                      [
                        { key: 'all' as const, label: 'Semua' },
                        { key: 'unit' as const, label: 'Unit & Sewa' },
                        { key: 'payment' as const, label: 'Tagihan' },
                        { key: 'account' as const, label: 'Akun' },
                      ] as const
                    ).map((cat) => {
                      const active = activeCategory === cat.key
                      const count = counts[cat.key]
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => {
                            setActiveCategory(cat.key)
                            setOpenIndices([0])
                          }}
                          className={`group relative flex shrink-0 items-center justify-between gap-3 border-[1.5px] px-3 py-3 text-left font-mono text-xs transition lg:w-full ${
                            active ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#0F1F33]/15 bg-[#FFFBF0] text-[#0F1F33]/80 hover:border-[#0F1F33]/40 hover:bg-white'
                          }`}
                        >
                          <span className="uppercase tracking-wide font-semibold">{cat.label}</span>
                          <span className={`px-1.5 py-0.5 text-[11px] tabular-nums font-bold border ${active ? 'bg-white text-[#0F1F33] border-white' : 'bg-white border-[#0F1F33]/10 text-[#0F1F33]/60'}`}>
                            {count}
                          </span>
                          {/* brass drawer pull */}
                          <span className={`absolute left-1/2 -bottom-1 hidden h-1 w-8 -translate-x-1/2 rounded-full lg:block ${active ? 'bg-[#C8A46A]' : 'bg-[#0F1F33]/10 group-hover:bg-[#C8A46A]/40'}`} aria-hidden />
                        </button>
                      )
                    })}
                  </nav>
                  <div className="border-t border-[#0F1F33]/10 bg-[#FFFBF0] px-3 py-2 font-mono text-[11px] text-[#0F1F33]/60">
                    Tarik laci untuk ganti kategori
                  </div>
                </div>

                <div className="hidden lg:block border-[1.5px] border-[#0F1F33] bg-white p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#0F1F33]/50">Butuh jawaban cepat?</p>
                  <p className="mt-2 text-sm leading-6 text-[#0F1F33]/70">Chat langsung ke pengelola. Tidak ada bot.</p>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 bg-[#0F1F33] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59] transition">
                    <MessageCircle className="h-4 w-4" /> 0813-8463-4526
                  </a>
                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#0F1F33]/10 pt-3 font-mono text-[10px] text-[#0F1F33]/50">
                    <span>08:00–18:00 · Setiap hari</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main list — punched cards */}
            <section className="col-span-12 lg:col-span-9">
              {filteredFAQs.length === 0 ? (
                <div className="border-[1.5px] border-dashed border-[#0F1F33]/20 bg-white px-6 py-14 text-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#0F1F33]/50">Tidak ada kartu</p>
                  <p className="mx-auto mt-2 max-w-[36ch] text-sm leading-6 text-[#0F1F33]/60">
                    Tidak ada pertanyaan yang cocok dengan “{searchQuery}”. Coba kata kunci lain atau ganti laci.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('all')
                    }}
                    className="mt-4 border-[1.5px] border-[#0F1F33] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide hover:bg-[#0F1F33] hover:text-white transition"
                  >
                    Reset filter
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFAQs.map((item, idx) => {
                    const isOpen = openIndices.includes(idx)
                    const globalIndex = FAQ_DATA.indexOf(item)
                    return (
                      <div
                        key={`${item.category}-${globalIndex}-${item.question}`}
                        className="relative border-[1.5px] border-[#0F1F33] bg-white overflow-hidden hover:shadow-[3px_3px_0_rgba(15,31,51,0.08)] transition-shadow"
                      >
                        {/* punched holes top */}
                        <div className="absolute left-0 right-0 top-0 flex justify-center gap-8 border-b border-dashed border-[#0F1F33]/10 bg-[#FFFBF0]/60 py-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#0F1F33]/10 border border-[#0F1F33]/20" />
                          <span className="h-2 w-2 rounded-full bg-[#0F1F33]/10 border border-[#0F1F33]/20" />
                          <span className="h-2 w-2 rounded-full bg-[#0F1F33]/10 border border-[#0F1F33]/20 hidden sm:block" />
                          <span className="h-2 w-2 rounded-full bg-[#0F1F33]/10 border border-[#0F1F33]/20 hidden sm:block" />
                        </div>

                        <button type="button" onClick={() => toggleFAQ(idx)} aria-expanded={isOpen} className="flex w-full items-start justify-between gap-4 px-4 pt-8 pb-5 text-left sm:gap-6 sm:px-6">
                          <span className="hidden shrink-0 font-mono text-xs font-bold tabular-nums text-[#C8A46A] sm:block sm:pt-1">
                            {String(globalIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="border border-[#0F1F33]/10 bg-[#E9E5DD]/60 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0F1F33]/60">
                                {CATEGORY_LABEL[item.category]}
                              </span>
                              <span className="hidden font-mono text-[10px] text-[#0F1F33]/40 sm:inline">· {String(idx + 1).padStart(2, '0')} / {String(filteredFAQs.length).padStart(2, '0')}</span>
                            </span>
                            <span className="mt-2 block font-display text-[15px] font-bold leading-6 tracking-tight">{item.question}</span>
                            {isOpen && (
                              <span className="mt-3 block border-l-[2.5px] border-[#C8A46A] pl-4 font-mono text-[13px] leading-6 text-[#0F1F33]/70">
                                {item.answer}
                              </span>
                            )}
                          </span>
                          <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center border-[1.5px] transition ${isOpen ? 'border-[#0F1F33] bg-[#0F1F33] text-white' : 'border-[#0F1F33]/20 bg-white text-[#0F1F33]/60'}`} aria-hidden>
                            {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeCategory === 'all' && filteredFAQs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-[#0F1F33]/15 pt-4">
                  {CATEGORY_ORDER.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat)
                        setOpenIndices([0])
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1.5 border-[1.5px] border-[#0F1F33]/15 bg-white px-3 py-1.5 font-mono text-xs font-semibold hover:border-[#0F1F33] transition"
                    >
                      Lihat {CATEGORY_LABEL[cat]} <ArrowUpRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 border-[1.5px] border-[#0F1F33] bg-[#0F1F33] p-4 sm:hidden">
                <p className="font-display text-sm font-bold text-white">Masih ada yang belum jelas?</p>
                <p className="mt-1 text-sm leading-6 text-white/70">Chat pengelola langsung. Survei bisa hari yang sama.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-[#C8A46A] px-3 py-3 text-sm font-bold text-[#0F1F33]">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <Link href="/kontrakan" className="inline-flex items-center justify-center border border-white/20 bg-transparent px-3 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0F1F33] transition">
                    Lihat unit
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-10 border-y-[1.5px] border-[#0F1F33] bg-white">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 sm:px-6 lg:px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-sm font-bold tracking-tight">Tidak ketemu jawabannya?</h2>
              <p className="mt-1 text-sm text-[#0F1F33]/60">Hubungi pengelola atau cek unit yang masih tersedia.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#0F1F33] px-5 py-3 text-sm font-semibold text-white hover:bg-[#115E59] transition">
                Chat WhatsApp <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </a>
              <Link href="/kontrakan" className="inline-flex items-center justify-center border-[1.5px] border-[#0F1F33] bg-white px-5 py-3 text-sm font-semibold hover:bg-[#0F1F33] hover:text-white transition">
                Lihat unit
              </Link>
              <Link href="/tentang" className="hidden items-center gap-1 px-3 py-3 font-mono text-xs font-semibold underline decoration-[#C8A46A] decoration-2 underline-offset-4 sm:inline-flex">
                Tentang kami <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-[1.5px] border-[#0F1F33] bg-[#FFFBF0]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 sm:px-6 lg:px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#0F1F33]/50">© 2026 Kelola Kontrakan · Jakarta Selatan</p>
          <p className="max-w-[44ch] text-xs leading-5 text-[#0F1F33]/50">Dokumen bantuan diperbarui berkala. Untuk masalah teknis akun, sertakan email terdaftar saat chat.</p>
        </div>
      </footer>
    </div>
  )
}
