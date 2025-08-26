'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // User is authenticated, show dashboard option
      console.log('User authenticated, showing dashboard option');
    } else {
      // User not authenticated, redirect to login
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="text-center">
        {isAuthenticated() ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h1>
            <p className="text-gray-600">Anda sudah login ke sistem</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Masuk ke Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
} 