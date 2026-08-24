# konnect BE

konnect 백엔드 — NestJS + Postgres(Prisma).

## 시작하기

```bash
npm install
cp .env.example .env.development   # 로컬 기본값 사용 시 그대로 두면 된다
npm run start:dev                  # http://localhost:4000  (DB_DRIVER=memory 면 DB 불필요)
```

Postgres에 붙일 때는 `.env.development`의 `DB_DRIVER=prisma`로 바꾸고:

```bash
npm run dev        # = db:migrate && start:dev
```

## 폴더 구조

```
prisma/
  schema.prisma          # 데이터 스키마 (모델은 도메인이 정해질 때 추가)
src/
  main.ts                # 부트스트랩 — loadEnv() 를 가장 먼저 호출한다
  app.setup.ts           # 전역 파이프/필터/인터셉터 (main 과 e2e 가 공유)
  app.module.ts          # 루트 모듈 — 도메인 모듈을 여기에 등록
  config/                # 환경변수 로더 + APP_CONFIG DI 토큰
  common/                # 공통 filters / interceptors / decorators / id
  prisma/                # PrismaService(전역) + DB_DRIVER 저장소 스위치
  modules/               # 도메인 모듈 (health/ 가 최소 예시)
    health/
  utils/                 # 순수 함수 (string/array/number/boolean)
test/                    # e2e (*.e2e-spec.ts)
```

### 도메인 모듈 관례

한 도메인(`posts/`)은 아래 구성을 따른다:

```
posts/
  posts.controller.ts
  posts.service.ts
  posts.module.ts
  dto/                       # class-validator DTO (전역 ValidationPipe 가 검증)
  entities/                  # 저장소 경계의 레코드 타입
  repositories/
    posts.repository.ts      #   인터페이스 + DI 토큰 + 인메모리 구현
    posts.prisma.repository.ts
  index.ts                   # 모듈/공개 타입만 export
```

## 응답 계약

성공 응답은 전역 `TransformInterceptor`가 봉투로 감싼다:

```json
{ "data": <payload>, "timestamp": "2026-08-24T14:00:00.000Z" }
```

에러는 전역 `HttpExceptionFilter`가 `{ statusCode, path, timestamp, message }`로 정규화한다.
FE는 `query/client.ts`의 `unwrap()`으로 봉투를 벗긴다.

## 저장소 드라이버 스위치 (`DB_DRIVER`)

각 도메인 모듈의 저장소는 `DB_DRIVER` 값으로 구현이 선택된다.

| `DB_DRIVER` | 구현 | 용도 |
| --- | --- | --- |
| (미설정) | `InMemory*Repository` | 기본값. DB 없이 동작(테스트/데모) |
| `memory` | `InMemory*Repository` | 명시적 인메모리 |
| `prisma` | `Prisma*Repository` | Postgres(Prisma) |

- 선택은 `src/prisma/repository.provider.ts`의 `useFactory`가 담당한다(DI 해석 시점 평가).
- **테스트는 `DB_DRIVER`를 설정하지 않으므로 항상 인메모리** → DB 없이 `jest`/`e2e`가 그린.

## 환경변수 파일 로딩

부팅 시 `src/config/load-env.ts`가 다음 순서로 로드한다(먼저 채워진 값이 이긴다):

1. 이미 설정된 `process.env` (OS/배포 환경변수) — 항상 최우선
2. `.env.${NODE_ENV}` (예: `.env.development`)
3. `.env` (공통 기본값, 있으면)

변수 목록/설명은 커밋된 **`.env.example`** 참고. `.env*`는 gitignore 대상이다.

## 스크립트

| 스크립트 | 동작 |
| --- | --- |
| `npm run start:dev` | 개발 서버(watch) |
| `npm run dev` | 마이그레이션 적용 후 개발 서버 기동 |
| `npm run build` | `nest build` |
| `npm run start:prod` | `NODE_ENV=production node dist/main` |
| `npm run lint` | eslint --fix |
| `npm run test` | jest 단위 테스트(`src/**/*.spec.ts`) |
| `npm run test:e2e` | jest e2e(`test/**/*.e2e-spec.ts`) |
| `npm run db:generate` | `prisma generate` — Client 생성(DB 불필요) |
| `npm run db:migrate` | 로컬 마이그레이션 생성/적용(`.env.development` 로드) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:deploy` | `prisma migrate deploy` — 운영 마이그레이션 적용 |

## 운영 배포

`.env.production` 파일은 **커밋하지 않는다.** 아래 변수를 배포 환경에 직접 주입한다.

- `NODE_ENV=production`, `PORT`, `CORS_ORIGIN`
- `DB_DRIVER=prisma`
- `DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?schema=public`

```bash
npm ci
npm run build
npm run db:deploy
npm run start:prod
```
