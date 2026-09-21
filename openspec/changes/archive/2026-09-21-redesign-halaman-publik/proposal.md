# Proposal

## Why

Halaman publik (`/`, `/kontrakan`, `/kontrakan/[slug]`, `/tentang`, `/faq`) adalah wajah pertama calon penyewa, namun tampilannya saat ini terasa tidak konsisten dan kurang premium: tema gelap-emas yang berat, ritme section yang berulang, dan hierarki CTA yang lemah. Redesign modern, profesional, dan elegan dibutuhkan agar kepercayaan naik dan alur Lihat katalog -> Survei via WhatsApp -> Login penyewa menjadi jelas dalam hitungan detik.

## What Changes

- Merombak visual halaman publik ke arah modern-profesional-elegan: terang, lega, hierarki tipografi tegas, spacing konsisten, tanpa mengubah struktur data atau alur bisnis (transfer manual, verifikasi admin, WA).
- Menyeragamkan shared chrome publik: `PublicNavbar`, `PublicFooter`, `PublicLayout`, `WhatsAppFloat` (kontras, sticky behavior, mobile menu, safe-area).
- Mendesain ulang Home (`src/app/page.tsx` + `testimonial-carousel.tsx`, `hero-carousel.tsx`): hero baru, stats, fasilitas, unit pilihan, cara sewa, testimoni, FAQ preview, final CTA.
- Mendesain ulang katalog (`kontrakan/page.tsx` + `property-catalog.tsx`): hero ringkas, filter/search/sort yang elegan, kartu properti baru, empty state, CTA bantuan WA.
- Mendesain ulang detail (`kontrakan/[slug]/page.tsx` + `gallery-viewer.tsx`, `detail-actions.tsx`): header harga/status, galeri lightbox modern, kartu booking sticky, daftar unit, fasilitas per-unit, peta lokasi, mobile bottom bar.
- Mendesain ulang Tentang (`tentang/page.tsx`) dan FAQ (`faq/page.tsx`): hero, prinsip/metrik, lokasi + peta, quote; search + kategori + accordion + aside WA yang rapi.
- Menata ulang design tokens di `globals.css` (light elegan sebagai default publik) dan memastikan aksesibilitas (kontras, focus state, `prefers-reduced-motion`) serta performa (gambar `next/image`, lazy, tanpa animasi berat).
- Tidak mengubah: skema Prisma, Server Actions/API, logika auth/billing, area `/admin/*` dan `/dashboard/*`.

## Capabilities

### New Capabilities

- `public-home-redesign`: Home publik modern-profesional-elegan dengan hero, stats, fasilitas, unit pilihan, cara sewa, testimoni, FAQ preview, dan CTA survei yang konversi ke katalog/WA.
- `public-catalog-redesign`: Katalog kontrakan elegan dengan filter/search/sort, kartu properti konsisten, status ketersediaan jujur, dan empty state yang mengarah ke WA.
- `public-property-detail-redesign`: Halaman detail elegan dengan galeri modern, info harga/status, fasilitas per-unit, ketersediaan unit, peta, sticky booking card + mobile bar, CTA WA per-unit.
- `public-about-faq-redesign`: Halaman Tentang & FAQ yang rapi, mudah dipindai, dengan search/kategori/accordion, info kontak + jam operasional, dan CTA WA yang konsisten.
- `public-design-system`: Sistem visual publik bersama (token warna/tipografi/spacing, navbar/footer/layout, tombol/chip/card/badge, pola motion & aksesibilitas) yang dipakai kelima halaman di atas.

### Modified Capabilities

- (kosong — belum ada spec di `openspec/specs/`; ini change pertama sehingga semua capability bersifat baru.)

## Impact

- Kode terdampak: `src/app/page.tsx`, `src/app/testimonial-carousel.tsx`, `src/app/kontrakan/**`, `src/app/tentang/page.tsx`, `src/app/faq/page.tsx`, `src/components/public-{layout,navbar,footer}.tsx`, `src/components/{hero-carousel,whatsapp-float}.tsx`, `src/app/globals.css`, `next.config.ts` (hanya jika perlu domain image/headers), `public/` assets bila ada foto/ilustrasi baru.
- Tidak ada perubahan API, DB, atau auth; tidak ada dependensi baru yang direncanakan kecuali utilitas yang sudah ada (`lucide-react`, Tailwind v4, daisyUI).
- Risiko utama: inkonsistensi tema gelap saat ini vs terang elegan baru — dimitigasi dengan token terpusat + scope publik saja; regresi visual dimitigasi dengan checklist screenshot per halaman (desktop + mobile 360px).
