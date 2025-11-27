import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campus, subject } = body;

    // Construct query parameters for NestJS backend
    // Endpoint: GET /mentors/match?campus=...&subject=...
    // Note: We are mapping the form data to the backend expected query params
    const queryParams = new URLSearchParams();
    if (campus) queryParams.append("campus", campus);
    if (subject) queryParams.append("subject", subject);
    // Add other params if supported by backend

    const nestBackendUrl = process.env.NEST_BACKEND_URL || "http://localhost:3000";
    const targetUrl = `${nestBackendUrl}/mentors/match?${queryParams.toString()}`;

    console.log(`Proxying request to: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      method: "GET", // The NestJS controller defines @Get('match')
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Backend error: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
