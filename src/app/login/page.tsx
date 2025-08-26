'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Email dan password wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for x-www-form-urlencoded
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);

      const response = await fetch('https://glasgow-favors-hazard-exercises.trycloudflare.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login success:', result);
        
        // Check if response contains JWT token (access_token)
        if (result.access_token) {
          console.log('JWT access_token found:', result.access_token);
          
          // Store JWT token in localStorage
          localStorage.setItem('jwt_token', result.access_token);
          console.log('JWT token stored in localStorage');
          
          // Store user info if available
          if (result.user) {
            localStorage.setItem('user_info', JSON.stringify(result.user));
            console.log('User info stored:', result.user);
          }
          
          toast({
            title: "Login Berhasil",
            description: "JWT token tersimpan! Selamat datang kembali!",
          });
          
          console.log('Redirecting to dashboard...');
          // Redirect to dashboard with delay to ensure localStorage is updated
          setTimeout(() => {
            router.push('/dashboard');
            // Force refresh if router.push doesn't work
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          }, 500);
        } else {
          console.log('No access_token in response:', result);
          toast({
            title: "Error",
            description: "Response tidak mengandung access_token",
            variant: "destructive"
          });
        }
      } else if (response.status === 401) {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah",
          variant: "destructive"
        });
      } else {
        let errorMessage = "Gagal melakukan login";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response');
        }
        
        toast({
          title: "Error",
          description: `HTTP ${response.status}: ${errorMessage}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat melakukan login",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login ke Sistem</h1>
          <p className="text-base text-gray-600">
            Masuk ke akun Anda untuk mengakses sistem SOP
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-xl">
                <LogIn className="w-5 h-5 text-blue-600" />
              </div>
              <span>Formulir Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              >
                {isSubmitting ? 'Memproses...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
