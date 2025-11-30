"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Mail, ArrowLeft, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultadoAgendadoPage() {
  const router = useRouter();

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
                <Calendar className="w-16 h-16 text-green-500" />
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
                ¡Sesión Agendada!
              </CardTitle>
              <CardDescription className="text-base">
                Tu sesión de mentoría ha sido programada exitosamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensaje Principal */}
              <div className="p-6 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-foreground text-center leading-relaxed font-medium">
                  Hemos registrado tu cita. Tanto tú como tu mentor recibirán un correo electrónico con todos los detalles de la sesión.
                </p>
              </div>

              {/* Próximos Pasos */}
              <div className="p-5 rounded-lg bg-accent/10 border border-border/30">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Próximos Pasos
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    <span>Revisa tu correo electrónico para ver la confirmación de la cita</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    <span>Recibirás recordatorios automáticos antes de la sesión</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    <span>Prepara tus dudas y materiales para aprovechar al máximo la mentoría</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    <span>Si necesitas cancelar o reprogramar, usa el enlace en el correo de confirmación</span>
                  </li>
                </ul>
              </div>

              {/* Mensaje de Éxito */}
              <div className="text-center space-y-3 pt-4">
                <p className="text-sm text-foreground font-medium">
                  ¡Estás un paso más cerca de alcanzar tus metas académicas! 🎓
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Te deseamos mucho éxito en tu sesión de mentoría
                </p>
              </div>

              {/* Botón Volver */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => {
                    // Clear any remaining session data
                    sessionStorage.removeItem("helpRequestResult");
                    sessionStorage.removeItem("schedulingData");
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
