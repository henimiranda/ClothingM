'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  Clock,
  X,
  Image as ImageIcon,
  Loader2,
  Factory
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0, recentLogs: [] });
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    base_stock: '',
    category: 'T-Shirt',
    size: 'L',
    image_url: ''
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      alert('Access Denied: Admin Only');
      router.push('/');
      return;
    }
    setUser(parsedUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/stats/overview`);
      const data = await res.json();
      setStats({
        totalProducts: data.totalProducts,
        totalOrders: data.totalStock,
        totalUsers: data.totalUsers,
        revenue: data.revenue,
        recentLogs: data.recentLogs || []
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', price: '', base_stock: '', category: 'T-Shirt', size: 'L', image_url: '' });
        alert('Product added successfully!');
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-corporate-900/20">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 glass-card border-r border-corporate-800 p-6 hidden md:block">
        <div className="text-xl font-bold mb-10 text-accent-blue flex items-center gap-2">
          <LayoutDashboard /> Admin Panel
        </div>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="w-full flex items-center gap-3 px-4 py-3 bg-accent-blue text-white rounded-xl font-medium">
            <TrendingUp size={20} /> Ringkasan
          </a>
          <a href="/admin/scm" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-corporate-800 text-corporate-400 rounded-xl transition-all">
            <Package size={20} /> Inventaris (SCM)
          </a>
          <a href="/admin/manufactory" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-corporate-800 text-corporate-400 rounded-xl transition-all">
            <Factory size={20} /> Produksi
          </a>
          <a href="/admin/orders" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-corporate-800 text-corporate-400 rounded-xl transition-all">
            <ShoppingCart size={20} /> Pesanan
          </a>
          <a href="/admin/customers" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-corporate-800 text-corporate-400 rounded-xl transition-all">
            <Users size={20} /> Pelanggan
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Selamat datang kembali, {user?.name || 'Admin'}</h1>
            <p className="text-corporate-400 text-sm">Kelola ekosistem bisnis Anda dengan mudah.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-blue/20"
          >
            <Plus size={20} /> Tambah Produk
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Pendapatan', value: `Rp ${stats.revenue.toLocaleString()}`, icon: <TrendingUp className="text-green-500" />, trend: '+12.5%' },
            { label: 'Total Stok', value: stats.totalOrders, icon: <Package className="text-accent-blue" />, trend: 'Aktif' },
            { label: 'Produk', value: stats.totalProducts, icon: <Package className="text-orange-500" />, trend: 'Stabil' },
            { label: 'User Aktif', value: stats.totalUsers, icon: <Users className="text-purple-500" />, trend: '+2' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-corporate-700/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-corporate-800 rounded-xl">{stat.icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-corporate-700 text-corporate-400'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-corporate-400 text-sm mb-1">{stat.label}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="glass-card p-8 rounded-3xl border border-corporate-700/50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock size={20} /> Pergerakan Stok Terbaru
            </h3>
            <div className="space-y-4">
              {stats.recentLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-corporate-900/50 rounded-2xl border border-corporate-800">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${log.type === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {log.type}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{log.product_name}</p>
                      <p className="text-xs text-corporate-500">{log.reason}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${log.type === 'IN' ? 'text-green-500' : 'text-red-500'}`}>
                    {log.type === 'IN' ? '+' : '-'}{log.quantity}
                  </span>
                </div>
              ))}
              {stats.recentLogs.length === 0 && <p className="text-center text-corporate-500 text-sm italic">Belum ada aktivitas terbaru.</p>}
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-corporate-700/50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle size={20} /> Peringatan Sistem
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-accent-blue/5 rounded-2xl border border-accent-blue/20 flex justify-between items-center">
                <span className="text-sm">Status Sinkronisasi Database</span>
                <span className="text-xs font-bold text-accent-blue">Aktif</span>
              </div>
              <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/20 flex justify-between items-center">
                <span className="text-sm">Integrasi Modul SCM</span>
                <span className="text-xs font-bold text-green-500">Terhubung</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-corporate-900 border border-corporate-700 w-full max-w-2xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Tambah Produk Baru</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-corporate-400 hover:text-white"><X /></button>
                </div>

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-400">Nama Produk</label>
                    <input 
                      type="text" required
                      className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent-blue outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-400">Kategori</label>
                    <select 
                      className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 px-4 outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>T-Shirt</option>
                      <option>Pants</option>
                      <option>Outerwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-corporate-400">Deskripsi</label>
                    <textarea 
                      required rows="3"
                      className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent-blue outline-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-400">Harga (IDR)</label>
                    <input 
                      type="number" required
                      className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 px-4"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-corporate-400">Stok Awal</label>
                    <input 
                      type="number" required
                      className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 px-4"
                      value={formData.base_stock}
                      onChange={(e) => setFormData({...formData, base_stock: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-corporate-400">URL Gambar</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full bg-corporate-800 border border-corporate-700 rounded-xl py-3 pl-12 pr-4"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="md:col-span-2 py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Konfirmasi Tambah Produk'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
