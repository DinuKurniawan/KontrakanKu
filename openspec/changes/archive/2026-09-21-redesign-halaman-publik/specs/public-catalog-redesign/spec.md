# Spec Delta

## Purpose

Menyediakan katalog kontrakan publik yang elegan dan mudah dipindai sehingga pengunjung cepat menemukan unit yang masih tersedia dan berpindah ke detail atau WhatsApp.

## ADDED Requirements

### Requirement: Katalog dengan filter, pencarian, dan pengurutan

Halaman `/kontrakan` SHALL menampilkan daftar properti PUBLISHED beserta kontrol filter lokasi/ketersediaan, pencarian nama/alamat, dan pengurutan harga, dengan hasil yang ter-update tanpa reload halaman penuh.

#### Scenario: Memfilter katalog

- **WHEN** pengunjung memilih filter ketersediaan atau mengetik pencarian
- **THEN** daftar menampilkan hanya properti yang cocok beserta hitungan hasil yang akurat.

#### Scenario: Tidak ada hasil filter

- **WHEN** tidak ada properti yang cocok dengan filter/pencarian
- **THEN** sistem menampilkan empty state dengan tombol reset filter dan CTA WhatsApp.

### Requirement: Kartu properti yang konsisten dan jujur

Setiap kartu properti SHALL menampilkan foto sampul (atau placeholder), nama, alamat, harga mulai per bulan, total vs tersedia unit, badge status, dan tautan Detail ke `/kontrakan/[slug]`, serta TIDAK SHALL menampilkan data pribadi penyewa.

#### Scenario: Membuka detail dari kartu

- **WHEN** pengunjung mengklik Detail pada kartu
- **THEN** sistem membuka `/kontrakan/[slug]` properti tersebut.

#### Scenario: Data penyewa tidak bocor

- **WHEN** katalog dirender untuk publik tanpa login
- **THEN** tidak ada nama, kontak, atau info sewa penyewa yang tampil di kartu mana pun.
