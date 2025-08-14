import { API_CONFIG, getApiUrl, getFallbackUrls } from './config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Enhanced fetch with retry and fallback
export async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const urls = [getApiUrl(endpoint), ...getFallbackUrls(endpoint)];
  
  for (const url of urls) {
    try {
      console.log(`Trying API call to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Success from: ${url}`);
        return { success: true, data };
      } else {
        console.warn(`HTTP error from ${url}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Network error from ${url}:`, error);
    }
  }
  
  return {
    success: false,
    error: 'All API endpoints failed. Please check your connection or try again later.'
  };
}

// Specific API functions
export const api = {
  // Fetch SOPs
  async getSOPs(): Promise<ApiResponse<any[]>> {
    return fetchWithFallback(API_CONFIG.ENDPOINTS.SOPS);
  },

  // Fetch Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    return fetchWithFallback(API_CONFIG.ENDPOINTS.CATEGORIES);
  },

  // Fetch Divisions
  async getDivisions(): Promise<ApiResponse<any[]>> {
    return fetchWithFallback(API_CONFIG.ENDPOINTS.DIVISIONS);
  },

  // Upload SOP
  async uploadSOP(formData: FormData): Promise<ApiResponse<any>> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD);
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorText = await response.text();
        return { success: false, error: `Upload failed: ${response.status} - ${errorText}` };
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },

  // Get single SOP by ID
  async getSOPById(id: string): Promise<ApiResponse<any>> {
    return fetchWithFallback(`${API_CONFIG.ENDPOINTS.SOPS}/${id}`);
  }
};
