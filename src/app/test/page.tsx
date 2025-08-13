'use client'

import AppLayout from "@/components/AppLayout";

export default function TestPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">Ini adalah halaman test untuk memverifikasi navbar.</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            Jika Anda melihat Header (dengan logo PAC) dan Sidebar (dengan menu navigasi) di atas dan di kiri, 
            maka navbar sudah berfungsi dengan baik!
          </p>
        </div>
      </div>
    </AppLayout>
  );
} 