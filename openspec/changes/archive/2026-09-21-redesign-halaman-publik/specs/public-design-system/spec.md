# Spec Delta

## Purpose

Menyediakan sistem visual publik bersama yang modern, profesional, dan elegan sehingga kelima halaman publik terlihat satu keluarga, mudah dibaca, dan aksesibel di semua perangkat.

## ADDED Requirements

### Requirement: Token visual terang yang elegan dan konsisten

Sistem publik SHALL memakai tema terang sebagai default (background off-white/warm gray, teks charcoal gelap, aksen hijau muted/sage + emas kalem) dengan skala tipografi (display/body/mono), spacing, radius, dan shadow yang dipakai konsisten di semua halaman publik.

#### Scenario: Membuka halaman publik mana pun

- **WHEN** pengunjung membuka `/`, `/kontrakan`, `/kontrakan/[slug]`, `/tentang`, atau `/faq`
- **THEN** warna, tipografi, dan spacing terlihat satu bahasa visual tanpa sisa tema gelap yang bertabrakan.

#### Scenario: Teks tetap terbaca

- **WHEN** konten dirender di atas background terang maupun aksen
- **THEN** kombinasi warna teks-background memenuhi kontras aksesibilitas (minimum AA untuk teks isi).

### Requirement: Chrome publik dan komponen bersama yang responsif

`PublicNavbar`, `PublicFooter`, `PublicLayout`, dan `WhatsAppFloat` SHALL menyediakan navigasi responsif (termasuk hamburger di mobile), footer informatif, tombol/chip/card/badge yang konsisten, focus state yang terlihat, dan dukungan `prefers-reduced-motion` yang menonaktifkan animasi non-esensial.

#### Scenario: Navigasi mobile

- **WHEN** pengunjung membuka menu di layar sempit
- **THEN** menu terbuka/tertutup dengan jelas dan semua tautan utama (Beranda, Katalog, Tentang, FAQ, Login) dapat diakses.

#### Scenario: Pengguna reduced-motion

- **WHEN** sistem operasi mengaktifkan pengurangan gerak
- **THEN** animasi/carousel/transisi non-esensial dinonaktifkan dan konten tetap sepenuhnya usable.

### Requirement: Performa dan SEO publik terjaga

Halaman publik SHALL memuat cepat (gambar via optimasi bawaan framework dengan lazy-loading di bawah lipatan, tanpa animasi berat pemblokir render) dan menyediakan metadata dasar (title/description) per halaman.

#### Scenario: Memuat halaman katalog dengan banyak foto

- **WHEN** katalog berisi banyak properti dengan foto
- **THEN** gambar di bawah lipatan dimuat malas (lazy) dan layout tidak bergeser berlebihan (ada dimensi/placeholder yang stabil).
