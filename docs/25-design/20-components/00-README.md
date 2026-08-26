# 25.20 · 컴포넌트

Foundation 토큰 위에 올린 컴포넌트 목록. 구현은 `FE/src/components/`,
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
| `Avatar` | 이미지 없으면 이니셜. 한글 이름은 **한 글자만** 딴다(두 글자면 이름 일부가 노출된다). 색은 이름에서 파생해 항상 같다 |
| `Badge` | 상태 표시에는 아이콘을 함께 — 색만으로 구분하지 않는다 |
| `Spinner` | `currentColor` 를 따른다. 버튼 안에서 색 지정 불필요 |
| `Skeleton` | `aria-hidden`. 로딩 안내는 감싸는 영역이 `aria-busy` 로 한다 |
| `VisuallyHidden` | `display:none` 은 접근성 트리에서도 사라져 이 목적에 못 쓴다 |

### `forms/` — 값을 입력받는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Field` | 레이블·설명·에러를 입력에 **연결**한다. render prop 으로 `aria` 배선을 내려준다. `buildFieldAria` 는 순수 함수라 테스트된다 |
| `Input` / `Textarea` / `Select` / `Checkbox` | 전부 **네이티브 요소**. `accent-color` 토큰이 컨트롤 강조색을 맞춘다 |
| `TagInput` | Enter·쉼표·붙여넣기·Backspace 를 전부 받는다. 정규화 후 중복을 판정한다 |

> `Textarea` 는 `field-sizing: content` 로 내용에 맞춰 늘어난다.
> 미지원 브라우저는 `rows` 로 떨어지는 점진적 향상이다.

### `feedback/` — 상태를 알리는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Banner` | konnect 의 주 용도는 **R1 고지**. `riskToTone`/`freshnessToTone` 이 도메인 등급을 tone 에 매핑한다. R3 는 배너를 띄우지 않는다 |
| `EmptyState` | "결과 없음"만 띄우지 않는다. 다음 행동을 준다 |

### `overlays/` — 흐름 위에 띄우는 것

| 컴포넌트 | 네이티브 기반 |
| --- | --- |
| `Modal` | **`<dialog>`** + `showModal()`. 포커스 트랩·복귀·Esc·top layer 를 브라우저가 한다 |
| `Popover` | **Popover API**. 열림 상태를 위한 JS 가 **아예 없다** |
| `Menu` | `Popover` 위에 얹음. `role="menu"` 를 **쓰지 않는다**(화살표 로빙 포커스 없이 롤만 붙이면 더 나쁘다) |

### `data-display/` — 값을 보여주는 것

| 컴포넌트 | 메모 |
| --- | --- |
| `Card` | 층은 `surface-raised` 로. 카드 전체 링크와 내부 링크를 **동시에 쓰지 않는다** |
| `Tag` | 저장은 정규화 소문자, 표시할 때만 사람이 읽는 형태로 올린다(`visa:d-2` → `D-2`) |
| `Accordion` | **`<details name>`** — 같은 name 이면 하나만 열린다. 상태 관리 JS 불필요 |
| `DescriptionList` | **`<dl>/<dt>/<dd>`** + Grid subgrid. 속성 목록이지 표가 아니다 |

## 테스트되는 로직

컴포넌트 중 **순수 함수로 뺄 수 있는 규칙**은 전부 뺐고 유닛 테스트가 붙어 있다.
UI 없이 검증 가능하고, 실제로 틀리기 쉬운 부분이 거기 모여 있기 때문이다.

| 파일 | 검증하는 것 |
| --- | --- |
| `Avatar.utils` | 이니셜 규칙(다국어·서로게이트 페어), 색 인덱스 안정성 |
| `Field.utils` | `aria-describedby` 에 설명과 에러를 **둘 다** 연결 |
| `Tag.utils` | 정규화·네임스페이스 파싱·표시 형태. 오타 접두사를 네임스페이스로 인정하지 않음 |
| `TagInput.utils` | 정규화 후 중복 판정, 정원 초과, 붙여넣기 분해 |
| `Banner.utils` | 위험 등급/최신성 → tone 매핑 |

## 아직 없는 것

- Toast (전역 알림) — 상태 스토어가 먼저 필요하다
- Pagination / 무한 스크롤 — [키셋 커서](../../30-architecture/03-api-conventions.md) 확정 후
- 헤더·네비게이션 — [IA](../../20-product/01-information-architecture.md) 확정 후
- 테마 토글 — `.dark` 클래스를 붙이는 초기 스크립트와 함께
- 브랜드 로고·파비콘
