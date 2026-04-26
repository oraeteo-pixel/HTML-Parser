# Vercel 배포 가이드

## 1. GitHub에 코드 업로드

GitHub 리포지토리에 push하면 됩니다.  
이미 `origin`이 `https://github.com/oraeteo-pixel/HTML-Parser`로 연결되어 있습니다.

## 2. Neon 데이터베이스 설정

1. [https://neon.tech](https://neon.tech) 에서 무료 계정 생성
2. 새 프로젝트 생성 → Connection String 복사 (형식: `postgresql://...`)
3. 복사한 URL을 `DATABASE_URL` 환경변수로 사용

## 3. Vercel 프로젝트 생성

1. [https://vercel.com](https://vercel.com) 접속 → GitHub으로 로그인
2. **"Add New Project"** 클릭
3. `oraeteo-pixel/HTML-Parser` 리포지토리 선택
4. **Framework Preset**: Other
5. **Build Command**: `npx vite build` (vercel.json에 이미 설정됨)
6. **Output Directory**: `dist/public` (vercel.json에 이미 설정됨)

## 4. 환경변수 설정 (Vercel 대시보드)

Vercel 프로젝트 → Settings → Environment Variables에서 아래 값들을 추가:

| 변수명 | 값 | 필수 |
|--------|-----|------|
| `DATABASE_URL` | Neon 연결 문자열 | ✅ 필수 |
| `SESSION_SECRET` | 임의의 긴 문자열 (32자 이상) | ✅ 필수 |
| `NAVER_CLIENT_ID` | 네이버 앱 ID | 로그인 기능 시 |
| `NAVER_CLIENT_SECRET` | 네이버 앱 시크릿 | 로그인 기능 시 |
| `NAVER_CALLBACK_URL` | `https://your-domain.vercel.app/api/auth/naver/callback` | 로그인 기능 시 |
| `KAKAO_CLIENT_ID` | 카카오 앱 키 | 로그인 기능 시 |
| `KAKAO_CLIENT_SECRET` | 카카오 앱 시크릿 | 로그인 기능 시 |
| `KAKAO_CALLBACK_URL` | `https://your-domain.vercel.app/api/auth/kakao/callback` | 로그인 기능 시 |
| `GOOGLE_CLIENT_ID` | 구글 클라이언트 ID | 로그인 기능 시 |
| `GOOGLE_CLIENT_SECRET` | 구글 클라이언트 시크릿 | 로그인 기능 시 |
| `GOOGLE_CALLBACK_URL` | `https://your-domain.vercel.app/api/auth/google/callback` | 로그인 기능 시 |

> **SESSION_SECRET 생성법**: 아무 문자열이나 32자 이상이면 됩니다.  
> 예: `my-super-secret-orae-session-key-2024`

## 5. 데이터베이스 테이블 생성

배포 후 Neon 콘솔 또는 로컬에서 실행:

```bash
DATABASE_URL="your-neon-url" npx drizzle-kit push
```

## 6. 배포 확인

- Vercel이 자동으로 빌드 및 배포
- 배포 완료 후 `https://your-project.vercel.app` 접속

## 주의사항

- **파일 업로드**: Vercel 서버리스 환경에서 업로드된 파일은 `/tmp`에 임시 저장되며,
  함수 실행이 끝나면 사라집니다. 영구 저장이 필요하면 Cloudinary, AWS S3, Supabase Storage 등을 연동해야 합니다.
- **로그인 기능**: 현재 코드에는 네이버/카카오/구글 OAuth가 이미 구현되어 있습니다.
  나중에 각 플랫폼에서 앱 등록 후 환경변수만 추가하면 활성화됩니다.
