'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Calendar, Tag, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/stats/overview`); // Temporary use stats or create new endpoint
      const data = await res.json();
      // For now, let's use the recentLogs as a proxy or simulate orders
      setOrders([
        { id: 1001, customer: 'John Doe', amount: 450000, status: 'Paid', date: new Date().toISOString() },
        { id: 1002, customer: 'Jane Smith', amount: 150000, status: 'Paid', date: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-3 bg-corporate-800 rounded-2xl hover:bg-corporate-700 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold italic">Manajemen Pesanan</h1>
          <p className="text-corporate-400 text-sm">Kelola semua pesanan pelanggan dari seluruh jaringan.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" size={48} /></div>
      ) : (
        <div className="glass-card rounded-3xl border border-corporate-700/50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-corporate-800/50 text-corporate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Pelanggan</th>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Total Bayar</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-800">
              {orders.map((order) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-8 py-6 font-mono text-accent-blue font-bold">#{order.id}</td>
                  <td className="px-8 py-6 font-bold">{order.customer_name}</td>
                  <td className="px-8 py-6 text-sm">
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-8 py-6 font-bold">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-extrabold uppercase">
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
