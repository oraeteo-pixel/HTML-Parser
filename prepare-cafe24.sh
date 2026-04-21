#!/bin/bash
# cafe24 MySQL 배포 준비 스크립트
# 프로젝트 루트 디렉토리에서 실행하세요: bash prepare-cafe24.sh

set -e

echo "=== cafe24 MySQL 배포 준비 시작 ==="

# .env.cafe24 파일 확인
if [ ! -f ".env.cafe24" ]; then
  echo "[오류] .env.cafe24 파일이 없습니다!"
  echo "프로젝트 루트에 .env.cafe24 파일을 만들고 환경변수를 설정하세요."
  exit 1
fi

# 1. PostgreSQL 원본 파일 백업
echo "[1/5] 원본 파일 백업 중..."
mkdir -p _backup_pg
cp shared/schema.ts _backup_pg/schema.ts
cp shared/models/auth.ts _backup_pg/auth.ts
cp server/db.ts _backup_pg/db.ts
cp server/storage.ts _backup_pg/storage.ts
cp server/replit_integrations/auth/replitAuth.ts _backup_pg/replitAuth.ts
cp server/replit_integrations/auth/storage.ts _backup_pg/auth_storage.ts
cp drizzle.config.ts _backup_pg/drizzle.config.ts

# 2. MySQL 파일로 교체
echo "[2/5] MySQL 파일로 교체 중..."
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
echo "[3/5] 빌드 중..."
npm run build

# 4. .env.cafe24 → dist/.env 복사
echo "[4/5] 환경변수 파일 복사 중..."
cp .env.cafe24 dist/.env
echo "  ✓ dist/.env 생성 완료"

# 5. PostgreSQL 파일 복구 (Replit 개발환경 보존)
echo "[5/5] Replit 개발환경 복구 중..."
cp _backup_pg/schema.ts shared/schema.ts
cp _backup_pg/auth.ts shared/models/auth.ts
cp _backup_pg/db.ts server/db.ts
cp _backup_pg/storage.ts server/storage.ts
cp _backup_pg/replitAuth.ts server/replit_integrations/auth/replitAuth.ts
cp _backup_pg/auth_storage.ts server/replit_integrations/auth/storage.ts
cp _backup_pg/drizzle.config.ts drizzle.config.ts

echo ""
echo "=== 배포 준비 완료 ==="
echo ""
echo "dist/ 폴더 내용:"
ls dist/
echo ""
echo "다음 단계:"
echo "  1. dist/ 폴더 전체를 cafe24 서버에 업로드"
echo "  2. cafe24 서버에서 MySQL 마이그레이션 실행:"
echo "     node dist/migrate.cjs  (또는 cafe24 콘솔에서 실행)"
echo "  3. cafe24 Node.js 앱 시작 명령:"
echo "     node dist/index.cjs"
echo "  4. 포트: 8001 (cafe24 앱 설정에서 확인)"
echo ""
echo "⚠️  OAuth 콜백 URL 등록 확인:"
echo "     네이버: https://oraem.cafe24app.com/api/auth/naver/callback"
echo "     카카오: https://oraem.cafe24app.com/api/auth/kakao/callback"
echo "     구글:   https://oraem.cafe24app.com/api/auth/google/callback"
