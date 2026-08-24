# 시스템 개요

## 구성

```
 브라우저
    │
    ▼
┌─────────────────┐   /api/*   ┌──────────────────┐
│  FE (Next.js)   │ ─────────► │  BE (NestJS)     │
│  App Router     │  rewrites  │  :4000           │
│  :3000          │            └────────┬─────────┘
└─────────────────┘                     │ Prisma
                                        ▼
                                 ┌──────────────┐
                                 │  PostgreSQL  │
                                 └──────────────┘
```

## 왜 이 구성인가

| 선택 | 이유 |
| --- | --- |
| **Next.js (App Router)** | 검색 유입이 주 채널이라 **SSR/SSG가 기능 요구사항**이다 ([검색과 SEO](../20-product/10-features/05-search-and-tagging.md)) |
| **NestJS** | 도메인 모듈 경계가 구조로 강제된다. 영역이 6개로 갈리는 이 서비스에 맞다 |
| **PostgreSQL** | 관계형 데이터(질문-답변-태그)가 주이고, 전문검색(`tsvector`)을 DB에서 시작할 수 있다 |
| **`/api/*` 프록시** | FE와 BE를 같은 오리진으로 서빙해 CORS와 쿠키 문제를 없앤다 |
| **BE/ · FE/ 분리** | 배포 단위가 다르다 ([ADR-0002](../50-decisions/0002-monorepo-be-fe-split.md)) |

## 검색엔진

MVP는 **Postgres 전문검색으로 시작**하고 별도 검색엔진을 두지 않는다.
콘텐츠가 쌓이고 한국어/영어 혼재 문제가 실제 병목이 되면 그때 도입한다
(→ [검색과 태그](../20-product/10-features/05-search-and-tagging.md)).

## 저장소 드라이버 스위치

BE는 `DB_DRIVER` 값으로 **인메모리 / Prisma** 구현을 갈아끼운다.
테스트와 초기 개발이 **DB 없이** 돌아간다는 뜻이다 → [BE/README.md](../../BE/README.md)

## 아직 정하지 않은 것

- 배포 대상(호스팅) → [40-operations/03-deployment.md](../40-operations/03-deployment.md)
- 이미지/첨부 저장소 (오브젝트 스토리지 필요 시점)
- 캐시 계층 (초기에는 없음)
