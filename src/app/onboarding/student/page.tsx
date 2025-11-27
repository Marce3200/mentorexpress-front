"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormValues } from "@/lib/schemas";
import { registerStudent } from "@/services/api";
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

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      campus: "ANTONIO_VARAS",
      career: "CIVIL_ENGINEERING",
      currentYear: 1,
      needs: "",
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    try {
        // 1. Register Student
        await registerStudent(data);
        // 2. Store basic profile in local storage for the matching demo
        localStorage.setItem("studentProfile", JSON.stringify(data));
        // 3. Redirect
        router.push("/matching");
    } catch (error) {
        console.error(error);
        // Even if it fails (backend down), proceed to matching for the demo
        localStorage.setItem("studentProfile", JSON.stringify(data));
        router.push("/matching");
    } finally {
        setIsLoading(false);
    }
  }

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
                            name="needs"
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

                        <Button type="submit" className="w-full font-bold text-md" disabled={isLoading}>
                            {isLoading ? "Registrando..." : "Encontrar mi Mentor"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
