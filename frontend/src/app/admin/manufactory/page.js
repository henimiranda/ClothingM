'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Factory, Calendar, Clock, CheckCircle2, ChevronRight, Plus, Loader2 } from 'lucide-react';

export default function ManufactoryPage() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusSteps = ['queued', 'material_prep', 'cutting', 'sewing', 'finishing', 'completed'];

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      const res = await fetch(`${API_URL}/production`);
      const data = await res.json();
      setProductions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    if (currentIndex === statusSteps.length - 1) return;

    const nextStatus = statusSteps[currentIndex + 1];
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5052/api';
      await fetch(`${API_URL}/production/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchProductions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Manufactory Control</h1>
          <p className="text-corporate-400">Track and manage production cycles in real-time.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent-blue/20">
          <Plus size={20} /> Order Baru
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-blue" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {productions.map((prod, idx) => (
            <motion.div 
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-corporate-700/50"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center text-accent-blue">
                    <Factory size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{prod.product_name}</h3>
                    <p className="text-sm text-corporate-400 font-mono">Batch #{prod.id} • {prod.quantity} Unit</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-corporate-800 rounded-xl text-xs font-bold text-corporate-400">
                    MULAI: {new Date(prod.start_date).toLocaleDateString('id-ID')}
                  </div>
                  <div className="px-4 py-2 bg-corporate-800 rounded-xl text-xs font-bold text-accent-blue">
                    TARGET: {new Date(prod.end_date).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Production Timeline */}
              <div className="relative pt-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-corporate-800 -translate-y-1/2 rounded-full"></div>
                <div className="relative flex justify-between">
                  {statusSteps.map((stage, i) => {
                    const currentIndex = statusSteps.findIndex(s => s.id === prod.status);
                    const isPast = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    
                    return (
                      <div key={stage.id} className="flex flex-col items-center gap-4 relative z-10">
                        <div 
                          className={`w-6 h-6 rounded-full border-4 transition-all duration-500 ${
                            isPast ? 'bg-accent-blue border-accent-blue shadow-lg shadow-accent-blue/40' : 
                            isCurrent ? 'bg-corporate-900 border-accent-blue animate-pulse' : 
                            'bg-corporate-900 border-corporate-700'
                          }`}
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-accent-blue' : 'text-corporate-500'}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {prod.status !== 'completed' && (
                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={() => updateStatus(prod.id, prod.status)}
                    className="px-6 py-2 bg-corporate-800 hover:bg-corporate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> Update Progres
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
