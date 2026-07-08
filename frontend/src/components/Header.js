'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getRoleLabel, isManagementRole } from '@/utils/roles';

export default function Header() {
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 glass-card px-6 py-4 flex justify-between items-center border-b border-corporate-700">
      <a href="/" className="text-2xl font-bold corporate-gradient-text">
        <span className="text-accent-blue">CLOTHING</span>
        <span className="text-corporate-400">M</span>
      </a>
      
      {!isLoginPage && (
        <>
          <nav className="hidden md:flex gap-8">
            <a href="/catalog" className="hover:text-accent-blue transition-colors">Katalog</a>
            {isManagementRole(user?.role) && (
              <>
                <a href="/admin/dashboard" className="hover:text-accent-blue transition-colors text-accent-blue font-bold">Dashboard Admin</a>
                <a href="/admin/scm" className="hover:text-accent-blue transition-colors">SCM</a>
                <a href="/admin/manufactory" className="hover:text-accent-blue transition-colors">Produksi</a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-6">
            {/* Cart Icon with Badge */}
            <a href="/cart" className="relative p-2 text-corporate-300 hover:text-white transition-colors" title="Keranjang Belanja">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-corporate-500 uppercase tracking-widest">{getRoleLabel(user.role)}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-corporate-400 hover:text-red-500 transition-colors"
                  title="Keluar"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/login" className="px-4 py-2 text-sm rounded-lg bg-corporate-800 hover:bg-corporate-700 transition-all">Masuk</a>
                <a href="/register" className="px-4 py-2 text-sm rounded-lg bg-accent-blue hover:bg-blue-600 transition-all text-white font-bold">Daftar</a>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
