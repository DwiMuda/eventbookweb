# EventBook — Community Event Booking System

Platform manajemen event modern untuk komunitas, workshop, dan event organizer profesional.

## Tech Stack

| Layer     | Teknologi                        |
|-----------|----------------------------------|
| Frontend  | Vue 3 (Composition API) + Vite   |
| Styling   | Tailwind CSS                     |
| Backend   | Node.js + Express.js             |
| Database  | SQLite (dev) / PostgreSQL (prod) |
| ORM       | Prisma                           |
| Auth      | JWT                              |

---

## Struktur Folder

```
eventbook/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.js              # Demo data seeder
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── checkin.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── event.service.js
│   │   │   ├── booking.service.js
│   │   │   ├── checkin.service.js
│   │   │   └── dashboard.service.js
│   │   ├── routes/              # Express routers
│   │   │   ├── auth.routes.js
│   │   │   ├── event.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── checkin.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── index.js             # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/                 # Axios API modules
    │   │   ├── client.js
    │   │   └── index.js
    │   ├── assets/
    │   │   └── main.css         # Tailwind + global styles
    │   ├── components/
    │   │   ├── event/
    │   │   │   └── EventCard.vue
    │   │   ├── layout/
    │   │   │   └── AppLayout.vue
    │   │   └── ui/
    │   │       ├── AppBadge.vue
    │   │       ├── AppButton.vue
    │   │       ├── AppInput.vue
    │   │       ├── AppModal.vue
    │   │       └── StatsCard.vue
    │   ├── router/
    │   │   └── index.js
    │   ├── stores/
    │   │   └── auth.js          # Pinia auth store
    │   ├── views/
    │   │   ├── LoginView.vue
    │   │   ├── RegisterView.vue
    │   │   ├── DashboardView.vue
    │   │   ├── EventListView.vue
    │   │   ├── EventFormView.vue
    │   │   ├── EventDetailView.vue
    │   │   ├── EventPublicView.vue
    │   │   ├── BookingView.vue
    │   │   ├── TicketView.vue
    │   │   └── CheckinView.vue
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Setup & Instalasi

### 1. Clone dan install dependencies

```bash
# Backend
cd eventbook/backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup database

```bash
cd backend

# Generate Prisma client + push schema ke SQLite
npx prisma db push

# Isi data demo (opsional)
node prisma/seed.js
```

### 3. Jalankan development server

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Auth | Deskripsi         |
|--------|--------------------|------|-------------------|
| POST   | /api/auth/register | —    | Registrasi user   |
| POST   | /api/auth/login    | —    | Login             |
| GET    | /api/auth/me       | ✓    | Data user aktif   |

### Events
| Method | Endpoint                      | Auth | Deskripsi              |
|--------|-------------------------------|------|------------------------|
| GET    | /api/events                   | —    | List semua event       |
| GET    | /api/events/:id               | —    | Detail event           |
| POST   | /api/events                   | ✓    | Buat event baru        |
| PUT    | /api/events/:id               | ✓    | Update event           |
| DELETE | /api/events/:id               | ✓    | Hapus event            |
| GET    | /api/events/:id/participants  | ✓    | List peserta           |

### Bookings
| Method | Endpoint                       | Auth | Deskripsi              |
|--------|--------------------------------|------|------------------------|
| POST   | /api/bookings                  | —    | Buat booking baru      |
| GET    | /api/bookings/:code            | —    | Detail booking by code |
| PATCH  | /api/bookings/:code/cancel     | —    | Batalkan booking       |
| GET    | /api/bookings/export/:eventId  | ✓    | Export CSV peserta     |

### Check-in
| Method | Endpoint                    | Auth | Deskripsi             |
|--------|-----------------------------|------|-----------------------|
| POST   | /api/checkin                | ✓    | Check-in peserta      |
| GET    | /api/checkin/stats/:eventId | ✓    | Statistik check-in    |

### Dashboard
| Method | Endpoint       | Auth | Deskripsi         |
|--------|----------------|------|-------------------|
| GET    | /api/dashboard | ✓    | Statistik ringkas |

---

## Demo Login

```
Email:    organizer@eventbook.id
Password: organizer123
```

---

## Deployment

### Backend (Railway / Render)
1. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
2. Untuk production, ganti `DATABASE_URL` ke PostgreSQL
3. Update `prisma/schema.prisma` provider dari `sqlite` ke `postgresql`
4. Push dan migrate: `npx prisma migrate deploy`

### Frontend (Vercel / Netlify)
1. Set env variable: `VITE_API_URL=https://your-backend.railway.app/api`
2. Build command: `npm run build`
3. Output directory: `dist`

---

## Fitur Utama

- ✅ Manajemen event (CRUD + status)
- ✅ Sistem booking dengan auto-generate kode unik
- ✅ Tiket digital dengan QR Code
- ✅ Sistem check-in manual
- ✅ Dashboard statistik admin
- ✅ Waitlist otomatis saat kuota penuh
- ✅ Export data peserta ke CSV
- ✅ Halaman publik per event
- ✅ Responsive mobile-first design
- ✅ JWT authentication

---

## Pengembangan Lanjutan (Roadmap)

- [ ] Scan QR menggunakan kamera
- [ ] Notifikasi WhatsApp / Email otomatis
- [ ] Multi-tenant (per organizer)
- [ ] Pembayaran online
- [ ] Custom form pendaftaran
- [ ] Laporan & analitik lengkap
