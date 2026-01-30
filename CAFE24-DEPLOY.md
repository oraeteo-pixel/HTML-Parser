# Cafe24 Node.js 호스팅 배포 가이드

## 배포 전 준비

### 1. 빌드 실행
```bash
npm run build
```

### 2. 업로드할 파일/폴더
Cafe24에 다음 파일들을 업로드하세요:

```
web.js                    ← 진입점 (필수)
dist/
  └── index.cjs           ← 컴파일된 서버
  └── public/             ← 컴파일된 프론트엔드
node_modules/             ← 의존성 패키지
package.json              ← 패키지 정보
```

### 3. 환경 변수 설정
Cafe24 호스팅 관리자에서 다음 환경 변수를 설정하세요:

```
DATABASE_URL=postgresql://사용자:비밀번호@호스트:포트/데이터베이스
SESSION_SECRET=임의의_긴_문자열
NODE_ENV=production
PORT=Cafe24에서_제공하는_포트
```

### 4. PostgreSQL 데이터베이스
- Cafe24에서 PostgreSQL 데이터베이스를 별도로 생성하거나
- 외부 PostgreSQL 서비스 (Supabase, Neon 등) 사용

### 5. 시작 명령
Cafe24 Node.js 호스팅 시작 명령:
```
node web.js
```

## 중요 사항

1. **web.js**가 최상위 폴더에 있어야 합니다.
2. **dist/** 폴더 전체를 업로드해야 합니다.
3. **node_modules**도 함께 업로드하거나, Cafe24에서 `npm install` 실행
4. 데이터베이스 연결 정보가 올바른지 확인하세요.

## 테스트
로컬에서 production 모드 테스트:
```bash
npm run build
node web.js
```
