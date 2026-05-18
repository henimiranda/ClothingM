@echo off
echo ==========================================
echo  MEMULAI ERP CLOTHINGM (TANPA DOCKER BUG)
echo ==========================================

echo [1/3] Menghentikan kontainer yang lama (jika ada)...
docker-compose down

echo [2/3] Menjalankan Microservices (MinIO, CRM, HR, Gateway) via Docker...
docker-compose up -d

echo [3/3] Menjalankan Backend secara lokal...
start "ClothingM Backend" cmd /k "cd backend && npm run dev"

echo [4/4] Menjalankan Frontend secara lokal...
start "ClothingM Frontend" cmd /k "cd frontend && npm run dev"

echo ==========================================
echo Selesai! Semua servis sedang booting...
echo Silakan buka http://localhost:3000 di browser Anda.
echo ==========================================
