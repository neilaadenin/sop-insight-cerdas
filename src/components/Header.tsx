
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, switchRole, isAdmin } = useAuth();

  const handleRoleSwitch = () => {
    switchRole(isAdmin ? 'Karyawan' : 'Admin');
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PAC</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard SOP</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Masuk sebagai:</span>
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {currentUser?.peran} - {currentUser?.nama}
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRoleSwitch}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ganti Peran</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
