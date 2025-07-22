
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, ChevronRight, ChevronDown } from 'lucide-react';
import SOPCard from '@/components/SOPCard';
import { sops, kategoris } from '@/data/sampleData';
import { SOP } from '@/types/sop';
import { useNavigate } from 'react-router-dom';

const SOPDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('all');
  const [selectedDepartemen, setSelectedDepartemen] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const departemens = ['HR', 'Keuangan', 'IT', 'Produksi', 'Umum'];

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.tag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKategori = selectedKategori === 'all' || sop.kategori === selectedKategori;
    const matchesDepartemen = selectedDepartemen === 'all' || sop.departemen === selectedDepartemen;
    
    return matchesSearch && matchesKategori && matchesDepartemen;
  });

  const handleViewSOP = (sop: SOP) => {
    navigate(`/sop/${sop.id}`);
  };

  const handleViewHistory = (sop: SOP) => {
    navigate(`/sop/${sop.id}`);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const groupSOPsByCategory = () => {
    const grouped: { [key: string]: SOP[] } = {};
    
    filteredSOPs.forEach(sop => {
      if (!grouped[sop.kategori]) {
        grouped[sop.kategori] = [];
      }
      grouped[sop.kategori].push(sop);
    });
    
    return grouped;
  };

  const groupedSOPs = groupSOPsByCategory();

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

      {/* SOP Categories */}
      <div className="space-y-4">
        {Object.keys(groupedSOPs).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Tidak ada SOP yang ditemukan</p>
              <p className="text-sm">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedSOPs).map(([categoryName, sops]) => {
            const kategori = kategoris.find(k => k.nama === categoryName);
            const isExpanded = expandedCategories.includes(categoryName);
            
            return (
              <Collapsible 
                key={categoryName}
                open={isExpanded}
                onOpenChange={() => toggleCategory(categoryName)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="text-2xl">{kategori?.icon}</span>
                      <span className="font-semibold text-left">{categoryName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sops.length} SOP
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pl-8">
                    {sops.map(sop => (
                      <SOPCard
                        key={sop.id}
                        sop={sop}
                        onView={handleViewSOP}
                        onViewHistory={handleViewHistory}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>

    </div>
  );
};

export default SOPDashboard;
