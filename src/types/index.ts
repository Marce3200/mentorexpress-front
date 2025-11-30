export interface Mentor {
  id: number;
  name: string;
  role: string;
  specialty: string;
  campus: string;
  matchScore: number;
  tags: string[];
  bio: string;
}

export interface Student {
  fullName: string;
  email: string;
  campus: "ANTONIO_VARAS" | "VINA_DEL_MAR" | "CONCEPCION";
  career: "CIVIL_ENGINEERING" | "COMPUTER_ENGINEERING" | "ELECTRICAL_ENGINEERING" | "INDUSTRIAL_ENGINEERING";
  currentYear: number;
  needs: string;
}

export type Campus = Student["campus"];
export type Career = Student["career"];

/**
 * Candidate mentor returned by the matching system
 */
export interface MentorCandidate {
  id: number;
  fullName: string;
  email: string;
  matchScore: number;
  campus: string;
  career: string;
  specialtySubject: string;
  bio?: string;
}

/**
 * Result from the help request with triage
 */
export interface HelpRequestResult {
  student: {
    id: number;
    fullName: string;
    email: string;
    campus: string;
    career: string;
    currentYear: number;
  };
  triaje: {
    tipo: 'academica' | 'emocional';
    confianza: number;
  };
  resultado:
    | {
        tipo: 'emocional';
        mensaje: string;
        accion: 'derivar_bienestar';
      }
    | {
        tipo: 'academica';
        mentores: MentorCandidate[];
        mensaje: string;
      };
}

/**
 * Result from selecting a mentor
 */
export interface SelectMentorResult {
  student: {
    id: number;
    fullName: string;
    email: string;
  };
  mentor: {
    id: number;
    fullName: string;
    email: string;
  };
  mensaje: string;
}
