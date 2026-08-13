import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Call backend login endpoint to get token
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Login failed",
        },
        { status: response.status }
      );
    }

    // Create response with token and user data
    const loginResponse = NextResponse.json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: data.user,
    });

    // Set token in HTTP-only cookie (optional, more secure)
    // loginResponse.cookies.set("authToken", data.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60, // 7 days
    // });

    return loginResponse;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
