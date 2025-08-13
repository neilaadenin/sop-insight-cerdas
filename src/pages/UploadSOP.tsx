"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Tag, RefreshCw, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
}

interface APISOP {
  id: number;
  title: string;
  description: string;
  status: string;
  category: {
    id: number;
    category_name: string;
  };
  division: {
    id: number;
    division_name: string;
  };
  tags: string[] | null;
  created_at: string;
}

const UploadSOP: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingSOPs, setPendingSOPs] = useState<APISOP[]>([]);
  
  const [formData, setFormData] = useState({
    judul: '',
    departemen: '',
    kategori: '',
    tags: '',
    ringkasan: '',
    versi: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');

  // Fetch categories and pending SOPs from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('https://innovative-merit-bailey-ambient.trycloudflare.com/categories');
        if (!categoriesResponse.ok) throw new Error('Gagal mengambil data kategori');
        const categoriesData = await categoriesResponse.json();
        // Ensure categoriesData is an array
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        // Fetch pending SOPs
        const sopsResponse = await fetch('https://innovative-merit-bailey-ambient.trycloudflare.com/sops');
        if (!sopsResponse.ok) throw new Error('Gagal mengambil data SOP');
        const sopsData = await sopsResponse.json();
        // Ensure sopsData is an array before filtering
        const sopsArray = Array.isArray(sopsData) ? sopsData : [];
        const pending = sopsArray.filter((sop: APISOP) => 
          sop.status === 'Pending Review' || 
          sop.status === 'Rejected' || 
          sop.status === 'Revisi' ||
          sop.status === 'Draft'
        );
        setPendingSOPs(pending);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil data dari server",
          variant: "destructive"
        });
        // Set empty arrays on error to prevent crashes
        setCategories([]);
        setPendingSOPs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputTag.trim()) {
      e.preventDefault();
      if (!tags.includes(inputTag.trim())) {
        setTags(prev => [...prev, inputTag.trim()]);
      }
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.departemen || !formData.kategori || !selectedFile) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi (kecuali file)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('judul', formData.judul);
      formDataToSend.append('deskripsi', formData.ringkasan);
      formDataToSend.append('departemen', formData.departemen);
      formDataToSend.append('category_id', formData.kategori);
      formDataToSend.append('tags', tags.join(','));
      formDataToSend.append('file', selectedFile);

      const response = await fetch('https://innovative-merit-bailey-ambient.trycloudflare.com/sops', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        toast({
          title: "Sukses!",
          description: "SOP berhasil diunggah"
        });
        
        // Reset form
        setFormData({
          judul: '',
          departemen: '',
          kategori: '',
          tags: '',
          ringkasan: '',
          versi: ''
        });
        setSelectedFile(null);
        setTags([]);
        
        // Redirect to dashboard
        router.push('/');
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Gagal mengunggah SOP",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Revisi':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Revisi</Badge>;
      case 'Draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading data dari API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Unggah SOP Baru</h1>
        <p className="text-muted-foreground mt-2">
          Unggah dokumen SOP dan dapatkan ringkasan AI otomatis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Formulir Upload SOP</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul SOP *</Label>
                <Input
                  id="judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  placeholder="Contoh: SOP Onboarding Karyawan Baru"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departemen">Departemen *</Label>
                  <Select value={formData.departemen} onValueChange={(value) => setFormData(prev => ({ ...prev, departemen: value }))}>
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

                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori *</Label>
                  <Select value={formData.kategori} onValueChange={(value) => setFormData(prev => ({ ...prev, kategori: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Categories loaded: {categories.length} items</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="versi">Versi SOP</Label>
                <Select value={formData.versi} onValueChange={(value) => setFormData(prev => ({ ...prev, versi: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih versi SOP (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0</SelectItem>
                    <SelectItem value="1.1">1.1</SelectItem>
                    <SelectItem value="2.0">2.0</SelectItem>
                    <SelectItem value="2.1">2.1</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Pilih versi jika ini adalah update dari SOP yang sudah ada</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ringkasan">Ringkasan SOP</Label>
                <Textarea
                  id="ringkasan"
                  name="ringkasan"
                  value={formData.ringkasan}
                  onChange={handleInputChange}
                  placeholder="Berikan ringkasan singkat tentang SOP ini"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ketik tag dan tekan Enter"
                      value={inputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (inputTag.trim() && !tags.includes(inputTag.trim())) {
                          setTags(prev => [...prev, inputTag.trim()]);
                          setInputTag('');
                        }
                      }}
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
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
                      {selectedFile ? selectedFile.name : "Klik untuk memilih file atau drag & drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, atau DOCX (Max 10MB)
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
                className="w-full flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengunggah...' : 'Unggah SOP'}</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Verification Status */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Dalam Proses Verifikasi</h2>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="space-y-4">
            {pendingSOPs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">Tidak ada SOP yang sedang diverifikasi</p>
                </CardContent>
              </Card>
            ) : (
              pendingSOPs.map((sop) => (
                <Card key={sop.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{sop.title}</h3>
                        {sop.description && (
                          <p className="text-sm text-muted-foreground mb-2">{sop.description}</p>
                        )}
                      </div>
                      {getStatusBadge(sop.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {sop.category && (
                        <Badge variant="outline" className="text-xs">
                          {sop.category.category_name}
                        </Badge>
                      )}
                      {sop.division && (
                        <Badge variant="outline" className="text-xs">
                          {sop.division.division_name}
                        </Badge>
                      )}
                      {getStatusBadge(sop.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Dibuat: {new Date(sop.created_at).toLocaleDateString('id-ID')}
                      </span>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSOP;