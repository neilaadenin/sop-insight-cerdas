// API Configuration
export const API_CONFIG = {
  // Primary API URL - can be overridden by environment variable
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://glasgow-favors-hazard-exercises.trycloudflare.com',
  
  // Fallback URLs if primary fails
  FALLBACK_URLS: [
    'https://glasgow-favors-hazard-exercises.trycloudflare.com',
    'https://glasgow-favors-hazard-exercises.trycloudflare.com'
  ],
  
  // API Endpoints
  ENDPOINTS: {
    SOPS: '/sops',
    CATEGORIES: '/categories',
    DIVISIONS: '/divisions',
    UPLOAD: '/sops'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get fallback URLs
export const getFallbackUrls = (endpoint: string): string[] => {
  return API_CONFIG.FALLBACK_URLS.map(baseUrl => `${baseUrl}${endpoint}`);
};
