'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { OAUTH_API_URL } from '@/utils/oauth';
import { isManagementRole } from '@/utils/roles';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (isManagementRole(user.role)) {
          router.push('/admin/dashboard');
        } else {
          router.push('/catalog');
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, [router]);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${OAUTH_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-corporate-700/20 rounded-full blur-[120px]" />

      {/* Centered Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] border border-corporate-700/50 shadow-2xl text-center relative z-10"
      >
        {/* Branding & Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-accent-blue" />
          </div>
          
          <div className="text-3xl font-black mb-1">
            <span className="text-accent-blue">CLOTHING</span>
            <span className="text-corporate-400">M</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang</h2>
          <p className="text-corporate-400 text-sm">
            Masuk ke akun ClothingM Anda dengan Google
          </p>
        </div>

        {/* Google Login Button */}
        <button
          id="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Menghubungkan...</span>
            </>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Masuk dengan Google</span>
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-corporate-500 leading-relaxed">
          Dengan masuk, Anda menyetujui syarat & ketentuan penggunaan platform ClothingM.
          Login hanya tersedia melalui akun Google.
        </p>

        {/* Divider & Footer */}
        <div className="mt-8 pt-6 border-t border-corporate-800">
          <p className="text-xs text-corporate-500">
            Butuh bantuan?{' '}
            <a
              href="mailto:henimiranda9@gmail.com"
              className="text-accent-blue hover:underline"
            >
              Hubungi admin
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
