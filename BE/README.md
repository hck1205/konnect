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
  schema.prisma          # 데이터 스키마 — User·AuthIdentity·Question·Answer·Tag
  migrations/            # 마이그레이션 이력
src/
  main.ts                # 부트스트랩 — loadEnv() 를 가장 먼저 호출한다
  app.setup.ts           # 전역 파이프/필터/인터셉터 (main 과 e2e 가 공유)
  app.module.ts          # 루트 모듈 — 도메인 모듈을 여기에 등록
  config/                # 환경변수 로더 + APP_CONFIG DI 토큰
  common/                # 공통 filters / interceptors / decorators / id
                         #   + 키셋 페이지네이션 · 소유권 확인 · 불변 필드 가드
  prisma/                # PrismaService(전역) + DB_DRIVER 저장소 스위치
  modules/               # 도메인 모듈
    health/              #   헬스체크
    auth/                #   ⚠️ 임시 로그인 + 전역 JWT 가드 (OAuth 미구현)
    users/               #   사용자 (작성자 FK 를 만족시키는 최소 형태)
    tags/                #   태그 고정 어휘·정규화 (FE 와 같은 규칙)
    questions/           #   질문 CRUD + 키셋 목록
    answers/             #   답변 + 채택
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

## API

전부 `{ data, timestamp }` 봉투로 감싸진다.

| 메서드 | 경로 | 인증 |
| --- | --- | --- |
| POST | `/auth/login` | 공개 — ⚠️ **테스트 전용, 운영에서는 404** |
| GET | `/auth/me` | 필요 |
| GET | `/questions` | 공개 — `cursor` `limit` `topic` `tags` `q` `answered` |
| GET | `/questions/:id` | 공개 (숨김 글은 작성자에게만) |
| POST | `/questions` | 필요 |
| PATCH | `/questions/:id` | 작성자 |
| DELETE | `/questions/:id` | 작성자 — **숨김**이지 물리 삭제가 아니다 |
| GET | `/questions/:id/answers` | 공개 |
| POST | `/questions/:id/answers` | 필요 |
| POST | `/questions/:id/answers/:answerId/accept` | **질문** 작성자 |
| DELETE | `/questions/:id/answers/accepted` | 질문 작성자 |
| PATCH | `/answers/:id` | 작성자 |
| DELETE | `/answers/:id` | 작성자 — 숨김 |

### 접근 정책

**Read 는 공개, Write 는 인증 + 작성자 본인.** 검색으로 들어온 사용자가 로그인
벽에 막히면 안 된다 — 유입이 주 채널이다.

전역 가드라 **기본이 "인증 필요"**이고 공개 라우트에 `@Public()` 을 붙인다.
반대로 하면 새 엔드포인트가 의도치 않게 공개된다.

### 페이지네이션

키셋(커서) 방식이다. id 가 UUIDv7(시간정렬)이라 **커서 = id 하나**로 성립한다.
offset 을 쓰지 않는 이유: 새 글이 계속 들어오므로 페이지 사이에 중복·누락이 생긴다.

```
GET /questions?limit=20&cursor=<lastId>
→ { data: { items: [...], nextCursor: "..." | null }, timestamp }
```

## 아직 안 된 것

| 항목 | 상태 |
| --- | --- |
| **소셜 OAuth** | 미구현. `/auth/login` 은 임시 통로이고 운영에서는 404 다 |
| **동일인 식별** | 제공자 id 로 찾을 경로가 없어 **로그인할 때마다 새 계정**이 된다. OAuth 도입 시 해결된다 |
| 댓글·리액션·신고 | 별도 모듈 |

## 스키마

`prisma/schema.prisma`. 결정 몇 가지:

- **비밀번호 컬럼이 없다.** 로그인은 OAuth 전용이다 — 보관하지 않으면 유출·재사용·
  재설정 흐름이 통째로 사라진다. `AuthIdentity(provider, providerId)` 가 유일한 식별 경로다
- **id 는 애플리케이션이 만드는 UUIDv7**(DB 기본값이 아니다). 시간정렬이라
  **커서 = id 하나**로 키셋 페이지네이션이 성립한다
- **시각은 `timestamptz`** — 사용자가 여러 시간대에 흩어져 있다
- **물리 삭제가 없다.** `status` 로 숨긴다
- 복합 인덱스는 **필터 먼저, 정렬 나중**(`[status, id desc]`) — 그래야 인덱스를 탄다
- `QuestionTag.position` — 태그 **입력 순서**를 저장한다. 조인 결과의 순서는
  보장되지 않는데, 먼저 적은 태그가 더 중요할 가능성이 높다

### 두 드라이버가 같은 테스트를 통과해야 한다

인메모리 구현이 계약의 정의이고 Prisma 는 그 의미를 SQL 로 옮긴 것이다.
**같은 e2e 를 두 번 돌린다.**

```bash
npm run test:e2e                                    # 인메모리
DB_DRIVER=prisma DATABASE_URL=... npm run test:e2e  # Postgres
```

한쪽만 통과하면 계약이 갈라진 것이다 — 실제로 태그 순서가 그렇게 어긋나 있었다.

**도메인 enum ↔ Prisma enum** 도 같은 종류의 계약이다. 변환이 캐스팅이라
타입 검사가 못 잡는다 — `TOPICS` 에만 주제를 추가하면 컴파일은 통과하고
DB 에 넣는 순간 터진다. `questions.mapper.spec.ts` 가 양쪽 목록을 대조한다.

### 규칙을 한 곳에만 둔다

| 규칙 | 어디에 | 갈라지면 |
| --- | --- | --- |
| 존재 + 소유 확인 | `common/assertOwned` | `!==` 를 `===` 로 잘못 쓴 한 곳에서 남의 글을 고칠 수 있게 된다 |
| patch 불변 필드 | `common/patchRecord` | `authorId` 를 빠뜨리면 **patch 로 소유권이 넘어간다** |
| 키셋 페이지네이션 | `common/paginateByCursor` | 커서 처리가 저장소마다 달라진다 |
| 태그 정규화 | `modules/tags` (FE 와 같은 규칙) | 같은 태그가 두 표기로 저장돼 필터가 무너진다 |
| 길이 제한 | `*.constants.ts` | "새로 쓸 땐 되는데 수정하면 400" |

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
