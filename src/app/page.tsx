"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      <Navbar />
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      
      <main className="container mx-auto px-6 pt-20 pb-12 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Emparejamiento Potenciado por IA v2.0</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Tu Mentor Académico Perfecto <br />
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    Potenciado por IA
                </span>
             </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            Conecta con mentores que entienden tu estilo de aprendizaje. Nuestro motor de IA analiza tu perfil para encontrar el tutor perfecto.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex gap-4 mt-4"
          >
            <Button 
                asChild
                size="lg" 
                className="font-semibold bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30 text-white hover:opacity-90 transition-opacity"
            >
                <Link href="/onboarding/student">
                    <GraduationCap className="mr-2 h-4 w-4" /> Soy Estudiante
                </Link>
            </Button>
            <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="font-semibold"
            >
                <Link href="#">Soy Mentor</Link>
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
            <FeatureCard 
                icon={<GraduationCap className="w-8 h-8 text-violet-500" />}
                title="Tu Perfil"
                description="Cuéntanos tu carrera, campus y en qué asignaturas necesitas ayuda."
            />
            <FeatureCard 
                icon={<Brain className="w-8 h-8 text-fuchsia-500" />}
                title="Motor de Emparejamiento IA"
                description="Nuestro algoritmo sofisticado analiza compatibilidad basado en necesidades académicas y estilos de aprendizaje."
            />
            <FeatureCard 
                icon={<Sparkles className="w-8 h-8 text-cyan-500" />}
                title="Conexión Perfecta"
                description="Obtén recomendaciones instantáneas de mentores que han sobresalido en tus desafíos específicos."
            />
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="gap-4 p-6">
                <div className="p-3 rounded-xl bg-secondary/50 w-fit mb-4">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
