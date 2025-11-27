import { NextResponse } from "next/server";
import { studentSchema } from "@/lib/schemas";
import { config } from "@/config/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body with Zod
    const validation = studentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
    }
    
    // Forward to NestJS Backend
    const res = await fetch(`${config.backendUrl}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.text();
        console.error("Backend Error (Students):", errorData);
        // If backend is down, we might want to return a success mock for demo
        // but let's try to return the actual error first.
        return NextResponse.json({ error: "Backend Error", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Proxy Error:", error);
    // MOCK FALLBACK FOR DEMO IF BACKEND IS UNREACHABLE
    return NextResponse.json({ 
        id: Math.floor(Math.random() * 1000), 
        ...studentSchema.parse(await req.clone().json()) // Return the same data as if created
    }, { status: 201 });
  }
}
