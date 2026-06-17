'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const user = searchParams.get('user');
  const router = useRouter();

  useEffect(() => {
    if (token && user) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', decodeURIComponent(user));
        router.push('/');
        router.refresh();
      } catch (err) {
        console.error('Error saving auth data:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [token, user, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="animate-spin text-accent-blue mb-4" size={48} />
      <h1 className="text-xl font-semibold text-white">Sedang memproses masuk...</h1>
      <p className="text-corporate-400 mt-2">Mohon tunggu sebentar.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-blue" size={32} />
      </div>
    }>
      <CallbackComponent />
    </Suspense>
  );
}
