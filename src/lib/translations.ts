// Translation maps for enum values to Spanish display text

export const campusTranslations: Record<string, string> = {
  ANTONIO_VARAS: "Antonio Varas",
  VINA_DEL_MAR: "Viña del Mar",
  CONCEPCION: "Concepción",
};

export const careerTranslations: Record<string, string> = {
  CIVIL_ENGINEERING: "Ingeniería Civil",
  COMPUTER_ENGINEERING: "Ingeniería en Computación",
  ELECTRICAL_ENGINEERING: "Ingeniería Eléctrica",
  INDUSTRIAL_ENGINEERING: "Ingeniería Industrial",
};

export const subjectTranslations: Record<string, string> = {
  CALCULUS_I: "Cálculo I",
  LINEAR_ALGEBRA: "Álgebra Lineal",
  PHYSICS: "Física",
  PROGRAMMING: "Programación",
  ELECTRONICS: "Electrónica",
};

export const languageTranslations: Record<string, string> = {
  SPANISH: "Español",
  ENGLISH: "Inglés",
  SPANISH_ENGLISH: "Español e Inglés",
};

export const modalityTranslations: Record<string, string> = {
  IN_PERSON: "Presencial",
  ONLINE: "Online",
};

// Helper functions
export function translateCampus(value: string): string {
  return campusTranslations[value] || value;
}

export function translateCareer(value: string): string {
  return careerTranslations[value] || value;
}

export function translateSubject(value: string): string {
  return subjectTranslations[value] || value;
}

export function translateLanguage(value: string): string {
  return languageTranslations[value] || value;
}

export function translateModality(value: string): string {
  return modalityTranslations[value] || value;
}
