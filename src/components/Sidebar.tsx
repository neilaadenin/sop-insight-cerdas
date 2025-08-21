"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  MessageCircle, 
  Upload, 
  FolderOpen, 
  User,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { 
      to: '/', 
      icon: FileText, 
      label: 'Daftar SOP', 
      forAll: true 
    },
    { 
      to: '/upload', 
      icon: Upload, 
      label: 'Unggah SOP Baru', 
      forAll: true 
    },
    { 
      to: '/categories', 
      icon: FolderOpen, 
      label: 'Kelola Kategori', 
      forAll: true 
    },
    { 
      to: '/users', 
      icon: Users, 
      label: 'Kelola Pengguna', 
      forAll: true 
    },
    { 
      to: '/profile', 
      icon: User, 
      label: 'Profil Saya', 
      forAll: true 
    }
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-gray-100 h-full">
      <nav className="p-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.to;
          
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-105"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
