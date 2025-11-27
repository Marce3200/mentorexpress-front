# Arquitectura del Sistema - MentorExpress

## 📋 Información General

Esta documentación describe la arquitectura técnica del frontend MentorExpress, una aplicación de emparejamiento académico potenciada por IA. El sistema está diseñado siguiendo el patrón **Backend for Frontend (BFF)**, optimizado para entornos universitarios de demostración.

## 🏗️ Patrón Arquitectónico: Backend for Frontend (BFF)

### Rol de Next.js como BFF

Next.js (App Router) actúa como un **Backend for Frontend (BFF)**, sirviendo como intermediario inteligente entre el usuario final y los servicios backend.

#### Responsabilidades del BFF:

- **🎨 Rendering de UI**: Combina Server Components y Client Components para una experiencia de usuario fluida
- **🔄 Proxy de Solicitudes**: Todas las llamadas a APIs pasan por rutas de Next.js (`app/api/...`) que actúan como proxy seguro
- **🛡️ Seguridad**: Manejo de CORS, headers de seguridad y validación de entrada
- **⚡ Optimización**: Server-Side Rendering (SSR), Static Generation y caching inteligente

#### Límite Arquitectónico Estricto:

> **IMPORTANTE**: Next.js contiene **CERO lógica de negocio**. No conecta directamente a bases de datos, no ejecuta modelos de IA, ni realiza procesamiento complejo. Su único propósito es servir como gateway seguro y optimizado hacia el backend NestJS.

## 🌐 Red y Seguridad (Cloudflare Tunnel)

### Estrategia de Despliegue

```
Internet → Cloudflare Tunnel → Next.js (Puerto Expuesto) → Red Interna → NestJS + AI Services
```

#### Componentes de Seguridad:

- **Acceso Público**: Los usuarios se conectan via `https://demo-url.trycloudflare.com` (tunnel temporal)
- **Endpoint del Tunnel**: Cloudflare solo reenvía tráfico al puerto de Next.js (configurable, por defecto 3007)
- **Red Interna**: NestJS (puerto 4000) y servicios de IA (Python) están completamente ocultos detrás del firewall
- **Aislamiento**: Solo Next.js puede acceder a los servicios internos, creando una capa de seguridad adicional

#### Beneficios del Diseño:

- ✅ **Zero Trust**: Nada expuesto directamente a internet
- ✅ **SSL Automático**: Cloudflare maneja certificados HTTPS
- ✅ **Escalabilidad**: Fácil cambio entre entornos (desarrollo/producción)
- ✅ **Debugging Seguro**: Logs y monitoreo sin exponer infraestructura

## 💻 Stack Tecnológico del Frontend

### Framework y Runtime
- **Next.js 15**: Framework React con App Router para routing moderno
- **React 19**: Biblioteca principal con Server Components y Suspense
- **Node.js 20**: Runtime optimizado para Next.js

### UI y Estilos
- **Tailwind CSS v4**: Sistema de diseño utilitario moderno
- **shadcn/ui**: Componentes accesibles y profesionales construidos sobre Radix UI
- **next-themes**: Soporte completo para modo oscuro/claro con persistencia

### Gestión de Estado y Datos
- **React Server Actions**: Para mutaciones de datos del lado del servidor
- **API Routes**: Endpoints `/api/*` que actúan como proxy al backend
- **Zod**: Validación de esquemas TypeScript-first

### Calidad y Desarrollo
- **TypeScript**: Tipado estático completo
- **ESLint**: Linting automatizado
- **Prettier**: Formateo de código consistente

## 🚀 Despliegue para Desarrollo y Presentación

### Configuración con Docker Compose

El proyecto incluye configuración completa para despliegue local con tunnel público:

#### Archivos de Configuración:

```yaml
# docker-compose.yml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "${PORT:-3007}:${PORT:-3007}"
    environment:
      - NODE_ENV=production
      - PORT=${PORT:-3007}
    networks:
      - app-network

  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel --url http://nextjs:${PORT:-3007} --protocol http2
    depends_on:
      - nextjs
    networks:
      - app-network
```

#### Variables de Entorno:

```bash
# .env (crear desde docker-env.example)
PORT=3007  # Puerto configurable, por defecto 3007
```

### Pasos para Despliegue:

1. **Preparar entorno:**
   ```bash
   cp docker-env.example .env
   # Editar .env si necesitas cambiar el puerto
   ```

2. **Construir y ejecutar:**
   ```bash
   docker compose up --build
   ```

3. **Acceder a la aplicación:**
   - **Local**: `http://localhost:3007`
   - **Público**: URL generada por Cloudflare (ej: `https://xxxxx.trycloudflare.com`)

### Características del Despliegue:

- ✅ **Sin instalación**: Solo requiere Docker
- ✅ **Sin autenticación**: Tunnel temporal de Cloudflare
- ✅ **Multiplataforma**: Funciona en Windows, Linux y Mac
- ✅ **Puerto configurable**: Cambia `PORT` en `.env`
- ✅ **Optimizado para producción**: Usa `npm ci` y Next.js standalone

## 📊 Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Internet"
        U[👤 Usuario]
    end

    subgraph "Cloudflare Edge"
        CF[☁️ Cloudflare Tunnel<br/>HTTPS Seguro]
    end

    subgraph "Contenedor Docker - Red Pública"
        NJ[🎨 Next.js BFF<br/>Puerto: ${PORT:-3007}<br/>Server Components<br/>API Routes Proxy]
    end

    subgraph "Red Interna - Firewall"
        NS[🔧 NestJS Backend<br/>Puerto: 4000<br/>Lógica de Negocio<br/>API REST]
        AI[🤖 Servicio IA<br/>Python<br/>Modelos de ML<br/>Procesamiento]
        DB[(🗄️ Base de Datos)]
    end

    U --> CF
    CF --> NJ
    NJ --> NS
    NS --> AI
    AI --> DB

    style U fill:#e1f5fe
    style CF fill:#fff3e0
    style NJ fill:#f3e5f5
    style NS fill:#e8f5e8
    style AI fill:#fff8e1
    style DB fill:#fce4ec
```

### Flujo de Datos:

1. **Usuario** accede via URL pública de Cloudflare
2. **Cloudflare Tunnel** reenvía el tráfico HTTPS a Next.js
3. **Next.js (BFF)** renderiza la UI y proxy las APIs
4. **NestJS** ejecuta la lógica de negocio
5. **Servicio IA** procesa modelos de machine learning
6. **Base de Datos** almacena y recupera datos

## 🔒 Consideraciones de Seguridad

- **Principio de Menor Privilegio**: Next.js solo puede acceder a endpoints específicos
- **Validación de Input**: Todas las entradas pasan por Zod schemas
- **Headers de Seguridad**: Automáticamente configurados por Next.js
- **Rate Limiting**: Implementado en Cloudflare Edge
- **Auditoría**: Logs completos de todas las operaciones

## 📈 Métricas y Monitoreo

- **Performance**: Core Web Vitals optimizados
- **SEO**: Server-Side Rendering para motores de búsqueda
- **Analytics**: Integración con herramientas de analítica
- **Error Tracking**: Sistema de reporte de errores

## 🎯 Próximos Pasos

- [ ] Implementar autenticación OAuth para usuarios universitarios
- [ ] Agregar monitoreo avanzado con DataDog
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Implementar caché distribuido (Redis)
- [ ] Agregar tests end-to-end con Playwright

---

*Esta arquitectura asegura escalabilidad, seguridad y mantenibilidad para el sistema MentorExpress en entornos universitarios.*
