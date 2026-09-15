# Product Requirements Document (PRD)

# Sistem Manajemen Kontrakan

**Versi:** 2.1
**Status:** Implemented — Production-Ready MVP
**Terakhir Diperbarui:** 15 September 2026
**Changelog 2.0 → 2.1:** Sinkronisasi dengan kode aktual (seed hanya admin, `gallery-viewer.tsx`, `bcryptjs`, `CRON_SECRET`, koreksi alur `WAITING_PAYMENT`/`PENDING`, klarifikasi PDF tidak dikonversi WebP, hitungan halaman user portal 7 halaman)
**Platform:** Web Application (Responsive)
**Framework:** Next.js 16 (App Router, route protection via `src/proxy.ts`)
**Language:** TypeScript (Strict)
**Styling:** Tailwind CSS v4
**Database:** PostgreSQL
**ORM:** Prisma v6
**Authentication:** Secure database session-based + JWT cookie (jose, HS256)
**File Processing:** Sharp (WebP conversion khusus gambar; PDF dipertahankan as-is)
**Target User:** Pemilik/Pengelola kontrakan dan penyewa

---

# 1. Product Overview

## 1.1 Tujuan Produk

Sistem ini adalah aplikasi web untuk membantu orang tua pemilik kontrakan mengelola seluruh aktivitas kontrakan secara terpusat.

Sistem menangani:

* Data kontrakan
* Data unit/kamar
* Data penyewa
* Status hunian
* Tagihan bulanan (manual & batch)
* Pembayaran penyewa (transfer manual)
* Verifikasi pembayaran manual oleh admin
* Riwayat pembayaran
* Dashboard admin dengan chart pendapatan
* Dashboard penyewa
* Notifikasi in-app
* Informasi kontrakan yang dapat diakses publik
* Halaman FAQ & Tentang

Tujuan utamanya adalah mengurangi pengelolaan manual menggunakan catatan, WhatsApp, atau spreadsheet.

---

# 2. Product Goals

## 2.1 Primary Goals

1. Admin dapat mengetahui kondisi seluruh unit kontrakan dalam satu dashboard.
2. Admin dapat mengetahui siapa yang sudah dan belum membayar.
3. Penyewa dapat melihat tagihan bulanannya.
4. Penyewa dapat melakukan pembayaran melalui transfer manual.
5. Admin dapat memverifikasi pembayaran.
6. Sistem menyimpan histori pembayaran secara terstruktur.
7. Informasi kontrakan dapat ditampilkan secara publik.
8. Sistem memiliki security yang layak untuk aplikasi production.
9. UI mudah digunakan oleh orang tua yang tidak terlalu teknis.
10. Sistem dapat dikembangkan lebih lanjut tanpa perlu melakukan perubahan besar pada arsitektur.

---

# 3. Non-Goals

Fitur berikut tidak termasuk dalam MVP:

* Payment gateway otomatis
* Virtual Account otomatis
* Integrasi bank secara langsung
* WhatsApp API otomatis
* E-mail automation kompleks
* Akuntansi lengkap
* Payroll
* Marketplace kontrakan
* Sistem booking online dengan pembayaran otomatis
* Multi-company SaaS
* Mobile application native

Fitur tersebut dapat masuk ke roadmap setelah MVP stabil.

---

# 4. User Roles

Sistem memiliki dua role utama:

## 4.1 Admin

Admin adalah pemilik/pengelola kontrakan.

Admin dapat:

* Login
* Melihat dashboard (statistik, chart pendapatan, aktivitas terbaru)
* Mengelola kontrakan (CRUD dengan foto & fasilitas)
* Mengelola unit (CRUD dengan fasilitas per-unit)
* Mengelola penyewa (CRUD, assign/end rental)
* Membuat tagihan (manual & batch massal)
* Melihat pembayaran
* Memverifikasi pembayaran
* Menolak pembayaran
* Melihat riwayat pembayaran
* Melihat detail penyewa
* Mengubah status unit
* Mengelola rekening pembayaran (termasuk QR code)
* Mengelola profil akun
* Melihat audit log
* Melihat notifikasi

---

## 4.2 User / Penyewa

User adalah orang yang menyewa unit.

User dapat:

* Login
* Melihat dashboard (ringkasan tagihan, unit, status pembayaran)
* Melihat kontrakan yang ditempati
* Melihat detail unit
* Melihat tagihan
* Melihat status pembayaran
* Mengirim bukti transfer
* Melihat riwayat pembayaran
* Melihat profil sendiri
* Mengubah profil (nama, telepon, password)
* Melihat notifikasi

User tidak dapat:

* Mengubah nominal tagihan
* Mengubah status pembayaran menjadi lunas
* Mengubah data kontrakan
* Melihat data penyewa lain
* Mengakses dashboard admin
* Mengubah data pembayaran yang sudah dikirim

---

# 5. Application Structure

Aplikasi dibagi menjadi empat area utama.

```text
PUBLIC
│
├── Home                    /
├── Daftar Kontrakan        /kontrakan
├── Detail Kontrakan        /kontrakan/[slug]
├── Tentang                 /tentang
├── FAQ                     /faq
└── Login                   /(auth)/login

USER (Dashboard Penyewa)
│
├── Dashboard               /dashboard
├── Kontrakan Saya          /dashboard/kontrakan-saya
├── Tagihan                 /dashboard/tagihan
├── Pembayaran              /dashboard/pembayaran
├── Riwayat Pembayaran      /dashboard/riwayat
├── Notifikasi              /dashboard/notifikasi
└── Profil                  /dashboard/profil

ADMIN
│
├── Dashboard               /admin
├── Kontrakan               /admin/kontrakan
├── Unit                    /admin/unit
├── Penyewa                 /admin/penyewa
├── Tagihan                 /admin/tagihan
├── Pembayaran              /admin/pembayaran
├── Riwayat                 /admin/riwayat
├── Notifikasi              /admin/notifikasi
├── Audit Log               /admin/audit-log
└── Pengaturan              /admin/pengaturan

API
│
├── Upload                  /api/upload
├── File Proofs             /api/files/proofs/[fileName]
├── Notifications           /api/notifications
├── Notification Read       /api/notifications/[id]/read
├── Read All Notifications  /api/notifications/read-all
└── Cron Sync Overdue       /api/cron/sync-overdue
```

---

# 6. Public Website

Public website tidak membutuhkan authentication.

## 6.1 Home Page

URL:

```text
/
```

Tujuan:

Memberikan informasi singkat mengenai kontrakan dan mengarahkan calon penyewa ke daftar kontrakan.

### Komponen:

* Navbar (responsive, mobile hamburger menu)
* Logo/nama usaha
* Hero section
* Informasi singkat
* Highlight fasilitas
* Daftar kontrakan unggulan
* Testimonial carousel
* CTA
* Footer

### CTA:

```text
Lihat Kontrakan
```

dan

```text
Login Penyewa
```

---

## 6.2 Tentang Page

URL:

```text
/tentang
```

Halaman informasi tentang pengelola kontrakan.

---

## 6.3 FAQ Page

URL:

```text
/faq
```

Halaman pertanyaan yang sering diajukan.

---

# 7. Public Property Listing

URL:

```text
/kontrakan
```

Menampilkan seluruh kontrakan yang memiliki status:

```text
PUBLISHED
```

### Filter

* Lokasi
* Harga
* Status ketersediaan

### Card kontrakan

