const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initializeDatabase() {
  console.log('Membaca file schema.sql...');
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Mengeksekusi SQL ke database Neon...');
    await pool.query(schemaSql);
    
    console.log('✅ Database berhasil diinisialisasi! Semua tabel dan data awal (Admin) sudah terbuat.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal menginisialisasi database:');
    console.error(err.message);
    process.exit(1);
  }
}

initializeDatabase();
