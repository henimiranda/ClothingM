# ClothingM - E-Commerce & SCM Platform

ClothingM adalah platform E-Commerce profesional yang terintegrasi dengan sistem **Supply Chain Management (SCM)** dan **Produksi Manufaktur**. Proyek ini dirancang untuk memenuhi kebutuhan bisnis pakaian modern dari hulu ke hilir.

## ✨ Fitur Utama

### 🛒 E-Commerce & Pelanggan
- **Katalog Produk Premium**: Tampilan grid modern dengan pencarian dan filter kategori.
- **Keranjang Belanja Dinamis**: Manajemen item belanja secara real-time.
- **Sistem Pembayaran**: Flow checkout lengkap dengan integrasi pemotongan stok otomatis.

### 🏭 Produksi & Manufaktur
- **Pelacakan Produksi (Gantt Chart)**: Visualisasi progres produksi garmen dari persiapan hingga selesai.
- **Manajemen Batch**: Kontrol jumlah unit produksi dan target penyelesaian.
- **Auto-Sync Gudang**: Stok otomatis bertambah saat produksi selesai.

### 📦 SCM & Inventaris
- **Log Inventaris**: Pencatatan riwayat barang masuk dan keluar secara mendetail.
- **Audit Trail**: Pemantauan mutasi stok untuk transparansi operasional.

### 📊 Dashboard Admin
- **Statistik Real-Time**: Grafik pendapatan, total stok, produk aktif, dan user terdaftar.
- **Manajemen Produk**: Modal form untuk menambah koleksi baru secara instan.

## 🛠️ Teknologi (Tech Stack)
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Context API.
- **Backend**: Node.js, Express.js, JWT Auth, Bcrypt.
- **Database**: PostgreSQL.
- **Infrastruktur**: Docker & Docker Compose.

## 🚀 Cara Menjalankan Proyek

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/USERNAME_KAMU/CLOTHINGM.git
   cd CLOTHINGM
   ```

2. **Jalankan Docker**:
   Pastikan Docker Desktop sudah aktif, lalu jalankan:
   ```bash
   docker-compose up --build
   ```

3. **Akses Aplikasi**:
   - Frontend: `http://localhost:3034`
   - Backend API: `http://localhost:5052/api`

## 🔑 Akun Login Default (Admin)
- **Email**: `admin@clothingm.com`
- **Password**: `admin`

---
*Dikembangkan dengan ❤️ untuk Tugas Akhir oleh ClothingM Team.*
