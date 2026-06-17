# WAD Capstone API - Sistem Notifikasi

Proyek ini adalah REST API untuk sistem manajemen tugas dan notifikasi yang dibangun sebagai pemenuhan tugas UTS mata kuliah Web Application Development (WAD).

## Daftar Isi
1. [Fitur Proyek](#fitur-proyek)
2. [Struktur Teknologi](#struktur-teknologi)
3. [Cara Instalasi](#cara-instalasi)
4. [Dokumentasi Endpoint](#dokumentasi-endpoint)
5. [ERD Database](#erd-database)

---

## Fitur Proyek
Proyek ini mengintegrasikan seluruh materi dari Week 1 hingga Week 7:
- **Autentikasi (Week 6):** Register (Argon2id), Login (JWT Access + Refresh Token), Logout, Refresh Token Rotation, dan Get Me.
- **Task Management (Week 2-3):** Full CRUD Task dengan Joi validation, pagination, filtering, dan sorting.
- **Notification System (Model Tambahan - Week 7):** Fitur unik untuk mengirim dan mengelola notifikasi pengguna dengan relasi ke model User.
- **Dokumentasi (Week 2):** Swagger UI interaktif tersedia di `/api/docs`.

## Struktur Teknologi
- **Backend:** Node.js & Express.js (MVC Pattern).
- **Database:** PostgreSQL/MySQL dengan Prisma ORM.
- **Security:** JWT (JSON Web Token), Argon2id (Password Hashing), Joi (Input Validation).


### Cara Instalasi

1. Clone repository ini ke komputer kamu.
2. Salin `.env.example` menjadi `.env` dan isi konfigurasi database.
3. Install package:
   ```bash
   npm install
## 1. Jalankan migrasi database:
    npx prisma migrate dev
## 2. Jalankan server dalam mode development:
    npm run dev

## Dokumentasi Endpoint
Dokumentasi lengkap API dapat dilihat melalui Swagger UI setelah server berjalan:
http://localhost:3000/api/docs

ERD Database
Sistem ini terdiri dari model utama:

User: Menyimpan kredensial pengguna.

Task: Menyimpan detail tugas dengan fitur pagination.

Notification: Model tambahan untuk sistem notifikasi (relasi ke User).

RefreshToken: Tabel pendukung untuk sistem autentikasi JWT.

Catatan: Bukti screenshot Swagger dan Prisma Studio tersedia di folder /Media. 