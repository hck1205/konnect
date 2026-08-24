# konnect FE — 아키텍처 & 컨벤션

Next.js(App Router) · TypeScript · Tailwind · jotai · axios · TanStack Query

## 기술 스택

| 관심사 | 라이브러리 |
|--------|-----------|
| 프레임워크 | Next.js 16 (App Router, `src/` 디렉터리) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 클라이언트 상태 | jotai (atoms) |
| 서버 상태/캐시 | TanStack Query(react-query) |
| HTTP | axios |
| 테스트 | vitest |

## 폴더 구조

```
src/
  app/                     # Next.js App Router — 라우팅 셸만 (화면은 views/)
    layout.tsx             #   Providers 주입
    providers.tsx          #   react-query + jotai Provider ('use client')
    page.tsx               #   홈 → views/HomePage
    globals.css            #   Tailwind + 디자인 토큰(@theme)
  views/                   # 페이지 컴포넌트 (app은 이걸 렌더만; src/pages는 Next 충돌로 금지)
    HomePage/
  components/              # UI 컴포넌트 (관심사별 폴더)
    common/                #   공통 재사용 컴포넌트
  atoms/                   # jotai 전역 상태 (관심사별)
  query/                   # 서버 통신 (axios + react-query, 관심사별)
    client.ts              #   공용 axios 인스턴스 + 봉투 unwrap/orNull + Bearer 인터셉터
  types/                   # 공유 도메인 모델
  utils/                   # 순수 함수 (string/array/number/boolean)
  lib/                     # 앱 인프라 (query-client, cn, routes, apiBase, auth-token)
```

## 컴포넌트 규약 (핵심)

컴포넌트는 **폴더 단위**로, 아래 파일 구성을 따른다:

```
{Name}/
  hooks/                 # 이 컴포넌트에서 쓰는 훅 모음
    use{Name}.ts
    index.ts
  {Name}.types.ts        # 이 컴포넌트의 타입 (공통화되면 상위 공통 타입으로 승격)
  {Name}.utils.ts        # 이 컴포넌트의 유틸 (공통화되면 @/utils 로 승격)
  {Name}.view.tsx        # UI만 담당 (프레젠테이셔널, 상태 없음)
  {Name}.tsx             # business logic 담당 (훅 소비 → view에 위임)
  index.ts               # index 패턴 export (컴포넌트 + 필요한 타입만)
```

### 규칙
- **UI상 컴포넌트 안에 하위 컴포넌트가 생기면** → 그 폴더 하위에 **폴더로 중첩**한다.
- **하위 컴포넌트가 공통으로 쓰이게 되면** → `components/common/` 밑으로 **승격**한다.
- `{name}.tsx`(business)와 `{name}.view.tsx`(UI)를 **분리**해 View는 순수하게 유지 → 테스트/재사용 용이.
- 컴포넌트를 **최대한 작은 단위로** 쪼갠다. 하나의 파일은 하나의 책임만.
- 훅/상태(이벤트 핸들러 포함)를 쓰는 business 컴포넌트 진입점에는 `'use client'`를 둔다.

## utils 규약

- `string / array / number / boolean` 등 **primitive 함수형 유틸**. 모두 **순수 함수**(입력 불변, 부수효과 없음) → **unit test 가능**.
- 배럴은 도메인 네임스페이스로 export: `import { number } from '@/utils'; number.clamp(...)`.
- 컴포넌트 로컬 유틸(`{name}.utils.ts`)이 공통으로 쓰이면 여기로 승격.
- 테스트: `*.test.ts` 로 colocate, `npm run test`.

## atoms 규약 (jotai)

- 한 파일(`*.atom.ts`)에는 기본적으로 **get / set / reset** 세 atom만 둔다.
  - `xxxAtom` (읽기), `setXxxAtom` (쓰기), `resetXxxAtom` (리셋)
- 그 외 파생 동작은 같은 폴더의 **`*.actions.atom.ts`** 로 분리.
- 관심사별 폴더로 구성, `index.ts`로 export.

## query 규약 (axios + react-query)

관심사별 폴더로 구성. 한 관심사(`user/`)는:

```
user/
  user.api.ts     # axios 통신 구현체 (순수 통신)
  user.keys.ts    # react-query 캐시 키 (계층적)
  user.query.ts   # 훅: useQuery/useMutation ('use client')
  user.types.ts
  index.ts        # 훅 + 타입만 export
```

- **통신은 axios**(`query/client.ts` 공용 인스턴스), **캐시/상태는 react-query**, 소비는 **훅**으로.
- mutation 성공 시 관련 키를 `invalidateQueries`로 무효화.

### BE(NestJS :4000) 연동

- **프록시**: `next.config.ts`의 rewrites가 `/api/*` → BE(:4000)로 전달(CORS 불필요).
  배포 시 `API_PROXY_TARGET` 환경변수로 대상만 바꾼다(빌드 시점 값이다).
- **응답 봉투**: BE는 성공 응답을 `{ data, timestamp }`로 감싼다 —
  `query/client.ts`의 `unwrap()`으로 벗긴다. "없음"이 정상인 조회는 `orNull()`로
  404(필요 시 401/403)를 null로 매핑한다.
- **인증**: `lib/auth-token.ts`에 액세스 토큰 보관(브라우저 localStorage,
  SSR/테스트는 인메모리 폴백). `httpClient` 요청 인터셉터가 Bearer로 첨부.

### 통합 테스트

`npm run test:integration` — FE의 api 계층(axios)을 **라이브 BE**에 붙여 검증한다
(`*.integration.test.ts`, `vitest.integration.config.ts`). BE(:4000)를 먼저 띄워야 하며,
단위 테스트(`npm run test`)에서는 제외된다.

## 스크립트

```sh
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run typecheck   # tsc --noEmit
npm run test        # vitest 단위 테스트
npm run lint        # eslint
```
