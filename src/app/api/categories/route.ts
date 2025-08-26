import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock categories data matching the expected format
    const mockCategories = [
      {
        id: 1,
        category_name: 'HR',
        description: 'Human Resources',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        category_name: 'IT',
        description: 'Information Technology',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        category_name: 'Keuangan',
        description: 'Finance & Accounting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        category_name: 'Produksi',
        description: 'Production',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        category_name: 'Umum',
        description: 'General',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockCategories,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
