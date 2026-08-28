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
    [locale]/              #   로케일 세그먼트 — SEO 를 위해 URL 에 둔다
      layout.tsx           #     <html lang> + Providers
      page.tsx             #     홈 → views/HomePage
    providers.tsx          #   locale + react-query + jotai + 호스트들
    globals.css            #   Tailwind + 디자인 토큰(@theme)
  proxy.ts                 # Accept-Language 협상 → 로케일 리다이렉트 (307)
                           #   ⚠️ src/ 안에 있어야 한다. 루트에 두면 Next 가 조용히
                           #   무시하고 로케일 없는 경로가 전부 404 가 된다
  views/                   # 페이지 컴포넌트 (app은 이걸 렌더만; src/pages는 Next 충돌로 금지)
    HomePage/
  components/              # UI 컴포넌트 (관심사 카테고리별)
    primitives/            #   최소 단위, 도메인 무관 (Button, Heading, Avatar …)
    forms/                 #   입력 (Form, Field, Combobox, TagInput …)
    feedback/              #   상태 전달 (Banner, Toast, LoadingState, ErrorState)
    overlays/              #   띄우는 것 (Modal, Drawer, ConfirmDialog, Popover …)
    data-display/          #   보여주는 것 (Card, Table, Stat, Quote …)
    navigation/            #   위치 이동 (Tabs, Steps, Pagination …)
    layout/                #   화면 뼈대 (AppShell, PageHeader, Footer …)
    theme/                 #   테마 적용 (ThemeScript, ThemeToggle)
    community/             #   도메인 조합 (CommentThread, ReactionBar, MessageThread …)
    i18n/                  #   언어 (LocaleSwitcher)
    utility/               #   렌더 자체 (ErrorBoundary, ClientOnly)
  atoms/                   # jotai 전역 상태 (관심사별)
  query/                   # 서버 통신 (axios + react-query, 관심사별)
    client.ts              #   공용 axios 인스턴스 + 봉투 unwrap/orNull + Bearer 인터셉터
    auth/ questions/ answers/
                           #   도메인별 3파일: *.api.ts · *.keys.ts · *.hooks.ts
  types/                   # 공유 도메인 모델 — 컴포넌트가 아니라 **여기가 소유**한다
                           #   (query/ 가 컴포넌트를 import 하면 의존 방향이 뒤집힌다)
  utils/                   # 순수 함수 (string/array/number/boolean)
  lib/                     # 앱 인프라 (query-client, cn, routes, apiBase, auth-token)
    i18n/                  #   번역·포맷 (Intl 기반) + 로케일 라우팅
    theme/                 #   테마 외부 스토어
    text/                  #   slug 정규화 — BE 와 같은 규칙.
                           #   contracts/ 가 강제한다 (slug.contract.test.ts)
    tone/…tone.ts          #   tone → 클래스·아이콘 매핑
    forms/                 #   폼 컨트롤 공용 스타일
    css/                   #   CSS 앵커 이름 등
