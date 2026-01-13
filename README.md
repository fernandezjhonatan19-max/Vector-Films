# Vector Films | Team Pulse

Sistema de gamificación y seguimiento de rendimiento para el equipo de Vector Films.

## Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: TailwindCSS v4 + CSS Variables (Dark theme)
- **Base de Datos**: Supabase (Auth, Postgres, Storage)
- **Gráficas**: Recharts
- **Iconos**: Lucide React

## Requisitos Previos
- Node.js 18+
- Cuenta en Supabase

## Configuración Paso a Paso

### 1. Clonar e Instalar
```bash
git clone <tu-repo>
cd vector-team-pulse
npm install
```

### 2. Configurar Supabase
1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. Ve al SQL Editor en el dashboard de Supabase.
3. Copia el contenido del archivo `schema.sql` (en la raíz de este proyecto) y ejecútalo. Esto creará:
   - Tablas: `profiles`, `missions`, `actions_ledger`, `monthly_archives`, `settings`.
   - Políticas de seguridad (RLS).
   - Funciones (RPC `close_month`).
   - Bucket de almacenamiento `avatars`.
4. (Opcional) Copia y ejecuta `seed.sql` para tener datos de prueba (misiones).

### 3. Autenticación
1. En Supabase > Authentication > Providers, habilita **Email/Password**.
2. Desactiva "Confirm email" si quieres registro rápido para pruebas, o crea usuarios manualmente desde el dashboard.

### 4. Variables de Entorno
Crea un archivo `.env` en la raíz basado en `.env.example` (o crea uno nuevo):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Obtén estas credenciales en Supabase > Project Settings > API.

### 5. Configuración de Storage (Avatares)
El script SQL ya intenta crear el bucket 'avatars'. Si falla, ve a Storage > Create new bucket > "avatars" (Public).

## Ejecución
```bash
npm run dev
```
Abre http://localhost:5173

## Funcionalidades
- **Dashboard**: Vista general de puntos y ranking.
- **Acciones**: Registrar puntos/penalizaciones (requiere seleccionar Agente y Misión).
- **Equipo**: Ver listado de integrantes (CRUD básico).
- **Misiones**: Crear/Borrar misiones y puntajes.
- **Historial**: Cerrar mes y archivar resultados.
- **Ajustes**: Configurar valor del punto y reglas.

## Modo Demo
Si no configuras las variables de entorno, la app funcionará en "Modo Demo" con datos simulados en memoria (se reinician al recargar).
