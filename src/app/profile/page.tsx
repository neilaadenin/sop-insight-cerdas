'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, Shield, Bell, Lock, Key, Crown, Building2, Mail, Phone, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";

function ProfileContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Profil Saya</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelola informasi profil, pengaturan akun, dan preferensi sistem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info - Main Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <span>Informasi Profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                        <p className="text-lg font-semibold text-gray-900">System Admin</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Peran</p>
                        <p className="text-lg font-semibold text-gray-900">Administrator</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Building2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Departemen</p>
                        <p className="text-lg font-semibold text-gray-900">IT & Systems</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID Karyawan</p>
                        <p className="text-lg font-semibold text-gray-900">ADM001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span>Informasi Kontak</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base font-semibold text-gray-900">admin@company.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg border border-green-100">
                      <Phone className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telepon</p>
                        <p className="text-base font-semibold text-gray-900">+62 812-3456-7890</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <span>Pengaturan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full h-11 justify-start bg-white/50 hover:bg-white border-gray-200 hover:border-gray-300">
                  <Key className="w-4 h-4 mr-3 text-gray-600" />
                  Ubah Password
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start bg-white/50 hover:bg-white border-gray-200 hover:border-gray-300">
                  <Bell className="w-4 h-4 mr-3 text-gray-600" />
                  Notifikasi
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start bg-white/50 hover:bg-white border-gray-200 hover:border-gray-300">
                  <Lock className="w-4 h-4 mr-3 text-gray-600" />
                  Privasi & Keamanan
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl text-green-800">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <span>Status Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Aktif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Terakhir Login</span>
                  <span className="text-sm text-green-600">Hari ini</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Sesi</span>
                  <span className="text-sm text-green-600">Aktif</span>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <Button 
              variant="destructive" 
              className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <span>Aktivitas Terbaru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Login ke sistem</p>
                    <p className="text-sm text-gray-500">2 jam yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Upload SOP baru</p>
                    <p className="text-sm text-gray-500">1 hari yang lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Update kategori</p>
                    <p className="text-sm text-gray-500">3 hari yang lalu</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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