Setiap card menampilkan:

* Foto utama
* Nama kontrakan
* Lokasi
* Harga mulai
* Jumlah unit
* Jumlah unit tersedia
* Status

Contoh:

```text
Kontrakan Melati

Jl. Example No. 10
Mulai dari Rp1.200.000 / bulan

3 Unit tersedia

[ Lihat Detail ]
```

Komponen utama: `property-catalog.tsx`

---

# 8. Property Detail Page

URL:

```text
/kontrakan/[slug]
```

Halaman ini dapat diakses tanpa login.

## Informasi:

### Basic Information

* Nama kontrakan
* Alamat
* Deskripsi
* Harga
* Status

### Gallery

* Foto utama
* Foto tambahan
* Gallery lightbox untuk melihat foto detail (`gallery-viewer.tsx`)

### Facilities

Contoh:

* WiFi
* Kamar mandi
* Parkir
* Listrik
* Air

### Unit Availability

Menampilkan status secara umum.

Contoh:

```text
Unit A
Tersedia

Unit B
Terisi

Unit C
Tersedia
```

Jangan menampilkan informasi pribadi penyewa.

### CTA

```text
Hubungi Pengelola
```

CTA dapat diarahkan ke WhatsApp jika nomor WhatsApp dikonfigurasi admin.

Komponen utama: `detail-actions.tsx`

---

# 9. Admin Dashboard

URL:

```text
/admin
```

Hanya dapat diakses oleh role:

```text
ADMIN
```

## 9.1 Dashboard Summary

Dashboard harus memberikan informasi yang dapat dipahami dalam beberapa detik.

### Statistik utama:

```text
Total Kontrakan
Total Unit
Unit Terisi
Unit Tersedia
Tagihan Belum Dibayar
Pembayaran Menunggu Verifikasi
```

---

## 9.2 Payment Overview

Dashboard menampilkan:

```text
Tagihan bulan ini

Lunas       12
Menunggu     3
Belum bayar  2
Terlambat    1
```

---

## 9.3 Revenue Chart

Dashboard menampilkan grafik pendapatan bulanan.

Komponen: `revenue-chart.tsx`

---

## 9.4 Recent Activity

Menampilkan aktivitas terbaru:

```text
Budi mengirim pembayaran
2 jam lalu

Andi terlambat membayar
1 hari lalu

Pembayaran Siti diverifikasi
2 hari lalu
```

---

# 10. Property Management

Admin dapat melakukan CRUD kontrakan.

Komponen utama:
* `property-management.tsx` — tabel dan list
* `property-modal.tsx` — modal form create/edit

## 10.1 Create Property

Field:

```text
Nama Kontrakan
Slug
Alamat
Deskripsi
Harga Mulai
Fasilitas            (array of strings)
Foto                 (multiple, auto-converted to WebP)
Status
```

Status:

```text
DRAFT
PUBLISHED
ARCHIVED
```

### Rules

`DRAFT`

Tidak muncul di public website.

`PUBLISHED`

Muncul di public website.

`ARCHIVED`

Tidak muncul di public website tetapi tetap tersimpan dalam database.

---

# 11. Unit Management

Setiap kontrakan dapat memiliki beberapa unit.

Contoh:

```text
Kontrakan Melati
│
├── Unit A
├── Unit B
├── Unit C
└── Unit D
```

Komponen utama:
* `unit-management.tsx` — tabel dan list
* `unit-modal.tsx` — modal form create/edit

## 11.1 Unit Fields

```text
Property ID
Unit Name / Number
Description
Monthly Rent
Facilities            (array of strings, per-unit)
Status
```

Status:

```text
AVAILABLE
OCCUPIED
MAINTENANCE
INACTIVE
```

Constraint:

```text
UNIQUE(property_id, name)
```

Nama unit/kamar tidak boleh duplikat dalam satu properti.

---

# 12. Tenant Management

Admin dapat melihat seluruh penyewa.

Komponen utama:
* `tenant-management.tsx` — tabel dan list
* `tenant-modal.tsx` — modal form create/edit
* `assign-tenant-modal.tsx` — assign tenant ke unit
* `end-rental-modal.tsx` — akhiri kontrak sewa

## Tenant Data

```text
Nama
Email
Nomor Telepon
Unit
Tanggal Mulai Sewa
Tanggal Akhir Sewa
Harga Sewa
Status
```

Status:

```text
ACTIVE
INACTIVE
```

---

# 13. Relasi User dan Unit

Satu user dapat memiliki satu kontrak aktif pada MVP.

Relasi:

```text
User
  │
  └── Rental
       │
       └── Unit
            │
            └── Property
```

Dengan demikian sistem dapat mengetahui:

```text
Siapa penyewanya
Unit mana yang ditempati
Kontrakan mana
Harga sewanya
Kapan mulai menyewa
```

---

# 14. Billing System

Billing adalah salah satu fitur inti aplikasi.

Sistem menggunakan konsep:

```text
Invoice → Payment
```

Invoice merupakan tagihan.

Payment merupakan pembayaran terhadap invoice.

Invoice dapat dibuat secara:

```text
MANUAL    — Admin membuat tagihan satu per satu
BATCH     — Admin menerbitkan tagihan massal untuk semua rental aktif
```

---

# 15. Invoice

Setiap bulan user memiliki invoice.

Komponen utama:
* `invoice-management.tsx` — tabel tagihan
* `create-invoice-modal.tsx` — modal buat tagihan manual
* `batch-invoice-modal.tsx` — modal terbitkan tagihan massal

Contoh:

```text
Invoice #INV-2026-09-001

Penyewa:
Budi

Kontrakan:
Kontrakan Melati

Unit:
A-01

Periode:
September 2026

Jatuh Tempo:
10 September 2026

Nominal:
Rp1.500.000

Status:
UNPAID

Source:
MANUAL
```

---

# 16. Invoice Status

Status invoice:

```text
PENDING
UNPAID
WAITING_PAYMENT
PAID
OVERDUE
CANCELLED
```

### Penjelasan

`PENDING`

Invoice belum aktif.

`UNPAID`

Tagihan aktif dan belum dibayar.

`WAITING_PAYMENT`

User sudah mengupload bukti transfer dan `Payment` berstatus `PENDING`.
Invoice menunggu verifikasi admin. Status ini di-set atomik saat payment dibuat
(`payment.repository.ts` → `create()` dalam `$transaction`).

`PAID`

Pembayaran telah diverifikasi admin.

`OVERDUE`

Tanggal jatuh tempo telah lewat dan invoice belum lunas. Status ini disinkronisasi melalui cron endpoint `/api/cron/sync-overdue`.

`CANCELLED`

Invoice tidak berlaku.

---

# 17. Invoice Generation

Admin dapat membuat invoice dengan dua cara:

### Manual
Admin membuat tagihan satu per satu untuk rental tertentu.

### Batch (Terbitkan Massal)
Admin menerbitkan tagihan untuk seluruh rental aktif sekaligus.

Invoice batch (`source = BATCH`) untuk bulan depan disembunyikan dari penyewa sampai bulannya tiba.

Sistem memastikan invoice tidak dibuat dua kali untuk:

```text
rental_id + billing_period
```

Database memiliki unique constraint:

```text
@@unique([rentalId, billingPeriod])
```

---

# 18. Manual Payment

User membayar melalui transfer bank secara manual.

Admin terlebih dahulu mengatur rekening pembayaran.

