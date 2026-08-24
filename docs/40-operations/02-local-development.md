# 로컬 개발

## 처음 한 번

```bash
git clone <repo> && cd konnect

# BE
cd BE
npm install
cp .env.example .env.development
npm run db:generate          # Prisma Client 생성 (DB 불필요)

# FE
cd ../FE
npm install
cp .env.example .env.local
```

## 평소

터미널 두 개:

```bash
# 1) BE — DB 없이 뜬다 (DB_DRIVER=memory)
cd BE && npm run start:dev        # http://localhost:4000

# 2) FE
cd FE && npm run dev              # http://localhost:3000
```

FE의 `/api/*`가 BE로 프록시되므로 CORS 설정 없이 붙는다.

## Postgres를 쓸 때

`.env.development`에서 `DB_DRIVER=prisma`로 바꾸고:

```bash
cd BE && npm run dev              # = db:migrate && start:dev
```

## 커밋 전 체크

```bash
# BE
cd BE && npm run lint && npm run build && npm test && npm run test:e2e

# FE
cd FE && npm run lint && npm run typecheck && npm test && npm run build
```

## 왜 DB 없이 개발할 수 있게 해 두었나

새로 합류한 사람이 **Postgres 설치 없이 5분 만에** 앱을 띄울 수 있어야 하고,
CI가 DB 컨테이너 없이 돌아야 한다. `DB_DRIVER` 스위치가 그 장치다
([BE/README.md](../../BE/README.md)).

## 열린 질문

- CI를 무엇으로 돌릴 것인가? (GitHub Actions 유력)
- pre-commit 훅으로 lint/format을 강제할 것인가?
