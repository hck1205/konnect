# 정보 구조 (IA)

## 세 축

콘텐츠를 **성격**, **주제**, **맥락** 세 축으로 나눈다. 이 셋은 서로 직교한다.

| 축 | 값 | 역할 |
| --- | --- | --- |
| **성격 (type)** | Question / Post / Guide / Checklist / Meetup | 콘텐츠가 무엇인가 |
| **주제 (topic)** | visa / language / education / housing / work / social | 어느 도메인인가 — [10-domain](../10-domain/) 대응 |
| **맥락 (tag)** | `visa:f-2`, `topic:residency`, `region:ansan`, `nationality:vn` | 누구의 상황인가 |

한 글은 **성격 1개 + 주제 1개 + 맥락 N개**를 가진다.
검색·필터·개인화가 전부 이 세 축의 조합으로 나온다.

> **맥락은 태그이지 공간이 아니다.** 국적·학교·지역으로 **전용 방을 만들지 않는다** —
> 모수가 쪼개지고 빈 방이 생긴다. 공간으로 승격하는 조건은
> [ADR-0008](../50-decisions/0008-nationality-as-tag-not-space.md)이 숫자로 정한다.

> **실제 라우트 목록과 색인 정책**은
> [30-architecture/07-routes-and-indexing](../30-architecture/07-routes-and-indexing.md)이 갖는다.
> 아래는 사용자가 보는 네비게이션이고, 그쪽은 URL 과 `noindex` 경계다.

## 네비게이션 (초안)

```
konnect
├─ Home              개인화 피드 (온보딩 정보 기반) / 비로그인은 인기·최신
├─ Ask               질문하기 → Q&A 목록
├─ Guides            가이드(승격된 문서) — 주제별 브라우징
├─ Checklists        시점별 할 일 (도착 전 / 도착 직후 / 정착기)
├─ Boards            주제별 게시판 (토론·후기·잡담)
├─ Meetups           밋업 목록  ※ 2단계
└─ Me                프로필 / 내 글 / 저장 / 알림
```

## 화면 우선순위

1. **콘텐츠 상세** (질문/가이드) — 검색 유입의 착지점. 여기가 제일 중요하다
2. **검색 결과 / 목록** — 필터(주제·태그)가 붙는다
3. **작성 화면** — 태그 입력을 자연스럽게 유도해야 한다
4. **홈** — 재방문자용. 초기에는 유입이 검색이므로 우선순위가 낮다

> 홈을 마지막에 두는 것이 의도적이다. 초기 서비스의 트래픽은 검색으로 **상세 페이지에 바로**
> 떨어진다. 홈을 잘 만들어도 아무도 안 본다.

## 콘텐츠 승격 흐름

```
Question ──(반복되면)──> Guide ──(시점이 명확하면)──> Checklist 항목
```

이 승격이 [제품 원칙 1](../00-overview/02-problem-statement.md)의 구현체다.
누가·언제 승격시키는지는 [가이드 기능](./10-features/03-guides-wiki.md) 참고.

## 열린 질문

- Boards(게시판)와 Q&A를 **분리**할 것인가, 하나의 피드에 type만 다르게 둘 것인가?
  분리하면 명확하고, 합치면 초기에 덜 휑해 보인다.
- Topic을 URL 1급 시민으로 둘 것인가? (`/topics/visa/...` vs `/questions?topic=visa`) → SEO에 영향