Contoh:

```text
Bank BCA
1234567890
Nama Pemilik
[QR Code / QRIS]
```

User melihat informasi tersebut pada halaman pembayaran.

Bank yang didukung (dengan logo SVG):

```text
BCA, BNI, BRI, BSI, BTN, CIMB, Danamon, Mandiri, Permata, Jago
DANA, GoPay, OVO, QRIS
```

---

# 19. User Payment Workflow

Workflow pembayaran:

```text
User login
    ↓
Dashboard
    ↓
Melihat tagihan
    ↓
Pilih invoice
    ↓
Melihat rekening pembayaran
    ↓
Transfer melalui bank
    ↓
Upload bukti transfer
    ↓
Submit payment
    ↓
Payment = PENDING + Invoice = WAITING_PAYMENT (atomik via $transaction)
    ↓
Admin melakukan pengecekan
    ↓
┌───────────────────┐
│                   │
▼                   ▼
APPROVED          REJECTED
│                   │
▼                   ▼
Invoice PAID      User diminta
                  melakukan pembayaran ulang
```

---

# 20. Payment Submission

User mengisi melalui `payment-form.tsx`:

```text
Invoice
Jumlah Transfer
Tanggal Transfer
Bank Pengirim
Nama Pengirim
Rekening Tujuan
Bukti Transfer        (file, auto-converted to WebP)
Catatan
```

### Validation

Jumlah transfer harus:

```text
> 0
```

dan idealnya sama dengan jumlah invoice.

Jika nominal berbeda:

```text
WARNING:
Nominal transfer berbeda dengan tagihan.
```

Admin tetap dapat menentukan keputusan akhir.

---

# 21. Payment Status

Payment menggunakan status:

```text
PENDING
APPROVED
REJECTED
```

### PENDING

Bukti pembayaran telah dikirim user tetapi belum diverifikasi.

### APPROVED

Admin menyetujui pembayaran.

Efek:

```text
Payment = APPROVED
Invoice = PAID
```

### REJECTED

Admin menolak pembayaran.

Invoice tetap:

```text
UNPAID / OVERDUE
```

---

# 22. Admin Payment Verification

URL:

```text
/admin/pembayaran
```

Admin melihat:

```text
Budi
Unit A01
September 2026
Rp1.500.000
12 September 2026
PENDING
```

Admin dapat membuka detail.

Komponen utama: `verification-card.tsx`

---

## 22.1 Payment Detail

Menampilkan:

```text
Nama penyewa
Invoice
Unit
Periode
Nominal invoice
Nominal transfer
Tanggal transfer
Bank pengirim
Nama pengirim
Bukti transfer
Catatan
```

Admin memiliki dua action:

```text
[ Approve Payment ]
[ Reject Payment ]
```

---

# 23. Approve Payment Workflow

Saat admin menekan:

```text
Approve
```

sistem harus melakukan transaction.

Secara konseptual:

```text
BEGIN TRANSACTION

Payment.status = APPROVED

Invoice.status = PAID

Invoice.paid_at = current_timestamp

Record audit log

Create notification for tenant

COMMIT
```

Jika salah satu proses gagal:

```text
ROLLBACK
```

Tidak boleh terjadi kondisi:

```text
Payment APPROVED
Invoice UNPAID
```

---

# 24. Reject Payment Workflow

Admin menekan:

```text
Reject
```

Admin wajib memberikan alasan.

Contoh:

```text
Bukti transfer tidak dapat diverifikasi.
```

Kemudian:

```text
Payment.status = REJECTED
Payment.rejection_reason = ...
```

Invoice tetap belum lunas.

User dapat melihat alasan penolakan.

Notifikasi dikirim ke penyewa.

---

# 25. User Dashboard

URL:

```text
/dashboard
```

Dashboard user harus sederhana.

## Summary

```text
Tagihan Bulan Ini

Rp1.500.000

Jatuh tempo:
10 September 2026

Status:
Belum Dibayar
```

CTA:

```text
Bayar Sekarang
```

---

## 25.1 User Dashboard Sections

```text
Current Bill
My Property
Payment Status
Recent Payments
```

---

# 26. My Property

URL:

```text
/dashboard/kontrakan-saya
```

User dapat melihat:

```text
Nama kontrakan
Alamat
Unit
Harga sewa
Tanggal mulai
Status sewa
```

User hanya boleh melihat data unit miliknya sendiri.

---

# 27. Payment History

URL:

```text
/dashboard/riwayat
```

Komponen utama: `tenant-history-view.tsx`

Menampilkan:

| Periode        |     Nominal | Tanggal | Status   |
| -------------- | ----------: | ------- | -------- |
| September 2026 | Rp1.500.000 | 8 Sep   | Approved |
| Agustus 2026   | Rp1.500.000 | 7 Agu   | Approved |
| Juli 2026      | Rp1.500.000 | 9 Jul   | Approved |

User hanya dapat melihat pembayaran miliknya sendiri.

---

# 28. Notification System

## 28.1 In-App Notifications

Sistem notifikasi in-app telah diimplementasikan secara penuh.

### Komponen:
* `notification-bell.tsx` — bell icon dengan badge jumlah unread
* `notification-list.tsx` — daftar notifikasi penyewa

### API Endpoints:
* `GET /api/notifications` — ambil notifikasi user
* `POST /api/notifications/[id]/read` — tandai satu notifikasi sebagai dibaca
* `POST /api/notifications/read-all` — tandai semua sebagai dibaca

### Tipe Notifikasi:
```text
INFO
INVOICE
PAYMENT
WARNING
```

### Halaman Notifikasi:
* Admin: `/admin/notifikasi`
* User: `/dashboard/notifikasi`

### Trigger Notifikasi:
* Pembayaran disetujui
* Pembayaran ditolak
* Invoice baru dibuat
* Invoice overdue

---

# 29. Authentication

Authentication digunakan untuk:

```text
/admin/*
/dashboard/*
```

Public pages tidak membutuhkan authentication.

## Authentication Requirements

* Password di-hash menggunakan bcryptjs (12 rounds, `src/lib/password.ts`).
* Session tersimpan di database PostgreSQL (tabel `sessions`).
* Cookie authentication menggunakan JWT (jose library):

  * Cookie name: `kk_session`
  * HttpOnly
  * Secure pada production
  * SameSite: lax
  * Max-Age: 7 hari
* Password tidak pernah disimpan plaintext.
* Password tidak pernah dikembalikan melalui API.
* Session memiliki expiration.
* Logout menghapus session dari database dan cookie.

### Route Protection

Implementasi menggunakan **Next.js 16 Proxy** (`src/proxy.ts`):
* Mencegah akses anonim ke rute `/admin/*` dan `/dashboard/*`
* Redirect ke `/login?callbackUrl=...`
* Mencegah user non-admin mengakses `/admin/*`
* Redirect user yang sudah login dari `/login` ke portal masing-masing

---

# 30. Authorization

Authentication ≠ Authorization.

Setiap protected request harus memvalidasi:

```text
Apakah user sudah login?
       ↓
Role apa?
       ↓
Resource ini milik siapa?
       ↓
Apakah user memiliki permission?
```

### Guard Functions (src/lib/auth.ts):

```text
getCurrentUser()       — ambil user dari session
requireAuth()          — pastikan user sudah login
requireAdmin()         — pastikan user adalah ADMIN
```

### Object-Level Authorization (src/lib/authorization.ts):

