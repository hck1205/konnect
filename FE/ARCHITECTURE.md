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
  components/              # UI 컴포넌트 (관심사 카테고리별)
    primitives/            #   최소 단위, 도메인 무관 (Button, Avatar …)
    forms/                 #   입력 (Field, Input, TagInput …)
    feedback/              #   상태 전달 (Banner, EmptyState)
    overlays/              #   띄우는 것 (Modal, Popover, Menu)
    data-display/          #   보여주는 것 (Card, Tag, Accordion …)
  atoms/                   # jotai 전역 상태 (관심사별)
  query/                   # 서버 통신 (axios + react-query, 관심사별)
    client.ts              #   공용 axios 인스턴스 + 봉투 unwrap/orNull + Bearer 인터셉터
  types/                   # 공유 도메인 모델
  utils/                   # 순수 함수 (string/array/number/boolean)
  lib/                     # 앱 인프라 (query-client, cn, routes, apiBase, auth-token)
```

## 컴포넌트 규약 (핵심)

### 카테고리

컴포넌트는 **관심사 카테고리** 아래에 폴더 단위로 둔다.

| 카테고리 | 기준 | 예 |
| --- | --- | --- |
| `primitives/` | 최소 단위, 도메인 지식 없음 | Button, IconButton, Avatar, Badge, Spinner, Skeleton |
| `forms/` | 값을 입력받는 것 | Field, Input, Textarea, Select, Checkbox, TagInput |
| `feedback/` | 상태를 알리는 것 | Banner, EmptyState |
| `overlays/` | 흐름 위에 띄우는 것 | Modal, Popover, Menu |
| `data-display/` | 값을 보여주는 것 | Card, Tag, Accordion, DescriptionList |

카테고리를 고를 때는 **"무엇으로 만들었나"가 아니라 "무슨 일을 하나"** 를 본다.
TagInput 이 Tag 를 쓰지만 `forms/` 인 이유가 그것이다.

### 폴더 깊이 — 최대 3

```
src/components/<카테고리>/<Component>/    ← 여기까지가 폴더의 끝
```

컴포넌트 폴더 **안에 또 폴더를 만들지 않는다**(예외: `hooks/`).
하위 컴포넌트가 필요하면 같은 폴더의 **파일**로 두거나, 재사용되면 같은 카테고리로
**승격**한다. 깊이가 깊어지면 import 경로가 길어지고 무엇이 어디 있는지 감이 사라진다.

### 파일 구성

```
{Name}/
  {Name}.tsx             # 진입점. 로직이 있으면 business 레이어
  {Name}.view.tsx        # UI만 (상태 없음) — business/view 분리가 필요할 때만
  {Name}.types.ts        # 이 컴포넌트의 타입 — 타입이 여러 개일 때만
  {Name}.utils.ts        # 순수 함수 — 테스트할 로직이 있을 때만
  {Name}.utils.test.ts   # 그 유닛 테스트
  {Name}.stories.tsx     # Ladle 스토리 (필수)
  hooks/use{Name}.ts     # 상태 로직이 클 때만
  index.ts               # 공개 API — 컴포넌트 + 필요한 타입만
```

**모든 파일을 다 만들지 않는다.** 로직이 없는 순수 표현 컴포넌트(Card, Skeleton)는
`{Name}.tsx` + `{Name}.stories.tsx` + `index.ts` 세 개면 충분하다.
없어도 되는 파일을 만드는 것은 구조가 아니라 소음이다.

business/view 를 나누는 기준은 **테스트 가능한 로직이 있는가**다.
`Avatar`(이니셜·색 계산), `TagInput`(입력 규칙)은 나누고, `Badge` 는 나누지 않는다.

### 규칙

- 색은 **semantic 토큰만** 쓴다. `bg-teal-700` 같은 primitive 직접 사용 금지
  → [디자인 토큰](../docs/25-design/02-tokens.md)
- 브라우저가 이미 하는 일을 다시 만들지 않는다 (`<dialog>`, Popover API, `<details>`)
  → [네이티브 플랫폼 우선](../docs/25-design/10-foundations/08-native-platform.md)
- 컴포넌트를 **최대한 작은 단위로** 쪼갠다. 하나의 파일은 하나의 책임만.
- 훅/상태(이벤트 핸들러 포함)를 쓰는 진입점에는 `'use client'`를 둔다.
- import 는 **카테고리 배럴**에서 한다: `import { Button } from '@/components/primitives'`

## 스토리 (Ladle)

모든 컴포넌트는 스토리를 가진다. 스토리는 데모가 아니라 **명세**다 —
그 컴포넌트가 어떤 상태를 가지며 무엇을 하면 안 되는지가 여기 남는다.

```sh
npm run ladle          # 개발 서버
npm run ladle:build    # 정적 빌드 (스토리가 깨지지 않는지 확인)
```

- `title` 은 `'카테고리 / 컴포넌트'` 형식
- 상태를 **빠짐없이** 보여준다: default / disabled / loading / invalid
- 접근성 애드온(a11y)이 켜져 있다. 새 스토리를 추가하면 한 번 확인한다
- 테마 토글이 `.dark` 클래스와 동기화되어 있어 **다크 모드를 그대로 검증**할 수 있다


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
npm run dev              # 개발 서버
npm run build            # 프로덕션 빌드
npm run ladle            # 컴포넌트 스토리
npm run typecheck        # tsc --noEmit
npm run test             # vitest 단위 테스트
npm run check:contrast   # 디자인 토큰 대비 검증
npm run lint             # eslint
```
