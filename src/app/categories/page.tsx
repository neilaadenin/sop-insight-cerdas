'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
  sops?: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
  }>;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://ocean-lake-claims-transcription.trycloudflare.com/categories');
        if (!response.ok) throw new Error('Gagal mengambil data kategori');
        const data = await response.json();
        console.log('Categories API response:', data);
        
        // Handle the new API response structure that includes SOPs
        const categoriesData = data.data || data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Gagal mengambil data kategori dari server.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kelola Kategori</h1>
            <p className="text-muted-foreground mt-2">
              Kelola kategori SOP untuk organisasi
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.category_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description || 'Tidak ada deskripsi'}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">ID: {category.id}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {category.sops ? category.sops.length : 0} SOP
                  </Badge>
                </div>
                {category.sops && category.sops.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">SOP dalam kategori ini:</p>
                    <div className="space-y-1">
                      {category.sops.slice(0, 3).map((sop) => (
                        <div key={sop.id} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                          <span className="truncate">{sop.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {sop.status}
                          </Badge>
                        </div>
                      ))}
                      {category.sops.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{category.sops.length - 3} SOP lainnya
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm ? 'Tidak ada kategori ditemukan' : 'Belum ada kategori'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan menambahkan kategori pertama.'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 