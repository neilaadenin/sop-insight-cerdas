"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<APICategory | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://innovative-merit-bailey-ambient.trycloudflare.com/categories');
        if (!response.ok) throw new Error('Gagal mengambil data kategori');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Gagal mengambil data kategori dari server');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    if (!formData.category_name.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori harus diisi",
        variant: "destructive"
      });
      return;
    }

    const newCategory: APICategory = {
      id: Date.now(), // Temporary ID for demo
      category_name: formData.category_name.trim(),
      description: formData.description.trim()
    };

    setCategories(prev => [...prev, newCategory]);
    setFormData({ category_name: '', description: '' });
    setIsCreateOpen(false);
    
    toast({
      title: "Sukses",
      description: "Kategori berhasil ditambahkan"
    });
  };

  const handleEdit = (category: APICategory) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      description: category.description
    });
  };

  const handleUpdate = () => {
    if (!editingCategory || !formData.category_name.trim()) {
      toast({
        title: "Error",
        description: "Nama kategori harus diisi",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, category_name: formData.category_name.trim(), description: formData.description.trim() }
        : cat
    ));

    setEditingCategory(null);
    setFormData({ category_name: '', description: '' });
    
    toast({
      title: "Sukses",
      description: "Kategori berhasil diupdate"
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Sukses",
        description: "Kategori berhasil dihapus"
      });
    }
  };

  const handleCancel = () => {
    setIsCreateOpen(false);
    setEditingCategory(null);
    setFormData({ category_name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading kategori dari API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Manajemen Kategori</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreateOpen || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {editingCategory ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category_name">Nama Kategori *</Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                placeholder="Masukkan nama kategori"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi kategori (opsional)"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={editingCategory ? handleUpdate : handleCreate}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingCategory ? 'Update' : 'Simpan'}</span>
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{category.category_name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">ID: {category.id}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg">Belum ada kategori</p>
            <p className="text-sm">Mulai dengan menambahkan kategori pertama</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;