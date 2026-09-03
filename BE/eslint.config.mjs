// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // scripts/ 는 타입 프로젝트 밖의 순수 .mjs 다(node --test 로 돌린다).
    // 여기 없으면 `npx eslint .` 가 '프로젝트에서 찾을 수 없다' 로 실패해
    // 다음 사람이 없는 문제를 쫓는다 — npm run lint 는 애초에 scripts/ 를
    // 대상에 넣지 않으므로 동작 변화는 없다.
    ignores: ['eslint.config.mjs', 'dist/**', 'coverage/**', 'scripts/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // `_` 접두사를 "의도적으로 안 쓰는 인자"로 인정한다.
      // 인터페이스를 구현하느라 시그니처는 맞춰야 하지만 본문에서 안 쓰는 경우가 있다
      // (예: 아직 구현되지 않은 Prisma 저장소).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
