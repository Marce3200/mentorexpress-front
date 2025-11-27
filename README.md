# MentorExpress - Frontend Next.js

Aplicación frontend de MentorExpress construida con Next.js 16, React 19, y shadcn/ui. Proporciona una interfaz moderna para estudiantes y mentores con soporte para temas claro/oscuro y localización en español.

## Inicio Rápido

### Requisitos Previos

En sistemas Linux, asegúrate de tener suficiente límite de `inotify` para monitorear archivos:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Configuración de Variables de Entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Contenido de `.env.local`:

```bash
# Puerto en el que correrá la aplicación Next.js (por defecto: 3007)
PORT=3007

# URL del backend (NestJS)
# En desarrollo local: http://localhost:3000
# En producción: tu URL de backend
BACKEND_URL=http://localhost:3000
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3007](http://localhost:3007)

### Construir para Producción

```bash
npm run build
npm start
```

## Arquitectura y Configuración

### Gestión de Configuración

La aplicación utiliza un sistema centralizado de configuración en `src/config/env.ts` que:

- **Valida variables de entorno** al iniciar la aplicación
- **Proporciona valores por defecto** seguros
- **Evita duplicación** de lógica de configuración en múltiples rutas

**Uso en rutas API:**

```typescript
import { config } from "@/config/env";

// Usar config.backendUrl en lugar de process.env directamente
const res = await fetch(`${config.backendUrl}/students`, { ... });
```

### Patrón BFF (Backend for Frontend)

Todas las llamadas del frontend al backend NestJS se realizan a través de rutas API de Next.js (`/api/*`), implementando el patrón BFF:

- **Seguridad**: Las credenciales del backend no se exponen al cliente
- **Flexibilidad**: Fácil cambiar la URL del backend sin modificar el frontend
- **Resiliencia**: Fallback a datos mock si el backend no está disponible

### Temas Claro/Oscuro

La aplicación incluye soporte completo para temas usando `next-themes`:

- **Tres opciones**: Claro, Oscuro, Sistema (automático)
- **Persistencia**: El tema se guarda en localStorage
- **Accesibilidad**: Cumple con estándares WCAG AAA
- **Sin flash**: Transiciones suaves sin parpadeos

### Localización

Toda la interfaz de usuario está en español mientras el código permanece en inglés:

- **Validaciones Zod**: Mensajes de error en español
- **Componentes**: Etiquetas y botones en español
- **Mantenibilidad**: Identificadores de código en inglés

## Solución de Problemas

### Error: "OS file watch limit reached"

**Causa**: Linux tiene un límite bajo de archivos que puede monitorear (`inotify`).

**Solución**:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Esto aumenta el límite de 8192 a 524288, permitiendo monitorear miles de archivos en `node_modules`.

### Error: "EADDRINUSE: address already in use"

**Causa**: El puerto 3007 ya está en uso.

**Soluciones**:

1. Esperar unos segundos y reintentar (el puerto podría estar en estado TIME_WAIT)
2. Cambiar el puerto en `.env.local`: `PORT=3008`
3. Liberar el puerto manualmente si es necesario

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: react-hook-form + Zod
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Themes**: next-themes
- **Type Safety**: TypeScript con strict mode

## Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## Docker Setup

Este proyecto incluye configuración Docker completa para ejecutar la aplicación con Cloudflare Tunnel.

### Variables de Entorno

Copia el archivo `docker-env.example` a `.env` y modifica los valores según necesites:

```bash
cp docker-env.example .env
```

Contenido del archivo `.env`:

```bash
# Puerto en el que correrá la aplicación Next.js (por defecto: 3007)
PORT=3007
```

Si no defines la variable `PORT`, la aplicación usará el puerto 3007 por defecto.

### Ejecutar con Docker

```bash
# Construir y ejecutar la aplicación
docker compose up --build

# Ejecutar en segundo plano
docker compose up -d --build

# Detener la aplicación
docker compose down
```

### Acceso a la Aplicación

- **Local**: `http://localhost:{PORT}` (por defecto: http://localhost:3007)
- **Cloudflare Tunnel**: Se generará automáticamente una URL temporal como `https://xxxxx.trycloudflare.com`

### Configuración Técnica

- **npm ci**: Se usa para instalación confiable de dependencias en producción
- **Puerto configurable**: Define `PORT` en tu archivo `.env` o como variable de entorno
- **Cloudflare Tunnel**: Crea un tunnel temporal sin necesidad de autenticación
- **Next.js Standalone**: Optimizado para contenedores Docker
