"use client"

import React from 'react';

const TestCSSPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
          Test CSS Page
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Basic Tailwind Test
          </h2>
          <p className="text-gray-600 mb-4">
            Jika Anda melihat styling ini, berarti Tailwind CSS sudah berfungsi.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Test Button
          </button>
        </div>
        
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Status CSS:
          </h3>
          <p className="text-red-700">
            Jika halaman ini terlihat berwarna dan memiliki styling, 
            berarti Tailwind CSS berfungsi. Jika tidak, ada masalah dengan CSS loading.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestCSSPage; 