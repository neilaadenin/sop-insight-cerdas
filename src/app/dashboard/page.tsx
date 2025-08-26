"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, Filter, FileText, Eye, AlertCircle, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { api } from '@/lib/api';
import { authenticatedFetch, getUserInfo, logout, isAuthenticated } from '@/lib/auth';
import { getApiUrl, API_CONFIG } from '@/lib/config';
import { useCategoriesWithAuth, useDivisions } from '@/hooks/use-dropdown-data';
import { DynamicDropdown } from '@/components/ui/dynamic-dropdown';

interface APISOP {
  id: number;
  title: string;
  description: string;
  status: string;
  category_id?: number;
  division_id?: number;
  category?: string;
  division?: string;
  tags?: string | any[];
  created_at: string;
  updated_at: string;
  status_reason?: string;
}

interface APICategory {
  id: number;
  category_name: string;
  description: string;
}

interface APIDivision {
  id: number;
  division_name: string;
  description: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [apiSOPs, setApiSOPs] = useState<APISOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [userInfo, setUserInfo] = useState<any>(null);

  // Use dynamic dropdown hooks
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategoriesWithAuth();
  const { data: departments, loading: departmentsLoading, error: departmentsError } = useDivisions();

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    console.log('isAuthenticated():', isAuthenticated());
    
    // Check authentication first
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    
    console.log('User is authenticated, proceeding to dashboard');
    
    // Get user info from localStorage
    const user = getUserInfo();
    console.log('User info from localStorage:', user);
    setUserInfo(user);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch SOPs with JWT authentication
        let sopsResponse;
        try {
          sopsResponse = await authenticatedFetch(getApiUrl(API_CONFIG.ENDPOINTS.SOPS), {
            method: 'GET',
          });
        } catch (fetchError) {
          console.error('Network error fetching SOPs:', fetchError);
          throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to connect to server'}`);
        }
        
        if (!sopsResponse.ok) {
          throw new Error(`HTTP ${sopsResponse.status}: ${sopsResponse.statusText}`);
        }
        
        const sopsData = await sopsResponse.json();
        console.log('SOPs API response:', sopsData);
        
        // Handle the actual API response structure
        const sops = sopsData.data || sopsData;
        setApiSOPs(Array.isArray(sops) ? sops : []);
        
        // Categories and divisions are now fetched using hooks
        // No need to fetch them here anymore
        
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Gagal mengambil data dari server: ${errorMessage}`);
        setApiSOPs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: number | undefined) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  // Helper function to get division name by ID
  const getDivisionName = (divisionId: number | undefined) => {
    if (!divisionId) return 'Unknown';
    const division = departments.find(div => div.id === divisionId);
    return division ? division.name : 'Unknown';
  };

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
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDepartment('all');
  };

  // Filter SOPs based on search and filters
  const filteredSOPs = apiSOPs.filter(sop => {
    const categoryName = getCategoryName(sop.category_id);
    const divisionName = getDivisionName(sop.division_id);
    
    const matchesSearch = searchTerm === '' || 
      sop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sop.tags && typeof sop.tags === 'string' && sop.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
    const matchesDepartment = selectedDepartment === 'all' || divisionName === selectedDepartment;
    
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  // Group SOPs by category
  const groupedSOPs = filteredSOPs.reduce((acc, sop) => {
    const category = getCategoryName(sop.category_id);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sop);
    return acc;
  }, {} as Record<string, APISOP[]>);

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
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-destructive mb-2">Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()}>
                  Coba Lagi
                </Button>
                <div className="text-xs text-muted-foreground">
                  <p>Jika masalah berlanjut, cek:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Koneksi internet</li>
                    <li>Status server backend</li>
                    <li>URL API yang benar</li>
                  </ul>
                </div>
              </div>
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
            <h1 className="text-3xl font-bold text-foreground">Daftar SOP</h1>
            <p className="text-muted-foreground mt-2">
              Kelola dan lihat semua Standard Operating Procedures
            </p>
            {userInfo && (
              <div className="flex items-center space-x-2 mt-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Welcome, {userInfo.full_name || userInfo.username} ({userInfo.role || 'User'})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total: {apiSOPs.length} SOP
            </span>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari SOP berdasarkan judul, deskripsi, atau tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <DynamicDropdown
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Kategori"
                items={categories}
                loading={categoriesLoading}
                error={categoriesError}
                className="w-40"
                showAllOption={true}
                allOptionLabel="Semua Kategori"
              />
              
              <DynamicDropdown
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="Departemen"
                items={departments}
                loading={departmentsLoading}
                error={departmentsError}
                className="w-40"
                showAllOption={true}
                allOptionLabel="Semua Departemen"
              />
              
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* SOP List */}
        <div className="space-y-4">
          {Object.entries(groupedSOPs).map(([category, sops]) => (
            <Collapsible
              key={category}
              open={expandedCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-left">{category}</span>
                    <Badge variant="secondary" className="ml-2">
                      {sops.length} SOP
                    </Badge>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-gray-50/50 rounded-lg">
                  {sops.map((sop) => (
                    <Card key={sop.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{sop.title || 'No Title'}</CardTitle>
                          {getStatusBadge(sop.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {sop.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Kategori:</span>
                          <span>{getCategoryName(sop.category_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Departemen:</span>
                          <span>{getDivisionName(sop.division_id)}</span>
                        </div>
                        
                        {sop.status_reason && (
                          <div className="text-xs text-muted-foreground bg-gray-100 p-2 rounded">
                            <span className="font-medium">Alasan:</span> {sop.status_reason}
                          </div>
                        )}
                        
                        {sop.tags && (
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(sop.tags) ? (
                              sop.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {String(tag)}
                                </Badge>
                              ))
                            ) : typeof sop.tags === 'string' ? (
                              sop.tags.split(',').map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))
                            ) : null}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <span>Dibuat: {sop.created_at ? new Date(sop.created_at).toLocaleDateString('id-ID') : 'Unknown'}</span>
                          <span>Update: {sop.updated_at ? new Date(sop.updated_at).toLocaleDateString('id-ID') : 'Unknown'}</span>
                        </div>
                        
                        <Link href={`/sop/${sop.id}`}>
                          <Button className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {Object.keys(groupedSOPs).length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Tidak ada SOP ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah filter pencarian atau kategori yang dipilih.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 