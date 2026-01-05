# replit.md

## Overview

This is a Korean-language community calendar web application ("오리알터닷컴") built with a full-stack TypeScript architecture. The app features a traditional East Asian calendar system displaying Heavenly Stems, Earthly Branches, Twenty-Eight Mansions, and other traditional calendar elements alongside a modern community posting system with user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom Korean fonts (Noto Sans KR, Nanum Gothic)
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- UI primitives in `client/src/components/ui/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Design**: RESTful API with typed route definitions in `shared/routes.ts`
- **Authentication**: Passport.js with Local Strategy, session-based auth using express-session
- **Password Security**: Scrypt hashing with timing-safe comparison

The server structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route handlers
- `server/auth.ts` - Authentication configuration
- `server/storage.ts` - Database access layer
- `server/db.ts` - Database connection

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Migrations**: Drizzle Kit with migrations output to `./migrations`
- **Session Store**: MemoryStore (development), connect-pg-simple available for production

Database tables:
- `users` - User accounts with username, password (hashed), nickname
- `posts` - Community posts with title, content, author reference

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and Zod validation schemas
- `routes.ts` - API contract definitions with typed inputs/outputs using Zod

## External Dependencies

### Database
- PostgreSQL database required (via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- Drizzle Zod for automatic schema validation

### Frontend Libraries
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Accessible UI primitives (20+ packages)
- `date-fns` - Date manipulation for calendar
- `lucide-react` - Icon library
- `react-hook-form` with `@hookform/resolvers` - Form handling
- `wouter` - Lightweight routing
- `framer-motion` - Animations (in requirements)

### Backend Libraries
- `express` with `express-session` - Web server and sessions
- `passport` with `passport-local` - Authentication
- `drizzle-orm` with `pg` - Database access
- `zod` - Runtime validation

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling (production)
- tsx for TypeScript execution (development)
- Replit-specific plugins for development experience