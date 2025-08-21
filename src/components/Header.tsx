"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-8 z-50">
      {/* Logo dan Nama Perusahaan */}
      <div className="flex items-center space-x-4">
        <img 
          src="/pac-logo.png" 
          alt="PAC Logo" 
          className="w-16 h-10 object-cover"
        />
        <div className="h-6 w-px bg-gray-200"></div>
        <h1 className="text-lg font-medium text-gray-700">PT Sarana Pactindo</h1>
      </div>

      {/* Search Bar di Tengah */}
      <div className="flex-1 max-w-xl mx-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Cari SOP berdasarkan judul, deskripsi, atau tag..."
            className="pl-12 pr-4 h-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 rounded-xl"
          />
        </div>
      </div>

      {/* Icons di Kanan */}
      <div className="flex items-center space-x-2">
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
