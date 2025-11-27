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
