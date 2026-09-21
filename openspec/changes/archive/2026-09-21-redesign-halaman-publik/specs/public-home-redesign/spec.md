# Spec Delta

## Purpose

Menyediakan halaman Home publik yang modern, profesional, dan elegan sehingga calon penyewa memahami nilai kontrakan dan sampai ke katalog atau WhatsApp dalam hitungan detik.

## ADDED Requirements

### Requirement: Hero home yang jelas dan elegan

Halaman Home SHALL menampilkan hero dengan headline, subcopy singkat, dua CTA utama (Lihat unit tersedia ke `/kontrakan` dan Masuk ke `/login`), serta indikator kepercayaan (skor ulasan, waktu respon, kontak pengelola) dalam satu layar awal tanpa scroll berlebihan.

#### Scenario: Calon penyewa membuka Home

- **WHEN** pengunjung membuka `/`
- **THEN** hero menampilkan headline, subcopy, kedua CTA yang berfungsi, dan indikator kepercayaan yang terbaca di desktop maupun mobile 360px.

#### Scenario: CTA hero mengarah dengan benar

- **WHEN** pengunjung mengklik CTA utama
- **THEN** sistem mengarahkan ke `/kontrakan` (Lihat unit) atau `/login` (Masuk).

### Requirement: Section Home yang rapi dan tidak berulang

Halaman Home SHALL menampilkan section statistik, fasilitas, unit pilihan (maks 3 dari properti PUBLISHED), cara sewa 3 langkah, testimoni, preview FAQ, dan CTA final survei dengan ritme visual konsisten dan tanpa duplikasi konten antar-section.

#### Scenario: Unit pilihan kosong

- **WHEN** tidak ada properti PUBLISHED
- **THEN** sistem menampilkan empty state yang mengarahkan pengunjung menghubungi pengelola via WhatsApp, bukan section kosong.

#### Scenario: Kartu unit pilihan jujur soal stok

- **WHEN** unit pilihan ditampilkan
- **THEN** setiap kartu menampilkan harga mulai per bulan, nama, alamat, foto sampul (atau placeholder), dan badge ketersediaan (N tersedia / Penuh) sesuai data unit aktual.

### Requirement: Testimoni dan FAQ preview yang usable

Testimoni SHALL dapat dijelajahi satu per satu (carousel/nav) dan preview FAQ SHALL membuka-tutup jawaban tanpa navigasi halaman.

#### Scenario: Menjelajah testimoni

- **WHEN** pengunjung berinteraksi dengan blok testimoni
- **THEN** konten berganti dengan kontrol yang dapat diakses keyboard dan teks tetap terbaca.

#### Scenario: Membuka FAQ preview

- **WHEN** pengunjung mengklik satu pertanyaan preview
- **THEN** jawaban terkait terbuka dan tautan Lihat semua FAQ mengarah ke `/faq`.
