'use client'

import React from 'react';

export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Test CSS & Tailwind
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Basic Colors */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Colors</h2>
            <div className="space-y-3">
              <div className="h-8 bg-blue-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-red-500 rounded"></div>
              <div className="h-8 bg-yellow-500 rounded"></div>
            </div>
          </div>

          {/* Card 2 - Typography */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Typography</h2>
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Extra Small Text</p>
              <p className="text-sm text-gray-700">Small Text</p>
              <p className="text-base text-gray-800">Base Text</p>
              <p className="text-lg text-gray-900">Large Text</p>
              <p className="text-xl font-semibold text-blue-600">Bold Blue Text</p>
            </div>
          </div>

          {/* Card 3 - Spacing & Layout */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Spacing & Layout</h2>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-purple-400 rounded"></div>
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Card 4 - Interactive Elements */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Elements</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
                Hover Me
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
                Another Button
              </button>
            </div>
          </div>

          {/* Card 5 - Responsive Design */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Responsive Design</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="block md:hidden">Mobile View</span>
                <span className="hidden md:block lg:hidden">Tablet View</span>
                <span className="hidden lg:block">Desktop View</span>
              </div>
              <div className="h-4 bg-gradient-to-r from-pink-400 to-orange-400 rounded"></div>
            </div>
          </div>

          {/* Card 6 - Animations */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Animations</h2>
            <div className="space-y-3">
              <div className="w-8 h-8 bg-red-400 rounded-full animate-bounce mx-auto"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full animate-pulse mx-auto"></div>
              <div className="w-8 h-8 bg-green-400 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Tailwind CSS is working correctly!
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Page loaded at: {new Date().toLocaleString()}</p>
            <p>• Tailwind classes should be visible above</p>
            <p>• If you see unstyled elements, CSS is not loading</p>
            <p>• Check browser console for any errors</p>
          </div>
        </div>
      </div>
    </div>
  );
} 