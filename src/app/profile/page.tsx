'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import AppLayout from "@/components/AppLayout";

function ProfileContent() {
  const handleRoleSwitch = () => {
    console.log('Role switch clicked');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi profil dan pengaturan akun
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informasi Profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama</label>
              <p className="text-lg font-semibold">System Admin</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Peran</label>
              <p className="text-lg font-semibold">Administrator</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-lg font-semibold">ADM001</p>
            </div>
            <Button onClick={handleRoleSwitch} variant="outline" className="w-full">
              Ganti ke Karyawan
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Ubah Password
            </Button>
            <Button variant="outline" className="w-full">
              Notifikasi
            </Button>
            <Button variant="outline" className="w-full">
              Privasi
            </Button>
            <Button variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppLayout>
      <ProfileContent />
    </AppLayout>
  );
} 