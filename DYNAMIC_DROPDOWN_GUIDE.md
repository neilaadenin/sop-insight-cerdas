# Dynamic Dropdown Implementation Guide

This guide explains how to implement dynamic filter/dropdown inputs based on database data in the SOP Insight Cerdas project.

## Overview

Dynamic dropdowns fetch data from the backend API and render it as selectable options in the UI. This approach ensures that dropdown options are always up-to-date with the database and eliminates the need for hardcoded options.

## Architecture

### 1. Backend API Endpoints
The backend must provide endpoints that return data for dropdowns:

```typescript
// Example API endpoints
GET /api/categories     // Returns list of categories
GET /api/divisions      // Returns list of divisions  
GET /api/statuses       // Returns list of statuses
```

### 2. Frontend Implementation
- **Custom Hooks**: Fetch and manage dropdown data
- **Reusable Components**: Render dropdowns with loading/error states
- **Type Safety**: TypeScript interfaces for data structures

## Implementation

### Step 1: Create Custom Hook

```typescript
// src/hooks/use-dropdown-data.ts
import { useState, useEffect } from 'react';
import { getApiUrl, API_CONFIG } from '@/lib/config';

interface DropdownItem {
  id: number;
  name: string;
  [key: string]: any;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = getApiUrl(endpoint);
        const response = useAuth 
          ? await authenticatedFetch(url, { method: 'GET' })
          : await fetch(url);

        if (response.ok) {
          const responseData = await response.json();
          const rawData = responseData[dataKey] || responseData;
          const items = Array.isArray(rawData) ? rawData : [];
          
          if (transformData) {
            setData(transformData(items));
          } else {
            setData(items);
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Error fetching dropdown data from ${endpoint}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Use fallback data if available
        if (fallbackData.length > 0) {
          setData(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, dataKey, transformData, useAuth, fallbackData]);

  return { data, loading, error };
}
```

### Step 2: Create Reusable Dropdown Component

```typescript
// src/components/ui/dynamic-dropdown.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface DynamicDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: DropdownItem[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function DynamicDropdown({
  value,
  onValueChange,
  placeholder,
  items,
  loading = false,
  error = null,
  disabled = false,
  className = '',
  showAllOption = false,
  allOptionLabel = 'Semua'
}: DynamicDropdownProps) {
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem value="all">
            {allOptionLabel}
          </SelectItem>
        )}
        {items.map((item) => (
          <SelectItem key={item.id} value={item.name}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Step 3: Use in Components

```typescript
// Example usage in a component
import { useCategories, useDivisions } from '@/hooks/use-dropdown-data';
import { DynamicDropdown } from '@/components/ui/dynamic-dropdown';

export default function MyComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');

  // Use predefined hooks
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: divisions, loading: divisionsLoading, error: divisionsError } = useDivisions();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <DynamicDropdown
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          placeholder="Choose category"
          items={categories}
          loading={categoriesLoading}
          error={categoriesError}
          showAllOption={true}
          allOptionLabel="All Categories"
        />
      </div>

      <div className="space-y-2">
        <Label>Division</Label>
        <DynamicDropdown
          value={selectedDivision}
          onValueChange={setSelectedDivision}
          placeholder="Choose division"
          items={divisions}
          loading={divisionsLoading}
          error={divisionsError}
          showAllOption={true}
          allOptionLabel="All Divisions"
        />
      </div>
    </div>
  );
}
```

## Predefined Hooks

The system includes predefined hooks for common dropdowns:

### useCategories()
```typescript
const { data: categories, loading, error } = useCategories();
```

### useDivisions()
```typescript
const { data: divisions, loading, error } = useDivisions();
```

### useCategoriesWithAuth()
```typescript
const { data: categories, loading, error } = useCategoriesWithAuth();
```

## Backend API Requirements

### Response Format
All dropdown endpoints should return data in this format:

```json
{
  "data": [
    {
      "id": 1,
      "category_name": "HR",
      "description": "Human Resources"
    },
    {
      "id": 2,
      "category_name": "IT",
      "description": "Information Technology"
    }
  ]
}
```

### Required Endpoints
- `GET /api/categories` - Returns categories
- `GET /api/divisions` - Returns divisions
- `GET /api/statuses` - Returns statuses (optional)

### Error Handling
- Return appropriate HTTP status codes
- Include error messages in response body
- Handle authentication for protected endpoints

## Features

### 1. Loading States
Dropdowns show loading indicators while fetching data:

```typescript
<DynamicDropdown
  loading={true}
  // ... other props
/>
```

### 2. Error Handling
Display error messages when API calls fail:

```typescript
<DynamicDropdown
  error="Failed to load categories"
  // ... other props
/>
```

### 3. Fallback Data
Provide fallback options when API is unavailable:

```typescript
const { data: categories } = useDropdownData({
  endpoint: '/api/categories',
  fallbackData: [
    { id: 1, name: 'HR' },
    { id: 2, name: 'IT' }
  ]
});
```

### 4. Authentication Support
Use authenticated requests when needed:

```typescript
const { data: categories } = useDropdownData({
  endpoint: '/api/categories',
  useAuth: true
});
```

### 5. Data Transformation
Transform API response to match component needs:

```typescript
const { data: categories } = useDropdownData({
  endpoint: '/api/categories',
  transformData: (items) => items.map(item => ({
    id: item.id,
    name: item.category_name,
    description: item.description
  }))
});
```

## Migration from Static Dropdowns

### Before (Static)
```typescript
<Select>
  <SelectContent>
    <SelectItem value="hr">HR</SelectItem>
    <SelectItem value="it">IT</SelectItem>
    <SelectItem value="finance">Finance</SelectItem>
  </SelectContent>
</Select>
```

### After (Dynamic)
```typescript
const { data: divisions } = useDivisions();

<DynamicDropdown
  value={selectedDivision}
  onValueChange={setSelectedDivision}
  placeholder="Choose division"
  items={divisions}
  loading={loading}
  error={error}
/>
```

## Benefits

1. **Real-time Data**: Dropdowns always reflect current database state
2. **Maintainability**: No need to update hardcoded options
3. **Consistency**: Same data across all components
4. **Error Handling**: Graceful fallbacks when API fails
5. **Type Safety**: TypeScript interfaces ensure data consistency
6. **Reusability**: Components can be used anywhere in the app

## Example Implementation

See `/dynamic-dropdown-example` page for a complete working example of dynamic dropdowns in action.

## Best Practices

1. **Always provide fallback data** for critical dropdowns
2. **Use loading states** to improve user experience
3. **Handle errors gracefully** with user-friendly messages
4. **Cache data** when appropriate to reduce API calls
5. **Use TypeScript** for type safety and better development experience
6. **Test with different API states** (loading, error, success)