```text
assertCanAccessRental(user, rentalId)
assertCanAccessInvoice(user, invoiceId)
assertCanAccessPayment(user, paymentId)
```

---

# 31. Admin Authorization

Semua route:

```text
/admin/*
```

harus memiliki:

```text
role = ADMIN
```

User biasa harus mendapatkan:

```text
403 Forbidden
```

atau redirect ke dashboard user.

Authorization dilakukan di:
1. Proxy layer (route protection)
2. Server-side layout (`requireAdmin()`)
3. Server Actions (setiap action memvalidasi role)

---

# 32. Object-Level Authorization

Ini merupakan requirement security penting.

Contoh (akses via Server Action / halaman server, bukan REST publik):

```text
Invoice milik rental user X diakses oleh user Y
```

Server tidak boleh hanya memeriksa:

```text
user authenticated = true
```

Server harus memeriksa:

```text
invoice.rental.userId === currentUser.id
```

atau user memiliki role admin.

Hal yang sama berlaku untuk:

* Invoice
* Payment
* Unit
* Tenant
* Property
* Uploaded files (via `/api/files/proofs/[fileName]`)

---

# 33. Database Architecture

Database menggunakan PostgreSQL dengan Prisma ORM v6.

Entity:

```text
users
sessions
properties
property_images
units
rentals
invoices
payments
payment_accounts
audit_logs
notifications
```

---

# 34. Users Table

```text
users
-----
id                cuid
name              String
email             String        UNIQUE
password_hash     String
role              UserRole      (ADMIN | USER)
phone             String?
avatar_url        String?
created_at        DateTime
updated_at        DateTime
```

Indexes:

```text
email
role
```

---

# 35. Sessions Table

```text
sessions
--------
id                cuid
user_id           String        → users.id (CASCADE)
token             String        UNIQUE
expires_at        DateTime
ip_address        String?
user_agent        String?
created_at        DateTime
```

Indexes:

```text
token
user_id
expires_at
```

---

# 36. Properties Table

```text
properties
----------
id                    cuid
name                  String
slug                  String          UNIQUE
description           Text?
address               Text
monthly_price_from    Decimal(12,2)
status                PropertyStatus  (DRAFT | PUBLISHED | ARCHIVED)
facilities            String[]        (array)
created_at            DateTime
updated_at            DateTime
```

Indexes:

```text
slug
status
```

---

# 37. Property Images Table

```text
property_images
--------------
id                cuid
property_id       String        → properties.id (CASCADE)
url               Text
alt_text          String?
sort_order        Int           default 0
is_cover          Boolean       default false
created_at        DateTime
```

Indexes:

```text
property_id
```

---

# 38. Units Table

```text
units
-----
id                cuid
property_id       String        → properties.id (CASCADE)
name              String
description       Text?
monthly_rent      Decimal(12,2)
status            UnitStatus    (AVAILABLE | OCCUPIED | MAINTENANCE | INACTIVE)
facilities        String[]      (array, per-unit)
created_at        DateTime
updated_at        DateTime
```

Constraint:

```text
UNIQUE(property_id, name)
```

Indexes:

```text
property_id
status
```

---

# 39. Rentals Table

Rental merupakan relasi antara user dan unit.

```text
rentals
-------
id                cuid
user_id           String        → users.id (RESTRICT)
unit_id           String        → units.id (RESTRICT)
start_date        DateTime
end_date          DateTime?
monthly_rent      Decimal(12,2)
status            RentalStatus  (ACTIVE | ENDED | CANCELLED)
notes             Text?
created_at        DateTime
updated_at        DateTime
```

Indexes:

```text
user_id
unit_id
status
```

---

# 40. Invoices Table

```text
invoices
--------
id                cuid
invoice_number    String          UNIQUE
rental_id         String          → rentals.id (RESTRICT)
billing_period    String          format "YYYY-MM"
amount            Decimal(12,2)
due_date          DateTime
status            InvoiceStatus
source            InvoiceSource   (MANUAL | BATCH)
paid_at           DateTime?
notes             Text?
created_at        DateTime
updated_at        DateTime
```

Constraint penting:

```text
UNIQUE(rental_id, billing_period)
```

Tujuannya mencegah duplicate invoice.

Indexes:

```text
rental_id
billing_period
status
due_date
```

---

# 41. Payments Table

```text
payments
--------
id                    cuid
invoice_id            String          → invoices.id (RESTRICT)
payment_account_id    String?         → payment_accounts.id (SET NULL)
amount                Decimal(12,2)
transfer_date         DateTime
sender_bank           String
sender_name           String
proof_file_url        Text
notes                 Text?
status                PaymentStatus   (PENDING | APPROVED | REJECTED)
rejection_reason      Text?
verified_by           String?         → users.id (SET NULL)
verified_at           DateTime?
created_at            DateTime
updated_at            DateTime
```

Indexes:

```text
invoice_id
status
transfer_date
```

---

# 42. Payment Accounts

Admin dapat mengatur rekening penerima.

```text
payment_accounts
----------------
id                cuid
bank_name         String
account_number    String
account_name      String
qr_code_url      String?           (opsional QRIS/QR image)
is_active         Boolean           default true
created_at        DateTime
updated_at        DateTime
```

User hanya melihat rekening yang:

```text
is_active = true
```

---

# 43. Audit Logs

Aktivitas penting harus dicatat.

```text
audit_logs
----------
id                cuid
user_id           String?       → users.id (SET NULL)
action            String
entity_type       String
entity_id         String
metadata          Json?
ip_address        String?
user_agent        String?
created_at        DateTime
```

Contoh:

```text
ADMIN_APPROVED_PAYMENT
PAYMENT_REJECTED
INVOICE_CREATED
UNIT_CREATED
TENANT_ASSIGNED
USER_LOGIN
```

Indexes:

```text
user_id
entity_type + entity_id
action
created_at
```

Audit log tidak boleh dapat diubah oleh user biasa.

---

# 44. Notifications Table

```text
notifications
-------------
id                cuid
user_id           String        → users.id (CASCADE)
title             String
message           Text
type              String        default "INFO"    (INFO | INVOICE | PAYMENT | WARNING)
link_url          String?
is_read           Boolean       default false
created_at        DateTime
```

Indexes:

```text
user_id + is_read
user_id + created_at
```

---

# 45. File Upload

Bukti transfer merupakan file yang sensitif.

### Implementasi:

* File disimpan di filesystem lokal (`storage/uploads/`).
* Foto properti disimpan di `public/uploads/properties/`.
* Bukti pembayaran disimpan di `storage/uploads/proofs/` (protected).
* Database hanya menyimpan reference/URL.
* Akses file bukti transfer melalui API route `/api/files/proofs/[fileName]` dengan authorization.
* Image processing menggunakan **Sharp** library untuk konversi gambar (JPG/JPEG/PNG/WEBP) ke WebP dengan auto-rotation EXIF dan batas dimensi. **PDF dipertahankan as-is tanpa modifikasi biner** (`isConvertibleImageMime()` + `processFileForStorage()`).
* Validasi MIME type dilakukan server-side.
* Validasi ukuran file.
* Nama file di-generate server-side.
* Filename dari client tidak dipercaya.

Contoh accepted files:

```text
JPG
JPEG
PNG
WEBP
PDF
```

Batas ukuran:

```text
≤ 5 MB
```

### Image Processing Pipeline:

