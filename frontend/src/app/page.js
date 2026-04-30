'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { login } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/catalog');
        }
        router.refresh();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-corporate-700/20 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem] border border-corporate-700/50 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="text-3xl font-black corporate-gradient-text mb-4">
            <span className="text-accent-blue">CLOTHING</span>
            <span className="text-corporate-400">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Login Sistem</h1>
          <p className="text-corporate-400 text-sm">Silakan masukkan kredensial Anda untuk melanjutkan</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl text-xs text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-corporate-500 uppercase tracking-widest ml-1">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all placeholder:text-corporate-700"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-corporate-500 uppercase tracking-widest ml-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all placeholder:text-corporate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent-blue/30"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Masuk Sekarang <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-corporate-800 text-center">
          <p className="text-corporate-400 text-sm mb-4">Belum punya akun?</p>
          <a 
            href="/register" 
            className="inline-block w-full py-3 bg-corporate-800 hover:bg-corporate-700 text-white rounded-2xl font-bold transition-all"
          >
            Buat Akun Baru
          </a>
        </div>
      </motion.div>
    </div>
  );
}
