"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { selectMentor } from "@/services/api";
import { motion } from "framer-motion";
import { HelpRequestResult, MentorCandidate } from "@/types";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, CheckCircle2, GraduationCap, MapPin, Briefcase, Award } from "lucide-react";

function getInitialState(): { result: HelpRequestResult | null; mentors: MentorCandidate[] } {
  if (typeof window === "undefined") {
    return { result: null, mentors: [] };
  }
  
  const storedResult = sessionStorage.getItem("helpRequestResult");
  if (!storedResult) {
    return { result: null, mentors: [] };
  }
  
  try {
    const parsedResult = JSON.parse(storedResult) as HelpRequestResult;
    if (parsedResult.resultado.tipo === "academica") {
      return { result: parsedResult, mentors: parsedResult.resultado.mentores };
    }
  } catch (error) {
    console.error("Failed to parse helpRequestResult:", error);
  }
  
  return { result: null, mentors: [] };
}

export default function MatchingPage() {
  const router = useRouter();
  const { result: initialResult, mentors: initialMentors } = getInitialState();
  const [result] = useState<HelpRequestResult | null>(initialResult);
  const [mentors] = useState<MentorCandidate[]>(initialMentors);
  const [selecting, setSelecting] = useState<number | null>(null);

  useEffect(() => {
    // Verify result and redirect if needed
    if (!result) {
      router.push("/");
      return;
    }
    
    if (result.resultado.tipo !== "academica") {
      router.push("/resultado/emocional");
    }
  }, [result, router]);

  const handleSelectMentor = async (mentorId: number) => {
    if (!result) return;
    
    setSelecting(mentorId);
    try {
      const selectResult = await selectMentor(result.student.id, mentorId);
      // Store success result
      sessionStorage.setItem("selectMentorResult", JSON.stringify(selectResult));
      // Redirect to success page
      await router.push("/resultado/exito");
    } catch (error) {
      console.error("Error selecting mentor:", error);
      alert("Hubo un error al seleccionar el mentor. Por favor intenta de nuevo.");
      setSelecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-12">
        {!result ? (
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
        ) : (
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
                    {result?.resultado.tipo === "academica" ? result.resultado.mensaje : 
                    "Encontramos estos mentores basados en tu perfil y necesidades académicas."}
                </p>
                <p className="text-sm text-muted-foreground">
                    Confianza de la IA: {result ? Math.round(result.triaje.confianza * 100) : 0}%
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
                                <span className="text-xs font-bold text-green-600">{Math.round(mentor.matchScore * 100)}% Match</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{mentor.campus}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Award className="w-4 h-4" />
                              <span>{mentor.specialtySubject}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="w-4 h-4" />
                              <span>{mentor.career}</span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="w-full" 
                              onClick={() => handleSelectMentor(mentor.id)}
                              disabled={selecting !== null}
                            >
                              {selecting === mentor.id ? "Seleccionando..." : "Seleccionar Mentor"}
                            </Button>
                          </CardFooter>
                        </Card>
                    </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
