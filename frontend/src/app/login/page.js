'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Redirect to backend Google OAuth initiation route
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl border border-corporate-700/50 text-center"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-corporate-400">Sign in to your ClothingM account securely</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/10"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              Sign In with Google <ArrowRight size={18} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
