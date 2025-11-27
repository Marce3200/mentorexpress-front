"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MentorCard } from "@/components/MentorCard";
import { findMentors, Mentor } from "@/services/api";
import { motion } from "framer-motion";
import { StudentFormValues } from "@/lib/schemas";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, CheckCircle2 } from "lucide-react";

export default function MatchingPage() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const profileData = localStorage.getItem("studentProfile");
        const criteria: Partial<StudentFormValues> = profileData ? JSON.parse(profileData) : {};
        
        // Add artificial delay for UX if needed, but API mock already has it
        const data = await findMentors(criteria);
        setMentors(data);
        setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Brain className="w-24 h-24 text-primary animate-bounce relative z-10" />
             </div>
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Analizando tu Perfil...</h2>
                <p className="text-muted-foreground">Buscando compatibilidad con nuestra base de mentores...</p>
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
                    Encontramos estos mentores basados en tu necesidad de ayuda con 
                    <span className="text-primary font-semibold"> asignaturas específicas</span> y tu estilo de aprendizaje.
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
                        <MentorCard mentor={mentor} />
                    </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
