# 아이콘

## 라이브러리

**`lucide-react`** (FE 의존성에 포함).

- 선(stroke) 기반이라 본문 굵기와 잘 어울린다
- 트리 셰이킹되어 쓰는 아이콘만 번들에 들어간다

## 규칙

### 아이콘만으로 의미를 전달하지 않는다

**이 서비스에서 특히 중요하다.** 아이콘의 의미는 문화권마다 다르고,
사용자는 다양한 국적에서 온다 ([타깃](../../00-overview/03-target-users.md)).

```tsx
// ❌ 아이콘만
<button><Trash2 /></button>

// ✅ 레이블 동반
<button><Trash2 /> Delete</button>

// △ 공간이 정말 없다면 최소한 접근 가능한 이름을
<button aria-label="Delete"><Trash2 aria-hidden /></button>
```

### 크기

| 맥락 | 크기 |
| --- | --- |
| 본문 인라인 | 16px |
| 버튼 내부 | 16~20px |
| 독립 액션 | 20px |
| 빈 상태 일러스트 | 32~48px |

본문과 함께 놓일 때는 **텍스트 크기에 맞춘다.** 아이콘이 글자보다 크면 시선을 뺏는다.

### 색

아이콘도 `text-*` semantic 토큰을 따른다. 별도 아이콘 색 토큰을 만들지 않는다.
장식용 아이콘은 `text-fg-subtle`, 의미가 있으면 상태 토큰을 쓴다.

### 접근성

- 의미를 전달하는 아이콘 → `aria-label` 또는 곁의 텍스트
- 장식용 아이콘 → `aria-hidden="true"` (스크린리더가 읽지 않게)

## 상태 아이콘 매핑

색만으로 구분하지 않기 위해 상태마다 아이콘을 고정한다
([원칙 5](../01-principles.md)).

| 상태 | 아이콘 |
| --- | --- |
| success | `CheckCircle2` |
| warning | `AlertTriangle` |
| danger / R1 고지 | `AlertOctagon` |
| info / 개인 경험 | `Info` |
| 최신성 오래됨 | `Clock` |

## 미정

- 브랜드 로고/심볼 — 아직 없다
- 파비콘 — 아직 없다
