'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
}

interface PendingSOP {
  id: number;
  title: string;
  description: string;
  status: string;
  category_id?: number;
  division_id?: number;
  created_at: string;
  updated_at: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [pendingSOPs, setPendingSOPs] = useState<PendingSOP[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_name: '',
    division_name: '',
    tags: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch categories and pending SOPs from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/categories');
        if (!categoriesResponse.ok) throw new Error('Gagal mengambil data kategori');
        const categoriesData = await categoriesResponse.json();
        console.log('Categories API response:', categoriesData);
        // Extract categories from data property
        const categoriesArray = categoriesData.data || categoriesData;
        console.log('Extracted categories array:', categoriesArray);
        const finalCategories = Array.isArray(categoriesArray) ? categoriesArray : [];
        console.log('Final categories to set:', finalCategories);
        setCategories(finalCategories);
        
        // Fetch pending SOPs
        const sopsResponse = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/sops');
        if (sopsResponse.ok) {
          const sopsData = await sopsResponse.json();
          const sops = sopsData.data || sopsData;
          const pending = Array.isArray(sops) ? sops.filter((sop: any) => 
            sop.status === 'pending' || sop.status === 'Pending Review' || sop.status === 'Draft'
          ) : [];
          setPendingSOPs(pending);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback categories if API fails
        setCategories([
          { id: 1, category_name: 'HR', description: 'Human Resources' },
          { id: 2, category_name: 'IT', description: 'Information Technology' },
          { id: 3, category_name: 'Keuangan', description: 'Finance & Accounting' },
          { id: 4, category_name: 'Produksi', description: 'Production' },
          { id: 5, category_name: 'Umum', description: 'General' }
        ]);
        setPendingSOPs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category_name || !formData.division_name || !selectedFile) {
      toast({
        title: "Error",
        description: "Judul, kategori, departemen, dan file wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Log the data being sent for debugging
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        category_name: formData.category_name,
        division_name: formData.division_name,
        tags: formData.tags,
        file: selectedFile.name,
        fileSize: selectedFile.size
      });

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('division_name', formData.division_name);
      formDataToSend.append('tags', formData.tags || '');
      formDataToSend.append('file', selectedFile);

      // Log FormData contents
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      const response = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/sops', {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        toast({
          title: "Sukses",
          description: "SOP berhasil diunggah",
        });
        router.push('/');
      } else {
        let errorMessage = "Gagal mengunggah SOP";
        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
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
      console.error('Error uploading SOP:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengunggah SOP",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unggah SOP Baru</h1>
          <p className="text-gray-600">Unggah dokumen SOP dan dapatkan ringkasan AI otomatis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Upload Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Formulir Upload SOP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul SOP *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: SOP Keamanan Data"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi SOP</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Berikan deskripsi singkat tentang SOP ini"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_name">Kategori *</Label>
                  <Select value={formData.category_name} onValueChange={(value) => setFormData(prev => ({ ...prev, category_name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading kategori..." : "Pilih kategori"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          Loading kategori...
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map(category => (
                          <SelectItem key={category.id} value={category.category_name}>
                            {category.category_name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Keuangan">Keuangan</SelectItem>
                          <SelectItem value="Produksi">Produksi</SelectItem>
                          <SelectItem value="Umum">Umum</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {categories.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {categories.length} kategori tersedia
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="division_name">Departemen *</Label>
                  <Select value={formData.division_name} onValueChange={(value) => setFormData(prev => ({ ...prev, division_name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih departemen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Keuangan">Keuangan</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operasional">Operasional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder='Contoh: ["HR", "Panduan"]'
                />
                <p className="text-xs text-muted-foreground">
                  Format: Array JSON atau string biasa
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    required
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Klik untuk memilih file"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, atau DOCX
                    </p>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    File terpilih: {selectedFile.name}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Mengunggah...' : 'Unggah SOP'}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                Dalam Proses Verifikasi
                {pendingSOPs.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingSOPs.length} SOP
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSOPs.length > 0 ? (
                <>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">SOP Menunggu Verifikasi:</h4>
                    {pendingSOPs.map((sop) => (
                      <div key={sop.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {sop.title || 'Untitled SOP'}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {sop.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {sop.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(sop.created_at).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-blue-800">Status Verifikasi</p>
                          <p className="text-xs text-blue-700">SOP sedang dalam proses review oleh admin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada SOP Pending</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      SOP yang baru diunggah akan muncul di sini dan akan diverifikasi oleh tim admin
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-yellow-800">Status Verifikasi</p>
                          <p className="text-xs text-yellow-700">Menunggu SOP untuk diverifikasi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Tahapan Verifikasi:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <span className="text-gray-700">Upload SOP selesai</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <span className="text-gray-700">Review oleh admin</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <span className="text-gray-400">Verifikasi selesai</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Setelah verifikasi selesai, SOP akan tersedia di dashboard utama
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 