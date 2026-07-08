# 🚀 ClothingM - Migrasi ke Laravel Backend + OAuth Google

## 📋 Ringkasan Perubahan

Proyek ini telah diperbarui dengan backend **Laravel** untuk menangani **autentikasi OAuth Google** sambil mempertahankan backend Node.js lama untuk API produk, pesanan, dan fitur lainnya.

### ✅ Apa yang Tetap Terjaga:
- ✓ **Express.js Backend** (port 5000) - tetap menangani routes: `/api/products`, `/api/orders`, `/api/scm`, `/api/production`, `/api/stats`
- ✓ **Frontend Next.js** - semua UI dan logika bisnis tetap sama
- ✓ **Database PostgreSQL** - terhubung ke Neon.tech
- ✓ **MinIO S3 Storage** - untuk upload file
- ✓ **Traefik Gateway** - reverse proxy tetap aktif

### 🔄 Perubahan Baru:
- 🆕 **Laravel Backend** (port 5001) - menangani OAuth Google login
- 🆕 **Larval Sanctum** - untuk API token authentication
- 🆕 **OAuth Routes** - `/api/auth/google` dan `/api/auth/google/callback`
- 🆕 **Socialite** - Laravel package untuk OAuth integration

---

## 📦 Struktur Proyek Baru

```
CLOTHINGM/
├── backend/                      # Node.js backend (Express.js)
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── Dockerfile
├── backend-laravel/              # Laravel backend BARU ✨
│   ├── app/Http/Controllers/AuthController.php
│   ├── routes/api.php
│   ├── config/services.php
│   ├── app/Models/User.php
│   └── database/migrations/
├── frontend/                     # Next.js frontend
│   ├── src/utils/
│   │   ├── api.js             # API calls (produk, order, dll)
│   │   └── oauth.js           # OAuth API calls BARU ✨
│   ├── src/app/
│   │   ├── page.js            # Home + Login Google
│   │   └── login/page.js      # Login page + Google OAuth
│   └── .env.local             # Config frontend
├── docker-compose.yml           # Orchestration semua service
└── .env                         # Env global
```

---

## 🔐 Flow OAuth Google - Bagaimana Cara Kerjanya

```
User klik "Masuk dengan Google"
    ↓
Frontend → redirect ke: http://localhost:5001/api/auth/google
    ↓
Laravel AuthController (redirectToGoogle)
    ↓
Google OAuth consent screen
    ↓
Google callback → http://localhost:5001/api/auth/google/callback
    ↓
Laravel AuthController (handleGoogleCallback)
    ↓
Cek/buat user di database
    ↓
Generate Sanctum token
    ↓
Redirect ke: http://localhost:3000/auth/callback?token=xxx&user=xxx
    ↓
Frontend save token & user ke localStorage
    ↓
User sudah login ✓
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat:
- Docker & Docker Compose terpasang
- Google OAuth credentials sudah dikonfigurasi di `.env` dan `.env` backend-laravel

### Step 1: Setup Environment Variables

**File: `.env` (Global)**
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[db]
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
JWT_SECRET=clothingm_secret_key_2024
```

**File: `backend-laravel/.env`** (sudah dikonfigurasi, tapi verifikasi):
```env
APP_NAME=ClothingM
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DATABASE_URL=postgresql://...

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=henimiranda9@gmail.com
```

**File: `frontend/.env.local`** (sudah dikonfigurasi):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_OAUTH_API_URL=http://localhost:5001/api
```

### Step 2: Jalankan Docker Compose

```bash
docker-compose up --build
```

Ini akan:
- ✓ Start Traefik gateway (port 8080)
- ✓ Start MinIO (port 9000)
- ✓ Start Express.js backend (port 5000)
- ✓ Start Laravel backend (port 5001) ← OAuth di sini
- ✓ Start Next.js frontend (port 3000)

### Step 3: Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Node.js API**: http://localhost:5000/api
- **Laravel API**: http://localhost:5001/api
- **Traefik Dashboard**: http://localhost:8082
- **MinIO Console**: http://localhost:9001

---

## 📱 Login Flow - User Journey

### 1️⃣ User Masuk Halaman Login
```
http://localhost:3000/login
```

### 2️⃣ User Klik "Masuk dengan Google"
Frontend trigger OAuth redirect ke Laravel:
```
window.location.href = 'http://localhost:5001/api/auth/google'
```

### 3️⃣ Google Meminta Persetujuan
User login ke akun Google mereka dan approve permissions.

### 4️⃣ Callback ke Laravel
Google redirect ke:
```
http://localhost:5001/api/auth/google/callback?code=xxx&state=xxx
```

### 5️⃣ Laravel Proses Callback
1. Ambil data user dari Google (email, nama, OAuth ID)
2. Cek apakah user sudah ada di database
3. Jika tidak ada → create user baru (role: 'customer' atau 'admin')
4. Jika ada → update OAuth fields
5. Generate Sanctum token
6. Redirect ke frontend dengan token:
```
http://localhost:3000/auth/callback?token=xxx&user=xxx
```

### 6️⃣ Frontend Simpan Token
Frontend page `/auth/callback` menyimpan token ke `localStorage`:
```javascript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.parse(user));
```

### 7️⃣ User Sudah Login
Frontend redirect ke:
- `/admin/dashboard` jika role = 'admin'
- `/catalog` jika role = 'customer'

---

## 🔗 API Integration

### Frontend API Calls

**Produk, Orders, SCM (masih ke Express.js backend):**
```javascript
import { API_URL } from '@/utils/api';

