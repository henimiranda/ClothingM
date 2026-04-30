'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { register } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Shield, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(formData);
      if (data.id) {
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl border border-corporate-700/50"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Buat Akun</h1>
          <p className="text-corporate-400">Bergabung dengan jaringan bisnis ClothingM</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-corporate-400 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
              <input 
                type="text" 
                required
                className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                placeholder="Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-corporate-400 ml-1">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-corporate-400 ml-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-blue/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Daftar Akun <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-corporate-400 text-sm">
          Sudah punya akun? <a href="/login" className="text-accent-blue hover:underline">Masuk di sini</a>
        </p>
      </motion.div>
    </div>
  );
}
