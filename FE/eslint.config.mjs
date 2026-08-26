import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next 의 기본 ignore 를 명시적으로 덮어쓴다.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**', // ladle build 산출물
    'next-env.d.ts',
  ]),
  {
    // Ladle 스토리(와 Ladle 설정)는 `export default { … }` 가 프레임워크 규약이다.
    // 이름 붙인 변수로 바꾸면 Ladle 이 메타를 못 읽는 게 아니라, 규약에서 벗어나
    // 다른 스토리와 모양이 갈린다. 이 파일들에서만 규칙을 끈다.
    files: ['**/*.stories.tsx', '.ladle/config.mjs'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
]);

export default eslintConfig;
