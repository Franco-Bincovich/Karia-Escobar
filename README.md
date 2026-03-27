<p align="center">
  <h1 align="center">🤖 KarIA Escobar</h1>
  <p align="center">
    Agente conversacional de inteligencia artificial para análisis documental y productividad empresarial
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Claude-Anthropic-D4A574?logo=anthropic&logoColor=white" alt="Anthropic" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Sistema de integraciones](#-sistema-de-integraciones)
- [Sistema de funcionalidades](#-sistema-de-funcionalidades)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Migraciones](#-migraciones)
- [Cómo correr](#-cómo-correr)
- [Bases de desarrollo](#-bases-de-desarrollo)
- [Seguridad](#-seguridad)
- [Roadmap](#-roadmap)

---

## 🎯 Descripción

**KarIA Escobar** es un agente conversacional impulsado por inteligencia artificial, diseñado para equipos de trabajo que necesitan analizar documentos, generar reportes y automatizar tareas de productividad.

### ¿Para quién es?

Equipos administrativos, analistas y profesionales que trabajan con grandes volúmenes de documentos y necesitan extraer información, generar reportes y automatizar flujos de trabajo sin salir de una interfaz de chat.

### ¿Qué problema resuelve?

Centraliza en un solo agente inteligente las tareas que normalmente requieren múltiples herramientas: lectura y análisis de documentos, generación de planillas y documentos Word, búsqueda web, gestión de correo y calendario, y creación de presentaciones. Todo desde una conversación natural en español.

---

## ⚡ Funcionalidades principales

### 📄 Análisis de documentos
- **PDF** — Extracción y análisis de texto completo
- **Excel (.xlsx)** — Análisis básico (resumen tabular) y avanzado (detección de schema, estadísticas automáticas)
- **Word (.docx)** — Extracción de contenido con mammoth
- **CSV / TXT** — Lectura y procesamiento directo

### 📊 Generación de archivos
- **Excel** — Planillas con headers estilizados, columnas auto-ajustadas y múltiples hojas
- **Word** — Documentos formateados: oficios, circulares, actas, respuestas y documentos generales

### 🔍 Búsqueda web
- Búsqueda inteligente vía **Perplexity AI** con citas y fuentes
- Búsqueda de normativa legal en **Infoleg** y **SAIJ** (scraping paralelo con circuit breaker)
- Búsqueda de ordenanzas municipales

### 📧 Integración Google Workspace
- **Gmail** — Leer últimos correos no leídos y enviar emails
- **Calendar** — Consultar próximos eventos y crear nuevos
- **Drive** — Buscar archivos en Google Drive

### 🎨 Presentaciones con Gamma
- Generación de presentaciones, documentos y páginas web vía **Gamma AI**
- Configuración de temas, cantidad de cards y formato

### 🧩 Funcionalidades personalizadas
- Sistema de **system prompts dinámicos** por usuario
- Configurador IA integrado que guía la creación paso a paso
- Cada funcionalidad se inyecta dinámicamente en el contexto del agente

---

## 🔌 Sistema de integraciones

KarIA Escobar cuenta con un sistema de integraciones **self-service**: cada usuario conecta sus propias credenciales desde la interfaz, sin intervención del administrador.

### Integraciones disponibles

| Integración | Tipo | Descripción |
|---|---|---|
| **Anthropic** | API Key | Modelo Claude para el agente conversacional |
| **OpenAI** | API Key | Modelo alternativo (reservado) |
| **Perplexity** | API Key | Motor de búsqueda web con citas |
| **Gamma** | API Key | Generación de presentaciones y documentos |
| **Gmail** | OAuth2 | Lectura y envío de correos |
| **Google Calendar** | OAuth2 | Gestión de eventos |
| **Google Drive** | OAuth2 | Búsqueda de archivos |

### ¿Cómo funciona?

1. El usuario va a la sección **Integraciones** en la interfaz
2. Para API Keys: ingresa la clave y se guarda cifrada con **AES-256-CBC** en la base de datos
3. Para Google: inicia un flujo **OAuth2** que solicita permisos específicos (lectura de correo, calendario, drive)
4. Las credenciales se cifran en el servidor antes de persistirse — nunca se exponen al frontend
5. Cada integración queda vinculada al usuario (`UNIQUE(user_id, tipo)`)
6. Los tokens OAuth se refrescan automáticamente cuando expiran

---

## 🧩 Sistema de funcionalidades

Las **funcionalidades** permiten a cada usuario crear comportamientos personalizados del agente sin tocar código.

### ¿Cómo funciona?

1. El usuario accede al **Configurador de funcionalidades** desde la interfaz
2. El configurador IA le hace preguntas guiadas: nombre, comportamiento esperado, tono, herramientas a usar
3. Se genera un **system prompt** optimizado automáticamente
4. La funcionalidad se guarda vinculada al usuario y se activa/desactiva a demanda
5. Al enviar un mensaje, el agente construye su prompt base + todos los system prompts activos del usuario

### Ejemplo de uso

> *"Creá una funcionalidad que cuando le pida 'resumen ejecutivo', analice el documento adjunto y genere un Word con formato de memo interno."*

El configurador generará el system prompt adecuado y lo guardará como funcionalidad reutilizable.

---

## 🛠 Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| **Runtime** | Node.js (Alpine) | 20+ |
| **Framework backend** | Express | 4.22.1 |
| **Frontend** | React + Vite | 18.3.1 / 5.4.21 |
| **Router frontend** | React Router DOM | 6.30.3 |
| **Base de datos** | Supabase (PostgreSQL) | — |
| **IA conversacional** | Anthropic Claude | SDK 0.27.3 |
| **Autenticación** | JWT + bcryptjs | 9.0.2 / 2.4.3 |
| **Validación** | express-validator | 7.0.1 |
| **Archivos Excel** | ExcelJS | 4.4.0 |
| **Archivos Word** | docx | 8.5.0 |
| **Lectura Word** | mammoth | 1.12.0 |
| **Lectura PDF** | pdf-parse | 1.1.1 |
| **Búsqueda web** | Perplexity API | — |
| **Presentaciones** | Gamma AI | — |
| **Google APIs** | googleapis | 171.4.0 |
| **Scraping** | cheerio | 1.2.0 |
| **Seguridad** | Helmet + rate-limit | 7.1.0 / 7.2.0 |
| **Logging** | Winston | 3.13.0 |
| **Contenedores** | Docker + Compose | — |
| **Linting** | ESLint + Prettier + Husky | — |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura por capas** estricta:

```
karia-escobar/
├── 📄 CLAUDE.md                    # Orquestación del proyecto
├── 📄 BASES-DE-DESARROLLO.md       # 11 reglas de desarrollo
├── 📄 .env.example                 # Template de variables de entorno
├── 🐳 Dockerfile                   # Imagen Node 20 Alpine
├── 🐳 docker-compose.yml           # Orquestación de contenedores
├── 📦 package.json                 # Dependencias (versiones exactas)
│
├── 📁 migrations/                  # SQL versionado para Supabase
│   ├── 001_create_users.sql
│   ├── 002_create_conversaciones.sql
│   ├── 003_grant_permissions.sql
│   ├── 004_create_integraciones.sql
│   └── 005_create_funcionalidades.sql
│
├── 📁 client/                      # Frontend React + Vite
│   └── src/
│       ├── pages/                  # Login, Chat, CrearFuncionalidad
│       ├── components/             # ChatInput, MessageBubble, Sidebar, Integraciones
│       ├── context/                # AuthContext (JWT en localStorage)
│       ├── hooks/                  # useAuth, useChat
│       └── services/              # Cliente HTTP (api.js)
│
└── 📁 src/                         # Backend Node.js + Express
    ├── server.js                   # Entry point: puerto, graceful shutdown
    ├── app.js                      # Express: middlewares, CORS, rutas
    ├── agent.js                    # Loop principal del agente Claude
    │
    ├── 📁 config/                  # ÚNICO lugar que lee process.env
    │   ├── index.js                # Variables de entorno centralizadas
    │   ├── supabase.js             # Cliente Supabase
    │   └── systemPrompts.js        # Prompts del agente
    │
    ├── 📁 routes/                  # Definición de rutas + validación de entrada
    ├── 📁 controllers/             # Orquestación (sin lógica de negocio)
    ├── 📁 services/                # Toda la lógica de negocio
    ├── 📁 repositories/            # Único punto de contacto con Supabase
    ├── 📁 integrations/            # Wrappers de APIs externas (Gamma, Perplexity, Google)
    │
    ├── 📁 tools/                   # Herramientas del agente Claude (13 tools)
    │   ├── search/                 # Búsqueda web, normativa, ordenanzas
    │   ├── export/                 # Generación de documentos Word
    │   ├── google/                 # Gmail, Calendar, Drive
    │   ├── excel.js                # Generación de Excel
    │   ├── excelAvanzado.js        # Análisis estadístico de Excel
    │   └── gamma.js                # Presentaciones Gamma AI
    │
    ├── 📁 middleware/              # Auth JWT, error handler, rate limiters
    └── 📁 utils/                   # Logger, circuit breaker, reintentos, crypto, cola
```

### Flujo de una petición

```
Cliente → Route (validación) → Controller (orquestación) → Service (lógica) → Repository (DB)
                                      ↓
                               Agent (Claude) → Tools (Excel, Word, Gmail, etc.)
                                      ↓
                              Integrations (APIs externas)
```

---

## 📋 Requisitos

- **Node.js** 20 o superior
- **npm** (incluido con Node.js)
- **Cuenta en Supabase** (PostgreSQL + Storage)
- **API Key de Anthropic** para el modelo Claude
- **Docker + Docker Compose** (opcional, para producción)
- **Credenciales Google OAuth2** (opcional, para Gmail/Calendar/Drive)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd karia-escobar
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd client
npm install
cd ..
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` y completar todas las variables (ver sección [Variables de entorno](#-variables-de-entorno)).

### 5. Aplicar migraciones en Supabase

Ejecutar los archivos SQL en el **SQL Editor** de Supabase, en orden (ver sección [Migraciones](#-migraciones)).

### 6. Crear el primer usuario

Insertar manualmente un usuario admin en Supabase:

```sql
INSERT INTO "usuarios-escobar" (email, password_hash, nombre, rol)
VALUES ('admin@tudominio.com', '<hash_bcrypt_12_rounds>', 'Admin', 'admin');
```

---

## 🔐 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor backend | `3003` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS (separados por coma) | `http://localhost:5173` |
| `JWT_SECRET` | Secreto para firmar tokens JWT (mínimo 32 caracteres) | `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | API Key de Anthropic para Claude | `sk-ant-...` |
| `SUPABASE_URL` | URL del proyecto en Supabase | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Service Role Key de Supabase | `eyJ...` |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth2 | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth2 | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | URI de callback para OAuth2 | `http://localhost:3003/api/integraciones/google/callback` |

> **Nota:** Las API Keys de Perplexity y Gamma se configuran por usuario desde la interfaz de integraciones, no en el `.env`.

---

## 🗃 Migraciones

Ejecutar en el **SQL Editor de Supabase**, estrictamente en este orden:

| # | Archivo | Descripción |
|---|---|---|
| 1 | `001_create_users.sql` | Tabla de usuarios con roles (`admin`, `analista`), RLS habilitado |
| 2 | `002_create_conversaciones.sql` | Historial de conversaciones con mensajes JSONB, índices optimizados |
| 3 | `003_grant_permissions.sql` | Permisos de Supabase (`service_role`, `authenticated`, `anon`) |
| 4 | `004_create_integraciones.sql` | Integraciones cifradas por usuario, constraint `UNIQUE(user_id, tipo)` |
| 5 | `005_create_funcionalidades.sql` | Funcionalidades personalizadas con system prompts dinámicos |

> ⚠️ **Importante:** Respetar el orden numérico. Las tablas tienen foreign keys que dependen de la tabla `usuarios-escobar` creada en la migración 001.

---

## ▶️ Cómo correr

### Desarrollo local

Abrir dos terminales:

**Terminal 1 — Backend (puerto 3003):**

```bash
npm run dev
```

**Terminal 2 — Frontend (puerto 5173):**

```bash
cd client
npm run dev
```

Acceder a la aplicación en `http://localhost:5173`.

### Producción con Docker

```bash
docker compose up --build
```

El backend se expone en el puerto configurado en `PORT`. Incluye health check automático en `/health`.

---

## 📐 Bases de desarrollo

El proyecto se rige por **11 bases de desarrollo** que todo el código cumple sin excepción:

| # | Base | Regla |
|---|---|---|
| 1 | Arquitectura por capas | `routes → controllers → services → repositories → integrations` |
| 2 | Errores centralizados | Todo error pasa por `errorHandler`. Clase `AppError` siempre. |
| 3 | Secrets externalizados | Solo `config/index.js` toca `process.env`. Nunca en otro archivo. |
| 4 | Validación en la frontera | `express-validator` en cada ruta. Helmet + CORS con whitelist. |
| 5 | Migraciones versionadas | Cada cambio de schema = archivo SQL numerado en `/migrations` |
| 6 | Código legible por IA | Máx. 150 líneas por archivo. Una función, un propósito. |
| 7 | Contratos explícitos | JSDoc obligatorio en `services/` e `integrations/`. |
| 8 | Run & See inmediato | `docker-compose up --build` levanta todo en menos de 60 segundos. |
| 9 | Auth y tokens seguros | JWT 8h, bcrypt 12 rounds, refresh tokens solo server-side. |
| 10 | Sin CVEs conocidos | `npm audit` bloquea en high/critical. Versiones exactas en `package.json`. |
| 11 | Estilo consistente | ESLint + Prettier + Husky. Sin esto no entra código al repo. |

> 📖 Documentación completa en [`BASES-DE-DESARROLLO.md`](./BASES-DE-DESARROLLO.md)

---

## 🔒 Seguridad

### Autenticación y autorización
- **JWT** con expiración de 8 horas
- **bcrypt** con 12 rounds de salt para hashing de contraseñas
- **Protección contra timing attacks** con hash dummy para usuarios inexistentes
- **Bloqueo de cuenta** tras 10 intentos fallidos (15 minutos de cooldown)
- **Flag `needs_password_reset`** para forzar cambio de contraseña en primer login

### Cifrado de credenciales
- Todas las API Keys y tokens OAuth se cifran con **AES-256-CBC** antes de persistirse
- IV aleatorio por cada operación de cifrado
- Derivación de clave con `crypto.scryptSync`
- Las credenciales nunca se exponen al frontend

### Seguridad HTTP
- **Helmet** para headers de seguridad
- **CORS** con lista blanca configurable (no wildcard)
- **Rate limiting** diferenciado:
  - Login: 10 requests / 15 min
  - Chat: 20 requests / min
  - API general: 100 requests / 15 min
- **Validación de entrada** con `express-validator` en todas las rutas

### Base de datos
- **Row-Level Security (RLS)** en todas las tablas
- Backend usa `service_role` key (bypass RLS)
- Foreign keys con `ON DELETE CASCADE`
- Índices optimizados para consultas por usuario

### Archivos
- **Prevención de IDOR** — archivos prefijados con `userId`
- **Prevención de path traversal** — `path.basename()` + validación `startsWith`
- Tipos permitidos: `.xlsx`, `.docx`, `.pdf`, `.csv`
- Limpieza automática de archivos temporales

### Resiliencia
- **Circuit breaker** para APIs externas (se abre tras 5 fallos consecutivos)
- **Retry con backoff exponencial** (máx. 3 intentos)
- **Cola de requests** para serializar llamadas al agente
- **Timeouts** con `AbortSignal.timeout()` en todas las llamadas externas

---

## 🗺 Roadmap

- [ ] 🔍 Scrapers de precios de electrodomésticos (Naldo, OnCity, Cetrogar, Megatone, Frávega)
- [ ] 📊 Dashboard de análisis comparativo de precios
- [ ] 🔔 Alertas automáticas de cambios de precio
- [ ] 📱 Interfaz responsive / PWA
- [ ] 🧪 Suite de tests unitarios e integración
- [ ] 📈 Métricas de uso y analytics
- [ ] 🔄 Soporte multi-modelo (OpenAI como alternativa)
- [ ] 📋 Templates de documentos personalizables
- [ ] 🌐 Deploy automatizado con CI/CD

---

<p align="center">
  Desarrollado por <strong>KarIA</strong> · Hecho con ☕ y Claude
</p>
