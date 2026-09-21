# Tasks

## 1. Fondasi visual publik

- [x] 1.1 Terapkan token terang elegan di `src/app/globals.css` (background, teks, aksen, tipografi, radius, shadow) dan verifikasi tidak ada teks yang hilang kontras di 5 rute publik via inspeksi visual.
- [x] 1.2 Rombak komponen bersama `public-layout/navbar/footer`, `whatsapp-float`, tombol/chip/card/badge dan verifikasi navigasi desktop + hamburger mobile 360px berfungsi serta focus state terlihat via uji keyboard.
- [x] 1.3 Ringankan motion (hormati `prefers-reduced-motion`, rapikan `hero-carousel`, `testimonial-carousel`, `scroll-reveal`) dan verifikasi carousel/animasi tetap usable dengan reduced-motion aktif.

## 2. Home

- [x] 2.1 Desain ulang hero Home (`src/app/page.tsx`: headline, subcopy, 2 CTA, indikator kepercayaan) dan verifikasi CTA mengarah ke `/kontrakan` dan `/login` di desktop + mobile.
- [x] 2.2 Desain ulang section stats, fasilitas, unit pilihan (maks 3 PUBLISHED + empty state WA), cara sewa, testimoni, FAQ preview, CTA final dan verifikasi setiap kartu menampilkan harga/status/foto-or-placeholder yang benar.

## 3. Katalog

- [x] 3.1 Desain ulang `src/app/kontrakan/page.tsx` + `property-catalog.tsx` (hero ringkas, filter lokasi/ketersediaan, search, sort harga, grid kartu, empty state + reset, CTA WA) dan verifikasi filter/search/sort memutakhirkan hasil + hitungan tanpa reload.
- [x] 3.2 Pastikan kartu katalog tidak membocorkan data penyewa dan tautan Detail membuka `/kontrakan/[slug]` yang benar, verifikasi via klik setiap kartu sampel.

## 4. Detail properti

- [x] 4.1 Desain ulang header + galeri (`kontrakan/[slug]/page.tsx` + `gallery-viewer.tsx`, `detail-actions.tsx`) termasuk SEO/JSON-LD dan state not-found, verifikasi via slug valid dan slug invalid.
- [x] 4.2 Desain ulang fasilitas per-unit, grid unit (nama/harga/status), dan blok lokasi + peta dengan tautan Rute, verifikasi status unit sesuai data dan tidak ada info penyewa.
- [x] 4.3 Desain ulang sticky booking card + mobile bottom bar dengan CTA `wa.me` ter-encode nama properti, verifikasi tautan WA terbuka dengan teks benar di desktop + 360px tanpa menutupi konten.

## 5. Tentang & FAQ

- [x] 5.1 Desain ulang `src/app/tentang/page.tsx` (hero, prinsip, metrik, info kantor + jam, peta, quote) dan verifikasi CTA katalog/WhatsApp/Maps berfungsi.
- [x] 5.2 Desain ulang `src/app/faq/page.tsx` (search, kategori, accordion, empty state + reset, aside WA) dan verifikasi pencarian/kategori memfilter + hitungan akurat serta accordion dapat dibuka via keyboard.

## 6. Verifikasi akhir

- [x] 6.1 Jalankan `npm run lint`, `npx tsc --noEmit`, `npm run build` dan verifikasi semuanya lolos tanpa error.
- [x] 6.2 Lakukan checklist screenshot 5 rute (desktop + 360px) serta uji keyboard (menu, accordion, lightbox, carousel) dan verifikasi tidak ada regresi visual atau aksesibilitas.
