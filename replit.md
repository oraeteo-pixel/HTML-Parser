# replit.md

## Overview

This project is a Korean-language community calendar web application, "오리알터닷컴," built with a full-stack TypeScript architecture. It integrates a unique East Asian calendar system, "황극력" (Hwanggeuknyeok), which goes beyond traditional astronomical and geographical principles to emphasize human-centric destiny management. This calendar displays elements like Heavenly Stems, Earthly Branches, and Twenty-Eight Mansions. Alongside this, the application provides a modern community posting system with user authentication and rich content management capabilities, including code snippets and a messaging system.

The core philosophy revolves around the "황극력," a proprietary calendrical system distinct from conventional East Asian calendars ("선천력"). The application aims to embody the essence of this new paradigm, where humanity actively shapes its destiny.

## User Preferences

Preferred communication style: Simple, everyday language.
The "황극력" calculation method is based on unique, proprietary rules known only to the user. Do not attempt to infer or alter these rules; always confirm with the user if questions arise regarding "황극력" calculations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: Shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables and custom Korean fonts (Noto Sans KR, Nanum Gothic)
- **Build Tool**: Vite

The frontend employs a component-based structure, separating pages, reusable components, custom hooks, and UI primitives.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with `tsx`
- **API Design**: RESTful API with typed route definitions shared between client and server using Zod.
- **Authentication**: Passport.js (Local Strategy, session-based with `express-session`)
- **Password Security**: Scrypt hashing

The backend organizes routes, authentication, and database access into distinct modules.

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema**: Defined in `shared/schema.ts` and used by both client and server.
- **Migrations**: Drizzle Kit
- **Session Store**: MemoryStore (development), `connect-pg-simple` (production ready)

Key database tables include `users` and `posts`. Additional tables `code_snippets` and `messages` support new features.

### Shared Code Pattern
The `shared/` directory contains common code like Drizzle table definitions, Zod validation schemas, and API contract definitions, ensuring type safety and consistency across the full stack.

### Core Features & Design
- **Hwanggeuknyeok Calendar**: Displays traditional East Asian calendar elements, including Heavenly Stems, Earthly Branches, and Twenty-Eight Mansions. Features an 81-palace (81궁) system with dynamic small-palace (소궁) and great-palace (대궁) calculations, and 64 hexagram (64괘) representations. Includes a 60-ganji timetable.
- **Calendar Export**: Provides an Excel download function for calendar data (1989-2050).
- **Community Posting System**: Supports rich content editing with image/video uploads, YouTube embeds, and object storage integration.
- **Code Snippet Repository**: Allows users to save, categorize, and manage code snippets with public/private settings.
- **Messaging System**: Enables private messaging between users with read status tracking.
- **UI/UX**: Features a 24-season (24절국) circular chart visualizing 팔괘 (Bagua) and Twenty-Eight Mansions, designed with an intuitive calendar navigation.

## External Dependencies

### Database
- PostgreSQL
- Drizzle ORM
- Drizzle Zod

### Frontend Libraries
- `@tanstack/react-query`
- `@radix-ui/*`
- `date-fns`
- `korean-lunar-calendar`
- `lucide-react`
- `react-hook-form` with `@hookform/resolvers`
- `wouter`
- `framer-motion`

### Backend Libraries
- `express`
- `express-session`
- `passport`
- `passport-local`
- `drizzle-orm` with `pg`
- `zod`

### Build & Development Tools
- Vite
- esbuild
- tsx