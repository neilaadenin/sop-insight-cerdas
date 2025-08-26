'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, ChevronLeft, ChevronRight, Clock, CheckCircle, FileText, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import { authenticatedFetch, isAuthenticated } from '@/lib/auth';

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
}

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [pendingSOPs, setPendingSOPs] = useState<PendingSOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [router]);
  
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
        
        // Check authentication first
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        // Fetch categories with authentication
        try {
          const categoriesResponse = await authenticatedFetch('https://glasgow-favors-hazard-exercises.trycloudflare.com/api/categories', {
            method: 'GET',
          });
          console.log('Categories response status:', categoriesResponse.status);
          
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log('Categories API response:', categoriesData);
            // Extract categories from data property
            const categoriesArray = categoriesData.data || categoriesData;
            console.log('Extracted categories array:', categoriesArray);
            const finalCategories = Array.isArray(categoriesArray) ? categoriesArray : [];
            console.log('Final categories to set:', finalCategories);
            setCategories(finalCategories);
          } else {
            console.log('Categories fetch failed with status:', categoriesResponse.status);
            // Use fallback categories
            setCategories([
              { id: 1, category_name: 'HR', description: 'Human Resources' },
              { id: 2, category_name: 'IT', description: 'Information Technology' },
              { id: 3, category_name: 'Keuangan', description: 'Finance & Accounting' },
              { id: 4, category_name: 'Produksi', description: 'Production' },
              { id: 5, category_name: 'Umum', description: 'General' }
            ]);
          }
        } catch (categoriesError) {
          console.log('Categories fetch error:', categoriesError);
          // Use fallback categories
          setCategories([
            { id: 1, category_name: 'HR', description: 'Human Resources' },
            { id: 2, category_name: 'IT', description: 'Information Technology' },
            { id: 3, category_name: 'Keuangan', description: 'Finance & Accounting' },
            { id: 4, category_name: 'Produksi', description: 'Production' },
            { id: 5, category_name: 'Umum', description: 'General' }
          ]);
        }
        
        // Fetch pending SOPs with authentication
        try {
          const sopsResponse = await authenticatedFetch('https://glasgow-favors-hazard-exercises.trycloudflare.com/api/sops', {
            method: 'GET',
          });
          console.log('SOPs response status:', sopsResponse.status);
          
          if (sopsResponse.ok) {
            const sopsData = await sopsResponse.json();
            console.log('SOPs API response:', sopsData);
            const sops = sopsData.data || sopsData;
            const pending = Array.isArray(sops) ? sops.filter((sop: any) => 
              sop.status === 'pending' || sop.status === 'Pending Review' || sop.status === 'Draft'
            ) : [];
            setPendingSOPs(pending);
          } else {
            console.log('SOPs fetch failed with status:', sopsResponse.status);
            setPendingSOPs([]);
          }
        } catch (sopsError) {
          console.log('SOPs fetch error:', sopsError);
          setPendingSOPs([]);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

      // Get JWT token for authentication
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Silakan login ulang.",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const response = await fetch('https://glasgow-favors-hazard-exercises.trycloudflare.com/api/sops', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formDataToSend,
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

  // Pagination functions
  const totalPages = Math.ceil(pendingSOPs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSOPs = pendingSOPs.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unggah SOP Baru</h1>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Unggah dokumen SOP dan dapatkan ringkasan AI otomatis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span>Formulir Upload SOP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Judul SOP *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Contoh: SOP Keamanan Data"
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi SOP</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Berikan deskripsi singkat tentang SOP ini"
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="category_name" className="text-sm font-semibold text-gray-700">Kategori *</Label>
                    <Select value={formData.category_name} onValueChange={(value) => setFormData(prev => ({ ...prev, category_name: value }))}>
                      <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200">
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
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="keuangan">Keuangan</SelectItem>
                            <SelectItem value="produksi">Produksi</SelectItem>
                            <SelectItem value="umum">Umum</SelectItem>
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

                  <div className="space-y-3">
                    <Label htmlFor="division_name" className="text-sm font-semibold text-gray-700">Departemen *</Label>
                    <Select value={formData.division_name} onValueChange={(value) => setFormData(prev => ({ ...prev, division_name: value }))}>
                      <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Pilih departemen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="keuangan">Keuangan</SelectItem>
                        <SelectItem value="produksi">Produksi</SelectItem>
                        <SelectItem value="umum">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder='Contoh: ["HR", "Panduan"]'
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Array JSON atau string biasa
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="file" className="text-sm font-semibold text-gray-700">Upload File *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all duration-200 bg-gray-50/50 hover:bg-gray-50">
                    <input
                      type="file"
                      id="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 hover:text-blue-500 transition-colors duration-200" />
                      <p className="text-base font-medium text-gray-700 mb-2">
                        {selectedFile ? selectedFile.name : "Klik untuk memilih file"}
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, atau DOCX (Max. 10MB)
                      </p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        File terpilih: {selectedFile.name}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? 'Mengunggah...' : 'Unggah SOP'}
                </Button>
              </CardContent>
            </Card>

            {/* Verification Status Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span>Dalam Proses Verifikasi</span>
                  {pendingSOPs.length > 0 && (
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                      {pendingSOPs.length} SOP
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingSOPs.length > 0 ? (
                  <>
                    {/* All SOPs List */}
                    <div className="space-y-3">
                      {currentSOPs.map((sop, index) => (
                        <div key={sop.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                                  SOP {startIndex + index + 1}
                                </span>
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  {sop.status}
                                </Badge>
                              </div>
                              <h5 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                                {sop.title || 'Untitled SOP'}
                              </h5>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {sop.description || 'No description'}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(sop.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                >
                                  Lihat
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-center space-x-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="h-10 px-4 text-base"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-base text-gray-700">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="h-10 px-4 text-base"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index + 1 === currentPage 
                                ? 'bg-blue-500 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Belum Ada SOP Pending</h3>
                      <p className="text-gray-600 text-sm">
                        SOP yang baru diunggah akan muncul di sini
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 