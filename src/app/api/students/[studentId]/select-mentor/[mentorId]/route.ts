import { NextResponse } from "next/server";
import { config } from "@/config/env";

/**
 * Select mentor endpoint - Confirms student's mentor selection
 * Routes to NestJS backend /students/:studentId/select-mentor/:mentorId
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ studentId: string; mentorId: string }> }
) {
  try {
    const { studentId, mentorId } = await params;
    
    // Validate IDs are numbers
    if (isNaN(Number(studentId)) || isNaN(Number(mentorId))) {
      return NextResponse.json({ error: "Invalid student or mentor ID" }, { status: 400 });
    }
    
    // Forward to NestJS Backend
    const res = await fetch(`${config.backendUrl}/students/${studentId}/select-mentor/${mentorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errorData = await res.text();
        console.error("Backend Error (Select Mentor):", errorData);
        return NextResponse.json({ error: "Backend Error", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Proxy Error (Select Mentor):", error);
    return NextResponse.json({ 
        error: "Failed to select mentor",
        details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
