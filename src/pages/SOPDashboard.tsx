
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import SOPCard from '@/components/SOPCard';
import { sops, kategoris } from '@/data/sampleData';
import { SOP } from '@/types/sop';

const SOPDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('all');
  const [selectedDepartemen, setSelectedDepartemen] = useState('all');

  const departemens = ['HR', 'Keuangan', 'IT', 'Produksi', 'Umum'];

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.tag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKategori = selectedKategori === 'all' || sop.kategori === selectedKategori;
    const matchesDepartemen = selectedDepartemen === 'all' || sop.departemen === selectedDepartemen;
    
    return matchesSearch && matchesKategori && matchesDepartemen;
  });

  const handleViewSOP = (sop: SOP) => {
    console.log('Viewing SOP:', sop.judul);
    // TODO: Implement SOP viewer modal
  };

  const handleViewHistory = (sop: SOP) => {
    console.log('Viewing history for:', sop.judul);
    // TODO: Implement history modal
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Daftar SOP</h1>
        <div className="text-sm text-muted-foreground">
          {filteredSOPs.length} dari {sops.length} SOP
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari SOP berdasarkan judul atau tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedKategori} onValueChange={setSelectedKategori}>
          <SelectTrigger>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Semua Kategori" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {kategoris.map(kategori => (
              <SelectItem key={kategori.id} value={kategori.nama}>
                {kategori.icon} {kategori.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartemen} onValueChange={setSelectedDepartemen}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Departemen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Departemen</SelectItem>
            {departemens.map(dept => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SOP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSOPs.map(sop => (
          <SOPCard
            key={sop.id}
            sop={sop}
            onView={handleViewSOP}
            onViewHistory={handleViewHistory}
          />
        ))}
      </div>

      {filteredSOPs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Tidak ada SOP yang ditemukan</p>
            <p className="text-sm">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPDashboard;