```text
Upload file → Validate MIME → Jika gambar: Sharp resize → Convert to WebP → Save to disk
                          → Jika PDF: simpan as-is tanpa konversi
```

Komponen: `src/lib/storage/image-processor.ts`

---

# 46. Security Requirements

## 46.1 SQL Injection

Semua query menggunakan Prisma ORM (parameterized queries).

Tidak ada raw SQL query dengan string concatenation dari input user.

---

## 46.2 XSS

Semua user-generated content di-sanitize melalui `src/lib/validations/sanitizer.ts`.

Khususnya:

* Nama
* Deskripsi
* Catatan pembayaran
* Alamat

---

## 46.3 CSRF

Mutation dilakukan melalui Server Actions (POST-only, origin-checked oleh Next.js).

---

## 46.4 Rate Limiting

Rate limiting diimplementasikan via `src/lib/validations/rate-limiter.ts`.

Diterapkan pada:

```text
Login
Payment submission
File upload
```

---

## 46.5 Brute Force Protection

Login memiliki perlindungan terhadap percobaan login berulang melalui rate limiting.

---

## 46.6 Sensitive Data

Password di-hash dengan bcryptjs (12 rounds).

Tidak menyimpan atau menampilkan:

```text
password plaintext
session token di client
secret key
database credentials
```

---

## 46.7 Security Headers

Dikonfigurasi di `next.config.ts`:

```text
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://images.unsplash.com https://maps.gstatic.com https://*.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self' https://www.google.com https://maps.google.com; frame-ancestors 'none'
```

Implementasi aktual: `securityHeaders` di `next.config.ts` diterapkan ke `/:path*`.

---

# 47. Environment Variables

Secret berada di environment variable.

```env
# Database
DATABASE_URL=
POSTGRES_URL=
PRISMA_DATABASE_URL=

# Authentication (AUTH_SECRET min 32 karakter, divalidasi Zod di src/lib/env.ts)
AUTH_SECRET=
SESSION_COOKIE_NAME=kk_session

# Cron (dipakai /api/cron/sync-overdue: Bearer token ATAU sesi admin aktif)
CRON_SECRET=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Catatan: `src/lib/env.ts` memvalidasi `DATABASE_URL`, `AUTH_SECRET` (min 32 char),
`SESSION_COOKIE_NAME` (default `kk_session`), `CRON_SECRET` (default
`kontrakan-cron-secret-key`), dan `NEXT_PUBLIC_APP_URL`. `POSTGRES_URL` /
`PRISMA_DATABASE_URL` didokumentasikan untuk kompatibilitas hosting (mis. Prisma Accelerate)
tetapi bukan bagian dari validasi runtime Zod.

File `.env` tidak boleh masuk Git repository.

File `.env.example` mendokumentasikan variable yang dibutuhkan tanpa secret sebenarnya.

---

# 48. API / Server Architecture

Business logic tidak boleh hanya berada di React client.

Arsitektur separation of concerns:

```text
UI (React Components)
 ↓
Server Action / API Route
 ↓
Service Layer (src/services/)
 ↓
Repository Layer (src/repositories/)
 ↓
Prisma ORM
 ↓
PostgreSQL
```

### Services:
```text
auth.service.ts
audit.service.ts
billing.service.ts
notification.service.ts
payment-account.service.ts
payment.service.ts
property.service.ts
rental.service.ts
unit.service.ts
user.service.ts
```

### Repositories:
```text
audit.repository.ts
invoice.repository.ts
notification.repository.ts
payment-account.repository.ts
payment.repository.ts
property.repository.ts
rental.repository.ts
unit.repository.ts
user.repository.ts
```

---

# 49. Next.js Architecture

Struktur implementasi aktual:

```text
kelola-kontrakan/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── banks/                     14 SVG bank/e-wallet logos
│   └── uploads/
│       └── properties/            Foto properti (public)
├── storage/
│   └── uploads/
│       └── proofs/                Bukti pembayaran (protected)
├── src/
│   ├── app/
│   │   ├── (auth)/login/          Login page + actions
│   │   ├── admin/                 Admin portal (10 halaman)
│   │   ├── dashboard/             User portal (7 halaman)
│   │   ├── kontrakan/             Public property listing & detail
│   │   ├── faq/                   FAQ page
│   │   ├── tentang/               About page
│   │   ├── api/                   API routes (6 endpoints)
│   │   ├── layout.tsx             Root layout
│   │   ├── page.tsx               Landing page
│   │   ├── robots.ts              SEO robots
│   │   ├── sitemap.ts             SEO sitemap
│   │   ├── globals.css            Tailwind CSS styles
│   │   └── testimonial-carousel.tsx
│   │
│   ├── components/
│   │   ├── auto-reveal.tsx
│   │   ├── logo.tsx
│   │   ├── notification-bell.tsx
│   │   ├── public-navbar.tsx
│   │   ├── scroll-reveal.tsx
│   │   ├── scroll-reveal-wrapper.tsx
│   │   └── toast-provider.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── authorization.ts
│   │   ├── bank-brand.ts
│   │   ├── env.ts
│   │   ├── facilities.ts
│   │   ├── password.ts
│   │   ├── prisma.ts
│   │   ├── security.ts
│   │   ├── session.ts
│   │   ├── utils.ts
│   │   ├── storage/
│   │   │   ├── index.ts
│   │   │   └── image-processor.ts
│   │   └── validations/           15 validation files (Zod schemas)
│   │
│   ├── proxy.ts                   Next.js 16 route protection
│   ├── repositories/              9 data access files
│   ├── services/                  10 business logic files
│   └── types/
│       ├── auth.ts
│       └── index.ts
│
├── .env.example
├── ARCHITECTURE.md
├── DATABASE_ERD.md
├── PRD.md
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

# 50. Separation of Concerns

```text
UI
 ↓
Server Action / API
 ↓
Service
 ↓
Repository / ORM
 ↓
PostgreSQL
```

Contoh:

```text
approvePayment()
```

tidak berada di component UI.

Business logic pembayaran berada di `payment.service.ts` → `payment.repository.ts`.

---

# 51. UI/UX Direction

UI tidak boleh terlihat seperti template AI/SaaS generik.

Hindari:

* Gradient berlebihan
* Glassmorphism berlebihan
* Neon colors
* Banyak card tanpa hierarki
* Dashboard penuh angka
* Animasi berlebihan
* Typography terlalu dekoratif
* Warna terlalu mencolok

---

# 52. Visual Direction

Arah visual:

```text
Calm
Clean
Warm
Professional
Trustworthy
Simple
Human
```

Karena produk digunakan untuk pengelolaan kontrakan keluarga, UI harus terasa seperti aplikasi administrasi properti yang profesional, bukan startup fintech.

---

# 53. Color System

Gunakan warna dasar yang kalem.

```text
Background:
Off-white / warm gray

Primary:
Muted green / sage

Secondary:
Warm gray

Text:
Dark charcoal

Success:
Muted green

Warning:
Muted amber

Danger:
Muted red
```

Warna harus memiliki contrast ratio yang cukup untuk accessibility.

---

# 54. Typography

Gunakan satu font family utama.

Prioritas:

```text
Readable
Professional
Neutral
```

Hierarchy:

```text
H1
H2
H3
Body
Caption
Label
```

---

# 55. Admin UX

Admin kemungkinan melakukan pekerjaan berulang.

Karena itu:

