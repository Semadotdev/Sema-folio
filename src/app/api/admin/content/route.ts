import { get } from "@vercel/edge-config";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const data = await get("portfolio");
    return Response.json(data || {});
  } catch {
    return Response.json({});
  }
}

export async function PUT(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: [{ key: "portfolio", value: body }] }),
      }
    );
    return Response.json({ ok: true });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
