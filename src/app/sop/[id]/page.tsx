'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';

interface APISOP {
  id: number;
  title: string;
  description: string;
  status: string;
  category: string;
  division: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

interface SOPPageProps {
  params: {
    id: string;
  };
}

export default function SOPPage({ params }: SOPPageProps) {
  const [sop, setSop] = useState<APISOP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSOP = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://innovative-merit-bailey-ambient.trycloudflare.com/sops/${params.id}`);
        if (!response.ok) throw new Error('Gagal mengambil data SOP');
        const data = await response.json();
        setSop(data);
        
      } catch (error) {
        console.error('Error fetching SOP:', error);
        setError('Gagal mengambil data SOP dari server.');
        setSop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSOP();
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending Review</Badge>;
      case 'verified':
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'revision':
      case 'revisi':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Revisi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  if (error || !sop) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">{error || 'SOP tidak ditemukan'}</p>
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        {/* SOP Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{sop.title || 'No Title'}</CardTitle>
                {getStatusBadge(sop.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
              <p className="text-muted-foreground">
                {sop.description || 'Tidak ada deskripsi tersedia'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Kategori</p>
                    <p className="text-sm text-muted-foreground">{sop.category || 'Uncategorized'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Departemen</p>
                    <p className="text-sm text-muted-foreground">{sop.division || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dibuat</p>
                    <p className="text-sm text-muted-foreground">
                      {sop.created_at ? new Date(sop.created_at).toLocaleDateString('id-ID') : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Update Terakhir</p>
                    <p className="text-sm text-muted-foreground">
                      {sop.updated_at ? new Date(sop.updated_at).toLocaleDateString('id-ID') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {sop.tags && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {typeof sop.tags === 'string' && sop.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 