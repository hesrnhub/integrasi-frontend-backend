# Review Kantin — Frontend React & Integrasi Backend (Tugas 4)

Frontend untuk Sistem Review Kantin yang terhubung ke backend Express.js + SQL Server (Tugas 2 dan 3).

## Teknologi
- **Frontend:** React 18, TypeScript, Vite, React Router
- **Komunikasi HTTP:** **Axios** (satu instance bersama dengan interceptor)
- **Backend:** Express 5, Drizzle ORM, SQL Server, JWT (Bearer), bcryptjs, Zod
- **Penyimpanan token:** `localStorage`

## Struktur
```
backend/    API Express (Tugas 2 + 3, ditambah CORS)
frontend/   Aplikasi React
  src/api/        client Axios, authApi, stallsApi, normalisasi error
  src/auth/       AuthContext, ProtectedRoute, aturan permission per role
  src/components/ Navbar, StallCard, StallForm, Feedback (loading/empty/error), Toast
  src/pages/      daftar, detail, form, login, register, profil, 403/404
```

## Instalasi dan menjalankan

Dari folder `tugas4`, pasang dependency untuk runner dan kedua aplikasi:
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Salin `backend/.env.example` menjadi `backend/.env`, lalu isi `DB_USER`,
`DB_PASSWORD`, dan `JWT_SECRET`. Salin juga `frontend/.env.example` menjadi
`frontend/.env` bila file tersebut belum ada. Nilai port backend dan URL API
frontend harus tetap cocok; konfigurasi bawaan menggunakan port `3001`.

Jalankan backend dan frontend bersamaan dari folder `tugas4`:
```bash
npm run dev
```
Backend tersedia di `http://localhost:3001` (Swagger: `/docs`) dan frontend
di `http://localhost:5173`. Pastikan database SQL Server `review_kantin`
sudah ada (skema Tugas 2).

Untuk menjalankan salah satu aplikasi saja:
```bash
npm run dev:backend
npm run dev:frontend
```

## Konfigurasi environment
| File | Variabel | Keterangan |
|---|---|---|
| `backend/.env` | `DB_*` | Koneksi SQL Server |
| `backend/.env` | `JWT_SECRET`, `JWT_EXPIRES_IN` | Penandatanganan token (jangan di-commit) |
| `backend/.env` | `CORS_ORIGIN` | Origin frontend, default `http://localhost:5173` |
| `frontend/.env` | `VITE_API_BASE_URL` | Alamat API backend |

## Hak akses
| Role | Kemampuan |
|---|---|
| Public | Lihat daftar dan detail warung, register, login |
| Customer | Hanya melihat |
| Owner | Tambah warung, ubah warung miliknya |
| Admin | Tambah, ubah, hapus semua warung |

Tombol di UI mengikuti aturan ini, tetapi keputusan akhir ada di backend (401/403).

## Akun uji
Register lewat UI menghasilkan role `customer`. Untuk admin/owner, ubah role lewat SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'emailmu@example.com';
```
