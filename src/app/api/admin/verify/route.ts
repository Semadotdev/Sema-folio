import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const valid = password === process.env.ADMIN_PASSWORD;
    return Response.json({ valid });
  } catch {
    return Response.json({ valid: false });
  }
}
