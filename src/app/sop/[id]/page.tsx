'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, User, Tag, Share, Download, Edit, Clock, Shield, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { authenticatedFetch } from '@/lib/auth';

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
  version?: string;
}

interface SOPPreview {
  preview_text: string;
}

interface SOPPageProps {
  params: {
    id: string;
  };
}

export default function SOPPage({ params }: SOPPageProps) {
  const [sop, setSop] = useState<APISOP | null>(null);
  const [sopPreview, setSopPreview] = useState<SOPPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSOP = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch SOP basic data with authentication
        const sopResponse = await authenticatedFetch(`https://glasgow-favors-hazard-exercises.trycloudflare.com/api/sops/${params.id}`, {
          method: 'GET',
        });
        if (!sopResponse.ok) throw new Error('Gagal mengambil data SOP');
        const sopData = await sopResponse.json();
        setSop(sopData);
        
        // Fetch SOP preview content with authentication
        try {
          const previewResponse = await authenticatedFetch(`https://glasgow-favors-hazard-exercises.trycloudflare.com/api/sops/${params.id}/preview`, {
            method: 'GET',
          });
          if (previewResponse.ok) {
            const previewData = await previewResponse.json();
            setSopPreview(previewData);
          } else {
            console.log('Preview not available, using fallback content');
          }
        } catch (previewError) {
          console.log('Preview fetch failed, using fallback content:', previewError);
        }
        
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
    if (!status) return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
      case 'verified':
      case 'approved':
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'revision':
      case 'revisi':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Revisi</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
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
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-gray-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{sop.title || 'No Title'}</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {sop.description || 'Comprehensive guide for conducting operations and procedures'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">SOP Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    {/* Content Structure */}
                    <div className="space-y-4">
                      <h1 className="text-2xl font-bold text-gray-900"># {sop.title || 'SOP Title'}</h1>
                      
                      {/* Dynamic SOP Content from API */}
                      {sopPreview && sopPreview.preview_text ? (
                        <div className="prose prose-gray max-w-none">
                          <div 
                            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ 
                              __html: sopPreview.preview_text
                                .replace(/\n\n/g, '<br><br>')
                                .replace(/\n/g, '<br>')
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold text-gray-800">## Overview</h2>
                          <p className="text-gray-700 leading-relaxed">
                            {sop.description || 'This document outlines the standard procedures for conducting operations and ensuring that all processes are followed correctly and efficiently.'}
                          </p>

                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">## Scope</h2>
                            <p className="text-gray-700 leading-relaxed">
                              This SOP applies to all operations and procedures within the organization.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">## Prerequisites</h2>
                            <p className="text-gray-700 leading-relaxed">
                              Understanding of the application architecture and basic operational procedures.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">## Procedure</h2>
                            
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">### 1. Test Case Selection</h3>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Identify areas affected by recent changes</li>
                                <li>Select relevant test cases from the regression test suite</li>
                                <li>Prioritize critical functionality and high-risk areas</li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">### 2. Environment Preparation</h3>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Ensure test environment is properly configured</li>
                                <li>Verify test data availability</li>
                                <li>Check application deployment status</li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">### 3. Test Execution</h3>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Execute automated regression tests first</li>
                                <li>Perform manual testing for complex scenarios</li>
                                <li>Document any failures or unexpected behavior</li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">### 4. Reporting</h3>
                              <p className="text-gray-700 leading-relaxed">
                                Generate comprehensive reports documenting all test results and findings.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SOP Information */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">SOP Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status</span>
                    {getStatusBadge(sop.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Version</span>
                    <span className="text-gray-900 font-medium">{sop.version || '1.0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Category</span>
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      {sop.category || 'General'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Division</span>
                    <span className="text-gray-900 font-medium">{sop.division || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Updated</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {sop.updated_at ? new Date(sop.updated_at).toLocaleDateString('en-CA') : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assigned To */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span>Assigned To</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">B</span>
                    </div>
                    <span className="text-gray-900">Budi</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">S</span>
                    </div>
                    <span className="text-gray-900">Siti</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">A</span>
                    </div>
                    <span className="text-gray-900">Ahmad</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Version 2.1 published</span>
                    <span className="text-sm text-gray-500">2024-01-15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Content updated</span>
                    <span className="text-sm text-gray-500">2024-01-10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">Assigned to Ahmad</span>
                    <span className="text-sm text-gray-500">2024-01-08</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 