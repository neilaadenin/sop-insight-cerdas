# Environment Variables Setup

This document explains how to configure API URLs using environment variables in the SOP Insight Cerdas project.

## Overview

All API URLs are now configured through environment variables instead of being hardcoded in the source code. This makes the application more flexible and easier to deploy across different environments.

## Environment File

Create a `.env.local` file in the root directory of your Next.js project with the following configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://glasgow-favors-hazard-exercises.trycloudflare.com

# API Endpoints
NEXT_PUBLIC_API_ENDPOINTS_SOPS=/api/sops
NEXT_PUBLIC_API_ENDPOINTS_CATEGORIES=/api/categories
NEXT_PUBLIC_API_ENDPOINTS_DIVISIONS=/divisions
NEXT_PUBLIC_API_ENDPOINTS_AUTH_LOGIN=/api/auth/login
NEXT_PUBLIC_API_ENDPOINTS_AUTH_REGISTER=/api/auth/register

# Fallback URLs (if needed)
NEXT_PUBLIC_API_FALLBACK_URLS=https://glasgow-favors-hazard-exercises.trycloudflare.com,https://glasgow-favors-hazard-exercises.trycloudflare.com
```

## Environment Variables Explained

### Base URL
- `NEXT_PUBLIC_API_URL`: The main API server URL

### API Endpoints
- `NEXT_PUBLIC_API_ENDPOINTS_SOPS`: Endpoint for SOP operations
- `NEXT_PUBLIC_API_ENDPOINTS_CATEGORIES`: Endpoint for category operations
- `NEXT_PUBLIC_API_ENDPOINTS_DIVISIONS`: Endpoint for division operations
- `NEXT_PUBLIC_API_ENDPOINTS_AUTH_LOGIN`: Endpoint for user login
- `NEXT_PUBLIC_API_ENDPOINTS_AUTH_REGISTER`: Endpoint for user registration

### Fallback URLs
- `NEXT_PUBLIC_API_FALLBACK_URLS`: Comma-separated list of fallback URLs if the main API fails

## Usage in Code

The environment variables are accessed through the configuration file at `src/lib/config.ts`:

```typescript
import { getApiUrl, API_CONFIG } from '@/lib/config';

// Example usage
const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SOPS));
```

## Benefits

1. **Environment Flexibility**: Easy to switch between development, staging, and production APIs
2. **Security**: API URLs are not exposed in the source code
3. **Maintainability**: Centralized configuration makes updates easier
4. **Deployment**: Different environments can use different API endpoints

## Important Notes

- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- The `.env.local` file should be added to `.gitignore` to keep sensitive URLs private
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)

## Example Service Usage

```typescript
// services/userService.ts
import { getApiUrl, API_CONFIG } from '@/lib/config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers() {
  const res = await fetch(`${getApiUrl(API_CONFIG.ENDPOINTS.SOPS)}`);
  return res.json();
}
```

## Migration from Hardcoded URLs

All hardcoded URLs have been replaced with environment variable references. The following files were updated:

- `src/lib/config.ts` - Central configuration
- `src/app/login/page.tsx` - Login API calls
- `src/app/register/page.tsx` - Registration API calls
- `src/app/dashboard/page.tsx` - Dashboard API calls
- `src/app/categories/page.tsx` - Categories API calls
- `src/app/upload/page.tsx` - Upload API calls
- `src/app/sop/[id]/page.tsx` - SOP detail API calls
- `src/app/debug-categories/page.tsx` - Debug API calls
- `src/app/test-api/page.tsx` - Test API calls
- `src/app/test-upload/page.tsx` - Test upload API calls

