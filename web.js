// Cafe24 호스팅용 진입점 (Entry point for Cafe24 hosting)
// 빌드 후 실행: npm run build && node web.js

// Production 모드 설정
process.env.NODE_ENV = 'production';

// 컴파일된 서버 실행
require('./dist/index.cjs');
