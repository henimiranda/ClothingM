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
- **Backend Utama**: Laravel 10, Sanctum, Socialite.
- **Backend Legacy**: Node.js/Express tetap tersedia sebagai fallback di port `5000`.
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
   - Frontend: `http://localhost:3000`
   - Gateway: `http://localhost:8080`
   - Laravel API utama: `http://localhost:5001/api`
   - Node API lama: `http://localhost:5000/api`

> Catatan: routing gateway `/api` sekarang diarahkan ke Laravel. Service Node lama tidak dihapus, jadi koneksi lama masih bisa dicek langsung melalui port `5000`.

## 🔑 Akun Login Default (Admin)
- **Email**: `admin@clothingm.com`
- **Password**: `admin`

---

