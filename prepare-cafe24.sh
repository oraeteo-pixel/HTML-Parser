#!/bin/bash
# cafe24 MySQL 배포 준비 스크립트
# 프로젝트 루트 디렉토리에서 실행하세요: bash prepare-cafe24.sh

set -e

echo "=== cafe24 MySQL 배포 준비 시작 ==="

# 1. PostgreSQL 원본 파일 백업
echo "[1/4] 원본 파일 백업 중..."
mkdir -p _backup_pg
cp shared/schema.ts _backup_pg/schema.ts
cp shared/models/auth.ts _backup_pg/auth.ts
cp server/db.ts _backup_pg/db.ts
cp server/storage.ts _backup_pg/storage.ts
cp server/replit_integrations/auth/replitAuth.ts _backup_pg/replitAuth.ts
cp server/replit_integrations/auth/storage.ts _backup_pg/auth_storage.ts
cp drizzle.config.ts _backup_pg/drizzle.config.ts

# 2. MySQL 파일로 교체
echo "[2/4] MySQL 파일로 교체 중..."
cp cafe24_mysql/shared/schema.ts shared/schema.ts
cp cafe24_mysql/shared/models/auth.ts shared/models/auth.ts
cp cafe24_mysql/server/db.ts server/db.ts
cp cafe24_mysql/server/storage.ts server/storage.ts
cp cafe24_mysql/server/auth/replitAuth.ts server/replit_integrations/auth/replitAuth.ts
cp cafe24_mysql/server/auth/storage.ts server/replit_integrations/auth/storage.ts

# drizzle.config.ts MySQL 버전으로 교체
cat > drizzle.config.ts << 'EOF'
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
EOF

# 3. 빌드
echo "[3/4] 빌드 중..."
npm run build

echo "[4/4] 완료!"
echo ""
echo "=== 배포 준비 완료 ==="
echo ""
echo "다음 단계:"
echo "  1. dist/ 폴더를 cafe24에 업로드"
echo "  2. cafe24 환경변수 설정:"
echo "     DATABASE_URL=mysql://유저:비번@호스트:3306/DB이름"
echo "     SESSION_SECRET=랜덤문자열32자이상"
echo "     NAVER_CLIENT_ID=..."
echo "     NAVER_CLIENT_SECRET=..."
echo "     KAKAO_CLIENT_ID=..."
echo "     KAKAO_CLIENT_SECRET=..."
echo "     GOOGLE_CLIENT_ID=..."
echo "     GOOGLE_CLIENT_SECRET=..."
echo "     NODE_ENV=production"
echo "  3. cafe24에서 node dist/index.js 실행"
echo ""
echo "Replit 개발 환경 복구가 필요하면: bash restore-pg.sh"
