import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

/**
 * FE ↔ BE 통합 테스트 설정 — FE의 api 계층(axios)을 라이브 BE에 붙여 검증한다.
 *
 * 실행 전제: BE dev 서버가 떠 있어야 한다.
 *   cd BE && npm run start:dev   →   cd FE && npm run test:integration
 *
 * Next 프록시(rewrites)를 거치지 않으므로 baseURL을 BE로 직접 지정한다.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    env: {
      NEXT_PUBLIC_API_BASE_URL:
        process.env.INTEGRATION_API_URL ?? 'http://localhost:4000',
    },
    // 라이브 서버 왕복이 있으므로 단위 테스트보다 여유 있게
    testTimeout: 15_000,
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
});
