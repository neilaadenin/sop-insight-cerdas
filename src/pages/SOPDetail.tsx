"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, FileText, History } from 'lucide-react';
import FloatingChatbot from '@/components/FloatingChatbot';
import SOPViewer from '@/components/SOPViewer';
import VersionHistory from '@/components/VersionHistory';

interface APISOP {
  id: number;
  title: string;
  description: string;
  status: string;
  status_reason?: string;
  category: {
    id: number;
    category_name: string;
    description: string;
  };
  division: {
    id: number;
    division_name: string;
    description: string;
  };
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const SOPDetail: React.FC<{ sopId: string }> = ({ sopId }) => {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [sop, setSop] = useState<APISOP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch SOP data from API
  useEffect(() => {
    const fetchSOP = async () => {
      try {
        setLoading(true);
        setError(null);
                       const response = await fetch('https://innovative-merit-bailey-ambient.trycloudflare.com/sops');
        if (!response.ok) throw new Error('Gagal mengambil data SOP');
        const data = await response.json();
        const foundSOP = data.find((s: APISOP) => s.id.toString() === sopId);
        if (foundSOP) {
          setSop(foundSOP);
        } else {
          setError('SOP tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching SOP:', error);
        setError('Tidak dapat terhubung ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchSOP();
  }, [sopId]);
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading SOP data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sop) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">{error || 'SOP tidak ditemukan'}</p>
        <Button onClick={() => router.push('/')} className="mt-4">
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
          <Button variant="ghost" onClick={() => router.push('/')}>
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
            <h1 className="text-2xl font-bold text-foreground">{sop.title}</h1>
            <Badge variant="outline">{sop.status}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{sop.category.category_name}</Badge>
            <Badge variant="outline">{sop.division.division_name}</Badge>
            {sop.tags && sop.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(sop.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>System</span>
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
                <span>Deskripsi SOP</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {sop.description}
              </p>
            </CardContent>
          </Card>

          {sop.status_reason && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Alasan Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600">
                  {sop.status_reason}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <VersionHistory 
          isOpen={showHistory} 
          onClose={() => setShowHistory(false)}
          sopId={sopId}
        />
      )}

      <FloatingChatbot />
    </div>
  );
};

export default SOPDetail;