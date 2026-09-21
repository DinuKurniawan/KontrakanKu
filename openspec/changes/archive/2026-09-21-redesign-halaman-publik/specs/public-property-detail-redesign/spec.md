# Spec Delta

## Purpose

Menyediakan halaman detail properti yang elegan dan meyakinkan sehingga pengunjung memahami harga, fasilitas, ketersediaan unit, dan lokasi lalu menghubungi pengelola via WhatsApp.

## ADDED Requirements

### Requirement: Header detail dengan harga dan status yang jelas

Halaman `/kontrakan/[slug]` SHALL menampilkan nama, alamat, harga mulai, badge ketersediaan (N dari M tersedia), dan metadata SEO (title, description, OpenGraph, JSON-LD) untuk properti PUBLISHED; slug yang tidak valid SHALL mengembalikan halaman tidak-ditemukan.

#### Scenario: Membuka detail valid

- **WHEN** pengunjung membuka slug PUBLISHED yang valid
- **THEN** header, harga, alamat, dan badge ketersediaan tampil sesuai data aktual.

#### Scenario: Slug tidak valid

- **WHEN** pengunjung membuka slug yang tidak ada atau tidak PUBLISHED
- **THEN** sistem menampilkan halaman not-found.

### Requirement: Galeri, fasilitas, unit, dan lokasi yang lengkap

Halaman detail SHALL menyediakan galeri foto dengan lightbox, daftar fasilitas (umum + per-unit dengan ikon yang bermakna), daftar unit dengan harga dan status per-unit, serta peta lokasi dengan tautan rute Google Maps.

#### Scenario: Melihat foto detail

- **WHEN** pengunjung membuka foto galeri
- **THEN** lightbox menampilkan foto yang dapat dinavigasi dan ditutup via keyboard maupun tombol.

#### Scenario: Membedakan unit tersedia dan terisi

- **WHEN** daftar unit ditampilkan
- **THEN** setiap unit menampilkan nama, harga bulanan, dan status Tersedia/Terisi yang sesuai data, tanpa info pribadi penyewa.

### Requirement: Booking card dan mobile bar dengan CTA WhatsApp

Halaman detail SHALL menyediakan kartu booking sticky (harga, progress ketersediaan, CTA Hubungi pengelola via WhatsApp dengan pesan terisi nama properti, tautan Lihat unit dan Rute) dan bottom bar mobile yang selalu terlihat dengan harga dan CTA yang sama.

#### Scenario: Menghubungi pengelola dari detail

- **WHEN** pengunjung mengklik CTA WhatsApp di kartu booking atau bottom bar
- **THEN** sistem membuka tautan `wa.me` dengan nomor pengelola dan teks yang menyebut nama properti tersebut.
