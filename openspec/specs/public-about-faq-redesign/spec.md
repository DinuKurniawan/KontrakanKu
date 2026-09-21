# Public About FAQ Redesign

## Purpose

Menyediakan halaman Tentang dan FAQ yang rapi dan profesional sehingga pengunjung percaya pada pengelola dan menemukan jawaban tanpa harus bertanya ulang via chat.

## Requirements

### Requirement: Halaman Tentang yang membangun kepercayaan

Halaman `/tentang` SHALL menampilkan hero dengan CTA Lihat unit dan Chat WhatsApp, tiga prinsip layanan, metrik (sejak 2018, penyewa tercatat, waktu respon, skor kepuasan), info kantor (alamat, jam 08.00-18.00, telepon, email), peta, dan kutipan pengelola.

#### Scenario: Membuka Tentang

- **WHEN** pengunjung membuka `/tentang`
- **THEN** semua blok di atas tampil dengan CTA yang berfungsi (katalog, WhatsApp, Google Maps).

#### Scenario: Kontak Tentang valid

- **WHEN** pengunjung mengklik kontak di halaman Tentang
- **THEN** tautan WhatsApp, telepon, email, dan Maps membuka tujuan yang benar.

### Requirement: FAQ dengan pencarian, kategori, dan accordion

Halaman `/faq` SHALL menyediakan pencarian teks, filter kategori (Unit & Sewa, Tagihan & Pembayaran, Akun Penyewa), daftar accordion yang membuka-tutup jawaban, empty state dengan reset filter, dan aside WhatsApp persisten.

#### Scenario: Mencari jawaban

- **WHEN** pengunjung mengetik kata kunci atau memilih kategori
- **THEN** daftar menampilkan hanya FAQ yang cocok beserta hitungan hasil yang akurat.

#### Scenario: Tidak ada jawaban cocok

- **WHEN** pencarian tidak cocok dengan FAQ mana pun
- **THEN** sistem menampilkan empty state dengan tombol reset dan CTA WhatsApp.
