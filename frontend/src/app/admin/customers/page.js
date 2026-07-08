'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Filter, Loader2, Search, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { ROLE_LABELS, ROLES } from '@/utils/roles';

const ROLE_STYLES = {
  admin: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  staff: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  customer: 'bg-corporate-700 text-corporate-300 border-corporate-600',
};

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Gagal memuat data pengguna');
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Data pengguna tidak bisa dimuat.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const roleCounts = useMemo(() => {
    return ROLES.reduce((acc, role) => {
      acc[role] = users.filter((user) => user.role === role).length;
      return acc;
    }, {});
  }, [users]);

  const updateRole = async (userId, role) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingId(userId);
    try {
      const res = await fetch(`${API_URL}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui role');
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? data.user : user))
      );
    } catch (err) {
      setError(err.message || 'Gagal memperbarui role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-3 bg-corporate-800 rounded-2xl hover:bg-corporate-700 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold italic">Manajemen Pengguna</h1>
          <p className="text-corporate-400 text-sm">
            Atur role admin, staff, dan customer dari satu tempat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl border border-corporate-700/50 p-5">
          <p className="text-xs uppercase tracking-widest text-corporate-500 mb-2">Total</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="glass-card rounded-2xl border border-corporate-700/50 p-5">
          <p className="text-xs uppercase tracking-widest text-corporate-500 mb-2">Admin</p>
          <p className="text-2xl font-bold text-accent-blue">{roleCounts.admin || 0}</p>
        </div>
        <div className="glass-card rounded-2xl border border-corporate-700/50 p-5">
          <p className="text-xs uppercase tracking-widest text-corporate-500 mb-2">Staff</p>
          <p className="text-2xl font-bold text-amber-400">{roleCounts.staff || 0}</p>
        </div>
        <div className="glass-card rounded-2xl border border-corporate-700/50 p-5">
          <p className="text-xs uppercase tracking-widest text-corporate-500 mb-2">Customer</p>
          <p className="text-2xl font-bold text-corporate-200">{roleCounts.customer || 0}</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-corporate-700/50 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-corporate-500" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email"
              className="w-full bg-corporate-900/50 border border-corporate-700 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-corporate-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-corporate-900/50 border border-corporate-700 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-accent-blue"
            >
              <option value="all">Semua role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent-blue" size={48} />
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-corporate-700/50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-corporate-800/50 text-corporate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Pengguna</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Ubah Role</th>
                <th className="px-8 py-5">Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6 font-bold flex items-center gap-4">
                    <div className="w-10 h-10 bg-corporate-800 rounded-full flex items-center justify-center text-accent-blue font-extrabold">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div>{user.name}</div>
                      {user.role !== 'customer' && (
                        <div className="text-[10px] uppercase tracking-widest text-corporate-500 flex items-center gap-1 mt-1">
                          <Shield size={12} />
                          {user.role === 'admin' ? 'Privileged' : 'Operational'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-corporate-400">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${ROLE_STYLES[user.role] || ROLE_STYLES.customer}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={savingId === user.id}
                        className="bg-corporate-900/50 border border-corporate-700 rounded-xl py-2 px-3 outline-none disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="customer">Customer</option>
                      </select>
                      {savingId === user.id && <Loader2 className="animate-spin text-accent-blue" size={16} />}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-corporate-500">
                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="px-8 py-16 text-center text-corporate-500">
              Tidak ada pengguna yang cocok dengan filter saat ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