* Tabel harus mudah dipindai.
* Filter harus jelas.
* Status menggunakan badge.
* Action penting mudah ditemukan.
* Delete menggunakan confirmation.
* Form tidak terlalu panjang.
* Error harus spesifik.
* Loading state harus jelas.
* Empty state harus informatif.

---

# 56. Payment Verification UX

Payment verification adalah workflow yang paling penting bagi admin.

Tampilan ideal:

```text
┌──────────────────────────────────────┐
│ Pembayaran #PAY-001                 │
│                                      │
│ Budi Santoso                         │
│ Unit A01                             │
│ September 2026                       │
│                                      │
│ Tagihan        Rp1.500.000           │
│ Transfer       Rp1.500.000           │
│ Tanggal        8 Sep 2026            │
│                                      │
│ [ Preview Bukti Transfer ]           │
│                                      │
│ [ Tolak ]        [ Verifikasi ]      │
└──────────────────────────────────────┘
```

Admin tidak perlu berpindah banyak halaman untuk melakukan verifikasi.

---

# 57. Confirmation Rules

Action destructive atau irreversible harus menggunakan confirmation.

Contoh:

```text
Hapus kontrakan?
```

Untuk payment:

```text
Verifikasi pembayaran?

Setelah diverifikasi, invoice akan ditandai sebagai lunas.
```

Untuk reject:

```text
Alasan penolakan wajib diisi.
```

---

# 58. Error Handling

Error harus actionable.

Buruk:

```text
Something went wrong.
```

Lebih baik:

```text
Pembayaran gagal dikirim.
Silakan coba lagi.
```

Jika file terlalu besar:

```text
Ukuran bukti pembayaran maksimal 5 MB.
```

Jika invoice sudah dibayar:

```text
Tagihan ini sudah lunas.
```

---

# 59. Loading State

Semua asynchronous operation harus memiliki loading state.

Contoh:

```text
Memverifikasi pembayaran...
```

Button tidak boleh dapat ditekan berkali-kali selama request berlangsung.

---

# 60. Empty State

Contoh:

Jika admin belum memiliki kontrakan:

```text
Belum ada kontrakan.

Tambahkan kontrakan pertama untuk mulai mengelola unit.

[ Tambah Kontrakan ]
```

Jika user tidak memiliki tagihan:

```text
Tidak ada tagihan saat ini.
```

---

# 61. Responsive Design

Aplikasi responsive.

Target:

```text
Desktop
Tablet
Mobile
```

Prioritas:

### User

Mobile-first.

### Admin

Desktop-first tetapi tetap usable di mobile.

---

# 62. Accessibility

Minimum:

* Semantic HTML
* Keyboard navigation
* Visible focus state
* Label pada form
* Alt text pada gambar
* Color bukan satu-satunya indikator status
* Contrast yang memadai
* Error message terhubung dengan input

---

# 63. Core Business Rules

## Rule 1 — Unit Occupancy

Satu unit tidak boleh memiliki dua rental aktif.

```text
unit.status = OCCUPIED
```

hanya jika terdapat rental:

```text
status = ACTIVE
```

---

## Rule 2 — Invoice

Satu rental hanya memiliki satu invoice untuk satu billing period.

```text
UNIQUE(rental_id, billing_period)
```

---

## Rule 3 — Payment

Payment yang telah:

```text
APPROVED
```

tidak dapat diedit user.

---

## Rule 4 — Invoice Paid

Invoice hanya dapat menjadi:

```text
PAID
```

melalui server-side verification.

User tidak dapat mengubah status invoice.

---

## Rule 5 — Rejected Payment

Payment rejected tidak boleh mengubah invoice menjadi PAID.

---

## Rule 6 — Admin

Hanya admin yang dapat:

```text
APPROVE PAYMENT
REJECT PAYMENT
CREATE/EDIT PROPERTY
CREATE/EDIT UNIT
MANAGE TENANT
CREATE/EDIT INVOICE
MANAGE PAYMENT ACCOUNTS
VIEW AUDIT LOG
```

---

# 64. Main Workflow — New Tenant

```text
Admin Login
    ↓
Dashboard
    ↓
Tambah User / Tenant
    ↓
Pilih Unit
    ↓
Masukkan Rental Information
    ↓
Save
    ↓
Rental ACTIVE
    ↓
Unit OCCUPIED
    ↓
Tenant dapat login
    ↓
Tenant melihat dashboard
```

---

# 65. Main Workflow — Monthly Billing

```text
Rental ACTIVE
    ↓
Billing period tiba
    ↓
Generate Invoice (Manual atau Batch)
    ↓
Invoice = UNPAID
    ↓
Notification dikirim ke penyewa
    ↓
User melihat invoice
    ↓
User melakukan transfer
    ↓
User upload bukti
    ↓
Payment = PENDING
```

---

# 66. Main Workflow — Payment Verification

```text
Payment PENDING
    ↓
Admin membuka payment
    ↓
Admin mengecek:
- User
- Unit
- Invoice
- Nominal
- Tanggal
- Bukti transfer
    ↓
      ┌──────────────┐
      │              │
   APPROVE         REJECT
      │              │
      ↓              ↓
Payment APPROVED   Payment REJECTED
      │              │
      ↓              ↓
Invoice PAID       Invoice UNPAID
      │              │
      ↓              ↓
Audit Log          Notification ke penyewa
      │
      ↓
Notification ke penyewa
```

---

# 67. Main Workflow — Overdue

```text
Invoice UNPAID
    ↓
Due date lewat
    ↓
POST/GET /api/cron/sync-overdue (auth: Bearer CRON_SECRET ATAU sesi ADMIN aktif)
    ↓
Invoice OVERDUE
    ↓
Dashboard admin:
"1 tagihan terlambat"
    ↓
User dashboard:
"Tagihan terlambat"
```

MVP tidak menerapkan denda.

---

# 68. Notification Strategy

### Implemented (MVP):

Notifikasi in-app di dashboard dengan:
* Bell icon dengan badge unread count
* List notifikasi dengan link ke resource terkait
* Mark as read (individual & bulk)

Contoh:

```text
Pembayaran Anda sedang diverifikasi.
```

```text
Pembayaran Anda telah disetujui.
```

```text
Pembayaran Anda ditolak.
```

### Future:

* Email
* WhatsApp
* Push notification

---

# 69. Admin Notification

Admin mendapatkan indikator ketika terdapat payment baru.

```text
Pembayaran Menunggu Verifikasi
3
```

Halaman notifikasi: `/admin/notifikasi`

---

# 70. Search & Filtering

Admin membutuhkan search minimal untuk:

### Tenant

* Nama
* Email
* Nomor telepon

### Unit

* Nama unit
* Property

### Payment

* Nama tenant
* Invoice number
* Status

### Invoice

* Tenant
* Periode
* Status

---

# 71. Pagination

List dengan jumlah data besar harus menggunakan pagination.

Contoh:

```text
Showing 1–20 of 84
```

---

# 72. Data Validation

Validation dilakukan di server menggunakan Zod (v4).

File validasi (`src/lib/validations/`):

```text
auth.ts              Login & registrasi
common.ts            Common validators
file.ts              File upload validation
invoice.ts           Invoice validation
payment.ts           Payment submission & verification
property-image.ts    Property image validation
property.ts          Property CRUD validation
query.ts             Query parameter validation
rate-limiter.ts      Rate limiting
rental.ts            Rental validation
sanitizer.ts         Input sanitization
unit.ts              Unit validation
user.ts              User management validation
validate.ts          Validation utilities
index.ts             Barrel export
```

