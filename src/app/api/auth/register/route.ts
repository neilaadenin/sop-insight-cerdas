import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    // Mock registration logic
    if (email && password && name) {
      // Mock successful registration response
      return NextResponse.json({
        success: true,
        access_token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000) + 1,
          email: email,
          name: name,
          role: 'user'
        },
        message: 'Registration successful'
      });
    } else {
      // Mock failed registration response
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

