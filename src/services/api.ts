import { StudentFormValues, MentorFormValues } from "@/lib/schemas";
import { Mentor } from "@/types";

// Re-export for backward compatibility
export type { Mentor };

// MOCK DATA
const MOCK_MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Sofia Rodriguez",
    role: "Civil Engineering - Year 4",
    specialty: "Calculus I & Physics",
    campus: "ANTONIO_VARAS",
    matchScore: 0.98,
    tags: ["Spanish", "In-Person", "Calculus"],
    bio: "Top of my class in Calculus. I love helping first-year students understand the basics of derivatives and integrals.",
  },
  {
    id: 2,
    name: "Thomas Anderson",
    role: "Computer Engineering - Year 3",
    specialty: "Programming & Algorithms",
    campus: "VINA_DEL_MAR",
    matchScore: 0.85,
    tags: ["English", "Online", "Python"],
    bio: "Full Stack developer with experience in Python and JS. Can help you with your intro to programming assignments.",
  },
  {
    id: 3,
    name: "Valentina Paz",
    role: "Industrial Engineering - Year 5",
    specialty: "Linear Algebra",
    campus: "CONCEPCION",
    matchScore: 0.72,
    tags: ["Spanish", "Hybrid", "Math"],
    bio: "Patient tutor focusing on practical applications of algebra in industrial processes.",
  }
];

export async function registerStudent(data: StudentFormValues) {
    const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error("Failed to register student");
    return res.json();
}

export async function registerMentor(data: MentorFormValues) {
    const res = await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error("Failed to register mentor");
    return res.json();
}

export async function findMentors(criteria: Partial<StudentFormValues>): Promise<Mentor[]> {
    try {
        const res = await fetch("/api/matching", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(criteria),
        });

        if (!res.ok) throw new Error("Failed to fetch matches");
        
        const data = await res.json() as Record<string, unknown>[];
        if (Array.isArray(data) && data.length > 0) {
             return data.map((m: Record<string, unknown>): Mentor => ({
                id: Number(m.id),
                name: String(m.fullName || m.name || ''),
                role: String(m.role || `${m.career || 'Engineering'} - Year ${m.currentYear || '?'}`),
                specialty: String(m.specialtySubject || m.specialty || ''),
                campus: String(m.campus || ''),
                matchScore: Number(m.matchScore) || (Math.random() * 0.15 + 0.85),
                tags: [String(m.language || ''), String(m.modality || ''), String(m.specialtySubject || '')].filter(Boolean),
                bio: String(m.bio || "No bio available"),
            }));
        }
        
        return MOCK_MENTORS;
    } catch (error) {
        console.warn("API Error, using mock data", error);
        return new Promise(resolve => setTimeout(() => resolve(MOCK_MENTORS), 1500));
    }
}
