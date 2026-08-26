import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/**
 * Ladle 전용 Vite 설정.
 *
 * `next/link` 만 스텁으로 바꾼다 — 스토리에는 Next 런타임이 없다.
 * 다른 next/* 모듈을 컴포넌트에서 쓰게 되면 여기에 alias 를 추가해야 한다.
 */
export default defineConfig({
  resolve: {
    alias: {
      'next/link': resolve(import.meta.dirname, './next-link-stub.tsx'),
    },
  },
});
