#!/bin/bash
# Replit PostgreSQL 환경으로 복구
# prepare-cafe24.sh 실행 후 개발 환경으로 돌아올 때 사용
# 프로젝트 루트에서 실행: bash restore-pg.sh

set -e

if [ ! -d "_backup_pg" ]; then
  echo "백업 폴더(_backup_pg)가 없습니다. prepare-cafe24.sh를 먼저 실행하세요."
  exit 1
fi

echo "=== PostgreSQL 개발 환경으로 복구 중 ==="

cp _backup_pg/schema.ts shared/schema.ts
cp _backup_pg/auth.ts shared/models/auth.ts
cp _backup_pg/db.ts server/db.ts
cp _backup_pg/storage.ts server/storage.ts
cp _backup_pg/replitAuth.ts server/replit_integrations/auth/replitAuth.ts
cp _backup_pg/auth_storage.ts server/replit_integrations/auth/storage.ts
cp _backup_pg/drizzle.config.ts drizzle.config.ts

echo "복구 완료! Replit에서 앱을 다시 시작하세요."
