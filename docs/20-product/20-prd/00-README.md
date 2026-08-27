# 20-prd · 제품 요구 정의

이 폴더는 **"누구의 어떤 문제를 어떤 순서로 푸는가"** 를 데이터로 정한다.

기존 `20-product/01~05` 는 *"무엇을 만드는가"* 를 적은 문서다.
이 PRD 는 그 앞단 — **왜 그것을 그 순서로 만드는가** — 를 담당한다.
기능 상세를 여기에 다시 쓰지 않는다. [10-features/](../10-features/) 로 링크한다.

> **BD 관점**: 커뮤니티는 트래픽만으로 사업이 되지 않는다.
> [07-monetization](./07-monetization.md) 이 수익 파이프라인을 정하고,
> **팔 수 없는 것을 만드는 데 시간을 쓰지 않도록** 기능 우선순위를 제약한다.

| 문서 | 정하는 것 |
| --- | --- |
| [01-market-data.md](./01-market-data.md) | **실측 수치** — 국적·체류자격·지역·조사. 모든 판단의 근거 |
| [02-segments-and-priority.md](./02-segments-and-priority.md) | 세그먼트와 **우선순위** (모수 × 도달가능성 × 문제밀도) |
| [03-interests-and-jobs.md](./03-interests-and-jobs.md) | **관심사** — 무엇을 하러 오는가 |
| [04-requirements.md](./04-requirements.md) | 요구사항 — Must / Should / Could |
| [05-localization-priority.md](./05-localization-priority.md) | 지원 언어 **순서와 그 기준** |
| [06-risks-and-open-questions.md](./06-risks-and-open-questions.md) | 리스크와 아직 모르는 것 |
| [07-monetization.md](./07-monetization.md) | **수익 파이프라인(BD)** — 무엇을 팔 수 있는가, 규제의 선은 어디인가 |

## 이 PRD 가 뒤집은 것 (두 번)

| ADR | 무엇을 뒤집었나 |
| --- | --- |
| [0006](../../50-decisions/0006-audience-priority-from-population-data.md) | **"영어권 전문직"** 가정이 인구 데이터와 맞지 않았다 → 베트남 유학생 |
| [0007](../../50-decisions/0007-settlement-intent-as-primary-axis.md) | 축을 **체류 목적 → 정주 의도**로 바꿨다 → **영주·귀화 준비자** |

0007 이 0006 의 **결론**을 대체한다. 0006 의 **방법**(네 축으로 계산한다)은 유효하다 —
바뀐 것은 축의 **가중치**이고, 지금은 **잔존기간이 최우선**이다.

## 수치를 다룰 때의 규칙

1. **모든 숫자에 기준 시점과 출처를 붙인다.** 시점이 없는 숫자는 이 폴더에 들어올 수 없다
2. **집계 기준이 다른 숫자를 한 표에 섞지 않는다.** 체류외국인 / 등록외국인 /
   상주인구 / 이주배경인구는 **서로 다른 모집단**이다 ([01-market-data](./01-market-data.md#집계-기준이-네-가지다))
3. 추정치는 `~` 를 붙이고 **어떻게 추정했는지** 적는다
