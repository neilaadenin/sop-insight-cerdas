# Fix API Error - Create Environment File

## The Problem
The application is currently trying to connect to `diff-correction-peas.com` which cannot be resolved, causing login failures.

## The Solution
I've updated the configuration file to use the correct domain, but you need to create a `.env.local` file to complete the fix.

## Steps to Fix

1. **Create a `.env.local` file** in the root directory of your project (same level as `package.json`)

2. **Add the following content** to the `.env.local` file:

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

3. **Restart your development server** (if it's running):
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## What I Fixed
- Updated `src/lib/config.ts` to use the correct domain `glasgow-favors-hazard-exercises.trycloudflare.com`
- Removed hardcoded incorrect URLs
- The configuration now properly falls back to the correct domain

## After Creating the File
The login should work properly and the "Failed to fetch" error should be resolved.

