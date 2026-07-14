# WAD Task Manager — Capstone Project

Aplikasi manajemen task full-stack dengan fitur real-time notification, dibangun sebagai proyek UTS & UAS mata kuliah Web Advanced Development 2.

- **Backend repo:** `wad-capstone` (Express + Prisma + MySQL + Socket.IO)
- **Frontend repo:** `wad-frontend` (React + Vite)
- **Live URL:** https://wad02nhasana.my.id
- **API Docs (Swagger):** https://wad02nhasana.my.id/api-docs

---

## Daftar Isi

1. [Cara Setup Lokal](#cara-setup-lokal)
2. [Daftar Endpoint API](#daftar-endpoint-api)
3. [Event Socket.IO](#event-socketio)
4. [ERD Database](#erd-database)
5. [Arsitektur Deployment](#arsitektur-deployment)

---

## Cara Setup Lokal

### Prasyarat
- Node.js v20+ (disarankan pakai NVM)
- MySQL 8
- Git

### Backend (`wad-capstone`)

```bash
git clone https://github.com/NHasana/wad_capstone.git
cd wad_capstone
npm install
```

Buat file `.env` di root folder:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/myapp_db"

JWT_ACCESS_SECRET=ganti_dengan_secret_acak
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=ganti_dengan_secret_acak_lain
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:5173
```

Jalankan migrasi database & seed (opsional):

```bash
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
```

Jalankan server:

```bash
npm run dev
```

Backend berjalan di `http://localhost:3000`, dokumentasi Swagger di `http://localhost:3000/api-docs`.

### Frontend (`wad-frontend`)

```bash
git clone https://github.com/NHasana/wad_frontend.git
cd wad_frontend
npm install
```

Buat file `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Jalankan dev server:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

---

## Daftar Endpoint API

Semua endpoint (kecuali auth) membutuhkan header `Authorization: Bearer <accessToken>`.

### Auth (`/auth`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/auth/register` | Registrasi user baru (password di-hash argon2id) |
| POST | `/auth/login` | Login, mengembalikan `accessToken` (15 menit) & `refreshToken` (7 hari) |
| POST | `/auth/refresh` | Refresh access token (dengan token rotation & reuse detection) |
| POST | `/auth/logout` | Logout, revoke refresh token |
| GET  | `/auth/me` | Ambil data user yang sedang login |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/tasks` | List task (pagination, filter status/priority, sorting) |
| GET | `/api/v1/tasks/:id` | Detail satu task |
| POST | `/api/v1/tasks` | Buat task baru |
| PUT | `/api/v1/tasks/:id` | Replace task (semua field wajib) |
| PATCH | `/api/v1/tasks/:id` | Update sebagian field task |
| DELETE | `/api/v1/tasks/:id` | Hapus task |

Query params untuk `GET /api/v1/tasks`: `status`, `priority`, `sort`, `order`, `limit`, `offset`.

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/notifications` | List notifikasi milik user yang login |
| GET | `/api/v1/notifications/unread-count` | Jumlah notifikasi belum dibaca |
| PUT | `/api/v1/notifications/mark-all-read` | Tandai semua notifikasi sebagai dibaca |
| GET | `/api/v1/notifications/:id` | Detail satu notifikasi |
| POST | `/api/v1/notifications` | Buat notifikasi (internal use) |
| PUT | `/api/v1/notifications/:id` | Update notifikasi (mis. `isRead`) |
| DELETE | `/api/v1/notifications/:id` | Hapus notifikasi |

### Admin (`/api/v1/admin`) — khusus role `ADMIN`

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/admin/users` | List semua user |
| PATCH | `/api/v1/admin/users/:id/role` | Ubah role user (`USER`/`ADMIN`) |
| GET | `/api/v1/admin/tasks` | List semua task dari semua user |

---

## Event Socket.IO

Koneksi socket diautentikasi lewat `accessToken` JWT yang dikirim di `socket.handshake.auth.token`. Koneksi tanpa token valid akan ditolak.

```js
const socket = io(API_URL, {
  transports: ["websocket"],
  auth: { token: accessToken },
});
```

### Rooms

| Room | Anggota | Kegunaan |
|---|---|---|
| `user:<userId>` | Socket milik user tsb | Notifikasi personal |
| `tasks:global` | Semua socket yang terhubung | Live update daftar task untuk semua user |

### Event dari Server → Client

| Event | Dikirim ke | Payload | Trigger |
|---|---|---|---|
| `task:created` | `tasks:global` | `{ task }` | Task baru dibuat |
| `task:updated` | `tasks:global` | `{ task }` | Task diperbarui (PUT/PATCH) |
| `task:deleted` | `tasks:global` | `{ taskId }` | Task dihapus |
| `notification` | `user:<userId>` | Objek notifikasi (`id, title, message, type, isRead, userId, relatedTaskId, createdAt`) | Setiap kali task milik user tsb dibuat/diperbarui/dihapus |
| `users:online` | Semua client | `{ count }` | Setiap ada koneksi/diskoneksi socket |

### Reconnection

Saat access token diperbarui lewat `/auth/refresh`, frontend memicu event lokal `token:refreshed`, yang membuat `SocketContext` melakukan disconnect + reconnect memakai token baru.

---

## ERD Database

```
┌─────────────────┐          ┌──────────────────┐
│      User        │          │   RefreshToken    │
├──────────────────┤          ├───────────────────┤
│ id (PK)          │ 1      * │ id (PK)           │
│ name             │──────────│ token             │
│ email (unique)   │          │ userId (FK)       │
│ password         │          │ expiresAt         │
│ role (enum)      │          │ isRevoked         │
│ createdAt        │          │ createdAt         │
│ updatedAt        │          └───────────────────┘
└──────────────────┘
     │ 1
     │
     │ *
┌──────────────────┐          ┌───────────────────┐
│      Task         │          │     Category      │
├──────────────────┤          ├───────────────────┤
│ id (PK)          │  *     1 │ id (PK)           │
│ title            │──────────│ name (unique)     │
│ description      │          │ color             │
│ status (enum)    │          │ createdAt         │
│ priority (enum)  │          └───────────────────┘
│ dueDate          │
│ userId (FK)      │
│ categoryId (FK)  │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
     │ 1
     │
     │ *
┌──────────────────┐
│   Notification    │
├──────────────────┤
│ id (PK)          │
│ title            │
│ message          │
│ type             │  (INFO / WARNING / SUCCESS)
│ isRead           │
│ userId (FK)      │──→ User
│ relatedTaskId(FK)│──→ Task (nullable)
│ createdAt        │
└──────────────────┘
```

**Enum:**
- `Status`: `TODO`, `IN_PROGRESS`, `DONE`
- `Priority`: `LOW`, `MEDIUM`, `HIGH`
- `Role`: `USER`, `ADMIN`

---

## Arsitektur Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                     Internet (HTTPS)                            │
│                 https://wad02nhasana.my.id                       │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  VPS Biznet Gio (Ubuntu 22.04) — 103.93.163.136                  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Nginx (reverse proxy + SSL termination via Certbot)      │  │
│  │  Listen :80 → redirect ke :443                             │  │
│  │  Listen :443 (SSL Let's Encrypt)                           │  │
│  │                                                             │  │
│  │   /socket.io/  ──┐                                         │  │
│  │   /api/        ──┼──▶ proxy_pass → localhost:3000          │  │
│  │   /auth/       ──┘      (Backend, dikelola PM2)             │  │
│  │                                                             │  │
│  │   /  (semua route lain) ──▶ proxy_pass → localhost:3001    │  │
│  │                              (Frontend, dikelola PM2)       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         ▼                  ▼                  ▼                 │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────┐         │
│  │  PM2:        │   │  PM2:         │   │  MySQL 8       │         │
│  │  wad-backend │   │  frontend     │   │  (myapp_db)    │         │
│  │  (Node.js,   │   │  (serve,      │   │                │         │
│  │  Express,    │   │  static build │   │                │         │
│  │  Socket.IO)  │   │  Vite/React)  │   │                │         │
│  │  port 3000   │   │  port 3001    │   │  port 3306     │         │
│  └──────┬───────┘   └───────────────┘   └───────┬───────┘         │
│         │                                        │                │
│         └────────────── Prisma ORM ───────────────┘                │
│                                                                   │
│  Firewall (UFW): hanya port 22 (SSH), 80, 443 terbuka ke publik   │
│  Port 3000/3001/3306 tertutup untuk akses eksternal langsung      │
└─────────────────────────────────────────────────────────────────┘

CI/CD: GitHub Actions
  push ke `master` (backend) → SSH ke VPS → git pull → npm install
    → prisma generate → prisma migrate deploy → pm2 restart wad-backend

  push ke `main` (frontend)  → SSH ke VPS → git pull → npm install
    → npm run build → copy ke /var/www/html → pm2 restart frontend
```

### Keamanan
- Akses VPS via SSH key (Ed25519), login root dinonaktifkan, autentikasi password dimatikan
- Deploy key terpisah untuk backend & frontend, disimpan sebagai GitHub Actions Secrets
- HTTPS wajib (HTTP otomatis redirect ke HTTPS via Certbot)
- Helmet untuk security headers, rate limiting pada endpoint auth
- Password di-hash dengan argon2id, JWT access token berumur pendek (15 menit) dengan refresh token rotation & reuse detection

---

## Tim / Pengembang

**Nur Hasana Merlinda Safitri** — Model tambahan: **Notification** (real-time notification center dengan bell icon, badge unread count, dan toast).
