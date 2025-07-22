import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, FileText, History } from 'lucide-react';
import { sops } from '@/data/sampleData';
import FloatingChatbot from '@/components/FloatingChatbot';
import SOPViewer from '@/components/SOPViewer';
import VersionHistory from '@/components/VersionHistory';

const SOPDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  
  const sop = sops.find(s => s.id === id);
  
  if (!sop) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">SOP tidak ditemukan</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar SOP
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar SOP
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(true)}
            className="flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span>Riwayat Versi</span>
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-foreground">{sop.judul}</h1>
            <Badge variant="outline">{sop.versi}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{sop.kategori}</Badge>
            <Badge variant="outline">{sop.departemen}</Badge>
            {sop.tag.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{sop.tanggal}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{sop.diunggah_oleh}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* PDF Viewer */}
        <div className="lg:col-span-2">
          <SOPViewer sop={sop} />
        </div>
        
        {/* AI Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Ringkasan AI</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {sop.ringkasan}
              </p>
            </CardContent>
          </Card>
          
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Departemen</p>
                <p className="text-sm text-muted-foreground">{sop.departemen}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Kategori</p>
                <p className="text-sm text-muted-foreground">{sop.kategori}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Versi Saat Ini</p>
                <p className="text-sm text-muted-foreground">{sop.versi}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot sop={sop} />
      
      {/* Version History Modal */}
      {showHistory && (
        <VersionHistory 
          sop={sop} 
          onClose={() => setShowHistory(false)} 
        />
      )}
    </div>
  );
};

export default SOPDetail;