```

## 컴포넌트 규약 (핵심)

### 카테고리

컴포넌트는 **관심사 카테고리** 아래에 폴더 단위로 둔다.

| 카테고리 | 기준 | 예 |
| --- | --- | --- |
| `primitives/` | 최소 단위, 도메인 지식 없음 | Button, IconButton, CloseButton, Link, Heading, Avatar, Badge, StatusDot, Spinner, Skeleton, Switch, Progress, Meter, Divider, Kbd, Code, AspectRatio, BrandMark, VisuallyHidden |
| `forms/` | 값을 입력받는 것 | Form, FormActions, Field, Fieldset, Input, Textarea, NumberInput, DateInput, Select, Combobox, Checkbox, RadioGroup, SegmentedControl, Switch·Slider, FileInput, SearchInput, TagInput |
| `feedback/` | 상태를 알리는 것 | Banner, Toast, EmptyState, LoadingState, ErrorState |
| `overlays/` | 흐름 위에 띄우는 것 | Modal, Drawer, ConfirmDialog, Popover, Menu, Tooltip |
| `data-display/` | 값을 보여주는 것 | Card, Table, Prose, Quote, Tag, Stat, AvatarGroup, Accordion, DescriptionList, RelativeTime, FreshnessIndicator, Timeline, Checklist, CopyButton, TruncatedText |
| `navigation/` | 위치를 옮기는 것 | NavLink, BackLink, Breadcrumb, Tabs, Steps, Pagination, TableOfContents |
| `layout/` | 화면 뼈대 | AppShell, Container, Section, PageHeader, PageTitle, Footer, SkipLink |
| `theme/` | 테마 적용 | ThemeScript, ThemeToggle |
| `community/` | **도메인 지식을 가진 조합** | PostEditor, CommentThread, ReactionBar, ReportDialog, MessageThread, ConversationList |
| `i18n/` | 언어 | LocaleSwitcher |
| `utility/` | 렌더 자체를 다루는 것 | ErrorBoundary, ClientOnly |

카테고리를 고를 때는 **"무엇으로 만들었나"가 아니라 "무슨 일을 하나"** 를 본다.
TagInput 이 Tag 를 쓰지만 `forms/` 인 이유가 그것이다.

### 폴더 깊이 — 기본 3, 필요하면 하위 폴더

```
src/components/<카테고리>/<Component>/              ← 기본
src/components/<카테고리>/<Component>/<Part>/       ← 하위 부품이 생기면
```

**기본은 3단계다.** 대부분의 컴포넌트는 여기서 끝난다.

하위 폴더는 **부품이 자기 이유를 가질 때만** 만든다:

| 만드는 경우 | 예 |
| --- | --- |
| 부품이 **자기 규칙**을 갖는다 | `MessageThread/SafetyNotice/` — 닫기 버튼을 받지 않는다는 것이 그 컴포넌트의 존재 이유다 |
| 두 곳에서 **같은 목록을 다르게 배치**한다 | `PageHeader/HeaderNav/` — 데스크톱 가로 / 모바일 세로. 두 벌로 두면 항목 추가 시 한쪽을 빠뜨린다 |
| 성격이 다른 UI 가 한 줄에 있다 | `ReactionBar/ReactionChip/` (목록) + `ReactionPicker/` (오버레이) |
| 형식이 바뀔 예정이라 **교체 지점을 좁혀 둔다** | `PostEditor/PostBodyField/` — 마크다운/WYSIWYG 이 정해지면 이 폴더만 바뀐다 |
| 상태 로직 | `hooks/` |

**만들지 않는 경우**: 파일이 길다는 것만으로는 이유가 안 된다. 쪼갠 뒤 각 조각이
"이건 무엇인가"에 한 문장으로 답하지 못하면 그냥 흩어놓은 것이다.

재사용되기 시작하면 같은 카테고리로 **승격**한다(하위 폴더에 남겨 두고 다른 곳에서
import 하지 않는다 — 그러면 소유 관계가 거짓말이 된다).

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
- 문구는 **사전에서** 가져온다(`useI18n().t`). 하드코딩 금지
  → [i18n 전략](../docs/30-architecture/06-i18n-strategy.md)
- 브라우저가 이미 하는 일을 다시 만들지 않는다 (`<dialog>`, Popover API, `<details>`)
  → [네이티브 플랫폼 우선](../docs/25-design/10-foundations/08-native-platform.md)
- 컴포넌트를 **최대한 작은 단위로** 쪼갠다. 하나의 파일은 하나의 책임만.
- 훅/상태(이벤트 핸들러 포함)를 쓰는 진입점에는 `'use client'`를 둔다.
- import 는 **카테고리 배럴**에서 한다: `import { Button } from '@/components/primitives'`
- **도메인 타입은 `types/` 가 소유한다.** 컴포넌트 안에 두면 `query/` 가 UI 를
  import 하게 되어 의존 방향이 뒤집힌다. 컴포넌트의 `*.types.ts` 는 그 재수출이거나
  **그 컴포넌트에만 있는 표현**(이모지·라벨 매핑 등)이다
- 여러 컴포넌트가 공유하는 **스타일·훅은 `lib/`·`hooks/`** 로 올린다.
  한 컴포넌트가 다른 다섯의 스타일 소유자가 되면 의존 그래프가 거짓말한다

## 스토리 (Ladle)

모든 컴포넌트는 스토리를 가진다. 스토리는 데모가 아니라 **명세**다 —
그 컴포넌트가 어떤 상태를 가지며 무엇을 하면 안 되는지가 여기 남는다.

```sh
npm run ladle          # 개발 서버
npm run ladle:build    # 정적 빌드
npm run check:stories  # 모든 스토리를 브라우저에서 열어 런타임 에러 확인
```

- `title` 은 `'카테고리 / 컴포넌트'` 형식
- 상태를 **빠짐없이** 보여준다: default / disabled / loading / invalid
- 접근성 애드온(a11y)이 켜져 있다. 새 스토리를 추가하면 한 번 확인한다
- 테마 토글이 `.dark` 클래스와 동기화되어 있어 **다크 모드를 그대로 검증**할 수 있다

### `check:routing` 도 같은 이유다

`negotiateLocale` 단위 테스트는 **순수 함수라 항상 통과한다.** 타입체크·린트·빌드도
전부 통과한다. 그런데 `proxy.ts` 가 `src/` 밖에 있으면 Next 가 조용히 무시해서
**로케일 없는 경로가 전부 404** 가 된다 — 실제로 그렇게 죽어 있었다.

```sh
npm run dev                 # 한 터미널
npm run check:routing       # 다른 터미널
```

Next 16 에서 `middleware` 규약이 **`proxy`** 로 바뀌었다는 것도 이때 드러났다.

### `check:stories` 가 왜 따로 필요한가

**빌드된다고 실행되는 것은 아니다.** typecheck·lint·`ladle build` 를 전부 통과하는데
브라우저에서 죽는 경우가 있다. 실제로 `next/link` 가 Ladle(Vite)에서
`ReferenceError: process is not defined` 로 죽었고, 이 검사만 그걸 잡았다.

```sh
npm run ladle -- --port 61000        # 한 터미널
LADLE_URL=http://localhost:61000 npm run check:stories
```

`next/link` 는 `.ladle/vite.config.ts` 에서 스텁으로 alias 된다 —
스토리에는 Next 런타임이 없기 때문이다. 컴포넌트에서 다른 `next/*` 를 쓰게 되면
거기에 alias 를 추가해야 한다.


## query 규약

도메인마다 **세 파일**로 나눈다. 각 파일이 아는 것이 다르다.

| 파일 | 아는 것 | 모르는 것 |
| --- | --- | --- |
| `*.api.ts` | URL · 봉투 · 상태코드 | **React** — 그래야 통합 테스트가 node 에서 직접 부른다 |
| `*.keys.ts` | 캐시 계층 | HTTP |
| `*.hooks.ts` | 화면이 쓸 모양 | URL·봉투 |

- **`.api.ts` 가 HTTP 를 아는 유일한 곳**이다. 컴포넌트는 `httpClient` 를 모른다 —
  BE 가 경로를 바꿔도 고칠 곳이 파일 하나다
- **키는 계층으로 만든다** (`all → lists/details → detail(id) → answers(id)`).
  화면마다 문자열로 흩뿌리면 오타 하나에 캐시가 안 지워지고,
  **새 답변이 화면에 안 보이는데 새로고침하면 있는** 버그가 된다
- **답변은 자기 키를 갖지 않는다.** `questionKeys.answers(id)` 아래에 둔다 —
  질문 캐시를 지우면 답변도 함께 지워져야 한다
- 훅은 **얇게** 유지한다. 로직이 생기면 `.api.ts`(순수 함수)로 내려 테스트한다

### 통합 테스트가 잡는 것

타입은 컴파일 타임에만 있어 **응답 모양을 검사하지 않는다.** 실제로 이번에 셋이 잡혔다:

| 짐작 | 실제 |
| --- | --- |
| 로그인이 `{accessToken}` | **`{token, user}`** — 401 로 나타났다 |
| 답변 목록이 `Page<Answer>` | **`Answer[]`** — 채택 답변이 다음 페이지로 밀리면 안 되기 때문 |
| 같은 닉네임 재로그인 = 같은 사람 | **매번 새 계정** — 403 으로 나타났다 (OAuth 전까지 유효) |

```sh
cd BE && npm run start:dev      # 한 터미널
cd FE && npm run test:integration
```

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
