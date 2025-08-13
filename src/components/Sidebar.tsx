"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  MessageCircle, 
  Upload, 
  FolderOpen, 
  User 
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
      to: '/profile', 
      icon: User, 
      label: 'Profil Saya', 
      forAll: true 
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full shadow-sm">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.to;
          
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
