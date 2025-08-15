"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-50">
      {/* Logo dan Nama Perusahaan */}
      <div className="flex items-center space-x-3">
        <img 
          src="/pac-logo.png" 
          alt="PAC Logo" 
          className="w-16 h-10 object-cover"
        />
        <h1 className="text-xl font-semibold text-gray-900">PT Sarana Pactindo</h1>
      </div>

      {/* Search Bar di Tengah */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari SOP berdasarkan judul, deskripsi, atau tag..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Icons di Kanan */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
