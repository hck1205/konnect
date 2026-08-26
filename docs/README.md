# konnect 문서

한국에 거주하거나, 여행·이민·유학 목적으로 들어오는 **외국인**을 위한 커뮤니티 서비스.
이 폴더는 그 서비스의 기획·도메인·아키텍처·운영 문서를 관심사별로 모아 둔 곳이다.

> 상태: **초안(draft)**. 아직 확정되지 않은 항목은 각 문서의 `열린 질문` 절에 모아 둔다.
> 확정되지 않은 것을 확정된 것처럼 쓰지 않는 것이 이 문서 모음의 규칙이다.

## 카테고리

| 번호 | 폴더 | 다루는 것 |
| --- | --- | --- |
| 00 | [`00-overview/`](./00-overview/) | 왜 만드는가 — 비전·문제·타깃·범위·용어 |
| 10 | [`10-domain/`](./10-domain/) | 사용자가 겪는 **실제 이슈 영역**(비자·어학·학교·주거·취업·교류) |
| 20 | [`20-product/`](./20-product/) | 그 이슈를 **제품으로 어떻게 푸는가** — IA·기능·여정·MVP·지표 |
| 25 | [`25-design/`](./25-design/) | 디자인 시스템 — 원칙·토큰·foundation |
| 30 | [`30-architecture/`](./30-architecture/) | 기술 구조 — 시스템·API·데이터 모델·인증·다국어 |
| 40 | [`40-operations/`](./40-operations/) | 환경·로컬 개발·배포 |
| 50 | [`50-decisions/`](./50-decisions/) | ADR — 되돌리기 어려운 결정과 그 이유 |
| 90 | [`90-templates/`](./90-templates/) | 새 문서를 시작할 때 복제하는 템플릿 |

## 넘버링 규칙

- **폴더는 10 단위**(`00`, `10`, `20`…)로 번호를 매긴다. 사이에 새 카테고리를 끼워 넣어도
  전체 번호를 다시 매길 필요가 없다.
- **파일은 1 단위**(`01-`, `02-`…)로, 읽는 순서대로 매긴다.
- 각 폴더의 **`00-README.md`가 그 폴더의 목차**다. 하위 폴더가 생기면 거기에도 둔다.
- 카테고리가 커지면 **하위 폴더로 더 쪼갠다**(예: `10-domain/10-visa-immigration/`).
  깊이 제한은 두지 않는다 — 관심사가 갈라지면 폴더로 갈라 놓는 쪽을 택한다.
- 파일명은 `kebab-case`, 내용 언어는 한국어(팀 내부 문서), 제품 UI 문구는 영어가 기준이다
  ([ADR-0003](./50-decisions/0003-english-first-multilingual.md)).

## 읽는 순서 (처음이라면)

1. [`00-overview/01-product-vision.md`](./00-overview/01-product-vision.md) — 한 줄 정의
2. [`00-overview/02-problem-statement.md`](./00-overview/02-problem-statement.md) — 무엇이 문제인가
3. [`20-product/04-mvp-scope.md`](./20-product/04-mvp-scope.md) — 처음 무엇을 만드는가
4. [`25-design/02-tokens.md`](./25-design/02-tokens.md) — 화면을 어떤 토큰으로 만드는가
5. [`30-architecture/01-system-overview.md`](./30-architecture/01-system-overview.md) — 어떻게 만드는가
