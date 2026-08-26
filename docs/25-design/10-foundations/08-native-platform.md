# 네이티브 플랫폼 우선

## 원칙

**브라우저가 이미 하는 일을 다시 구현하지 않는다.**

라이브러리로 만든 모달·팝오버·아코디언은 거의 항상 네이티브보다 접근성이 나쁘다.
포커스 트랩, Esc 닫기, 최상위 레이어, 스크린리더 노출을 직접 만들면 어딘가 빠진다.
브라우저는 그걸 이미 정확히 한다.

konnect처럼 **접근성이 기준선인 서비스**([원칙 5](../01-principles.md))에서는 이게
취향이 아니라 품질 문제다.

## 이미 적용한 것

`FE/src/app/globals.css`에 들어가 있다.

| 기능 | 무엇을 대체했나 | 왜 |
| --- | --- | --- |
| `light-dark()` | 라이트/다크 토큰 블록 2벌 | 두 값을 한 줄에 둬 **한쪽만 정의하는 실수를 구조적으로 차단** |
| `color-scheme` | — | 네이티브 폼 컨트롤·스크롤바가 테마를 따라간다 |
| `accent-color` | 체크박스·라디오·range 재구현 | 한 줄로 강조색이 브랜드에 맞는다 |
| `color-mix()` | rgba 리터럴 하드코딩 | scrim을 **토큰에서 파생** — 팔레트가 바뀌면 같이 바뀐다 |
| `text-wrap: pretty` | — | 본문 고아 단어 감소. 한 줄씩 읽는 사용자에게 실제 효과 |
| `text-wrap: balance` | — | 제목 줄 길이를 고르게 |
| `:focus-visible` | JS 포커스 관리 | 마우스 클릭엔 안 뜨고 키보드엔 뜬다 |
| `scroll-margin-block-start` | 스크롤 호출부마다 offset 계산 | 앵커 이동 시 고정 헤더에 제목이 가리지 않는다. **대상 요소에 한 번만** 선언 |
| `scroll-behavior: smooth` | 스크롤 애니메이션 JS | reduced-motion에서 자동으로 꺼진다 |
| `@media (any-pointer: coarse)` | User-Agent 기기 판별 | **입력 장치 성능을 직접 묻는다.** 터치스크린 노트북도 올바르게 처리 |
| `::selection` / `::marker` | — | semantic 구조를 유지한 채 색만 맞춘다 |
| `prefers-reduced-motion` | — | 접근성 필수 |

### `light-dark()`에 대한 주의

빌드 시 Lightning CSS가 `--lightningcss-light` / `--lightningcss-dark` 변수 방식으로
다운레벨한다(`:root`가 light, `.dark`가 dark로 전환). **동작은 동일**하고 구형 브라우저도 커버된다.

단, 폴리필된 형태는 `.dark` 클래스에만 반응하고 시스템 설정을 자동으로 따르지 않는다.
이건 우리 의도와 맞다 — 사용자가 라이트/다크/시스템을 **직접 고르는** 전략이기 때문이다.
시스템 선호 반영은 초기 스크립트가 `.dark` 클래스를 붙이는 방식으로 처리한다(미구현).

## 컴포넌트를 만들 때 쓸 것

[컴포넌트 단계](../20-components/)에서 아래를 **기본 선택지**로 삼는다.

