"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorSchema, MentorFormValues } from "@/lib/schemas";
import { registerMentor } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      campus: "ANTONIO_VARAS",
      career: "CIVIL_ENGINEERING",
      specialtySubject: "CALCULUS_I",
      language: "SPANISH",
      modality: "IN_PERSON",
      bio: "",
    },
  });

  async function onSubmit(data: MentorFormValues) {
    setIsLoading(true);
    try {
      // 1. Register Mentor
      await registerMentor(data);
      // 2. Store mentor profile in local storage
      localStorage.setItem("mentorProfile", JSON.stringify(data));
      // 3. Redirect to success page or home
      router.push("/");
    } catch (error) {
      console.error(error);
      // Even if it fails (backend down), proceed for the demo
      localStorage.setItem("mentorProfile", JSON.stringify(data));
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Únete como Mentor
            </CardTitle>
            <CardDescription>
              Comparte tu conocimiento y ayuda a estudiantes a alcanzar sus metas académicas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/80">Información Personal</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@universidad.edu" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Información Académica */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/80">Información Académica</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="campus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campus</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona campus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ANTONIO_VARAS">Antonio Varas</SelectItem>
                              <SelectItem value="VINA_DEL_MAR">Viña del Mar</SelectItem>
                              <SelectItem value="CONCEPCION">Concepción</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="career"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carrera</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona carrera" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CIVIL_ENGINEERING">Ingeniería Civil</SelectItem>
                              <SelectItem value="COMPUTER_ENGINEERING">Ingeniería en Computación</SelectItem>
                              <SelectItem value="ELECTRICAL_ENGINEERING">Ingeniería Eléctrica</SelectItem>
                              <SelectItem value="INDUSTRIAL_ENGINEERING">Ingeniería Industrial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialtySubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asignatura de Especialidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona asignatura" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CALCULUS_I">Cálculo I</SelectItem>
                            <SelectItem value="LINEAR_ALGEBRA">Álgebra Lineal</SelectItem>
                            <SelectItem value="PHYSICS">Física</SelectItem>
                            <SelectItem value="PROGRAMMING">Programación</SelectItem>
                            <SelectItem value="ELECTRONICS">Electrónica</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Modalidad y Idioma */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/80">Modalidad e Idioma</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="modality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modalidad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona modalidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IN_PERSON">Presencial</SelectItem>
                              <SelectItem value="ONLINE">Online</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona idioma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SPANISH">Español</SelectItem>
                              <SelectItem value="ENGLISH">Inglés</SelectItem>
                              <SelectItem value="SPANISH_ENGLISH">Español e Inglés</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/80">Información Adicional</h3>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografía</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntanos sobre tu experiencia, logros académicos y por qué quieres ser mentor. Ej: Soy estudiante de 4to año en Ingeniería Civil, especializado en Cálculo. He ayudado a más de 20 estudiantes..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo 20 caracteres. Esto ayuda a los estudiantes a conocerte mejor.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <Button type="submit" className="w-full font-bold text-md" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrarse como Mentor"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
