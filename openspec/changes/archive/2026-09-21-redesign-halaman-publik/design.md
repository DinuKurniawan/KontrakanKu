# Design

## Context

Lihat `proposal.md` (Why) untuk motivasi. Kondisi saat ini: halaman publik sudah fungsional (data PUBLISHED via Prisma, galeri `gallery-viewer.tsx`, katalog `property-catalog.tsx`, `testimonial-carousel.tsx`, `hero-carousel.tsx`) tetapi memakai tema gelap-emas yang berat (`globals.css`: `paper #121212`, `gold #d4af37`) dan bertentangan dengan arah visual PRD (calm, clean, warm, trustworthy). Scope desain ini hanya area publik; `/admin/*`, `/dashboard/*`, skema DB, dan API tidak berubah.

## Goals / Non-Goals

**Goals:**

- Bahasa visual terang-elegan khusus publik yang konsisten di 5 rute.
- Struktur section per halaman yang tidak berulang dan memprioritaskan konversi ke katalog/WA.
- Komponen bersama yang dapat dipakai ulang tanpa duplikasi gaya.

**Non-Goals:**

- Mengubah skema Prisma, Server Actions, auth/billing, atau portal admin/penyewa.
- Menambah CMS, payment gateway, atau i18n.
- Dark-mode toggle publik (tema terang adalah default; preferensi gelap OS tidak wajib didukung di change ini).

## Decisions

1. **Terang elegan sebagai default publik, token terpusat di `globals.css`.**
   - Off-white/warm gray background, charcoal text, aksen sage-muted + gold kalem; skala display/body/mono + radius/shadow tunggal.
   - Alternatif dipertimbangkan: mempertahankan tema gelap-emas — ditolak karena kontras berat, terasa malam-hari untuk produk keluarga, dan bertentangan dengan PRD visual direction.
   - Alternatif: Tailwind dark: variant per halaman — ditolak karena menggandakan gaya dan risiko inkonsistensi.

2. **Satu keluarga komponen publik, bukan restyle per halaman.**
   - `public-layout/navbar/footer`, `whatsapp-float`, tombol (primary/outline/ghost), chip, card, badge/stamp, accordion FAQ, kartu properti/unit, booking card, gallery lightbox.
   - Alternatif: tiap halaman punya gaya sendiri — ditolak karena duplikasi dan drift visual.

3. **Layout per halaman berbasis pola yang sudah terbukti.**
   - Home: hero 2-kolom (copy + visual) -> stats strip -> fasilitas grid -> unit pilihan 3 kartu -> 3 langkah -> testimoni -> FAQ preview -> CTA survei.
   - Katalog: hero ringkas + kontrol filter/search/sort sticky -> grid kartu -> empty state -> CTA WA.
   - Detail: breadcrumb + header harga/status -> galeri -> grid 2-kolom (konten + sticky booking card) -> fasilitas per-unit -> unit grid -> peta -> mobile bottom bar.
   - Tentang: hero 2-kolom -> metrik strip -> prinsip 3 kartu -> lokasi (info + peta) -> quote.
   - FAQ: hero + search + chip kategori -> 2-kolom (accordion + aside WA sticky).
   - Alternatif: single long-scroll naratif — ditolak karena menyulitkan pemindaian cepat info harga/stok.

4. **Gambar via `next/image` + lazy di bawah lipatan; hormati `prefers-reduced-motion`.**
   - Carousel/lightbox tetap ringan (tanpa lib berat), animasi hanya fade/slide halus yang bisa dimatikan OS.
   - Alternatif: lib carousel/animasi pihak ketiga — ditolak kecuali terbukti perlu, untuk menjaga bundle dan performa.

5. **Data flow tidak berubah; hanya presentasi.**
   - Query Prisma yang sama (PUBLISHED + cover + status unit; admin phone untuk WA). Pesan WA di-encode per properti. Tidak ada endpoint baru.
   - Alternatif: API katalog baru — tidak perlu, server component yang ada sudah cukup.

## Risks / Trade-offs

- [Risk] Tema terang baru bertabrakan dengan sisa gaya gelap global → Mitigasi: token publik di-scope jelas, audit `globals.css`/daisyUI theme, screenshot 5 rute sebelum/sesudah.
- [Risk] Foto properti bervariasi (rasio/kualitas) merusak grid elegan → Mitigasi: aspect-ratio tetap + placeholder + object-cover, cover fallback.
- [Risk] Sticky booking card/mobile bar menutupi konten di layar kecil → Mitigasi: padding-bottom safe-area, z-index terkontrol, uji 360px.
- [Risk] Peta Google iframe memperlambat load → Mitigasi: lazy iframe, placeholder statis, tombol Rute sebagai fallback.
- [Trade-off] Light elegan mengurangi kesan "premium gelap-emas" lama → diterima; premium dicapai via whitespace, tipografi, dan kerapian, sesuai PRD.

## Migration Plan

1. Terapkan token + komponen bersama di branch change ini; tidak ada migrasi data.
2. Restyle per halaman berurutan: chrome bersama -> Home -> katalog -> detail -> tentang/FAQ.
3. Verifikasi: `npm run lint`, `npx tsc --noEmit`, `npm run build`, checklist screenshot desktop + 360px per rute, keyboard-check accordion/menu/lightbox.
4. Rollback: revert change ini saja; tidak ada perubahan DB/API sehingga aman.

## Open Questions

- Foto/ilustrasi hero baru: pakai foto properti asli yang ada atau sediakan aset baru? (Tidak memblokir spek maupun task; diputuskan saat implementasi dengan fallback ke foto cover yang ada.)
