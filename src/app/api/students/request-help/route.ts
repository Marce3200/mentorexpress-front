import { NextResponse } from "next/server";
import { studentSchema } from "@/lib/schemas";
import { config } from "@/config/env";

/**
 * Request help endpoint - Processes student request with triage
 * Routes to NestJS backend /students/request-help
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body with Zod
    const validation = studentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
    }
    
    // Forward to NestJS Backend
    const res = await fetch(`${config.backendUrl}/students/request-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.text();
        console.error("Backend Error (Request Help):", errorData);
        return NextResponse.json({ error: "Backend Error", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Proxy Error (Request Help):", error);
    // Return error instead of mock for this critical flow
    return NextResponse.json({ 
        error: "Failed to process help request",
        details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
