# 검색과 태그

> 우선순위 **P0** · 태그는 **소급 적용이 불가능**해 반드시 처음부터 넣는다

## 태그 체계

세 종류를 구분한다. 섞으면 필터가 무너진다.

| 종류 | 예 | 누가 만드나 | 값 |
| --- | --- | --- | --- |
| **주제 (topic)** | `visa`, `housing` | 시스템 고정 | [10-domain](../../10-domain/) 6종 |
| **고정 어휘 태그** | `visa:d-2`, `topic:residency`, `region:seoul`, `nationality:vn`, `school:snu` | 관리자만 | 네임스페이스:값 |
| **자유 태그** | `interview`, `winter` | 사용자 | 소문자, 자유 |

### 왜 고정 어휘가 필요한가

`D-2`, `d2`, `D2 visa`, `디투`가 전부 다른 태그가 되면 **필터가 작동하지 않는다.**
매칭 품질이 곧 이 서비스의 가치이므로, 매칭에 쓰이는 축은 사용자가 만들 수 없게 한다.

### 네임스페이스

```
visa:f-2         visa:f-5        visa:naturalization    visa:e-7   ...
topic:residency  topic:work      topic:housing          topic:admin   topic:language
region:ansan     region:seoul    region:gyeonggi        ...
nationality:vn   nationality:cn  nationality:uz         ...
lang:en          lang:ko         lang:vi                lang:ja   ...
school:snu       ...
```

`topic:` 과 `nationality:` 는 나중에 추가됐다 —
[09-content-pillars](../20-prd/09-content-pillars.md)와
[ADR-0008](../../50-decisions/0008-nationality-as-tag-not-space.md)이 요구했다.

`lang:` 은 다른 태그와 쓰임이 다르다 — **필터가 아니라 정렬 가중치**로 쓴다
([ADR-0010](../../50-decisions/0010-language-as-weight-not-wall.md)).
임계질량을 넘은 언어만 기본 필터로 승격한다.

**교차 필터가 이 태그 체계의 존재 이유다.** `nationality:vn` × `topic:residency`,
`visa:f-2` × `region:ansan` 처럼 축을 곱해야 답이 나온다. BE 가 태그 AND 를 지원한다.

### ⚠️ `nationality:` 는 민감하다

국적은 [차별의 축](../../10-domain/60-social-community/02-safety-and-trust.md)이 될 수 있다.

- **선택 입력**이다. 강제하지 않는다
- 프로필에서 자동으로 붙이지 않는다 (자동 제안은 열린 질문)
- **태그 조합으로 개인이 특정되지 않는지** 점검한다 —
  `nationality:mn` × `region:영암` × `visa:e-9` 는 몇 명인가

### 태그를 공간으로 승격하는 기준

태그가 자라면 전용 카테고리가 될 수 있다. **감이 아니라 숫자로 판정한다.**

> **주간 신규 글 10건 이상이 4주 연속**이고, **답변률이 전체 평균 이상**일 때만 승격.

이 기준이 **"빈 방을 만들지 않는다"를 자동으로 보장한다.**
`nationality:` · `school:` · `region:` 전부 같은 규칙을 따른다.
(숫자 10 은 근거 없는 초기값이다. 운영하며 조정한다.)

### 정규화 규칙

- 네임스페이스와 값 모두 소문자, 공백은 하이픈: `school:seoul-national-university`
- 표시할 때만 사람이 읽는 형태로 올린다 (`visa:d-2` → `D-2`)
- 별칭(alias)을 지원한다: 사용자가 `D2`를 치면 `visa:d-2`로 흡수

## 검색

### Phase 1

- Postgres 전문검색(`tsvector`)으로 시작한다. 별도 검색엔진을 두지 않는다
- 대상: 제목, 본문, 태그
- 필터: topic, tags
- 정렬: 관련도 / 최신 / 답변 있음

### 한국어 + 영어 혼재 문제

이 서비스의 검색은 **본질적으로 이중 언어**다. 질문은 영어로 쓰이지만
고유명사(학교명, 관청명, 제도명)는 한국어로 섞여 들어온다.

- Postgres 기본 형태소 분석기는 한국어를 제대로 못 다룬다
- MVP에서는 감수하고, Phase 2 이후 개선 대상으로 둔다
- 대안: 별칭 사전으로 주요 용어를 양쪽 언어로 매핑 (`immigration office` ↔ `출입국`)

## SEO

검색 유입이 주 채널이므로 ([J1](../03-user-journeys.md)) 검색엔진 노출이 기능이다.

- SSR로 본문이 HTML에 실려야 한다
- 정규 URL(canonical), 구조화 데이터(QAPage), sitemap
- 질문 제목이 곧 검색어가 되도록 제목 작성을 유도

## 열린 질문

- 고정 어휘 태그를 **누가 관리**하나? 신규 요청 흐름이 필요하다
- `nationality:` 를 프로필에서 **자동 제안**할 것인가? 편하지만 민감정보다
- 국적별 정보(아포스티유·본국 서류)의 **발견성** — 필터를 모르는 사용자에게 어떻게 닿는가
- 학교 태그를 어디까지 미리 채워 둘 것인가?
- 검색엔진(Meilisearch 등) 도입 시점 — 콘텐츠 몇 건부터?