| 만들 것 | 네이티브 |
| --- | --- |
| 모달 | **`<dialog>`** — 최상위 레이어, 포커스 관리, Esc 닫기를 브라우저가 한다. JS는 열고 닫기만 |
| 드롭다운·메뉴·툴팁 | **Popover API** — 최상위 레이어, 바깥 클릭·Esc를 브라우저가 처리 |
| 아코디언 | **`<details>`** + 같은 `name` → 하나 열면 나머지가 닫힌다. 상태 관리 JS 불필요 |
| 비활성 영역 | **`inert`** — 포커스·포인터·접근성 트리에서 통째로 제외 |
| 이름-값 목록 | **`<dl>/<dt>/<dd>`** + CSS Grid — 표처럼 보이되 의미 구조 유지 |
| 숫자·통화·날짜 | **`Intl.NumberFormat`**, **`Intl.RelativeTimeFormat`** — 로케일별 포맷을 직접 조합하지 않는다 |
| 클래스 토글 | `classList.toggle(cls, boolean)` — 두 번째 인자로 상태를 **명시적으로 동기화** |
| 부모를 자식 상태로 스타일링 | `:has()` — `form:has(:invalid)` |
| 컴포넌트 폭 기준 반응형 | Container Query — 뷰포트가 아니라 **실제 받은 공간** 기준 |

> `Intl.RelativeTimeFormat`은 konnect에서 특히 유용하다. 사용자가 여러 시간대에 흩어져 있고
> ([데이터 모델 노트](../../30-architecture/04-data-model.md)) 다국어로 확장할 예정이라,
> "3일 전"을 직접 조립하면 로케일마다 다시 만들어야 한다.

## konnect 고유 적용: `translate="no"`

**이 서비스에 특히 중요하다.**

브라우저 번역기(Chrome 자동 번역 등)는 페이지 전체를 번역한다. 그런데 우리는
한국어 원문을 **그대로 보여줘야** 한다 — 사용자가 그 글자를 실제 서류나 검색창에서
찾아야 하기 때문이다 ([i18n 전략](../../30-architecture/06-i18n-strategy.md)).

`외국인등록증`이 번역기에 의해 "Alien Registration Card"로 바뀌면 그 목적이 사라진다.

```html
<!-- 한국어 원문 병기 — 번역 금지 + 언어 선언 -->
Alien Registration Card (<span lang="ko" translate="no">외국인등록증</span>)
```

- `translate="no"` → 브라우저 번역기가 건너뛴다
- `lang="ko"` → 스크린리더가 한국어로 읽는다

**규칙**: 행정 서식명·관청명·제도명 등 원문 그대로여야 하는 한국어에는
`lang="ko" translate="no"`를 함께 붙인다. 코드·고유명사도 마찬가지다.

## `hidden="until-found"`

접힌 콘텐츠를 브라우저 페이지 내 검색(Ctrl+F)으로 찾을 수 있게 유지하고,
검색되면 자동으로 펼쳐진다.

가이드 문서의 긴 절이나 FAQ 아코디언에 유용하다 — 사용자가 "이 페이지 어딘가에
답이 있는데" 상황에서 접힌 부분을 못 찾는 문제를 없앤다.
지원 편차가 있으므로 **접혀 있어도 내용이 필수는 아닌 곳**에만 쓴다.

## 쓰지 않기로 한 것

| 기능 | 이유 |
| --- | --- |
| `scrollbar-width: none` (스크롤바 숨김) | 스크롤 가능하다는 **유일한 시각 단서**를 없앤다. 캐러셀 등 대체 표시가 있는 곳 외에는 금지 |
| View Transitions API | 검색 유입자가 상세에 바로 착지한다 — 전환이 거의 없다. [모션 원칙](./05-motion.md)의 "페이지 전환 애니메이션 없음"과도 배치 |
| Scroll-driven Animations | 읽기를 방해한다 |
| CSS Carousel / Grid Lanes / `@function` / `corner-shape` | 아직 실험적. 지원이 안정되면 재검토 |
| `contrast-color()` | 대비를 브라우저에 맡기는 대신 **우리가 측정해서 토큰으로 고정**했다 ([색](./01-color.md)). 측정값이 문서에 남는 쪽이 낫다 |

## 실험적 기능을 쓸 때

점진적 향상(progressive enhancement)으로만 쓴다.

```css
@supports (corner-shape: squircle) { /* 향상된 표현 */ }
```

기능이 없어도 **화면이 성립해야 한다.** 지원 여부는 MDN·caniuse·webstatus.dev로 확인한다.
