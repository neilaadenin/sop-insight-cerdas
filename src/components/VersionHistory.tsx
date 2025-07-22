import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Download } from 'lucide-react';
import { SOP } from '@/types/sop';
import { useAuth } from '@/contexts/AuthContext';

interface VersionHistoryProps {
  sop: SOP;
  onClose: () => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ sop, onClose }) => {
  const { isAdmin } = useAuth();

  // Mock version history data
  const versionHistory = [
    {
      versi: 'v1.0',
      diunggah_oleh: 'Indira Kamila',
      tanggal: '2025-07-10',
      perubahan: 'Upload awal dokumen SOP',
      file: `${sop.file.replace('.pdf', '_v1.pdf')}`
    },
    {
      versi: 'v1.1',
      diunggah_oleh: 'Indira Kamila',
      tanggal: '2025-07-13',
      perubahan: 'Penambahan checklist pada halaman 3',
      file: `${sop.file.replace('.pdf', '_v1_1.pdf')}`
    },
    {
      versi: 'v2.0',
      diunggah_oleh: 'David Effendi',
      tanggal: '2025-07-18',
      perubahan: 'Revisi alur dan penambahan approval matrix',
      file: sop.file
    }
  ];

  const handleRestoreVersion = (version: string) => {
    console.log(`Restoring version ${version} for SOP: ${sop.judul}`);
    // TODO: Implement version restore functionality
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Riwayat Versi - {sop.judul}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {versionHistory.map((version, index) => (
            <div 
              key={version.versi} 
              className={`border rounded-lg p-4 ${
                index === versionHistory.length - 1 ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge variant={index === versionHistory.length - 1 ? 'default' : 'outline'}>
                    {version.versi}
                  </Badge>
                  {index === versionHistory.length - 1 && (
                    <Badge variant="secondary">Versi Aktif</Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat
                  </Button>
                  {isAdmin && index !== versionHistory.length - 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestoreVersion(version.versi)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Pulihkan
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{version.tanggal}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{version.diunggah_oleh}</span>
                  </div>
                </div>
                
                <p className="text-foreground">{version.perubahan}</p>
                
                <p className="text-xs text-muted-foreground">
                  File: {version.file}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistory;