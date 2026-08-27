# 50 · 결정 기록 (ADR)

되돌리기 어려운 결정과 **그때 왜 그렇게 정했는지**를 남긴다.
나중에 "이거 왜 이렇게 했지?"에 답하기 위한 것이지, 결정을 옹호하기 위한 것이 아니다.

| # | 제목 | 상태 |
| --- | --- | --- |
| [0001](./0001-record-architecture-decisions.md) | ADR을 기록한다 | 수락됨 |
| [0002](./0002-monorepo-be-fe-split.md) | 한 저장소에 BE/ · FE/ 분리 | 수락됨 |
| [0003](./0003-english-first-multilingual.md) | 영어 우선, 다국어 확장 | 수락됨 (일부 [0005](./0005-multilingual-from-day-one.md)로 대체) |
| [0004](./0004-direct-messages-with-safety-gates.md) | 1:1 쪽지 도입 — 안전 장치 전제 | 수락됨 |
| [0005](./0005-multilingual-from-day-one.md) | 다국어를 출시 시점부터 | 수락됨 |
| [0006](./0006-audience-priority-from-population-data.md) | 타깃 우선순위를 인구 데이터로 재조정 | 수락됨 |

## 규칙

- 번호는 4자리 연번(`0001`), 되돌아가 다시 매기지 않는다
- 상태: `제안됨` → `수락됨` → (`대체됨 by #NNNN` / `폐기됨`)
- **수락된 ADR은 수정하지 않는다.** 생각이 바뀌면 새 ADR을 쓰고 이전 것을 `대체됨`으로 표시한다
- 템플릿: [90-templates/adr-template.md](../90-templates/adr-template.md)

## 무엇을 ADR로 쓰는가

- 되돌리는 데 비용이 큰 것 (데이터 모델, 인증 방식, 저장소 구조)
- 나중에 반드시 "왜?"가 나올 것 (남들이 흔히 하는 것과 다르게 한 선택)
- **쓰지 않는 것**: 쉽게 바꿀 수 있는 것, 취향 문제, 라이브러리 사소한 선택
