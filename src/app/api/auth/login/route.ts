import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // Mock authentication logic
    if (email === 'test@example.com' && password === 'password') {
      // Mock successful login response
      return NextResponse.json({
        success: true,
        access_token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          email: email,
          name: 'Test User',
          role: 'user'
        },
        message: 'Login successful'
      });
    } else {
      // Mock failed login response
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

