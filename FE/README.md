# konnect FE

konnect 프론트엔드 — Next.js(App Router) · TypeScript · Tailwind · jotai · TanStack Query.

아키텍처와 폴더/컴포넌트 컨벤션은 [ARCHITECTURE.md](./ARCHITECTURE.md) 참고.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 로컬 기본값을 쓸 거라면 그대로 둬도 된다
npm run dev                  # http://localhost:3000
```

BE(:4000)를 함께 띄우면 `/api/*` 프록시로 붙는다(`next.config.ts`의 rewrites).

```bash
cd ../BE && npm run start:dev
```

## 스크립트

| 스크립트 | 동작 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 서빙 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |
| `npm run test` | vitest 단위 테스트 |
| `npm run test:integration` | 라이브 BE 대상 통합 테스트(BE 먼저 기동) |

## 환경변수

`.env.example` 참고. `.env*`는 gitignore 대상이다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | BE 주소. 비우면 `/api`(rewrites 프록시)로 떨어진다 |
| `API_PROXY_TARGET` | rewrites 프록시 대상. **빌드 시점** 값이다 |
