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
| `VisuallyHidden` | `display:none` 은 접근성 트리에서도 사라져 이 목적에 못 쓴다 |

### `forms/` — 값을 입력받는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Field` | 레이블·설명·에러를 입력에 **연결**한다. render prop 으로 `aria` 배선을 내려준다 |
| `Fieldset` | 네이티브 `<fieldset>/<legend>`. `disabled` 하나로 안쪽 전체가 꺼진다 |
| `Input` / `Textarea` / `Select` / `Checkbox` / `RadioGroup` | 전부 **네이티브 요소**. `accent-color` 토큰이 강조색을 맞춘다 |
| `SearchInput` | `<form role="search">` + `<input type="search">` — 랜드마크 + 모바일 검색 키 |
| `TagInput` | Enter·쉼표·붙여넣기·Backspace 를 전부 받는다. 정규화 후 중복을 판정한다 |

### `feedback/` — 상태를 알리는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Banner` | konnect 의 주 용도는 **R1 고지**. `riskToTone`/`freshnessToTone` 이 도메인 등급을 tone 에 매핑. R3 는 배너를 띄우지 않는다 |
| `EmptyState` | "결과 없음"만 띄우지 않는다. 다음 행동을 준다 |
| `Toast` | **모듈 스토어**라 React 밖(react-query `onError`)에서도 띄운다. `ToastHost` 는 앱 루트에 한 번만. 최대 3개 |

### `overlays/` — 흐름 위에 띄우는 것

| 컴포넌트 | 네이티브 기반 |
| --- | --- |
| `Modal` | **`<dialog>`** + `showModal()`. 포커스 트랩·복귀·Esc·top layer 를 브라우저가 한다 |
| `Drawer` | 같은 `<dialog>` 를 옆에 붙인다. `useDialogElement` 훅을 재사용 — 다른 건 위치와 크기뿐 |
| `Popover` | **Popover API**. 열림 상태를 위한 JS 가 **아예 없다** |
| `Menu` | `Popover` 위에 얹음. `role="menu"` 를 **쓰지 않는다**(아래 참고) |
| `Tooltip` | Popover 기반이라 hover 뿐 아니라 클릭·키보드로도 열린다. **필수 정보를 두지 않는다** |

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

### `navigation/` — 위치를 옮기는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `NavLink` | 색·굵기만이 아니라 `aria-current="page"` 로도 현재 위치를 알린다 |
| `Breadcrumb` | `<nav>` + `<ol>`. 마지막 항목은 링크가 아니다 |
| `Tabs` | `role="tablist"` 를 쓰므로 **화살표·Home/End 로빙 포커스를 실제로 구현**한다 |
| `Pagination` | 키셋 커서 방식이라 **페이지 번호가 없다**. 커서 스택은 순수 함수로 관리 |

### `layout/` — 화면 뼈대

| 컴포넌트 | 메모 |
| --- | --- |
| `Container` | `prose` 폭은 읽기 폭(약 70자) |
| `Section` | 제목이 있으면 `<section aria-labelledby>`, 없으면 `<div>` |
| `PageHeader` | `sticky` + `--header-h` 토큰 세팅(앵커 이동 시 제목 가림 방지). 모바일 네비는 Popover 로 접힌다 |
| `SkipLink` | 포커스를 받으면 나타난다. `display:none` 이면 목적이 사라진다 |

### `theme/` — 테마 적용

| 컴포넌트 | 메모 |
| --- | --- |
| `ThemeScript` | FOUC 방지 **동기 인라인 스크립트**. `next/script` 나 `useEffect` 로는 늦다 |
| `ThemeToggle` | light → dark → system 순환. 아이콘은 **적용 결과가 아니라 현재 선택**을 보여준다 |

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
| `lib/theme/theme.utils` | system 해석, 손상된 저장값, 순환 |

## 브라우저 검증

`npm run check:stories` — 모든 스토리를 실제 브라우저에서 열어 렌더와 런타임 에러를 본다.
**빌드된다고 실행되는 것은 아니다**: `next/link` 가 Ladle 에서 죽는 것을 이 검사만 잡았다.

## 아직 없는 것

- Pagination 을 실제 목록에 연결 — [키셋 커서](../../30-architecture/03-api-conventions.md) API 가 생긴 뒤
- 브랜드 로고·파비콘
- 폼 상태 관리(제출·검증 흐름) — 라이브러리 선택 필요
