// API Configuration
export const API_CONFIG = {
  // Primary API URL - Cloudflare tunnel
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://diff-correction-peas-steal.trycloudflare.com',
  
  // Fallback URLs if primary fails
  FALLBACK_URLS: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://glasgow-favors-hazard-exercises.trycloudflare.com'
  ],
  
  // API Endpoints - Use environment variables with fallbacks
  ENDPOINTS: {
    SOPS: process.env.NEXT_PUBLIC_API_ENDPOINTS_SOPS || '/api/sops',
    CATEGORIES: process.env.NEXT_PUBLIC_API_ENDPOINTS_CATEGORIES || '/api/categories',
    DIVISIONS: process.env.NEXT_PUBLIC_API_ENDPOINTS_DIVISIONS || '/api/divisions/dropdown',
    UPLOAD: process.env.NEXT_PUBLIC_API_ENDPOINTS_SOPS || '/api/sops',
    AUTH_LOGIN: process.env.NEXT_PUBLIC_API_ENDPOINTS_AUTH_LOGIN || '/api/auth/login',
    AUTH_REGISTER: process.env.NEXT_PUBLIC_API_ENDPOINTS_AUTH_REGISTER || '/api/auth/register'
  }
};

// Debug logging function that runs when called
export const logConfig = () => {
  console.log('🔍 Current API_CONFIG:', API_CONFIG);
  console.log('🔍 Environment variables:');
  console.log('🔍 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('🔍 NEXT_PUBLIC_API_ENDPOINTS_DIVISIONS:', process.env.NEXT_PUBLIC_API_ENDPOINTS_DIVISIONS);
  console.log('🔍 DIVISIONS endpoint being used:', API_CONFIG.ENDPOINTS.DIVISIONS);
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log(`🔍 getApiUrl called with endpoint: ${endpoint}`);
  console.log(`🔍 BASE_URL: ${API_CONFIG.BASE_URL}`);
  console.log(`🔍 Generated full URL: ${fullUrl}`);
  return fullUrl;
};

// Helper function to get fallback URLs
export const getFallbackUrls = (endpoint: string): string[] => {
  return API_CONFIG.FALLBACK_URLS.map(baseUrl => `${baseUrl}${endpoint}`);
};
