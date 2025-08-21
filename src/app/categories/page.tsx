'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, FolderOpen, Tag, FileText, Users, Calendar } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
  tags?: string[];
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<APICategory | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/categories');
        if (!response.ok) throw new Error('Gagal mengambil data kategori');
        const data = await response.json();
        console.log('Categories API response:', data);
        
        // Handle the new API response structure that includes SOPs
        const categoriesData = data.data || data;
        const apiCategories = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(apiCategories);
        
        // Save to localStorage for fallback
        localStorage.setItem('categories', JSON.stringify(apiCategories));
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        console.log('API failed, trying localStorage fallback');
        
        // Try to load from localStorage
        const localCategories = localStorage.getItem('categories');
        if (localCategories) {
          try {
            const parsedCategories = JSON.parse(localCategories);
            setCategories(parsedCategories);
            console.log('Loaded categories from localStorage:', parsedCategories);
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
            setCategories([]);
          }
        } else {
          setCategories([]);
        }
        
        setError('Gagal mengambil data kategori dari server, menggunakan data lokal.');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const addTag = () => {
    if (inputTag.trim() && !tags.includes(inputTag.trim())) {
      setTags(prev => [...prev, inputTag.trim()]);
      setInputTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleCreate = async () => {
    if (!formData.category_name.trim()) {
      alert('Nama kategori harus diisi');
      return;
    }

    try {
      console.log('Creating category:', formData);
      
      const response = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_name: formData.category_name.trim(),
          description: formData.description.trim(),
          tags: tags
        })
      });

      console.log('Create response status:', response.status);

      if (response.ok) {
        const newCategory = await response.json();
        console.log('New category response:', newCategory);
        const categoryToAdd = newCategory.data || newCategory;
        setCategories(prev => [...prev, categoryToAdd]);
        
        // Save to localStorage
        const currentCategories = categories;
        localStorage.setItem('categories', JSON.stringify([...currentCategories, categoryToAdd]));
        
        setFormData({ category_name: '', description: '' });
        setIsCreateOpen(false);
        alert('Kategori berhasil ditambahkan');
      } else {
        const errorText = await response.text();
        console.error('Create failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Gagal menambahkan kategori: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Gagal menambahkan kategori: ${error.message}`);
    }
  };

  const handleEdit = (category: APICategory) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      description: category.description
    });
    // Load tags if they exist
    if (category.tags && Array.isArray(category.tags)) {
      setTags(category.tags);
    } else {
      setTags([]);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.category_name.trim()) {
      alert('Nama kategori harus diisi');
      return;
    }

    try {
      console.log('Updating category:', editingCategory.id, formData);
      
      // Try API update first
      let response;
      try {
        response = await fetch(`https://und-mention-inspiration-fast.trycloudflare.com/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category_name: formData.category_name.trim(),
            description: formData.description.trim(),
            tags: tags
          })
        });
      } catch (apiError) {
        console.log('API update failed, using localStorage fallback');
        response = null;
      }

      if (response && response.ok) {
        const updatedCategory = await response.json();
        console.log('Updated category response:', updatedCategory);
        
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? updatedCategory.data || updatedCategory
            : cat
        ));
      } else {
        // Fallback to localStorage update
        console.log('Using localStorage fallback for update');
        const updatedCategory = {
          ...editingCategory,
          category_name: formData.category_name.trim(),
          description: formData.description.trim(),
          tags: tags
        };
        
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? updatedCategory
            : cat
        ));
        
        // Save to localStorage
        localStorage.setItem('categories', JSON.stringify(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        )));
      }

      setEditingCategory(null);
      setFormData({ category_name: '', description: '' });
      alert('Kategori berhasil diupdate');
      
    } catch (error) {
      console.error('Error updating category:', error);
      alert(`Gagal mengupdate kategori: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        console.log('Deleting category:', id);
        
        // Try API delete first
        let response;
        try {
          response = await fetch(`https://und-mention-inspiration-fast.trycloudflare.com/categories/${id}`, {
            method: 'DELETE'
          });
        } catch (apiError) {
          console.log('API delete failed, using localStorage fallback');
          response = null;
        }

        if (response && response.ok) {
          setCategories(prev => prev.filter(cat => cat.id !== id));
          alert('Kategori berhasil dihapus');
        } else {
          // Fallback to localStorage delete
          console.log('Using localStorage fallback for delete');
          setCategories(prev => prev.filter(cat => cat.id !== id));
          
          // Save to localStorage
          localStorage.setItem('categories', JSON.stringify(categories.filter(cat => cat.id !== id)));
          alert('Kategori berhasil dihapus (local storage)');
        }
        
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(`Gagal menghapus kategori: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    setIsCreateOpen(false);
    setEditingCategory(null);
    setFormData({ category_name: '', description: '' });
    setTags([]);
    setInputTag('');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Memuat Kategori</h3>
            <p className="text-gray-500">Sedang mengambil data kategori...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-3">Terjadi Kesalahan</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Coba Lagi
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
              <FolderOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Kelola Kategori</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kelola kategori SOP untuk organisasi dengan mudah dan efisien
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                    <p className="text-sm text-gray-600">Total Kategori</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.reduce((total, cat) => total + (cat.sops?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total SOP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.reduce((total, cat) => total + (cat.tags?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Tags</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari kategori berdasarkan nama atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                />
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="h-12 px-6 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Kategori
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(isCreateOpen || editingCategory) && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    {editingCategory ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
                  </div>
                  <span>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label htmlFor="category_name" className="text-sm font-semibold text-gray-700">Nama Kategori *</label>
                    <Input
                      id="category_name"
                      name="category_name"
                      value={formData.category_name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama kategori"
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi kategori (opsional)"
                      rows={3}
                      className="w-full p-4 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Ketik tag dan tekan Enter atau klik +"
                        value={inputTag}
                        onChange={(e) => setInputTag(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="flex-1 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTag}
                        className="h-12 px-6 border-2 border-gray-200 hover:border-blue-400 rounded-xl transition-all duration-200"
                      >
                        +
                      </Button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-xl text-sm font-medium">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600 text-blue-600 transition-colors duration-200"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={editingCategory ? handleUpdate : handleCreate}
                    className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span>{editingCategory ? 'Update Kategori' : 'Simpan Kategori'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="h-12 px-8 text-base font-medium border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200"
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <FolderOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {category.category_name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(category.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description || 'Tidak ada deskripsi'}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                      ID: {category.id}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <FileText className="w-3 h-3 mr-1" />
                      {category.sops ? category.sops.length : 0} SOP
                    </Badge>
                  </div>
                  
                  {category.tags && category.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {category.sops && category.sops.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <FileText className="w-3 h-3" />
                        <span>SOP dalam kategori ini:</span>
                      </p>
                      <div className="space-y-2">
                        {category.sops.slice(0, 3).map((sop) => (
                          <div key={sop.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-xs text-gray-700 truncate flex-1">{sop.title}</span>
                            <Badge variant="outline" className="text-xs bg-white">
                              {sop.status}
                            </Badge>
                          </div>
                        ))}
                        {category.sops.length > 3 && (
                          <p className="text-xs text-gray-500 text-center py-1">
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

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {searchTerm ? 'Tidak ada kategori ditemukan' : 'Belum ada kategori'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'Coba ubah kata kunci pencarian atau buat kategori baru.' : 'Mulai dengan menambahkan kategori pertama untuk mengorganisir SOP Anda.'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Buat Kategori Pertama
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 