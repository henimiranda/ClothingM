'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, ArrowUpRight, ArrowDownLeft, History, Package, Search, Loader2 } from 'lucide-react';

export default function SCMPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/scm/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-white">Supply Chain History</h1>
          <p className="text-corporate-400">Detailed logs of all warehouse stock movements.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-corporate-800 p-4 rounded-2xl border border-corporate-700 flex items-center gap-4">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><ArrowUpRight size={20} /></div>
            <div>
              <p className="text-[10px] uppercase text-corporate-500 font-bold">Total In</p>
              <p className="text-[10px] uppercase text-corporate-500 font-bold">Total Masuk</p>
              <p className="text-xl font-bold">1,240</p>
            </div>
          </div>
          <div className="bg-corporate-800 p-4 rounded-2xl border border-corporate-700 flex items-center gap-4">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ArrowDownLeft size={20} /></div>
            <div>
              <p className="text-[10px] uppercase text-corporate-500 font-bold">Total Keluar</p>
              <p className="text-xl font-bold">850</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" size={48} /></div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-corporate-700/50">
          <table className="w-full text-left">
            <thead className="bg-corporate-800 text-corporate-400 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-6">Tanggal</th>
                <th className="px-8 py-6">Nama Produk</th>
                <th className="px-8 py-6">Tipe</th>
                <th className="px-8 py-6">Jumlah</th>
                <th className="px-8 py-6">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-800">
              {logs.map((log, idx) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-8 py-5 text-sm text-corporate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 font-bold text-white flex items-center gap-3">
                    <Package size={16} className="text-accent-blue" />
                    {log.product_name}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      log.type === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {log.type === 'IN' ? 'MASUK' : 'KELUAR'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-mono font-bold">
                    {log.type === 'IN' ? '+' : '-'}{log.quantity}
                  </td>
                  <td className="px-8 py-5 text-sm italic text-corporate-500">
                    {log.reason}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-20 text-center text-corporate-500 flex flex-col items-center gap-4">
              <History size={48} />
              <p>No inventory movements recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
