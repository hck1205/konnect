# 25.20 · 컴포넌트

Foundation 토큰 위에 올린 컴포넌트. 구현은 `FE/src/components/`,
파일 구성 규약은 [FE/ARCHITECTURE.md](../../../FE/ARCHITECTURE.md#컴포넌트-규약-핵심)에 있다.

## 보는 법

```sh
cd FE && npm run ladle
```

스토리는 데모가 아니라 **명세**다 — 각 컴포넌트가 어떤 상태를 가지고
무엇을 하면 안 되는지가 거기 남는다. 테마 토글이 `.dark` 클래스와 동기화되어 있어
다크 모드를 그대로 검증할 수 있고, 접근성 애드온이 켜져 있다.

## 카테고리

카테고리는 **"무엇으로 만들었나"가 아니라 "무슨 일을 하나"** 로 나눈다.
TagInput 이 Tag 를 쓰지만 `forms/` 인 이유가 그것이다.

### `primitives/` — 최소 단위, 도메인 지식 없음

| 컴포넌트 | 메모 |
| --- | --- |
| `Button` | variant(solid·outline·subtle·ghost) × tone(brand·neutral·danger) × size. 조합은 CVA `compoundVariants` 로 **명시된 것만** 존재한다 |
| `IconButton` | `label` 이 **필수 prop**. 접근 가능한 이름 누락이 아이콘 버튼의 최대 사고라 규칙을 타입에 뒀다 |
| `Link` | 기본이 **밑줄 있음**. 외부 링크는 `rel="noopener"` + "새 탭에서 열림" 안내 |
| `Avatar` | 이미지 없으면 이니셜. 한글 이름은 **한 글자만** 딴다. 색은 이름에서 파생해 항상 같다 |
| `Badge` | 상태 표시에는 아이콘을 함께 — 색만으로 구분하지 않는다 |
| `Switch` | 네이티브 checkbox + `role="switch"`. **즉시 반영**이 아니면 `Checkbox` 를 쓴다 |
| `Progress` | 네이티브 `<progress>`. aria-value* 를 직접 붙일 필요가 없다 |
| `Spinner` | `currentColor` 를 따른다. 버튼 안에서 색 지정 불필요 |
| `Skeleton` | `aria-hidden`. 로딩 안내는 감싸는 영역이 `aria-busy` 로 한다 |
| `Divider` | 라벨 없으면 `<hr>` — "주제 전환"의 시맨틱 |
| `Kbd` / `Code` | `<kbd>`, `<code>`. Code 는 `translate="no"` 가 기본 |
| `Heading` | **레벨과 크기를 분리**한다. 작게 보이려고 h2 를 h4 로 낮추는 것이 가장 흔한 접근성 사고다 |
| `CloseButton` | Banner·Modal·Drawer·Toast 가 공유. 여럿이면 "무엇을 닫는지" 넣는다 |
| `StatusDot` | 점은 색뿐이라 접근 가능한 이름이 **필수** |
| `Meter` | `<meter>` — 진행률(`progress`)이 아니라 **범위 안의 측정값** |
| `AspectRatio` | 네이티브 `aspect-ratio`. padding-top 해킹을 쓰지 않는다 |
| `BrandMark` | ⚠️ 임시 심볼. 로고가 정해지면 이 파일만 교체하면 된다 |
| `VisuallyHidden` | `display:none` 은 접근성 트리에서도 사라져 이 목적에 못 쓴다 |

### `forms/` — 값을 입력받는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Field` | 레이블·설명·에러를 입력에 **연결**한다. render prop 으로 `aria` 배선을 내려준다 |
| `Fieldset` | 네이티브 `<fieldset>/<legend>`. `disabled` 하나로 안쪽 전체가 꺼진다 |
| `Input` / `Textarea` / `Select` / `Checkbox` / `RadioGroup` | 전부 **네이티브 요소**. `accent-color` 토큰이 강조색을 맞춘다 |
| `SearchInput` | `<form role="search">` + `<input type="search">` — 랜드마크 + 모바일 검색 키 |
| `TagInput` | Enter·쉼표·붙여넣기·Backspace 를 전부 받는다. 정규화 후 중복을 판정한다 |
| `Form` | `pending` 중 **`<fieldset disabled>`** 로 안쪽을 통째로 잠근다(이중 제출 방지) |
| `FormActions` | 파괴적 행동을 **반대편 끝**에 둔다 — 제출 옆의 삭제는 언젠가 잘못 눌린다 |
| `NumberInput` | 세는 값에만. 전화번호 같은 **식별자**는 앞자리 0 이 사라져 쓰면 안 된다 |
| `DateInput` | 네이티브 피커라 **사용자 로케일 형식**을 따른다. `03/04` 해석이 나라마다 다르다 |
| `Combobox` | 네이티브 `<datalist>`. **한국어 키워드로도 검색**된다 |
| `SegmentedControl` | 겉모습만 다른 **라디오**. Tabs 는 내비게이션, 이건 입력이다 |
| `Slider` | 네이티브 `<input type="range">`. 현재 값을 **텍스트로도** 보여준다 |
| `FileInput` | 드래그앤드롭은 **보조 수단**. 드롭만 되면 키보드·터치 사용자에게 없는 기능이다 |

### `feedback/` — 상태를 알리는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Banner` | konnect 의 주 용도는 **R1 고지**. `riskToTone`/`freshnessToTone` 이 도메인 등급을 tone 에 매핑. R3 는 배너를 띄우지 않는다 |
| `EmptyState` | "결과 없음"만 띄우지 않는다. 다음 행동을 준다 |
| `Toast` | **모듈 스토어**라 React 밖(react-query `onError`)에서도 띄운다. `ToastHost` 는 앱 루트에 한 번만. 최대 3개 |
| `LoadingState` | **영역이** 로딩을 알린다(스피너가 아니라). 가능하면 스켈레톤을 넘긴다 |
| `ErrorState` | 사용자에게 기술적 메시지를 보여주지 않는다. `detail` 은 개발 환경 전용 |

### `overlays/` — 흐름 위에 띄우는 것

| 컴포넌트 | 네이티브 기반 |
| --- | --- |
| `Modal` | **`<dialog>`** + `showModal()`. 포커스 트랩·복귀·Esc·top layer 를 브라우저가 한다 |
| `Drawer` | 같은 `<dialog>` 를 옆에 붙인다. `useDialogElement` 훅을 재사용 — 다른 건 위치와 크기뿐 |
| `Popover` | **Popover API**. 열림 상태를 위한 JS 가 **아예 없다** |
| `Menu` | `Popover` 위에 얹음. `role="menu"` 를 **쓰지 않는다**(아래 참고) |
| `Tooltip` | Popover 기반이라 hover 뿐 아니라 클릭·키보드로도 열린다. **필수 정보를 두지 않는다** |
| `ConfirmDialog` | `window.confirm` 대체. **Promise 를 돌려준다**: `await confirm({…})`. Esc = 취소 |

### `data-display/` — 값을 보여주는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Card` | 층은 `surface-raised` 로. 카드 전체 링크와 내부 링크를 **동시에 쓰지 않는다** |
| `Tag` | 저장은 정규화 소문자, 표시할 때만 사람이 읽는 형태로(`visa:d-2` → `D-2`) |
| `Table` | 네이티브 `<table>`. 스크롤 영역에 `tabIndex={0}`(WCAG 2.1.1) |
| `Prose` | 사용자 본문의 타이포그래피. `@tailwindcss/typography` 대신 우리 토큰으로 직접 정의 |
| `Accordion` | **`<details name>`** — 같은 name 이면 하나만 열린다. 상태 관리 JS 불필요 |
| `DescriptionList` | **`<dl>/<dt>/<dd>`** + Grid subgrid. 속성 목록이지 표가 아니다 |
| `RelativeTime` | `Intl.RelativeTimeFormat`. `<time datetime>` + 하이드레이션 안전 |
| `FreshnessIndicator` | `Banner.freshnessToTone` 재사용 — 배너와 배지가 같은 기준을 쓴다 |
| `Timeline` | 체류 생애주기(T0~T7) 표시 |
| `Checklist` | 시점별 할 일. 진행 상태는 **로컬 저장 전제** |
| `Quote` | `<figure>`+`<blockquote>`. **개인 경험과 규정을 시각적으로 구분**한다(R1 규칙) |
| `Stat` | `<dl>`. **증가가 항상 좋은 것은 아니다** — 응답 시간은 줄어야 좋다 |
| `AvatarGroup` | `<ul>`. 접힌 인원수는 텍스트로 남긴다 |
| `CopyButton` | 한국어 행정 용어를 **그대로 복사**해 서류·검색창에 붙여넣게 한다 |
| `TruncatedText` | `line-clamp` 는 시각적으로만 자른다 — 전체 텍스트가 DOM 에 남아 Ctrl+F 로 찾힌다 |

### `navigation/` — 위치를 옮기는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `NavLink` | 색·굵기만이 아니라 `aria-current="page"` 로도 현재 위치를 알린다 |
| `Breadcrumb` | `<nav>` + `<ol>`. 마지막 항목은 링크가 아니다 |
| `Tabs` | `role="tablist"` 를 쓰므로 **화살표·Home/End 로빙 포커스를 실제로 구현**한다 |
| `Pagination` | 키셋 커서 방식이라 **페이지 번호가 없다**. 커서 스택은 순수 함수로 관리 |
| `Steps` | 진행 중인 절차의 위치. Timeline 은 기록, Steps 는 현재 |
| `TableOfContents` | 긴 가이드용. 앵커 id 는 `slugify` 와 **같은 규칙**(갈라지면 링크가 죽는다) |
| `BackLink` | `history.back()` 을 쓰지 않는다 — 검색 유입자에게 "뒤"는 검색 결과이거나 없다 |

### `layout/` — 화면 뼈대

| 컴포넌트 | 메모 |
| --- | --- |
| `Container` | `prose` 폭은 읽기 폭(약 70자) |
| `Section` | 제목이 있으면 `<section aria-labelledby>`, 없으면 `<div>` |
| `PageHeader` | `sticky` + `--header-h` 토큰 세팅(앵커 이동 시 제목 가림 방지). 모바일 네비는 Popover 로 접힌다 |
| `SkipLink` | 포커스를 받으면 나타난다. `display:none` 이면 목적이 사라진다 |
| `PageTitle` | 제목은 항상 `<h1>`. 크기는 `Heading size` 로 줄이지 레벨을 낮추지 않는다 |
| `Footer` | 그룹마다 `<nav aria-label>`. **전역 고지**(법률 자문 아님)를 둔다 |
| `AppShell` | SkipLink + `id="main-content"` + `tabIndex={-1}` 을 한 곳에 고정 — **셋이 함께 있어야** 동작한다 |

### `theme/` — 테마 적용

| 컴포넌트 | 메모 |
| --- | --- |
| `ThemeScript` | FOUC 방지 **동기 인라인 스크립트**. `next/script` 나 `useEffect` 로는 늦다 |
| `ThemeToggle` | light → dark → system 순환. 아이콘은 **적용 결과가 아니라 현재 선택**을 보여준다 |

### `community/` — 도메인 지식을 가진 조합

다른 카테고리와 달리 **konnect 의 규칙을 알고 있다.** primitives 가 도메인을 모르는 것과
정반대다 — 그래서 카테고리를 나눴다.

| 컴포넌트 | 메모 |
| --- | --- |
| `PostEditor` | **작성 중 비슷한 질문**을 보여준다 — 태그를 강제하는 것보다 중복 방지에 효과적이다 |
| `CommentThread` | **대대댓글이 없다.** 답글의 답글은 한 단계로 접힌다. 삭제된 댓글은 자리를 남긴다 |
| `CommentComposer` | 비로그인에게 입력창을 보여주고 나서 로그인을 요구하지 않는다 |
| `ReactionBar` | 고정 어휘 이모지 5종. 이모지 옆에 **번역된 이름**이 함께 읽힌다 → [문서](../../20-product/10-features/08-reactions.md) |
| `ReportDialog` | 사유를 고르면 **긴급 트랙인지 즉시** 알려준다 |
| `MessageThread` | 안전 고지 **닫기 불가** + 차단·신고 한 번의 조작 + 민감정보 경고 → [ADR-0004](../../50-decisions/0004-direct-messages-with-safety-gates.md) |
| `ConversationList` | 안 읽음 개수를 숫자와 **텍스트 양쪽**으로 |

### `i18n/` — 언어

| 컴포넌트 | 메모 |
| --- | --- |
| `LocaleSwitcher` | **링크로 이동**한다(토글이 아니라). 각 언어 이름을 **그 언어로** 적는다 |

### `utility/` — 렌더 자체를 다루는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `ErrorBoundary` | 이 저장소에서 클래스 컴포넌트를 쓰는 **유일한 곳**(대응 훅이 없다). 경계는 화면이 아니라 **영역 단위**로 둔다 |
| `ClientOnly` | 하이드레이션 경고를 없애려고 아무 데나 두르지 않는다 — 서버 렌더에서 빠지면 **검색엔진이 못 읽는다** |

> 테마 상태는 `FE/src/lib/theme/` 의 `useSyncExternalStore` 기반 스토어가 들고 있다.
> Provider 를 두지 않는 이유: 테마는 거의 바뀌지 않는데 Context 로 감싸면
> 바뀔 때 하위 전체가 리렌더된다.

## ARIA 롤에 대한 입장

**롤을 붙이면 그 롤의 키보드 계약을 지켜야 한다.**

- `Tabs` 는 `role="tablist"` 를 쓰고 화살표·Home/End 이동을 **실제로 구현**했다
- `Menu` 는 `role="menu"` 를 **쓰지 않는다** — 화살표 로빙 포커스 없이 롤만 붙이면
  스크린리더 사용자가 "메뉴"를 기대하고 화살표를 눌렀는데 아무 일도 안 일어난다.
  버튼 목록으로 두면 Tab 으로 자연스럽게 순회된다.

구현할 생각이 없으면 롤을 붙이지 않는 쪽이 옳다.

## 공용 규칙의 단일 출처

같은 규칙이 여러 곳에 있으면 언젠가 어긋나고, 그때 증상은 엉뚱한 곳에서 나타난다.
아래는 **한 곳에만 있어야 하는 것들**이다.

| 규칙 | 어디에 | 갈라지면 |
| --- | --- | --- |
| 문자열 → slug | `lib/text/slug` | 본문 앵커와 목차 링크가 어긋나 링크가 죽고, 같은 태그가 두 표기로 갈라진다 |
| 로케일 포맷(숫자·날짜·상대시각·목록) | `lib/i18n/format` | 화면마다 다른 언어·형식이 나온다 |
| tone → 클래스·아이콘 | `lib/tone` | 같은 상태가 화면마다 다른 색·아이콘으로 보여 학습된 의미가 깨진다 |
| CSS 앵커 이름 정리 | `lib/css/useAnchorName` | `useId()` 특수문자 처리를 한 곳에서 빠뜨린다 |
| 비동기 제출 상태 | `hooks/useAsyncSubmit` | try/finally 를 빠뜨리면 실패 시 버튼이 영원히 잠긴다 |
| 클립보드 복사 | `hooks/useCopyToClipboard` | 실패를 삼키면 사용자가 빈 클립보드를 붙여넣는다 |

## 테스트되는 로직

순수 함수로 뺄 수 있는 규칙은 전부 뺐고 유닛 테스트가 붙어 있다.
UI 없이 검증 가능하고, 실제로 틀리기 쉬운 부분이 거기 모여 있기 때문이다.

| 파일 | 검증하는 것 |
| --- | --- |
| `Avatar.utils` | 이니셜 규칙(다국어·서로게이트 페어), 색 인덱스 안정성 |
| `Field.utils` | `aria-describedby` 에 설명과 에러를 **둘 다** 연결 |
| `Tag.utils` | 정규화·네임스페이스 파싱·표시 형태. 오타 접두사를 네임스페이스로 인정하지 않음 |
| `TagInput.utils` | 정규화 후 중복 판정, 정원 초과, 붙여넣기 분해 |
| `Banner.utils` | 위험 등급/최신성 → tone 매핑 |
| `Tabs.utils` | URL 에서 온 탭 값 검증, 화살표 순환 |
| `Pagination.utils` | 커서 스택 push/pop 왕복 |
| `PageHeader.utils` | 활성 경로 판정(루트가 모든 경로에 걸리지 않게) |
| `RelativeTime.utils` | `Intl` 포맷, 과거/미래, 잘못된 값 |
| `Checklist.utils` | 진행 계산(사라진 항목 id 무시) |
| `toast.store` | 최대 개수, danger 자동 소멸 안 함, 구독 |
| `confirm.store` | Promise resolve, 새 요청이 앞선 것을 취소로 닫음 |
| `Combobox.utils` | 영문·한국어 양쪽 검색, 접두 일치 우선 |
| `Steps.utils` | 단계 상태 경계, 범위 밖 current |
| `TableOfContents.utils` | 앵커 id 규칙, 중복 제목 번호 |
| `lib/theme/theme.utils` | system 해석, 손상된 저장값, 순환 |
| `lib/i18n/translate` | 보간, 복수형(언어별 카테고리), 폴백 순서 |
| `lib/i18n/format` | `Intl` 위임 — 베트남어 천 단위, 목록 접속사, 잘못된 날짜 |
| `lib/i18n/resolveLocale` | 경로 분리·치환, `Accept-Language` 협상(q 값 순서) |
| `ReactionBar.utils` | 한 사람이 하나, 갈아타기, 동수 시 안정 정렬 |
| `CommentThread.utils` | 대대댓글 접기, 고아 답글, 순환 참조 방어 |
| `ReportDialog.utils` | 사유 → 긴급/일반 트랙 |
| `MessageThread.utils` | 메시지 묶기(날짜 경계), 민감정보 형태 감지(오탐 억제) |
| `FileInput.utils` | 단일/다중 선택 차이, 크기 초과 걸러내기, 로케일 크기 표기 |
| `lib/text/slug` | 유니코드 보존, `keep` 문자, 중복 번호 |
| `utils/time` | 개월 수 내림, 미래·잘못된 값 |

## 브라우저 검증

`npm run check:stories` — 모든 스토리를 실제 브라우저에서 열어 렌더와 런타임 에러를 본다.
**빌드된다고 실행되는 것은 아니다**: `next/link` 가 Ladle 에서 죽는 것을 이 검사만 잡았다.

## 의도적으로 만들지 않은 것

빠진 게 아니라 **안 만들기로 한 것**이다.

| 컴포넌트 | 이유 |
| --- | --- |
| Carousel | [모션 원칙](../10-foundations/05-motion.md) — 자동 재생 캐러셀 금지. 필요해지면 CSS Carousel 이 안정된 뒤 |
| ScrollArea (커스텀 스크롤바) | 스크롤바를 숨기면 **스크롤 가능하다는 유일한 단서**가 사라진다 |
| DatePicker (커스텀 캘린더) | 네이티브 `DateInput` 이 로케일·키보드·모바일을 이미 처리한다 |
| Rating | 제품에 별점이 없다 — 학원/부동산 평점은 분쟁 리스크로 [보류](../../10-domain/20-language/01-topik-and-learning.md) |
| DataGrid | MVP 에 표 편집이 없다. `Table` 로 충분하다 |
| RichTextEditor | 본문 작성 방식(마크다운 vs WYSIWYG)이 아직 안 정해졌다 |

## 아직 없는 것 (필요하지만 전제가 빠짐)

- Pagination 을 실제 목록에 연결 — [키셋 커서](../../30-architecture/03-api-conventions.md) API 가 생긴 뒤
- 브랜드 로고·파비콘 — `BrandMark` 가 임시 심볼로 자리만 잡아 뒀다
- 폼 검증 흐름 — `Form`/`Field` 가 배선은 갖췄고, 스키마 라이브러리 선택이 남았다
- i18n 문구 추출 — 지금은 영어 하드코딩, [전략](../../30-architecture/06-i18n-strategy.md)은 정해져 있다
