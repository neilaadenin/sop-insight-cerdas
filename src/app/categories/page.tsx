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
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

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
                <label htmlFor="category_name">Nama Kategori *</label>
                <Input
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kategori"
                />
              </div>
                             <div className="space-y-2">
                 <label htmlFor="description">Deskripsi</label>
                 <textarea
                   id="description"
                   name="description"
                   value={formData.description}
                   onChange={handleInputChange}
                   placeholder="Masukkan deskripsi kategori (opsional)"
                   rows={3}
                   className="w-full p-2 border rounded-md"
                 />
               </div>
               
               <div className="space-y-2">
                 <label>Tags</label>
                 <div className="space-y-2">
                   <div className="flex space-x-2">
                     <Input
                       placeholder="Ketik tag dan tekan Enter atau klik +"
                       value={inputTag}
                       onChange={(e) => setInputTag(e.target.value)}
                       onKeyDown={handleTagInputKeyDown}
                       className="flex-1"
                     />
                     <Button
                       type="button"
                       variant="outline"
                       onClick={addTag}
                       className="px-3"
                     >
                       +
                     </Button>
                   </div>
                   
                   {tags.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                       {tags.map((tag, index) => (
                         <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                           <span>{tag}</span>
                           <button
                             type="button"
                             onClick={() => removeTag(tag)}
                             className="ml-1 hover:text-red-600 text-blue-600"
                           >
                             ×
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={editingCategory ? handleUpdate : handleCreate}
                  className="flex items-center space-x-2"
                >
                  <span>{editingCategory ? 'Update' : 'Simpan'}</span>
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(category.id)}>
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
                 
                 {category.tags && category.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mb-3">
                     {category.tags.map((tag, index) => (
                       <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                         {tag}
                       </Badge>
                     ))}
                   </div>
                 )}
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