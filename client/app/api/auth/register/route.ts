import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { username, email, password } = body;

  console.log(username, email, password);

  return NextResponse.json({
    success: true,
    message: "User registered successfully",
  });
}
