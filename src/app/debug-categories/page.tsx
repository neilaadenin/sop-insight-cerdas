'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface APICategory {
  id: number;
  category_name: string;
  description: string;
}

export default function DebugCategoriesPage() {
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const testCategoriesAPI = async () => {
    setLoading(true);
    setError(null);
    setCategories([]);
    setRawResponse(null);

    try {
      console.log('Testing categories API...');
      const response = await fetch('https://und-mention-inspiration-fast.trycloudflare.com/categories');
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      setRawResponse(data);

      // Extract categories from data property
      const categoriesArray = data.data || data;
      console.log('Extracted categories array:', categoriesArray);
      
      if (Array.isArray(categoriesArray)) {
        setCategories(categoriesArray);
        console.log('Categories set successfully:', categoriesArray);
      } else {
        console.error('Categories is not an array:', categoriesArray);
        setError('Response format tidak valid - categories bukan array');
      }

    } catch (error) {
      console.error('Error testing categories API:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Debug Categories API</h1>
        <p className="text-muted-foreground mb-6">
          Test page untuk debugging API categories
        </p>
        
        <Button 
          onClick={testCategoriesAPI} 
          disabled={loading}
          className="mb-6"
        >
          {loading ? 'Testing...' : 'Test Categories API'}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {rawResponse && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Raw API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categories Found: {categories.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{category.category_name}</h3>
                    <Badge variant="outline">ID: {category.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && categories.length === 0 && rawResponse && (
        <Card>
          <CardHeader>
            <CardTitle>No Categories Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              API responded but no categories were extracted. Check the raw response above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