Client-side validation boleh digunakan untuk UX tetapi server-side validation tetap wajib.

---

# 73. Database Transaction

Transaction wajib digunakan untuk operasi yang mengubah beberapa entity sekaligus.

### Approve Payment

```text
Payment APPROVED
+
Invoice PAID
+
Audit Log
+
Notification
```

Keempatnya harus konsisten.

Implementasi: Prisma `$transaction` di `payment.repository.ts`

### Submit Payment (create)

```text
Payment PENDING (create)
+
Invoice WAITING_PAYMENT (update)
+
Audit Log PAYMENT_SUBMITTED
+
Notification ke SEMUA admin
```

Juga atomik dalam `$transaction` yang sama (`payment.repository.ts` → `create()`).

---

# 74. Concurrency

Sistem mempertimbangkan race condition.

Server memastikan perubahan status dilakukan secara atomic/conditional melalui database transaction.

---

# 75. Soft Delete

Untuk data bisnis penting, tidak langsung hard delete.

```text
Property        → status ARCHIVED
Unit            → status INACTIVE
Rental          → status ENDED / CANCELLED
Invoice         → status CANCELLED
```

Payment dan invoice yang telah memiliki histori transaksi tidak dihapus secara fisik.

---

# 76. Auditability

Admin action penting dapat dilacak melalui:

URL:

```text
/admin/audit-log
```

Audit log menyimpan:

```text
actor (user_id)
action
entity_type
entity_id
metadata (JSON)
ip_address
user_agent
timestamp
```

Implementasi: `audit.service.ts` + `audit.repository.ts`

---

# 77. SEO

Public pages SEO-friendly.

Implementasi:

* `robots.ts` — robots.txt generation
* `sitemap.ts` — sitemap.xml generation
* Metadata per halaman
* Open Graph tags
* Semantic HTML

---

# 78. Performance

* Image dioptimalkan (WebP conversion via Sharp).
* Server rendering untuk public pages.
* Database query menggunakan index yang tepat.
* Pagination untuk data besar.

---

# 79. Observability

* Error logging
* Audit log system
* Toast notifications untuk user feedback (react-toastify)

---

# 80. Deployment

Target deployment:

```text
Git Repository
      ↓
CI / Build
      ↓
Vercel
      ↓
Next.js Application
      ↓
PostgreSQL
```

Environment:

```text
Development
Preview
Production
```

Production secrets tidak boleh digunakan di development.

---

# 81. Tech Stack Summary

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Framework      | Next.js 16 (App Router)           |
| Language       | TypeScript (Strict)               |
| UI             | React 19, Tailwind CSS v4         |
| Icons          | Lucide React                      |
| Database       | PostgreSQL                        |
| ORM            | Prisma v6                         |
| Auth           | Custom (bcryptjs + jose JWT HS256 + DB sessions) |
| Validation     | Zod v4                            |
| File Upload    | Sharp (WebP), local filesystem    |
| Toast          | react-toastify                    |
| CSS Utils      | clsx, tailwind-merge              |
| Dev Tools      | ESLint, tsx                       |

---

# 82. Test Accounts (Seeded)

`prisma/seed.ts` saat ini **hanya me-seed 1 akun admin** (upsert by email):

| Role    | Nama   | Email               | Password  | Portal  |
| ------- | ------ | ------------------- | --------- | ------- |
| ADMIN   | Admin  | admin@kontrakan.com | Admin123! | /admin  |

Akun penyewa contoh (mis. Budi / Siti) **tidak di-seed otomatis**.
Admin membuat akun penyewa via portal `/admin/penyewa` (Create Tenant +
Assign ke unit). Setelah rental `ACTIVE`, penyewa dapat login ke `/dashboard`
dengan kredensial yang dibuat admin.

---

# 83. Critical Acceptance Criteria

## Property

Admin dapat:

* Create property (dengan foto, auto WebP)
* Read property
* Update property
* Archive property

Public hanya dapat melihat property:

```text
PUBLISHED
```

---

## Unit

Admin dapat:

* Create unit (dengan fasilitas per-unit)
* Update unit
* Change availability
* Assign tenant

Satu unit tidak boleh memiliki dua rental aktif.

---

## Billing

Sistem dapat:

* Membuat invoice (manual & batch)
* Menampilkan invoice
* Menentukan status overdue (via cron)
* Menandai invoice PAID setelah payment approved

Duplicate invoice untuk periode yang sama dicegah oleh unique constraint.

---

## Payment

User dapat:

* Membuka invoice
* Melihat rekening (dengan QR code jika tersedia)
* Upload bukti transfer (auto WebP)
* Submit payment
* Melihat status

Admin dapat:

* Melihat payment pending
* Membuka bukti
* Approve
* Reject
* Memberikan alasan rejection

---

## Notification

* Notifikasi terkirim saat payment approved/rejected
* Notifikasi terkirim saat invoice dibuat
* Bell icon menampilkan unread count
* User dapat mark as read

---

## Security

* User tidak dapat mengakses admin.
* User tidak dapat mengakses data user lain.
* User tidak dapat mengubah status payment.
* User tidak dapat mengubah status invoice.
* Password tidak disimpan plaintext.
* Secret tidak dikirim ke client.
* File bukti transfer dilindungi oleh authorization.
* Mutation penting divalidasi di server.
* Payment approval menggunakan database transaction.
* Security headers dikonfigurasi.
* Input disanitasi.

---

# 84. MVP Definition

MVP dianggap selesai apabila workflow berikut berjalan end-to-end:

```text
ADMIN
  ↓
Create Property
  ↓
Create Unit
  ↓
Create/Assign Tenant
  ↓
Create Invoice (Manual/Batch)
  ↓
Tenant Login
  ↓
Tenant melihat unit
  ↓
Tenant melihat invoice
  ↓
Tenant menerima notifikasi
  ↓
Tenant transfer manual
  ↓
Tenant upload bukti
  ↓
Payment PENDING
  ↓
Admin mendapat notification/indicator
  ↓
Admin membuka payment
  ↓
Admin melihat bukti
  ↓
Admin APPROVE
  ↓
Payment APPROVED
  ↓
Invoice PAID
  ↓
Tenant melihat status LUNAS
  ↓
Tenant menerima notifikasi
  ↓
Audit Log tersimpan
```

**Status: ✅ MVP Complete**

---

# 85. Future Roadmap

Setelah MVP stabil, fitur berikut dapat ditambahkan.

## Phase 2

* WhatsApp reminder
* Email notification
* Automatic monthly invoice (scheduled/cron)
* Dashboard financial summary (expanded)
* Export Excel/CSV
* Printable invoice
* Receipt

## Phase 3

* Payment gateway
* Virtual Account
* Automatic payment verification
* Automatic reconciliation
* Multiple admin
* Admin permissions

## Phase 4

* Multi-property management (multi-owner)
* Expense tracking
* Profit/loss report
* Maintenance ticket
* Tenant complaints
* Contract document management
* Renewal reminder

---

# 86. Important Product Principle

Aplikasi ini bukan sekadar CRUD kontrakan.

Core product loop adalah:

```text
PROPERTY
    ↓
UNIT
    ↓
TENANT
    ↓
RENTAL
    ↓
INVOICE
    ↓
PAYMENT
    ↓
VERIFICATION
    ↓
PAID
    ↓
NOTIFICATION
```

