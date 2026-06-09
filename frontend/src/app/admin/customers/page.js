'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Search, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users`);
      const data = await res.json();
      setCustomers(data);
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
          <h1 className="text-3xl font-bold italic">Direktori Pelanggan</h1>
          <p className="text-corporate-400 text-sm">Daftar seluruh mitra bisnis dan pelanggan terdaftar.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" size={48} /></div>
      ) : (
        <div className="glass-card rounded-3xl border border-corporate-700/50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-corporate-800/50 text-corporate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Nama Pelanggan</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Peran</th>
                <th className="px-8 py-5">Bergabung Pada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6 font-bold flex items-center gap-4">
                    <div className="w-10 h-10 bg-corporate-800 rounded-full flex items-center justify-center text-accent-blue font-extrabold">
                      {customer.name.charAt(0)}
                    </div>
                    {customer.name}
                  </td>
                  <td className="px-8 py-6 text-corporate-400">{customer.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${customer.role === 'admin' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-corporate-700 text-corporate-400'}`}>
                      {customer.role === 'admin' ? 'ADMIN' : 'PELANGGAN'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-corporate-500">
                    {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
