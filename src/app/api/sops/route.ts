import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock SOPs data
    const mockSOPs = [
      {
        id: 1,
        title: 'Standard Operating Procedure 1',
        description: 'This is a mock SOP for development purposes',
        category: 'General',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Standard Operating Procedure 2',
        description: 'Another mock SOP for testing',
        category: 'Safety',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockSOPs,
      message: 'SOPs retrieved successfully'
    });
  } catch (error) {
    console.error('SOPs API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

