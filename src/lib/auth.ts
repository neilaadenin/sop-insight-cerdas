// JWT Token Management
export const getJWTToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

export const setJWTToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

export const removeJWTToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  }
};

export const isAuthenticated = (): boolean => {
  const token = getJWTToken();
  return token !== null && token.length > 0;
};

// Authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getJWTToken();
  
  if (!token) {
    throw new Error('No JWT token found. Please login first.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401) {
    removeJWTToken();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication failed. Please login again.');
  }

  return response;
};

// Get user info
export const getUserInfo = () => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};

// Logout function
export const logout = () => {
  removeJWTToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};


