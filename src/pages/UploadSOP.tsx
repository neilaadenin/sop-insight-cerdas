import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { kategoris } from '@/data/sampleData';
import { useToast } from '@/hooks/use-toast';

const UploadSOP: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    departemen: '',
    kategori: '',
    tags: '',
    deskripsi: '',
    file: null as File | null
  });

  const departemens = ['HR', 'Keuangan', 'IT', 'Produksi', 'Umum'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Hanya file PDF yang diperbolehkan.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.departemen || !formData.kategori || !formData.file) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang wajib diisi.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload and AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock new SOP data
    const newSOP = {
      id: `sop-${Date.now()}`,
      judul: formData.judul,
      kategori: formData.kategori,
      departemen: formData.departemen,
      tag: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      versi: 'v1.0',
      diunggah_oleh: 'Indira Kamila',
      tanggal: new Date().toLocaleDateString('id-ID'),
      ringkasan: `Ringkasan AI: ${formData.judul} menjelaskan prosedur ${formData.kategori.toLowerCase()} untuk departemen ${formData.departemen}. ${formData.deskripsi || 'Dokumen ini berisi panduan lengkap sesuai standar operasional PAC.'}`,
      file: formData.file.name
    };

    setIsUploading(false);
    
    toast({
      title: "Berhasil!",
      description: "SOP berhasil diunggah dan dianalisis oleh AI.",
    });

    // Navigate to detail page
    navigate(`/sop/${newSOP.id}`);
  };

  if (isUploading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Menganalisis Dokumen</h3>
                <p className="text-sm text-muted-foreground">
                  AI sedang membuat ringkasan otomatis...
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Unggah SOP Baru</h1>
        <p className="text-muted-foreground mt-2">
          Unggah dokumen SOP dan dapatkan ringkasan AI otomatis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Formulir Upload SOP</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="judul">Judul SOP *</Label>
              <Input
                id="judul"
                placeholder="Contoh: SOP Onboarding Karyawan Baru"
                value={formData.judul}
                onChange={(e) => handleInputChange('judul', e.target.value)}
                required
              />
            </div>

            {/* Departemen */}
            <div className="space-y-2">
              <Label htmlFor="departemen">Departemen *</Label>
              <Select onValueChange={(value) => handleInputChange('departemen', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departemens.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori *</Label>
              <Select onValueChange={(value) => handleInputChange('kategori', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoris.map(kategori => (
                    <SelectItem key={kategori.id} value={kategori.nama}>
                      {kategori.icon} {kategori.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tag (opsional)</Label>
              <Input
                id="tags"
                placeholder="Contoh: Onboarding, HR, Karyawan Baru (pisahkan dengan koma)"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi Tambahan (opsional)</Label>
              <Textarea
                id="deskripsi"
                placeholder="Tambahkan konteks atau prompt khusus untuk AI..."
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">File PDF *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  {formData.file ? (
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">{formData.file.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium">Klik untuk pilih file PDF</p>
                        <p className="text-sm text-muted-foreground">Maksimal 10MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Unggah SOP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSOP;