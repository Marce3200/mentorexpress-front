"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, GraduationCap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Calendly URL from environment variable with fallback
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jaimeshalom12/sesion-de-mentoria-mentorexpress";

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

interface SchedulingData {
  student: {
    id: number;
    fullName: string;
    email: string;
  };
  mentor: {
    id: number;
    fullName: string;
    email: string;
  };
}

function getInitialSchedulingData(): SchedulingData | null {
  if (typeof window === "undefined") {
    return null;
  }
  
  const storedData = sessionStorage.getItem("schedulingData");
  if (!storedData) {
    return null;
  }
  
  try {
    return JSON.parse(storedData) as SchedulingData;
  } catch (error) {
    console.error("Failed to parse schedulingData:", error);
  }
  
  return null;
}

export default function AgendarPage() {
  const router = useRouter();
  const [data] = useState<SchedulingData | null>(getInitialSchedulingData());
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verify data and redirect if needed
    if (!data) {
      router.push("/");
    }
  }, [data, router]);

  // Load Calendly script dynamically
  useEffect(() => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    
    if (existingScript) {
      // Script already in DOM, check if Calendly is ready
      const checkCalendly = () => {
        if (window.Calendly) {
          setCalendlyLoaded(true);
        } else {
          // Wait for script to finish loading
          existingScript.addEventListener("load", () => setCalendlyLoaded(true));
        }
      };
      checkCalendly();
      return;
    }

    // Create and append script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      setCalendlyLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Calendly widget when script is loaded and container is ready
  useEffect(() => {
    if (!calendlyLoaded || !data || !calendlyContainerRef.current) return;

    // Clear any existing content
    calendlyContainerRef.current.innerHTML = "";

    // Initialize Calendly inline widget with prefilled data
    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: `${CALENDLY_URL}?hide_gdpr_banner=1`,
        parentElement: calendlyContainerRef.current,
        prefill: {
          name: data.student.fullName,
          email: data.student.email,
        },
      });
    }
  }, [calendlyLoaded, data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

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
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
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
                    <CardDescription className="text-sm">{data.student.fullName}</CardDescription>
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
                    <CardDescription className="text-sm">{data.mentor.fullName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Calendly Embed */}
          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <CardContent className="p-0">
              {/* Container for Calendly widget - initialized via useEffect */}
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
