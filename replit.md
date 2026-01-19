# ChromaScale SVG

## Overview

ChromaScale is a professional-grade SVG color palette generator and visualizer. It creates mathematically perfect HSL color gradients for vector graphics, allowing users to upload SVG files and apply dynamically generated color palettes. The application supports two palette modes (cohesive and vibrant), AI-powered color suggestions via Google Gemini, and real-time SVG preview with zoom controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for slide-out panels and transitions
- **Icons**: Lucide React

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, NotFound)
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Layout components in `client/src/components/layout/` (Header, Footer, EditorOverlay)
- Custom hooks in `client/src/hooks/` for data fetching and utilities
- Color utilities in `client/src/lib/colorUtils.ts` for HSL-to-Hex conversion and palette generation

**Critical CSS Variables**: The application relies on CSS variables `--fill-1` through `--fill-6` for SVG coloring. These must be maintained for proper SVG palette application.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Build Tool**: Vite for frontend, esbuild for server bundling
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation

Key server files:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database abstraction layer
- `server/db.ts` - Database connection using Drizzle ORM

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated via `drizzle-kit push` to `./migrations/`

Database tables:
- `palettes` - Stores saved color palettes (hue, saturation, colors array, mode)
- `conversations` and `messages` - For AI chat feature (defined in `shared/models/chat.ts`)

### AI Integration
- **Provider**: Google Gemini via Replit AI Integrations
- **Model**: `gemini-3-flash-preview` for color suggestions
- **Endpoint**: `POST /api/ai/suggest` returns hue and saturation values
- **Environment Variables**: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

Pre-built AI integration modules in `server/replit_integrations/`:
- `chat/` - Conversational AI with message history
- `image/` - Image generation capabilities
- `batch/` - Batch processing with rate limiting

### Build and Development
- **Development**: `npm run dev` runs tsx server with Vite middleware
- **Production Build**: `npm run build` compiles frontend with Vite, bundles server with esbuild
- **Type Checking**: `npm run check` with TypeScript
- **Database Sync**: `npm run db:push` pushes schema to database

Path aliases configured in both TypeScript and Vite:
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Required for production, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage in PostgreSQL

### AI Services
- **Google Gemini API**: Accessed through Replit AI Integrations proxy
- Required environment variables:
  - `AI_INTEGRATIONS_GEMINI_API_KEY`
  - `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Frontend Libraries
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Framer Motion**: Animation library for smooth transitions
- **TanStack Query**: Server state management and caching
- **shadcn/ui**: Pre-styled component system based on Radix

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Fast server bundling for production
- **Replit Vite Plugins**: Error overlay, cartographer, dev banner (development only)