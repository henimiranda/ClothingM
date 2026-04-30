'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login?redirect=/checkout');
      return;
    }
    setUser(JSON.parse(storedUser));
    
    if (cartItems.length === 0 && !success) {
      router.push('/catalog');
    }
  }, [cartItems, success]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: cartItems,
          total_amount: cartTotal,
          shipping_address: address
        })
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
      }
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/20"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h1 className="text-4xl font-extrabold mb-4 text-white">Pembayaran Berhasil!</h1>
        <p className="text-corporate-400 mb-8 max-w-md">
          Pesanan Anda telah diterima dan sedang diproses oleh tim SCM kami. Terima kasih telah berbelanja di ClothingM.
        </p>
        <button 
          onClick={() => router.push('/catalog')}
          className="px-10 py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all"
        >
          Lanjut Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-corporate-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Kembali ke Keranjang
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div>
            <h1 className="text-4xl font-extrabold mb-4">Pembayaran</h1>
            <p className="text-corporate-400">Lengkapi pesanan Anda dengan mengisi detail di bawah ini.</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-corporate-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-accent-blue" /> Alamat Pengiriman
              </h3>
              <textarea 
                required
                rows="4"
                className="w-full bg-corporate-800 border border-corporate-700 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                placeholder="Nama jalan, Kota, Kode Pos..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="glass-card p-8 rounded-3xl border border-corporate-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-accent-blue" /> Metode Pembayaran
              </h3>
              <div className="p-6 border-2 border-accent-blue bg-accent-blue/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-corporate-700 rounded-lg"></div>
                  <div>
                    <p className="font-bold">Saldo Simulasi</p>
                    <p className="text-xs text-corporate-500">Transaksi Cepat & Aman</p>
                  </div>
                </div>
                <ShieldCheck className="text-accent-blue" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-accent-blue/20 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Bayar Rp {cartTotal.toLocaleString('id-ID')}</>}
            </button>
          </form>
        </motion.div>

        {/* Order Summary Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:pt-24"
        >
          <div className="glass-card p-8 rounded-3xl border border-corporate-700/50">
            <h2 className="text-2xl font-bold mb-6">Dalam Keranjang Anda</h2>
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-corporate-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-corporate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-corporate-800 mb-6"></div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Harga</span>
              <span className="text-accent-blue">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
