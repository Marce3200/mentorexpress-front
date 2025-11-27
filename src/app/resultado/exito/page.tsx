"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, User, ArrowLeft, PartyPopper } from "lucide-react";
import { SelectMentorResult } from "@/types";
import { motion } from "framer-motion";

function getInitialSuccessResult(): SelectMentorResult | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  const storedResult = sessionStorage.getItem("selectMentorResult");
  if (!storedResult) {
    return null;
  }
  
  try {
    const parsedResult = JSON.parse(storedResult) as SelectMentorResult;
    return parsedResult;
  } catch (error) {
    console.error("Failed to parse selectMentorResult:", error);
  }
  
  return null;
}

export default function ResultadoExitoPage() {
  const router = useRouter();
  const [result] = useState<SelectMentorResult | null>(getInitialSuccessResult());

  useEffect(() => {
    // Verify result and redirect if needed
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 p-4 rounded-full bg-green-500/10 w-fit relative"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-yellow-500" />
                </motion.div>
              </motion.div>
              <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ¡Conexión Exitosa!
              </CardTitle>
              <CardDescription className="text-base">
                Has sido emparejado con tu mentor. Ambos recibirán un correo electrónico con los detalles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensaje Principal */}
              <div className="p-6 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-foreground text-center leading-relaxed font-medium">
                  {result.mensaje}
                </p>
              </div>

              {/* Información del Match */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Estudiante */}
                <div className="p-5 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Estudiante</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground font-medium">{result.student.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{result.student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Mentor */}
                <div className="p-5 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">Mentor</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground font-medium">{result.mentor.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{result.mentor.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximos Pasos */}
              <div className="p-5 rounded-lg bg-accent/10 border border-border/30">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  📧 Próximos Pasos
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Ambos recibirán un correo de confirmación con los detalles del match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>El mentor se pondrá en contacto contigo para coordinar la primera sesión</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Revisa tu bandeja de entrada (y spam) en los próximos minutos</span>
                  </li>
                </ul>
              </div>

              {/* Mensaje de Éxito */}
              <div className="text-center space-y-3 pt-4">
                <p className="text-sm text-foreground font-medium">
                  ¡Estás un paso más cerca de alcanzar tus metas académicas! 🎓
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Te deseamos mucho éxito en tu proceso de mentoría
                </p>
              </div>

              {/* Botón Volver */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => {
                    // Clear session data
                    sessionStorage.removeItem("helpRequestResult");
                    sessionStorage.removeItem("selectMentorResult");
                    router.push("/");
                  }}
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
