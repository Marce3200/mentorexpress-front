# Integración de Calendly - MentorExpress

## Descripción General

MentorExpress utiliza Calendly para gestionar el agendamiento de sesiones de mentoría entre estudiantes y mentores. Esta integración permite a los estudiantes seleccionar horarios disponibles directamente desde la aplicación.

## Flujo de Usuario

```
1. Estudiante completa formulario → 2. IA analiza y muestra mentores → 3. Estudiante selecciona mentor → 4. Calendly muestra calendario → 5. Estudiante agenda cita → 6. Ambos reciben confirmación por email
```

## Implementación Técnica

### Ubicación del Código

El widget de Calendly está integrado directamente en la página de estudiantes:

```
src/app/onboarding/student/page.tsx
```

### Carga Dinámica del Script

El script de Calendly se carga dinámicamente cuando el usuario entra al estado de "scheduling":

```typescript
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
```

### Inicialización del Widget

Una vez cargado el script, se inicializa el widget inline con datos pre-rellenados:

```typescript
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
```

## Configuración

### Variable de Entorno

```env
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tu-usuario/tu-evento
```

**Ejemplo actual:**
```env
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/jaimeshalom12/sesion-de-mentoria-mentorexpress
```

### Archivos a Modificar

1. `.env.local` - Variable de entorno local
2. `.env.example` - Documentación de la variable

## Limitaciones del Plan Free de Calendly

### ❌ Lo que NO funciona con el plan gratuito:

1. **Personalización de colores/tema oscuro**
   - Los parámetros `background_color`, `text_color`, `primary_color` requieren plan de pago
   - El widget siempre se muestra con el tema por defecto de Calendly

2. **Múltiples calendarios por mentor**
   - Solo se puede tener UN tipo de evento
   - Todos los mentores comparten el mismo calendario

3. **Webhooks**
   - No se pueden recibir notificaciones automáticas cuando se agenda una cita
   - No hay forma de sincronizar la cita con el backend

4. **Notificaciones personalizadas**
   - Los correos de confirmación son los de Calendly, no personalizados
   - No se puede enviar información adicional del mentor específico

### ✅ Lo que SÍ funciona con el plan gratuito:

1. **Widget inline embebido**
   - Se muestra el calendario directamente en la página

2. **Pre-rellenado de datos**
   - Nombre y email del estudiante se pre-rellenan automáticamente

3. **Correos de confirmación básicos**
   - Calendly envía confirmación al estudiante (quien agenda)
   - Calendly envía notificación al dueño del calendario

4. **Recordatorios**
   - Calendly envía recordatorios automáticos antes de la cita

## Flujo de Correos Electrónicos

### Con el Plan Free:

| Destinatario | Tipo de Correo | Enviado por |
|--------------|----------------|-------------|
| Estudiante | Confirmación de cita | Calendly ✅ |
| Estudiante | Recordatorio | Calendly ✅ |
| Dueño del calendario | Notificación de nueva cita | Calendly ✅ |
| Mentor específico | Notificación | ❌ No disponible |

### Problema Principal:

El **mentor específico seleccionado** NO recibe notificación porque:
- Calendly solo notifica al dueño del calendario (cuenta institucional)
- No hay forma de enviar la cita a un email diferente por cada reserva

## Soluciones Propuestas

### Opción 1: Plan de Pago de Calendly (Recomendado para producción)

**Costo:** ~$10-15 USD/mes por usuario

**Beneficios:**
- Webhooks para sincronizar con backend
- Múltiples tipos de eventos
- Personalización de colores
- Notificaciones personalizadas

### Opción 2: Implementación Propia (Más trabajo)

Crear un sistema de agendamiento propio:

1. **Base de datos:** Tabla de disponibilidad por mentor
2. **UI:** Selector de fecha/hora personalizado
3. **Backend:** Lógica de reservas y conflictos
4. **Emails:** Integración con servicio SMTP (SendGrid, Mailgun)

**Ventajas:**
- Control total sobre el flujo
- Notificaciones personalizadas a ambas partes
- Sin costos de terceros

**Desventajas:**
- Más tiempo de desarrollo
- Mantenimiento continuo
- Sincronización con calendarios externos (Google, Outlook)

### Opción 3: Híbrida (MVP actual)

**Flujo actual:**
1. Estudiante agenda en Calendly
2. Calendly notifica al estudiante y al dueño del calendario
3. El dueño del calendario (admin) reenvía manualmente al mentor

**Para mejorar:**
- Agregar un paso donde el admin asigna la cita al mentor
- Implementar envío de correo desde el backend NestJS al mentor

## Implementación de Correos Propios (Backend NestJS)

El backend ya tiene un `EmailService` preparado. Para enviar correos al mentor:

### 1. Configurar SMTP

```env
# .env del backend
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-api-key
```

### 2. Crear endpoint para notificar

```typescript
// src/students/students.controller.ts
@Post('notify-mentor')
async notifyMentor(@Body() data: NotifyMentorDto) {
  await this.emailService.sendMentorNotification({
    mentorEmail: data.mentorEmail,
    mentorName: data.mentorName,
    studentName: data.studentName,
    scheduledDate: data.scheduledDate,
    scheduledTime: data.scheduledTime,
  });
}
```

### 3. Llamar desde el frontend después de agendar

El problema es que Calendly no proporciona un callback cuando se completa la reserva en el plan free. Opciones:

- **Botón manual:** "Ya agendé mi cita" → llama al endpoint
- **Polling:** Verificar periódicamente si hay nueva cita (no recomendado)
- **Webhooks (plan de pago):** Recibir notificación automática

## Parámetros de URL de Calendly

### Disponibles (todos los planes):

```
?hide_gdpr_banner=1          # Oculta banner de GDPR
?name=Juan%20Perez           # Pre-rellena nombre
?email=juan@email.com        # Pre-rellena email
?a1=respuesta1               # Respuestas a preguntas personalizadas
```

### Solo planes de pago:

```
?background_color=1a1a2e     # Color de fondo (sin #)
?text_color=ffffff           # Color de texto
?primary_color=7c3aed        # Color primario
```

## Estructura de Datos

### SchedulingData (Frontend)

```typescript
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
```

## Recomendaciones para Producción

1. **Corto plazo (MVP):**
   - Usar el flujo actual con Calendly free
   - Documentar que el admin debe reenviar citas a mentores
   - Agregar instrucciones claras en la UI

2. **Mediano plazo:**
   - Evaluar costo/beneficio de Calendly de pago vs implementación propia
   - Si hay presupuesto: Calendly Teams con webhooks
   - Si no hay presupuesto: Implementar sistema propio básico

3. **Largo plazo:**
   - Sistema de agendamiento propio integrado
   - Sincronización con Google Calendar/Outlook
   - Panel de administración para gestionar citas

## Recursos

- [Documentación de Calendly Embed](https://developer.calendly.com/api-docs/ZG9jOjQ0ODI0MzU-embed-options)
- [Calendly API](https://developer.calendly.com/)
- [Precios de Calendly](https://calendly.com/pricing)

## Contacto

Para dudas sobre esta integración, contactar al equipo de desarrollo.