Seluruh arsitektur database, permission, UI, dan workflow harus mengikuti hubungan tersebut.

---

# 87. Definition of Done

Sebuah fitur dianggap selesai apabila:

### Functional

* Workflow berhasil.
* Validation berjalan.
* Error handling tersedia.
* Loading state tersedia.
* Empty state tersedia.

### Security

* Authentication benar.
* Authorization benar.
* Object-level authorization benar.
* Input tervalidasi & tersanitasi.
* Sensitive data tidak bocor.

### Database

* Migration tersedia.
* Foreign key benar.
* Constraint tersedia.
* Index yang diperlukan tersedia.
* Transaction digunakan ketika diperlukan.

### UX

* Responsive.
* Mobile usable.
* Desktop usable.
* Accessibility dasar terpenuhi.
* Tidak ada UI yang misleading.

### Code Quality

* TypeScript strict.
* Tidak ada secret di source code.
* Business logic berada di server (services/repositories).
* Component tidak terlalu besar.
* Reusable component digunakan ketika memang diperlukan.

### Production

* Build berhasil.
* Environment variable terdokumentasi.
* Database migration terdokumentasi.
* Security headers dikonfigurasi.
* Deployment dapat dilakukan secara reproducible.

---

# 88. Final Product Architecture

```text
                         PUBLIC
                           │
             ┌─────────────┼─────────────┐
             │             │             │
        Property       Property      FAQ / Tentang
          List          Detail
             │
             ▼
        Authentication
             │
       ┌─────┴─────┐
       │           │
      USER        ADMIN
       │           │
       ▼           ▼
   Dashboard   Dashboard
       │           │
       │           ├── Properties
       │           ├── Units
       │           ├── Tenants
       │           ├── Invoices (Manual + Batch)
       │           ├── Payments (Verification)
       │           ├── History
       │           ├── Audit Log
       │           ├── Notifications
       │           └── Settings (Accounts + Profile)
       │
       ├── My Property
       ├── Invoices
       ├── Payment (Upload)
       ├── History
       ├── Notifications
       └── Profile
```

---

# 89. Priority Matrix

| Feature                    | Priority | MVP      | Status          |
| -------------------------- | -------- | -------- | --------------- |
| Public Home                | P0       | Yes      | ✅ Implemented  |
| Property Listing           | P0       | Yes      | ✅ Implemented  |
| Property Detail            | P0       | Yes      | ✅ Implemented  |
| Authentication             | P0       | Yes      | ✅ Implemented  |
| Admin Dashboard            | P0       | Yes      | ✅ Implemented  |
| User Dashboard             | P0       | Yes      | ✅ Implemented  |
| Property CRUD              | P0       | Yes      | ✅ Implemented  |
| Unit CRUD                  | P0       | Yes      | ✅ Implemented  |
| Tenant Management          | P0       | Yes      | ✅ Implemented  |
| Invoice (Manual)           | P0       | Yes      | ✅ Implemented  |
| Invoice (Batch)            | P1       | Optional | ✅ Implemented  |
| Manual Payment             | P0       | Yes      | ✅ Implemented  |
| Upload Payment Proof       | P0       | Yes      | ✅ Implemented  |
| Admin Payment Verification | P0       | Yes      | ✅ Implemented  |
| Payment History            | P0       | Yes      | ✅ Implemented  |
| Authorization              | P0       | Yes      | ✅ Implemented  |
| Object-Level Authorization | P0       | Yes      | ✅ Implemented  |
| Audit Log                  | P0       | Yes      | ✅ Implemented  |
| In-App Notifications       | P1       | Yes      | ✅ Implemented  |
| Revenue Chart              | P1       | Optional | ✅ Implemented  |
| SEO (robots, sitemap)      | P1       | Yes      | ✅ Implemented  |
| Security Headers           | P1       | Yes      | ✅ Implemented  |
| FAQ Page                   | P2       | Optional | ✅ Implemented  |
| Tentang Page               | P2       | Optional | ✅ Implemented  |
| Image WebP Processing      | P2       | Optional | ✅ Implemented  |
| Overdue Cron Sync          | P1       | Optional | ✅ Implemented  |
| Email Notification         | P1       | No       | ❌ Not yet      |
| WhatsApp Notification      | P1       | No       | ❌ Not yet      |
| Payment Gateway            | P2       | No       | ❌ Not yet      |
| Accounting                 | P2       | No       | ❌ Not yet      |
| Maintenance System         | P2       | No       | ❌ Not yet      |

---

# 90. Key Success Metrics

### Operational

* Admin dapat mengetahui status pembayaran tanpa membuka spreadsheet.
* Waktu pengecekan pembayaran berkurang.
* Tidak ada duplicate invoice.
* Tidak ada pembayaran yang kehilangan status.

### User

* User dapat menemukan tagihan dalam ≤ 2–3 klik.
* User dapat mengirim bukti pembayaran melalui mobile.
* User dapat mengetahui apakah pembayaran sudah diverifikasi.
* User menerima notifikasi in-app.

### Technical

* Tidak terdapat unauthorized data access.
* Tidak terdapat critical security vulnerability.
* Tidak terdapat inconsistent payment/invoice state.
* Security headers aktif.

---

# 91. Product Principle untuk Development

Prioritas pembangunan harus selalu:

```text
Correctness
    ↓
Security
    ↓
Data Integrity
    ↓
Usability
    ↓
Performance
    ↓
Visual Polish
```

Jangan mengorbankan data integrity atau security hanya demi membuat UI terlihat lebih cepat selesai.

Untuk sistem pembayaran, **status database harus selalu menjadi source of truth**, bukan state yang dipercaya dari browser.

---

# 92. MVP Final Scope

MVP final terdiri dari:

```text
PUBLIC
├── Home
├── Property Listing
├── Property Detail
├── Tentang
└── FAQ

AUTH
├── Login
└── Logout

USER
├── Dashboard
├── My Property
├── Invoice
├── Payment
├── Payment History
├── Notifications
└── Profile

ADMIN
├── Dashboard (+ Revenue Chart)
├── Property (CRUD + Images)
├── Unit (CRUD + Facilities)
├── Tenant (CRUD + Assign/End)
├── Invoice (Manual + Batch)
├── Payment Verification
├── Payment History
├── Notifications
├── Payment Accounts (+ QR Code)
├── Admin Profile
└── Audit Log

API
├── File Upload
├── Protected File Access
├── Notifications (CRUD + Read)
└── Cron (Overdue Sync)

SYSTEM
├── PostgreSQL + Prisma
├── Authentication (bcryptjs + jose JWT HS256 + DB sessions)
├── Authorization (RBAC + Object-Level)
├── File Storage (local + Sharp WebP)
├── Validation (Zod v4 + sanitizer)
├── Transaction (Prisma $transaction)
├── Rate Limiting
├── Security Headers
├── SEO (robots.ts + sitemap.ts)
└── Notifications (In-App)
```

**End state MVP:**

> Admin dapat mengelola kontrakan → mengelola unit → mengelola penyewa → membuat tagihan (manual/batch) → penyewa menerima notifikasi → penyewa melakukan transfer manual → mengirim bukti → admin memverifikasi → sistem otomatis mengubah invoice menjadi lunas → notifikasi terkirim → seluruh aktivitas penting tercatat di audit log dan terlindungi oleh authorization berlapis.
