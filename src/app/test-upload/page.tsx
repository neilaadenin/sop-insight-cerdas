'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getApiUrl, API_CONFIG } from '@/lib/config';

export default function TestUploadPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      data
    }]);
  };

  const testSimpleUpload = async () => {
    setLoading(true);
    addResult('Testing simple upload with minimal data...');

    try {
      // Test 1: Simple text data
      const simpleData = new FormData();
      simpleData.append('title', 'Test SOP');
      simpleData.append('description', 'Test description');
      simpleData.append('category_name', 'IT');
      simpleData.append('division_name', 'Technology');

      addResult('Sending simple data...', {
        title: 'Test SOP',
        description: 'Test description',
        category_name: 'IT',
        division_name: 'Technology'
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SOPS), {
        method: 'POST',
        body: simpleData
      });

      addResult(`Response status: ${response.status}`);
      addResult(`Response headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        addResult('Success! Response:', result);
      } else {
        let errorText = '';
        try {
          const errorData = await response.text();
          errorText = errorData;
        } catch (e) {
          errorText = 'Could not read error response';
        }
        addResult(`Error ${response.status}:`, errorText);
      }
    } catch (error) {
      addResult('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testWithFile = async () => {
    setLoading(true);
    addResult('Testing upload with file...');

    try {
      // Create a simple text file
      const fileContent = 'This is a test SOP document content.';
      const file = new File([fileContent], 'test-sop.txt', { type: 'text/plain' });

      const formData = new FormData();
      formData.append('title', 'Test SOP with File');
      formData.append('description', 'Test description with file');
      formData.append('category_name', 'IT');
      formData.append('division_name', 'Technology');
      formData.append('file', file);

      addResult('Sending data with file...', {
        title: 'Test SOP with File',
        description: 'Test description with file',
        category_name: 'IT',
        division_name: 'Technology',
        fileName: file.name,
        fileSize: file.size
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SOPS), {
        method: 'POST',
        body: formData
      });

      addResult(`Response status: ${response.status}`);
      addResult(`Response headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        addResult('Success! Response:', result);
      } else {
        let errorText = '';
        try {
          const errorData = await response.text();
          errorText = errorData;
        } catch (e) {
          errorText = 'Could not read error response';
        }
        addResult(`Error ${response.status}:`, errorText);
      }
    } catch (error) {
      addResult('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAPIEndpoint = async () => {
    setLoading(true);
    addResult('Testing API endpoint availability...');

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SOPS), {
        method: 'GET'
      });

      addResult(`GET response status: ${response.status}`);
      addResult(`GET response headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        addResult('GET success:', result);
      } else {
        addResult(`GET error ${response.status}`);
      }
    } catch (error) {
      addResult('GET network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Upload API</h1>
        <p className="text-gray-600">Debug upload API issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testAPIEndpoint} 
              disabled={loading}
              className="w-full"
            >
              Test API Endpoint (GET)
            </Button>
            
            <Button 
              onClick={testSimpleUpload} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Simple Upload (No File)
            </Button>
            
            <Button 
              onClick={testWithFile} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Test Upload with File
            </Button>

            <Button 
              onClick={clearResults} 
              variant="destructive"
              className="w-full"
            >
              Clear Results
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center">No test results yet. Run a test to see results.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {result.timestamp}
                    </div>
                    <div className="font-medium">{result.message}</div>
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
