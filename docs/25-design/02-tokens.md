# 토큰 아키텍처

## 3계층 구조

```
1) primitive   원시 팔레트·스케일        --color-brand-700: #0f766e
      ↓          의미 없음. 값만 있다.
2) semantic    역할 이름                 --brand-solid: var(--color-brand-700)
      ↓          테마마다 값이 달라진다.
3) utility     Tailwind 유틸리티          bg-brand-solid
```

**컴포넌트는 2계층(semantic)만 쓴다.**

## 왜 primitive를 직접 쓰면 안 되나

`bg-teal-700`을 컴포넌트에 직접 쓰면 두 가지가 깨진다.

1. **다크 모드에서 뒤집히지 않는다.** semantic 토큰은 `.dark`에서 값이 바뀌지만
   primitive는 그대로다. 어두운 배경에 어두운 버튼이 남는다.
2. **브랜드 색을 바꿀 수 없다.** teal을 다른 색으로 바꾸려면 전체 코드베이스에서
   `teal-*`을 찾아 고쳐야 한다. semantic만 쓰면 `globals.css` 한 곳만 고치면 된다.

```tsx
// ❌ primitive 직접 사용
<div className="bg-zinc-50 text-zinc-900 border-zinc-200">

// ✅ semantic
<div className="bg-surface-raised text-fg border-border">
```

## 역할 토큰 목록

### 표면 (surface)

| 토큰 | 쓰는 곳 |
| --- | --- |
| `bg-surface` | 페이지 배경 |
| `bg-surface-raised` | 카드·패널 (배경에서 한 단계 올라온 것) |
| `bg-surface-sunken` | 입력 필드 배경·코드 블록 (파묻힌 것) |
| `bg-surface-overlay` | 모달·팝오버 |

라이트에서는 raised가 **더 어둡고**, 다크에서는 **더 밝다.** 층은 밝기 차로 만든다.

### 텍스트 (fg)

| 토큰 | 쓰는 곳 |
| --- | --- |
| `text-fg` | 본문·제목 |
| `text-fg-muted` | 보조 설명 |
| `text-fg-subtle` | 메타 정보(작성일, 카운트) — **AA 최소선**. 더 흐리게 만들지 않는다 |
| `text-fg-on-solid` | 채움색 위 글자 |

### 보더 — 두 종류를 구분한다

| 토큰 | 쓰는 곳 | 대비 요구 |
| --- | --- | --- |
| `border-border` | 장식용 구분선, 카드 외곽 | 없음 (장식) |
| `border-border-strong` | 강조 구분 | 없음 |
| `border-border-interactive` | **입력 필드·체크박스** 등 경계 자체가 의미인 것 | **3:1 필수** |

WCAG 1.4.11(비텍스트 대비)은 *의미 있는* UI 경계에만 적용된다.
구분선까지 3:1로 만들면 화면이 답답해지므로 분리했다.

### 브랜드

| 토큰 | 쓰는 곳 |
| --- | --- |
| `text-brand` | 링크·강조 텍스트 |
| `bg-brand-solid` / `bg-brand-solid-hover` | 주요 버튼 채움 |
| `bg-brand-subtle` + `text-brand-on-subtle` | 틴트 배경 블록 |

> `brand`(링크)와 `brand-solid`(버튼 채움)를 나눈 이유: 라이트에서는 같은 값이지만
> **다크에서 갈라진다.** 링크는 밝게(teal-300), 버튼은 밝은 채움 + 어두운 글자(teal-400).

### 상태

`success` / `warning` / `danger` / `info` 각각 3종:

```
text-danger            텍스트·아이콘
bg-danger-subtle       틴트 배경
text-danger-on-subtle  그 틴트 위 글자
```

### 포커스

`--focus-ring`. 전역 `:focus-visible` 규칙이 이미 적용하므로
컴포넌트가 따로 신경 쓸 필요가 없다. **지우지만 않으면 된다.**

## 도메인 상태 매핑

[리스크 등급](../10-domain/10-visa-immigration/03-content-and-risk-policy.md)과
[최신성](../20-product/10-features/03-guides-wiki.md)을 상태 토큰에 연결한다.
새 색을 만들지 않는다.

| 도메인 개념 | 토큰 |
| --- | --- |
| R1 (비자·주거·취업 고지) | `danger-subtle` 배너 |
| R2 (학교·보험 절차) | `warning-subtle` 배너 |
| R3 (생활 팁·교류) | 배너 없음 |
| 최신성: 확인됨 | `success` |
| 최신성: 오래됨 | `warning` |
| 최신성: 매우 오래됨 | `danger` |
| 개인 경험 블록 | `info-subtle` |

**색만으로 구분하지 않는다** — 아이콘과 텍스트 레이블을 함께 쓴다
([원칙 5](./01-principles.md)).

## 새 토큰을 추가할 때

1. 정말 새 **역할**인가? 기존 역할의 변형이면 추가하지 않는다
2. primitive에 값이 있는가? 없으면 먼저 팔레트에 추가
3. **라이트/다크 양쪽** 값을 정한다. `light-dark(라이트, 다크)` 한 줄로 선언하므로
   한쪽만 정의하는 것 자체가 불가능하다 → [네이티브 플랫폼 우선](./10-foundations/08-native-platform.md)
4. 텍스트 토큰이면 **대비를 측정**한다 → [색](./10-foundations/01-color.md)
5. `@theme inline`에 유틸리티로 노출
6. 이 문서의 표에 추가
