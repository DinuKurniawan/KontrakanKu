# Kelola Kontrakan

Aplikasi web untuk membantu pemilik/pengelola kontrakan mengelola unit, penyewa, tagihan bulanan, dan verifikasi pembayaran transfer manual — terpusat dalam satu dashboard.

Status: **MVP production-ready** (lihat `PRD.md` v2.1 untuk spesifikasi lengkap).

## Fitur utama

- **Public:** home, daftar kontrakan (`/kontrakan`), detail kontrakan + galeri, tentang, FAQ, SEO (`robots`/`sitemap`)
- **Admin (`/admin`, 10 halaman):** dashboard + grafik pendapatan, CRUD kontrakan (foto), CRUD unit, manajemen penyewa (assign/akhiri sewa), tagihan manual + batch massal, verifikasi pembayaran (approve/reject), riwayat, notifikasi, audit log, pengaturan (rekening bank + QR + profil)
- **Penyewa (`/dashboard`, 7 halaman):** dashboard tagihan, kontrakan saya, tagihan, pembayaran (upload bukti transfer), riwayat, notifikasi, profil
- **Billing:** alur `Invoice → Payment`; cegah duplikat via `UNIQUE(rental_id, billing_period)`; tagihan batch bulan depan disembunyikan sampai bulannya tiba; sinkronisasi overdue via `/api/cron/sync-overdue`
- **Notifikasi in-app:** bell + badge unread, tandai dibaca satuan/massal
- **Keamanan:** session DB + JWT cookie (`jose`, HS256), `bcryptjs` 12 rounds, RBAC + object-level authorization, proteksi rute di `src/proxy.ts`, security headers + CSP, rate limiting, sanitasi input (Zod v4), bukti transfer di route terproteksi

## Tech stack

| Layer    | Teknologi                                        |
| -------- | ------------------------------------------------ |
| Framework| Next.js 16.3.4 (App Router), React 19            |
| Bahasa   | TypeScript (strict)                              |
| Styling  | Tailwind CSS v4, Lucide icons                    |
| Database | PostgreSQL + Prisma v6                           |
| Auth     | `bcryptjs` + `jose` (JWT HS256) + sesi di DB     |
| Validasi | Zod v4                                           |
| File     | Sharp (gambar → WebP; PDF disimpan as-is)        |
| UX       | react-toastify, clsx + tailwind-merge            |
| Dev      | ESLint 9, tsx, TypeScript 5                      |

## Prasyarat

- Node.js 20+
- PostgreSQL (lokal atau hosted)
- npm

## Setup cepat

```bash
npm install
cp .env.example .env   # lalu isi DATABASE_URL & AUTH_SECRET (min 32 karakter)
npx prisma generate
npx prisma db push     # dev; untuk production gunakan migrate
npx tsx prisma/seed.ts # seed 1 akun admin
npm run dev            # http://localhost:3000
```

Build production:

```bash
npm run build
npm start
```

## Environment variables

Salin `.env.example` menjadi `.env`, lalu isi dengan nilai aslinya. **Jangan pernah menampilkan, menyalin, atau membagikan isi `.env`** — file tersebut berisi secret krusial (kredensial database, `AUTH_SECRET`, `CRON_SECRET`).

Variabel yang dibutuhkan (lihat formatnya di `.env.example`):

- `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`
- `AUTH_SECRET`, `SESSION_COOKIE_NAME`
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`

Catatan:

- `AUTH_SECRET` wajib min 32 karakter (divalidasi Zod di `src/lib/env.ts`).
- `CRON_SECRET` dipakai endpoint `POST/GET /api/cron/sync-overdue` (Bearer token, atau fallback sesi admin aktif). Ada default di kode, tetapi sebaiknya diisi eksplisit.
- Jangan commit `.env` ke git.

## Akun seed

Seed (`prisma/seed.ts`, upsert by email) hanya membuat **1 akun**:

| Role  | Nama  | Email               | Password  | Portal  |
| ----- | ----- | ------------------- | --------- | ------- |
| ADMIN | Admin | admin@kontrakan.com | Admin123! | /admin  |

Akun penyewa **dibuat manual oleh admin** via `/admin/penyewa` (buat tenant → assign ke unit → rental `ACTIVE`), lalu penyewa login ke `/dashboard`.

## Struktur rute (ringkas)

```text
/                        Home
/kontrakan               Daftar kontrakan (PUBLISHED)
/kontrakan/[slug]        Detail + galeri (gallery-viewer.tsx)
/tentang, /faq           Halaman statis
/login                   Login (redirect by role; callbackUrl didukung)

/dashboard               Ringkasan tagihan penyewa
/dashboard/kontrakan-saya | /dashboard/tagihan | /dashboard/pembayaran
/dashboard/riwayat | /dashboard/notifikasi | /dashboard/profil

/admin                   Dashboard + revenue-chart
/admin/kontrakan | /admin/unit | /admin/penyewa | /admin/tagihan
/admin/pembayaran | /admin/riwayat | /admin/notifikasi
/admin/audit-log | /admin/pengaturan

/api/upload | /api/files/proofs/[fileName] (terproteksi)
/api/notifications | /api/notifications/[id]/read | /api/notifications/read-all
/api/cron/sync-overdue (Bearer CRON_SECRET atau admin)
```

Arsitektur kode: `UI → Server Action / API Route → Service (src/services/) → Repository (src/repositories/) → Prisma → PostgreSQL`.

## Dokumen terkait

- `PRD.md` — spesifikasi produk (source of truth fitur & workflow)
- `ARCHITECTURE.md` — arsitektur teknis
- `DATABASE_ERD.md` — relasi database
