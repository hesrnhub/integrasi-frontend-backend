# Panduan Pengujian Manual Tugas 4 (12 skenario) + bukti untuk laporan

Siapkan akun: 1 admin, 2 owner (masing-masing punya warung), 1 customer. Jalankan backend + frontend.
Untuk tiap skenario, ambil screenshot UI **dan** (untuk perubahan data) hasil `SELECT * FROM stalls` di SQL Server.

| # | Skenario | Cara uji | Bukti |
|---|---|---|---|
| 1 | Daftar warung tampil | Buka `/` | Screenshot daftar + Network tab `GET /stalls` |
| 2 | Detail warung tampil | Klik kartu warung | Screenshot detail + `GET /stalls/:id` |
| 3 | Admin tambah/ubah/hapus | Login admin; Tambah, Ubah, Hapus | Screenshot tiap aksi + query SQL sebelum/sesudah |
| 4 | Owner tambah & ubah miliknya | Login owner A; tambah warung, ubah warung A | Screenshot + query SQL |
| 5 | Owner tidak bisa ubah milik owner lain | Login owner A, buka `/stalls/<id warung B>/edit`, simpan | Banner **403** dari backend |
| 6 | Owner tidak bisa hapus | Login owner; buka detail warung | Tombol Hapus tidak muncul; (opsional) 403 via Swagger |
| 7 | Register & login | `/register` lalu `/login` | Screenshot keduanya |
| 8 | Info pengguna | Klik nama di navbar -> `/profile` | Screenshot + `GET /auth/me` |
| 9 | Belum login ke fitur terlindungi | Tanpa login buka `/stalls/new` | Redirect ke `/login` + pesan info |
| 10 | Respons 401 dan 403 | 401: hapus token di DevTools lalu aksi terlindungi; 403: skenario 5 / customer buka `/stalls/new` | Toast "Sesi berakhir"; halaman/banner 403 |
| 11 | Loading, empty, error state | Loading: throttling DevTools; Empty: cari kata ngawur; Error: matikan backend lalu reload | 3 screenshot |
| 12 | Tersimpan di database | Setelah tiap CRUD jalankan `SELECT * FROM stalls` | Screenshot SSMS/Azure Data Studio |

Validasi: coba register dengan nama 2 huruf dan password 3 karakter; pesan backend tampil di bawah input.
