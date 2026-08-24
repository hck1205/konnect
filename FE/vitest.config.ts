import { configDefaults, defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

/**
 * 단위 테스트 설정. utils 등 순수 함수의 unit test를 대상으로 한다.
 * (컴포넌트 테스트가 필요해지면 environment를 jsdom으로 바꾸고 RTL을 추가)
 * 통합 테스트(*.integration.test.ts)는 라이브 BE가 필요하므로 여기서 제외 —
 * vitest.integration.config.ts / `npm run test:integration` 으로 실행한다.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    exclude: [...configDefaults.exclude, '**/*.integration.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
});
