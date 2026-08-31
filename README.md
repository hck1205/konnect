# konnect

> **Korea + connect** — 한국에 살거나, 여행·이민·유학으로 오는 외국인이
> 겪는 문제를 서로의 경험으로 푸는 커뮤니티.

비자·어학·학교·주거·취업·교류 등 한국 생활에서 부딪히는 이슈를 다루고,
한 번 잘 답해진 질문이 다음 사람에게 문서로 남게 하는 것을 목표로 한다.

> 상태: **초기 세팅 단계.** 앱 골격과 기획 문서만 있고 도메인 기능은 아직 없다.

## 저장소 구조

```
konnect/
├─ docs/    기획·도메인·아키텍처·운영 문서
├─ BE/      NestJS + Prisma (Postgres)
├─ FE/      Next.js (App Router)
└─ contracts/  FE·BE 가 같아야 하는 규칙 (양쪽 테스트가 대조한다)
```

| 폴더 | 문서 |
| --- | --- |
| [**현재 상태**](./docs/00-overview/07-current-state.md) | **이어받을 때 여기부터** — 진행 상황·막힌 것·함정 |
| [`docs/`](./docs/) | [문서 인덱스](./docs/README.md) — 여기서 시작 |
| [`BE/`](./BE/) | [BE README](./BE/README.md) |
| [`FE/`](./FE/) | [FE README](./FE/README.md) · [아키텍처](./FE/ARCHITECTURE.md) · [디자인 시스템](./docs/25-design/) |
| [`contracts/`](./contracts/) | [경계 계약](./contracts/README.md) — 갈라지면 양쪽 테스트가 깨진다 |

## 빠른 시작

터미널 두 개. BE는 `DB_DRIVER=memory` 기본값이라 **Postgres 없이도 뜬다**.

```bash
# 1) BE
cd BE
npm install
cp .env.example .env.development
npm run start:dev            # http://localhost:4000

# 2) FE
cd FE
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

FE의 `/api/*`가 BE로 프록시되므로 CORS 설정 없이 붙는다.
자세한 내용은 [로컬 개발](./docs/40-operations/02-local-development.md).

## 기술 스택

| | |
| --- | --- |
| FE | Next.js 16 (App Router) · TypeScript · Tailwind v4 · jotai · TanStack Query · axios · vitest · Ladle |
| BE | NestJS 11 · TypeScript · Prisma · PostgreSQL · jest |

## 문서 먼저 읽기

1. [제품 비전](./docs/00-overview/01-product-vision.md) — 한 줄 정의
2. [문제 정의](./docs/00-overview/02-problem-statement.md) — 무엇이 문제인가
3. [MVP 범위](./docs/20-product/04-mvp-scope.md) — 처음 무엇을 만드는가
4. [디자인 토큰](./docs/25-design/02-tokens.md) — 화면을 무엇으로 만드는가
5. [시스템 개요](./docs/30-architecture/01-system-overview.md) — 어떻게 만드는가

## 커밋 전 체크

```bash
cd BE && npm run lint && npm run build && npm test && npm run test:e2e
cd FE && npm run lint && npm run typecheck && npm test && npm run check:contrast && npm run build
```
