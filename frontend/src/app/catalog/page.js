'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Filter, Search, Loader2, Tag, Check } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function CatalogPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Product Catalog</h1>
          <p className="text-corporate-400">Discover our latest premium collections</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500 group-focus-within:text-accent-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Cari koleksi baju premium..."
              className="w-full bg-corporate-800/50 border border-corporate-700 rounded-2xl py-4 pl-14 pr-4 focus:ring-2 focus:ring-accent-blue outline-none transition-all placeholder:text-corporate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {['Semua', 'T-Shirt', 'Pants', 'Outerwear', 'Accessories'].map((cat) => (
              <button 
                key={cat}
                className="px-6 py-2.5 rounded-xl bg-corporate-800 border border-corporate-700 text-sm font-medium hover:border-accent-blue transition-all whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-accent-blue" size={48} />
          <p className="text-corporate-400">Loading premium collection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden border border-corporate-700/50 group"
            >
              <div className="h-72 bg-corporate-800 relative overflow-hidden">
                <img 
                  src={product.image_url || `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop`} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent-blue/80 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1">
                  <Tag size={12} /> {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <span className="text-accent-blue font-bold">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-corporate-400 mb-6 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-corporate-500 font-medium">Size: {product.size}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`p-3 rounded-xl transition-all shadow-lg ${
                      addedId === product.id 
                        ? 'bg-green-500 text-white shadow-green-500/20' 
                        : 'bg-accent-blue hover:bg-blue-600 text-white shadow-accent-blue/20'
                    }`}
                  >
                    {addedId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-corporate-400 text-xl">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
