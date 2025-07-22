import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { kategoris } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

const CategoryManager: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(kategoris);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    nama: '',
    icon: '',
    warna: '#3b82f6'
  });

  const colors = [
    { name: 'Biru', value: '#3b82f6' },
    { name: 'Hijau', value: '#10b981' },
    { name: 'Ungu', value: '#8b5cf6' },
    { name: 'Merah', value: '#ef4444' },
    { name: 'Kuning', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' }
  ];

  const icons = ['📁', '👥', '💰', '🖥️', '🏭', '📋', '🔧', '📊', '🎯', '⚡'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.icon) {
      toast({
        title: "Error",
        description: "Nama dan ikon wajib diisi.",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast({
        title: "Berhasil!",
        description: "Kategori berhasil diperbarui.",
      });
      setEditingCategory(null);
    } else {
      // Create new category
      const newCategory = {
        id: `cat-${Date.now()}`,
        ...formData
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Berhasil!",
        description: "Kategori baru berhasil dibuat.",
      });
      setIsCreateOpen(false);
    }

    setFormData({ nama: '', icon: '', warna: '#3b82f6' });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      nama: category.nama,
      icon: category.icon,
      warna: category.warna
    });
  };

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({
      title: "Berhasil!",
      description: "Kategori berhasil dihapus.",
    });
  };

  const CategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Kategori</Label>
        <Input
          id="nama"
          placeholder="Contoh: SDM & Organisasi"
          value={formData.nama}
          onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Pilih Ikon</Label>
        <div className="grid grid-cols-5 gap-2">
          {icons.map(icon => (
            <Button
              key={icon}
              type="button"
              variant={formData.icon === icon ? "default" : "outline"}
              className="h-12 w-12 text-lg p-0"
              onClick={() => setFormData(prev => ({ ...prev, icon }))}
            >
              {icon}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pilih Warna</Label>
        <div className="grid grid-cols-3 gap-2">
          {colors.map(color => (
            <Button
              key={color.value}
              type="button"
              variant={formData.warna === color.value ? "default" : "outline"}
              className="justify-start"
              onClick={() => setFormData(prev => ({ ...prev, warna: color.value }))}
            >
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {editingCategory ? 'Perbarui Kategori' : 'Buat Kategori'}
      </Button>
    </form>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kelola Kategori</h1>
          <p className="text-muted-foreground mt-2">
            Atur kategori untuk mengorganisir SOP dengan lebih baik
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Kategori Baru</DialogTitle>
            </DialogHeader>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{category.nama}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className="mt-1"
                      style={{ borderColor: category.warna, color: category.warna }}
                    >
                      {category.warna}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Kategori</DialogTitle>
            </DialogHeader>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManager;