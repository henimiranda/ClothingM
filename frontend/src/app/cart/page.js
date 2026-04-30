'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-12 glass-card rounded-full mb-8"
        >
          <ShoppingBag size={80} className="text-corporate-700" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Keranjang Anda kosong</h1>
        <p className="text-corporate-400 mb-8 max-w-md">
          Sepertinya Anda belum menambahkan koleksi baju premium ke dalam keranjang.
        </p>
        <button 
          onClick={() => router.push('/catalog')}
          className="px-8 py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center gap-2"
        >
          Lihat Katalog <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10">Keranjang Belanja</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 rounded-3xl border border-corporate-700/50 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 bg-corporate-800 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-sm text-corporate-400 mb-4">{item.category} • Ukuran {item.size}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 bg-corporate-800 rounded-lg hover:bg-corporate-700 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 bg-corporate-800 rounded-lg hover:bg-corporate-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-2">
                  <span className="text-xl font-bold text-accent-blue">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-corporate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 rounded-3xl border border-corporate-700/50 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Ringkasan Pesanan</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-corporate-400">
                <span>Subtotal</span>
                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-corporate-400">
                <span>Pengiriman</span>
                <span className="text-green-500 font-medium">Dihitung saat pembayaran</span>
              </div>
              <div className="h-px bg-corporate-800 my-4"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-accent-blue">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-accent-blue/20"
            >
              <CreditCard size={20} /> Bayar Sekarang
            </button>
            
            <button 
              onClick={() => router.push('/catalog')}
              className="w-full mt-4 py-4 bg-transparent hover:bg-corporate-800 text-corporate-300 rounded-2xl font-medium transition-all"
            >
              Lanjut Belanja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
