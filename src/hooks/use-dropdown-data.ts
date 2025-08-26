import { useState, useEffect } from 'react';
import { getApiUrl, API_CONFIG, logConfig } from '@/lib/config';
import { authenticatedFetch } from '@/lib/auth';

// Debug: Log the config when the module loads
console.log('🔍 use-dropdown-data.ts loaded');
logConfig();

interface DropdownItem {
  id: number;
  name: string;
  [key: string]: any;
}

interface UseDropdownDataOptions {
  endpoint: string;
  dataKey?: string;
  transformData?: (data: any[]) => DropdownItem[];
  useAuth?: boolean;
  fallbackData?: DropdownItem[];
}

export function useDropdownData({
  endpoint,
  dataKey = 'data',
  transformData,
  useAuth = false,
  fallbackData = []
}: UseDropdownDataOptions) {
  const [data, setData] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = getApiUrl(endpoint);
        console.log(`🔍 Fetching from endpoint: ${endpoint}`);
        console.log(`🔍 Full URL: ${url}`);
        console.log(`🔍 Using auth: ${useAuth}`);
        
        const response = useAuth 
          ? await authenticatedFetch(url, { 
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            })
          : await fetch(url, {
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            });

        if (!isMounted) return;

        if (response.ok) {
          const responseData = await response.json();
          console.log(`🔍 Response data:`, responseData);
          
          const rawData = responseData[dataKey] || responseData;
          const items = Array.isArray(rawData) ? rawData : [];
          
          if (transformData) {
            const transformedData = transformData(items);
            console.log(`🔍 Transformed data:`, transformedData);
            setData(transformedData);
          } else {
            console.log(`🔍 Raw data:`, items);
            setData(items);
          }
          
          setHasFetched(true);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error(`Error fetching dropdown data from ${endpoint}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Use fallback data if available
        if (fallbackData.length > 0) {
          setData(fallbackData);
        }
        
        setHasFetched(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, dataKey, transformData, useAuth, hasFetched]);

  return { data, loading, error };
}

// Predefined hooks for common dropdowns
export function useCategories() {
  return useDropdownData({
    endpoint: API_CONFIG.ENDPOINTS.CATEGORIES,
    transformData: (items) => items.map(item => ({
      id: item.id,
      name: item.category_name,
      description: item.description
    })),
    fallbackData: [
      { id: 1, name: 'HR', description: 'Human Resources' },
      { id: 2, name: 'IT', description: 'Information Technology' },
      { id: 3, name: 'Keuangan', description: 'Finance & Accounting' },
      { id: 4, name: 'Produksi', description: 'Production' },
      { id: 5, name: 'Umum', description: 'General' }
    ]
  });
}

export function useDivisions() {
  return useDropdownData({
    endpoint: API_CONFIG.ENDPOINTS.DIVISIONS,
    useAuth: true,
    transformData: (items) => items.map((item, index) => ({
      id: index + 1, // Generate ID since dropdown endpoint doesn't return IDs
      name: item.division_name,
      description: item.division_name // Use division_name as description for now
    })),
    fallbackData: [
      { id: 1, name: 'HR', description: 'Human Resources' },
      { id: 2, name: 'IT', description: 'Information Technology' },
      { id: 3, name: 'Keuangan', description: 'Finance & Accounting' },
      { id: 4, name: 'Produksi', description: 'Production' },
      { id: 5, name: 'Umum', description: 'General' }
    ]
  });
}

export function useCategoriesWithAuth() {
  return useDropdownData({
    endpoint: API_CONFIG.ENDPOINTS.CATEGORIES,
    useAuth: true,
    transformData: (items) => items.map(item => ({
      id: item.id,
      name: item.category_name,
      description: item.description
    })),
    fallbackData: [
      { id: 1, name: 'HR', description: 'Human Resources' },
      { id: 2, name: 'IT', description: 'Information Technology' },
      { id: 3, name: 'Keuangan', description: 'Finance & Accounting' },
      { id: 4, name: 'Produksi', description: 'Production' },
      { id: 5, name: 'Umum', description: 'General' }
    ]
  });
}

