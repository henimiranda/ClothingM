'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, KeyRound } from 'lucide-react';
import { API_URL } from '@/utils/api';

function PinComponent() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('verify'); // 'verify' or 'setup'
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    const endpoint = mode === 'setup' ? '/auth/setup-pin' : '/auth/verify-pin';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
        router.refresh();
      } else {
        if (data.needsSetup) {
          setMode('setup');
          setError('Please setup a new 6-digit PIN for your account.');
          setPin('');
        } else {
          setError(data.message || 'Invalid PIN');
        }
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
        className="glass-card w-full max-w-md p-8 rounded-3xl border border-corporate-700/50 text-center"
      >
        <div className="mb-8">
          <div className="mx-auto bg-accent-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="text-accent-blue" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'setup' ? 'Setup Your PIN' : 'Enter PIN'}
          </h1>
          <p className="text-corporate-400">
            {mode === 'setup' 
              ? 'Please create a 6-digit PIN to secure your account.' 
              : 'Enter your 6-digit PIN to continue.'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${mode === 'setup' && error.includes('setup') ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-4 text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-accent-blue outline-none transition-all font-mono"
              placeholder="••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || pin.length !== 6}
            className="w-full py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'setup' ? 'Save PIN' : 'Unlock')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-accent-blue" size={32} /></div>}>
      <PinComponent />
    </Suspense>
  );
}
