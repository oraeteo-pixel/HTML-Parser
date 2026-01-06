# replit.md

## Overview

This is a Korean-language community calendar web application ("오리알터닷컴") built with a full-stack TypeScript architecture. The app features a traditional East Asian calendar system displaying Heavenly Stems, Earthly Branches, Twenty-Eight Mansions, and other traditional calendar elements alongside a modern community posting system with user authentication.

## 프로젝트 철학 (Project Philosophy)

### 문명과 역법의 기원
- **60갑자의 기원**: 10간(天干) + 12지(地支) = 60주기 → 메소포타미아 60진법과 동일 원리
- **문명 전파**: 천문(天文)과 지리(地理)를 이해한 지도자들이 이동하며 문명 창조
- **이동 원리**: 지구 세차운동(26,000년 주기), 태양·별의 기운, 기후 패턴에 따라 이동

### 천지인(天地人) 삼원과 시대 전환
| 시대 | 중심 | 원리 | 역법 |
|------|------|------|------|
| 과거 | 天 (하늘) | 하도(河圖) | 천문 중심 역법 |
| 현재 | 地 (땅) | 낙서(洛書) | 지리 중심 역법 |
| **미래** | **人 (인간)** | **황극(皇極)** | **인간 중심 역법** |

### 황극력의 의미
- 과거: 천문·지리를 따르기만 하던 시대
- 미래: **인간이 스스로 운명을 경영하는 시대**
- 황극력 = 새로운 문명 패러다임의 표현
- 이 앱(오리알터닷컴)은 그 정수를 담아내는 것이 목표

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

## Recent Changes (2026-01-07)

### 소궁/대궁 (81궁) 공식 계산 완성

#### 철학적 배경 (천지인 삼원)
- **하도(河圖)** = 天(하늘) - 선천, 생성의 원리, 총합 55
- **낙서(洛書)** = 地(땅) - 후천, 질서의 원리, 총합 45
- **황극(皇極)** = 人(인간) - 낙서를 되돌린 것
- **핵심 공식**: 낙서 숫자 + 황극 숫자 = 11 (보수 관계)
  - 1↔10, 2↔9, 3↔8, 4↔7, 5↔6
- **Position 쌍 합 = 12**: 6을 중심으로 대칭
  - Position 2↔10, 3↔9, 4↔8, 5↔7 (중궁 6)
- **732 반일**: 1년 = 366일 × 2(오전/오후) = 732 반일
  - 732 중 몇 번째인지 알면 대궁 결정 가능

#### 계산 공식
- **모든 시간은 한국 시간(UTC+9) 기준**
- **시작점(Epoch)**: 황극력 연초 전날 밤 23:00 (양력 4월 20일 23:00 KST)
- **대궁 계산 공식**:
  - 반일(12시간=720분) 수 계산: `totalHalfDays = (현재시간 - 시작점) / 720분`
  - 대궁 = `(totalHalfDays + 5) % 9 + 2` (2~10 순환)
  - calibrationOffset = 5 (2026년 1월 7일 오전에 대궁=7 맞춤)
- **Position(24절국) 계산 공식**:
  - 대궁사이클 수: `daegungCycleNum = totalHalfDays / 9`
  - Position = `(daegungCycleNum + 3) % 9 + 2` (2~10 순환)
  - positionOffset = 3 (2026년 1월 7일에 position=9 맞춤)
- **소궁 계산**:
  - 시간 슬롯: 23:20부터 80분 간격 (슬롯 1-9 오전, 10-18 오후)
  - 소궁 = SOGUNG_PATTERNS[position][슬롯인덱스]
- **소궁 패턴** (position별, 낙서 기반):
  - Position 2: [2,3,4,5,6,7,8,9,10]
  - Position 3: [3,4,7,2,6,10,5,8,9]
  - Position 4: [4,7,10,3,6,9,2,5,8]
  - Position 5: [5,2,3,8,6,4,9,10,7]
  - Position 6: [6,6,6,6,6,6,6,6,6] (중궁)
  - Position 7: [7,10,9,4,6,8,3,2,5]
  - Position 8: [8,5,2,9,6,3,10,7,4]
  - Position 9: [9,8,5,10,6,2,7,4,3]
  - Position 10: [10,9,8,7,6,5,4,3,2]

### 64괘 표시 기능 추가 (2026-01-07)
- **소궁/대궁과 64괘 관계**:
  - 소궁 = 상괘 (위, 흔들리는 것, 변하는 것)
  - 대궁 = 하괘 (아래, 뿌리, 고정된 것)
- **숫자 → 팔괘 매핑**:
  - 2=坤(곤/地), 3=艮(간/山), 4=坎(감/水), 5=震(진/雷)
  - 6=中(중궁), 7=巽(손/風), 8=離(리/火), 9=兌(태/澤), 10=乾(건/天)
- **예시**: 소궁 10(乾) + 대궁 7(巽) = 天風姤
- **시간 슬롯 시작**: 23:20부터 80분 간격

### 24절국 원형 차트 완성 (2026-01-05)
- **팔괘(八卦) 배치**: 12시-곤(☷), 1시-리(☲), 3시-태(☱), 5시-진(☳), 6시-건(☰), 7시-감(☵), 9시-간(☶), 11시-손(☴) - 모두 중심을 바라보게 회전
- **28수(二十八宿) 수정**: 
  - 辰 위치: 壁奎 (double mansion)
  - 震 위치: 室
  - 坎 위치: 箕斗 (double mansion)
- **숫자 화살표 연결**: 1→2→3→4→5→6→7→8→9→10 순서로 낙서(洛書) 패턴 표시
- **24방 배치**: 亥가 12시 방향, 寅申巳亥가 사방위(90°간격)에 정확히 위치
- **24절국 회전**: 元和(원화)가 酉(유)방에 오도록 1칸 회전

### 리치 에디터 및 콘텐츠 관리 시스템 (2026-01-06)
- **RichEditor 컴포넌트**: `client/src/components/RichEditor.tsx`
  - 드래그 앤 드롭 파일 업로드
  - 이미지/동영상/파일 업로드 버튼
  - YouTube URL 임베드 (유튜브 링크 또는 영상 ID 지원)
  - 파일별 에러 처리 및 토스트 알림
  - 업로드 중 제출 버튼 비활성화
- **Object Storage 연동**:
  - Presigned URL 방식으로 Google Cloud Storage 직접 업로드
  - public/private 디렉토리 지원
- **콘텐츠 섹션**:
  - posts 테이블에 section 필드 추가 (ebook/madang 구분)
  - youtubeUrls 필드 추가 (YouTube 영상 ID 배열)
  - `/api/posts/section/:section` 엔드포인트 추가