fetch(`${API_URL}/products`)     // http://localhost:5000/api/products
fetch(`${API_URL}/orders`)       // http://localhost:5000/api/orders
fetch(`${API_URL}/scm/logs`)     // http://localhost:5000/api/scm/logs
```

**OAuth Login (BARU - ke Laravel backend):**
```javascript
import { OAUTH_API_URL } from '@/utils/oauth';

window.location.href = `${OAUTH_API_URL}/auth/google`  
// http://localhost:5001/api/auth/google
```

---

## 🗄️ Database Schema

### Users Table (dengan OAuth fields)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',          -- ← BARU
    oauth_provider VARCHAR(50) NULL,               -- ← BARU (google)
    oauth_id VARCHAR(255) NULL,                    -- ← BARU (Google user ID)
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 🛠️ Troubleshooting

### Masalah 1: OAuth callback gagal
**Error**: "Redirect URI mismatch"
**Solusi**: Pastikan `GOOGLE_REDIRECT_URI` di `.env` Laravel sesuai dengan URL yang terdaftar di Google Console:
```env
GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
```

### Masalah 2: Frontend tidak bisa terhubung ke Laravel
**Error**: CORS error atau timeout
**Solusi**: 
1. Pastikan Laravel container running: `docker ps | grep laravel`
2. Cek env frontend punya URL yang benar:
```env
NEXT_PUBLIC_OAUTH_API_URL=http://localhost:5001/api
```

### Masalah 3: Database migration error
**Error**: "Column 'role' already exists"
**Solusi**: Pastikan migration file baru tidak dijalankan dua kali. Hapus dan jalankan ulang migration:
```bash
docker exec clothingm_backend_laravel php artisan migrate:reset
docker exec clothingm_backend_laravel php artisan migrate
```

### Masalah 4: Token invalid di frontend
**Error**: "Invalid token" saat di `/auth/callback`
**Solusi**: 
1. Pastikan token tidak corrupt saat di URL encode
2. Cek localStorage untuk token yang benar:
```javascript
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('user'))
```

---

## 📊 Testing

### Test OAuth Flow Manual:
1. Buka http://localhost:3000
2. Klik "Masuk dengan Google"
3. Login dengan akun Google test
4. Verify redirect ke `/auth/callback`
5. Check localStorage untuk token dan user data
6. Verify redirect ke `/catalog` atau `/admin/dashboard`

### Test API Connection:
```bash
# Test Express backend
curl http://localhost:5000/api/products

# Test Laravel backend
curl http://localhost:5001/api/auth/debug

# Test dengan token
curl -H "Authorization: Bearer {token}" http://localhost:5001/api/user
```

---

## 🔄 Deployment (Production)

Saat deploy ke production:

1. **Update environment variables** di host/cloud provider:
```env
FRONTEND_URL=https://your-domain.com
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
DATABASE_URL=postgresql://prod-db-url
```

2. **Update frontend `.env.local`**:
```env
NEXT_PUBLIC_OAUTH_API_URL=https://your-domain.com/api
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

3. **Run migrations** di production database
4. **Deploy** melalui Docker atau vercel

---

## 📝 File yang Diubah

1. ✅ `backend-laravel/` - Scaffold Laravel BARU
2. ✅ `backend-laravel/app/Http/Controllers/AuthController.php` - OAuth logic
3. ✅ `backend-laravel/routes/api.php` - Route OAuth
4. ✅ `backend-laravel/config/services.php` - Google config
5. ✅ `backend-laravel/app/Models/User.php` - fillable fields
6. ✅ `backend-laravel/database/migrations/2024_06_22_000000_add_oauth_fields_to_users_table.php` - Migration OAuth
7. ✅ `frontend/src/utils/oauth.js` - OAUTH_API_URL helper
8. ✅ `frontend/.env.local` - Add NEXT_PUBLIC_OAUTH_API_URL
9. ✅ `frontend/src/app/page.js` - Import OAUTH_API_URL
10. ✅ `frontend/src/app/login/page.js` - Import OAUTH_API_URL
11. ✅ `docker-compose.yml` - Add backend-laravel service
12. ✅ `backend-laravel/Dockerfile` - PHP 8.2 dengan Laravel

---

## 💡 Next Steps (Opsional)

- [ ] Add database seeding untuk test users
- [ ] Add email verification flow
- [ ] Add refresh token rotation
- [ ] Add logout endpoint di Laravel
- [ ] Add user profile update endpoint
- [ ] Add role-based middleware di Laravel
- [ ] Add API documentation (Laravel Swagger)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek logs: `docker logs clothingm_backend_laravel`
2. Debug database: Connect ke Neon.tech console
3. Test OAuth: Gunakan curl commands di atas

**Happy coding! 🚀**
