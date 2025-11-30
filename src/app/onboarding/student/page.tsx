"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormValues } from "@/lib/schemas";
import { requestHelp } from "@/services/api";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Brain, CheckCircle2, GraduationCap, MapPin, Briefcase, Award, ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { HelpRequestResult, MentorCandidate } from "@/types";
import { translateCampus, translateCareer, translateSubject } from "@/lib/translations";

// Calendly URL from environment variable with fallback
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/tu-usuario/sesion-de-mentoria-mentorexpress";

// Declare Calendly global type
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: {
          name?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
      }) => void;
    };
  }
}

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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

// View states for the page
type ViewState = "form" | "loading" | "results" | "scheduling";

interface SchedulingData {
  student: { id: number; fullName: string; email: string };
  mentor: { id: number; fullName: string; email: string };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<HelpRequestResult | null>(null);
  const [mentors, setMentors] = useState<MentorCandidate[]>([]);
  const [schedulingData, setSchedulingData] = useState<SchedulingData | null>(null);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      campus: "ANTONIO_VARAS",
      career: "CIVIL_ENGINEERING",
      subject: "CALCULUS_I",
      currentYear: 1,
      language: "SPANISH",
      modality: "IN_PERSON",
      request: "",
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    setErrorMessage("");
    setViewState("loading");
    
    try {
        // 1. Request help with triage
        const helpResult = await requestHelp(data);
        
        // 2. Store result in session storage (for calendar page)
        sessionStorage.setItem("helpRequestResult", JSON.stringify(helpResult));
        
        // 3. Route based on triage result
        if (helpResult.resultado.tipo === "emocional") {
            // Emotional support needed - redirect to welfare page
            router.push("/resultado/emocional");
        } else {
            // Academic help - show mentor results in same page
            setResult(helpResult);
            setMentors(helpResult.resultado.mentores || []);
            setViewState("results");
        }
    } catch (error) {
        console.error("Error requesting help:", error);
        setErrorMessage("Hubo un error al procesar tu solicitud. Verifica que el servidor esté activo e intenta de nuevo.");
        setViewState("form");
    } finally {
        setIsLoading(false);
    }
  }

  const handleSelectMentor = (mentor: MentorCandidate) => {
    if (!result) return;
    
    // Store scheduling data
    const data: SchedulingData = {
      student: {
        id: result.student.id,
        fullName: result.student.fullName,
        email: result.student.email,
      },
      mentor: {
        id: mentor.id,
        fullName: mentor.fullName,
        email: mentor.email,
      },
    };
    
    setSchedulingData(data);
    setViewState("scheduling");
  };

  const handleBackToForm = () => {
    setViewState("form");
    setResult(null);
    setMentors([]);
    setSchedulingData(null);
    setCalendlyLoaded(false);
  };

  const handleBackToResults = () => {
    setViewState("results");
    setSchedulingData(null);
    setCalendlyLoaded(false);
  };

  // Load Calendly script when entering scheduling state
  useEffect(() => {
    if (viewState !== "scheduling") return;

    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    
    if (existingScript) {
      if (window.Calendly) {
        setCalendlyLoaded(true);
      } else {
        existingScript.addEventListener("load", () => setCalendlyLoaded(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.head.appendChild(script);
  }, [viewState]);

  // Initialize Calendly widget
  useEffect(() => {
    if (!calendlyLoaded || !schedulingData || !calendlyContainerRef.current || viewState !== "scheduling") return;

    calendlyContainerRef.current.innerHTML = "";

    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: `${CALENDLY_URL}?hide_gdpr_banner=1`,
        parentElement: calendlyContainerRef.current,
        prefill: {
          name: schedulingData.student.fullName,
          email: schedulingData.student.email,
        },
      });
    }
  }, [calendlyLoaded, schedulingData, viewState]);

  // Loading state
  if (viewState === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <Brain className="w-24 h-24 text-primary animate-bounce relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Analizando tu Perfil...</h2>
              <p className="text-muted-foreground">Buscando los mejores mentores para ti...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results state - show mentors
  if (viewState === "results" && result) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Análisis Completado</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Tus Mentores Recomendados</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {result.resultado.tipo === "academica" && result.resultado.mensaje 
                  ? result.resultado.mensaje 
                  : "Encontramos estos mentores basados en tu perfil y necesidades académicas."}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{mentor.fullName}</CardTitle>
                            <CardDescription className="text-sm">{mentor.email}</CardDescription>
                          </div>
                        </div>
                        <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                          <span className="text-xs font-bold text-green-600">Match</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{translateCampus(mentor.campus)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span>{translateSubject(mentor.specialtySubject)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{translateCareer(mentor.career)}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleSelectMentor(mentor)}
                      >
                        Agendar Sesión
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button variant="outline" onClick={handleBackToForm} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al Formulario
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Scheduling state - show Calendly
  if (viewState === "scheduling" && schedulingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToResults}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Mentores
              </Button>
            </div>

            {/* Title Section */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Agendar Sesión</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Agenda tu Sesión de Mentoría</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Selecciona el día y horario que mejor te convenga. Tanto tú como tu mentor recibirán un correo de confirmación.
              </p>
            </div>

            {/* Match Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Student Card */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Estudiante</CardTitle>
                      <CardDescription className="text-sm">{schedulingData.student.fullName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Mentor Card */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Mentor</CardTitle>
                      <CardDescription className="text-sm">{schedulingData.mentor.fullName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Calendly Embed */}
            <Card className="border-border/50 bg-card/50 overflow-hidden">
              <CardContent className="p-0">
                <div
                  ref={calendlyContainerRef}
                  style={{ minWidth: "320px", height: "700px" }}
                >
                  {!calendlyLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                        <p className="text-muted-foreground">Cargando calendario...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="max-w-2xl mx-auto">
              <Card className="border-border/50 bg-accent/5">
                <CardContent className="p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ¿Qué sucede después de agendar?
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">1.</span>
                      <span>Recibirás un correo de confirmación con los detalles de la sesión</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">2.</span>
                      <span>Tu mentor también recibirá una notificación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">3.</span>
                      <span>Recibirás recordatorios antes de la sesión</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Info about email notifications */}
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Una vez que agendes en el calendario, Calendly enviará automáticamente
                los correos de confirmación a ti y a tu mentor.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Default: Form state
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                    Crea tu Perfil
                </CardTitle>
                <CardDescription>
                    Cuéntale a nuestra IA quién eres para encontrar tu mentor perfecto.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        <Input placeholder="juan@universidad.edu" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
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
                                name="currentYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semestre</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} max={6} {...field} onChange={e => field.onChange(Number(e.target.value))} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asignatura</FormLabel>
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

                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <FormField
                            control={form.control}
                            name="request"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿En qué necesitas ayuda?</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Ej: Necesito ayuda con Cálculo II, especialmente con integrales y derivadas. Prefiero alguien que explique de forma clara..."
                                            className="min-h-[100px]"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Nuestra IA analiza este texto para emparejarte con mentores especializados en estos temas.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Error Message */}
                        {errorMessage && (
                          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{errorMessage}</span>
                          </div>
                        )}

                        <Button type="submit" className="w-full font-bold text-md" disabled={isLoading}>
                            {isLoading ? "Buscando mentores..." : "Encontrar mi Mentor"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
