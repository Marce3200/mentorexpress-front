"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Mail, Phone } from "lucide-react";
import { HelpRequestResult } from "@/types";
import { motion } from "framer-motion";

function getInitialEmotionalResult(): HelpRequestResult | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  const storedResult = sessionStorage.getItem("helpRequestResult");
  if (!storedResult) {
    return null;
  }
  
  try {
    const parsedResult = JSON.parse(storedResult) as HelpRequestResult;
    if (parsedResult.resultado.tipo === "emocional") {
      return parsedResult;
    }
  } catch (error) {
    console.error("Failed to parse helpRequestResult:", error);
  }
  
  return null;
}

export default function ResultadoEmocionalPage() {
  const router = useRouter();
  const [result] = useState<HelpRequestResult | null>(getInitialEmotionalResult());

  useEffect(() => {
    // Verify result and redirect if needed
    if (!result) {
      router.push("/");
      return;
    }
    
    if (result.resultado.tipo !== "emocional") {
      router.push("/matching");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  const emocionalResult = result.resultado.tipo === "emocional" ? result.resultado : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-6 p-4 rounded-full bg-pink-500/10 w-fit">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                Te Entendemos
              </CardTitle>
              <CardDescription className="text-base">
                Hemos analizado tu solicitud y queremos ayudarte de la mejor manera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensaje Principal */}
              <div className="p-6 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-foreground leading-relaxed">
                  {emocionalResult?.mensaje}
                </p>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Información de Contacto - Bienestar Estudiantil
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Correo Electrónico</p>
                      <p className="text-sm text-muted-foreground">bienestar@universidad.edu</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Teléfono</p>
                      <p className="text-sm text-muted-foreground">+56 2 1234 5678</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios de Atención */}
              <div className="p-4 rounded-lg bg-accent/10 border border-border/30">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Horarios de Atención
                </h4>
                <p className="text-sm text-muted-foreground">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                </p>
                <p className="text-sm text-muted-foreground">
                  Atención de emergencia 24/7
                </p>
              </div>

              {/* Mensaje de Confianza */}
              <div className="text-center space-y-3 pt-4">
                <p className="text-sm text-muted-foreground italic">
                  Confianza detectada: {Math.round(result.triaje.confianza * 100)}%
                </p>
                <p className="text-sm text-foreground">
                  Recuerda que estamos aquí para apoyarte. Tu bienestar es nuestra prioridad.
                </p>
              </div>

              {/* Botón Volver */}
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
