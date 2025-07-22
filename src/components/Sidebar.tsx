
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  MessageCircle, 
  Upload, 
  FolderOpen, 
  User 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

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
      forAll: false 
    },
    { 
      to: '/categories', 
      icon: FolderOpen, 
      label: 'Kelola Kategori', 
      forAll: false 
    },
    { 
      to: '/profile', 
      icon: User, 
      label: 'Profil Saya', 
      forAll: true 
    }
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (!item.forAll && !isAdmin) return null;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
