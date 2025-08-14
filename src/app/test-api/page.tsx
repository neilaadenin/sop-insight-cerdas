"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestAPIPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    sops: { success: boolean; data?: any; error?: string };
    categories: { success: boolean; data?: any; error?: string };
  }>({
    sops: { success: false },
    categories: { success: false }
  });

  const testEndpoint = async (endpoint: string, name: string) => {
    try {
      setLoading(true);
      console.log(`Testing ${name} endpoint:`, endpoint);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`${name} response:`, data);
      
      return { success: true, data };
    } catch (error) {
      console.error(`Error testing ${name}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const runTests = async () => {
    setLoading(true);
    
         const sopsResult = await testEndpoint(
       'https://jeans-wa-dos-impact.trycloudflare.com/sops',
       'SOPs'
     );
    
         const categoriesResult = await testEndpoint(
       'https://jeans-wa-dos-impact.trycloudflare.com/categories',
       'Categories'
     );

    setResults({
      sops: sopsResult,
      categories: categoriesResult
    });
    
    setLoading(false);
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">API Connectivity Test</h1>
        <p className="text-muted-foreground mb-6">
          Test the connectivity to the SOP and Categories API endpoints to diagnose fetch issues.
        </p>
        
        <Button 
          onClick={runTests} 
          disabled={loading}
          className="mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Run API Tests'
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SOPs Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(results.sops.success)}
              <span className={getStatusColor(results.sops.success)}>
                SOPs API Test
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <strong>Endpoint:</strong><br />
                                 <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                   https://jeans-wa-dos-impact.trycloudflare.com/sops
                 </code>
              </div>
              
              {results.sops.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Success!</strong> API responded with data.
                    <div className="mt-2 text-xs">
                      <strong>Response:</strong>
                      <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(results.sops.data, null, 2)}
                      </pre>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : results.sops.error ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Failed:</strong> {results.sops.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Click "Run API Tests" to test this endpoint.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(results.categories.success)}
              <span className={getStatusColor(results.categories.success)}>
                Categories API Test
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <strong>Endpoint:</strong><br />
                                 <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                   https://jeans-wa-dos-impact.trycloudflare.com/categories
                 </code>
              </div>
              
              {results.categories.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Success!</strong> API responded with data.
                    <div className="mt-2 text-xs">
                      <strong>Response:</strong>
                      <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(results.categories.data, null, 2)}
                      </pre>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : results.categories.error ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Failed:</strong> {results.categories.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Click "Run API Tests" to test this endpoint.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Troubleshooting Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Check Cloudflare Tunnel:</strong>
              <p className="text-muted-foreground ml-4">
                TryCloudflare tunnels are temporary and expire. The tunnel URL might need to be refreshed.
              </p>
            </div>
            
            <div>
              <strong>2. Network Issues:</strong>
              <p className="text-muted-foreground ml-4">
                Check if you can access the URL directly in your browser. If not, there might be network restrictions.
              </p>
            </div>
            
            <div>
              <strong>3. CORS Issues:</strong>
              <p className="text-muted-foreground ml-4">
                The server might not allow requests from your domain. Check browser console for CORS errors.
              </p>
            </div>
            
            <div>
              <strong>4. Server Status:</strong>
              <p className="text-muted-foreground ml-4">
                The backend server might be down or not responding to requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 