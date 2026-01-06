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
- `korean-lunar-calendar` - Korean lunar calendar (KARI standard, 1000-2050)
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

## Recent Changes (2026-01-06)

### 소궁/대궁 (81궁) 계산 시스템 완성
- **연간 구조**: 366일 = 364.5일(81궁 순환) + 1.5일(존궁)
- **시간 단위**:
  - 1 소궁 = 80분
  - 1 대궁 = 9 소궁 = 720분 (12시간, 오전/오후)
  - 1 대궁사이클 = 9 대궁 = 4.5일
  - 9 대궁사이클 = 40.5일
  - 81 대궁사이클 = 364.5일
- **시작점**: 황극력 1월 1일 전날 밤 23:00 (양력 4월 20일 23:00)
- **대궁 순환**: 2→3→4→5→6→7→8→9→10 (매 12시간마다 변경)
- **소궁 순환 패턴** (낙서 기반, 대궁사이클에 따라):
  - 사이클 1: [2,3,4,5,6,7,8,9,10]
  - 사이클 2: [3,4,7,2,6,10,5,8,9]
  - 사이클 3: [4,7,10,3,6,9,2,5,8]
  - 사이클 4: [5,2,3,8,6,4,9,10,7]
  - 사이클 5: [6,6,6,6,6,6,6,6,6] (중궁)
  - 사이클 6: [7,10,9,4,6,8,3,2,5]
  - 사이클 7: [8,9,2,7,6,5,10,3,4]
  - 사이클 8: [9,2,5,8,6,4,7,10,3]
  - 사이클 9: [10,7,8,3,6,9,4,5,2]
- **오프셋**: 4 반일(2일) 오프셋 적용 for 원화 시작점 정렬

### 24절국 원형 차트 완성 (2026-01-05)
- **팔괘(八卦) 배치**: 12시-곤(☷), 1시-리(☲), 3시-태(☱), 5시-진(☳), 6시-건(☰), 7시-감(☵), 9시-간(☶), 11시-손(☴) - 모두 중심을 바라보게 회전
- **28수(二十八宿) 수정**: 
  - 辰 위치: 壁奎 (double mansion)
  - 震 위치: 室
  - 坎 위치: 箕斗 (double mansion)
- **숫자 화살표 연결**: 1→2→3→4→5→6→7→8→9→10 순서로 낙서(洛書) 패턴 표시
- **24방 배치**: 亥가 12시 방향, 寅申巳亥가 사방위(90°간격)에 정확히 위치
- **24절국 회전**: 元和(원화)가 酉(유)방에 오도록 1칸 회전