import { z } from "zod";

export const campusEnum = z.enum(["ANTONIO_VARAS", "VINA_DEL_MAR", "CONCEPCION"]);
export const careerEnum = z.enum([
  "CIVIL_ENGINEERING",
  "COMPUTER_ENGINEERING",
  "ELECTRICAL_ENGINEERING",
  "INDUSTRIAL_ENGINEERING",
]);
export const subjectEnum = z.enum([
  "CALCULUS_I",
  "LINEAR_ALGEBRA",
  "PHYSICS",
  "PROGRAMMING",
  "ELECTRONICS",
]);
export const languageEnum = z.enum([
  "SPANISH",
  "ENGLISH",
  "SPANISH_ENGLISH",
]);
export const modalityEnum = z.enum([
  "IN_PERSON",
  "ONLINE",
]);

export const studentSchema = z.object({
  fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor ingresa un correo válido" }),
  campus: campusEnum,
  career: careerEnum,
  currentYear: z.number().min(1, { message: "El año debe ser válido" }).max(6, { message: "El año debe ser válido" }),
  needs: z.string().min(10, { message: "Por favor proporciona más detalles sobre lo que necesitas para un mejor emparejamiento" }),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export const mentorSchema = z.object({
  fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Por favor ingresa un correo válido" }),
  campus: campusEnum,
  career: careerEnum,
  specialtySubject: subjectEnum,
  language: languageEnum,
  modality: modalityEnum,
  bio: z.string().min(20, { message: "La biografía debe tener al menos 20 caracteres" }),
  availability: z.string().min(10, { message: "Por favor describe tu disponibilidad horaria" }),
});

export type MentorFormValues = z.infer<typeof mentorSchema>;

export const matchingParamsSchema = z.object({
  campus: campusEnum.optional(),
  subject: z.string().optional(),
  needs: z.string().optional(),
});
