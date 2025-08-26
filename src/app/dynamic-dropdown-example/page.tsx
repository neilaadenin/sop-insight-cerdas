'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCategories, useDivisions, useDropdownData } from '@/hooks/use-dropdown-data';
import { DynamicDropdown } from '@/components/ui/dynamic-dropdown';
import { getApiUrl, API_CONFIG } from '@/lib/config';

export default function DynamicDropdownExamplePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Use predefined hooks for common dropdowns
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: divisions, loading: divisionsLoading, error: divisionsError } = useDivisions();

  // Use custom hook for custom dropdown data
  const { data: statuses, loading: statusesLoading, error: statusesError } = useDropdownData({
    endpoint: '/api/statuses', // Example endpoint
    transformData: (items) => items.map(item => ({
      id: item.id,
      name: item.status_name,
      color: item.color
    })),
    fallbackData: [
      { id: 1, name: 'Draft', color: 'gray' },
      { id: 2, name: 'Pending Review', color: 'yellow' },
      { id: 3, name: 'Approved', color: 'green' },
      { id: 4, name: 'Rejected', color: 'red' }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dynamic Dropdown Examples
          </h1>
          <p className="text-lg text-gray-600">
            Demonstrating how to create dynamic dropdowns based on database data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Dynamic Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Basic</Badge>
                Categories Dropdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Category</Label>
                <DynamicDropdown
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  placeholder="Choose a category"
                  items={categories}
                  loading={categoriesLoading}
                  error={categoriesError}
                  showAllOption={true}
                  allOptionLabel="All Categories"
                />
              </div>
              
              {selectedCategory && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Selected:</strong> {selectedCategory}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Division Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Basic</Badge>
                Divisions Dropdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Division</Label>
                <DynamicDropdown
                  value={selectedDivision}
                  onValueChange={setSelectedDivision}
                  placeholder="Choose a division"
                  items={divisions}
                  loading={divisionsLoading}
                  error={divisionsError}
                  showAllOption={true}
                  allOptionLabel="All Divisions"
                />
              </div>
              
              {selectedDivision && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Selected:</strong> {selectedDivision}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Dropdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Custom</Badge>
                Status Dropdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Status</Label>
                <DynamicDropdown
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  placeholder="Choose a status"
                  items={statuses}
                  loading={statusesLoading}
                  error={statusesError}
                />
              </div>
              
              {selectedStatus && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Selected:</strong> {selectedStatus}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Code</Badge>
                Implementation Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Create Hook</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// hooks/use-dropdown-data.ts
export function useCategories() {
  return useDropdownData({
    endpoint: API_CONFIG.ENDPOINTS.CATEGORIES,
    transformData: (items) => items.map(item => ({
      id: item.id,
      name: item.category_name,
      description: item.description
    })),
    fallbackData: [
      { id: 1, name: 'HR', description: 'Human Resources' },
      { id: 2, name: 'IT', description: 'Information Technology' }
    ]
  });
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Use in Component</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Component
const { data: categories, loading, error } = useCategories();

<DynamicDropdown
  value={selectedCategory}
  onValueChange={setSelectedCategory}
  placeholder="Choose category"
  items={categories}
  loading={loading}
  error={error}
  showAllOption={true}
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backend Requirements */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Backend API Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">API Endpoints Needed:</h4>
                <ul className="space-y-2 text-sm">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/categories</code> - Returns list of categories</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/divisions</code> - Returns list of divisions</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/statuses</code> - Returns list of statuses</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Expected Response Format:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`{
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
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

