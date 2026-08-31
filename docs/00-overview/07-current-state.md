# 현재 상태

> **갱신: 2026-08-31.** 세션이 바뀌어도 여기부터 읽으면 이어받을 수 있게 쓴다.
> 결정의 *근거*는 여기 적지 않는다 — [ADR](../50-decisions/)과 [PRD](../20-product/20-prd/)가 갖는다.
> 이 문서는 **무엇이 되어 있고 무엇이 막혀 있는가**만 답한다.

## 한눈에

| | |
| --- | --- |
| 커밋 | 40 (2026-08-24 ~ 08-31) |
| 문서 | 96개 · ADR 11개 |
| 코드 | BE 3,025줄 · FE 15,647줄 |
| 배포 | **A1 서버에서 가동 중** — `https://134.185.112.123` (self-signed) |
| 열린 PR | [#1](https://github.com/hck1205/konnect/pull/1) — 레퍼런스·분류·출처 감시 |

## 무엇이 되어 있나

### 제품 정의 — 세 번 뒤집혔다

방향이 바뀔 때마다 ADR 로 남겼다. **읽는 순서가 곧 사고의 순서다.**

| | 무엇이 바뀌었나 |
| --- | --- |
| [0006](../50-decisions/0006-audience-priority-from-population-data.md) | 추측 → **인구 데이터**. "영어권 전문직"이 모수의 주변부였다 |
| [0007](../50-decisions/0007-settlement-intent-as-primary-axis.md) | 체류 목적 → **정주 의도**. 비치헤드가 영주·귀화 준비자가 됐다 |
| [0008](../50-decisions/0008-nationality-as-tag-not-space.md)·[0011](../50-decisions/0011-taxonomy-that-scales.md) | 공간 vs 태그 → **세 층**(네임스페이스·값·공간) |

레퍼런스는 [06-references](./06-references.md) — 카페·Reddit·LinkedIn·채용 플랫폼에서
**무엇을 버리는가**가 핵심이다.

### BE — Q&A 가 돈다

- 질문·답변·채택·태그, 키셋 페이지네이션, 권한
- **저장소 드라이버 두 개**(memory · prisma)가 **같은 e2e 24건**을 통과한다
- 테스트: unit 96 · e2e 24
- ⚠️ **OAuth 없음.** `/auth/login` 은 임시 통로이고 운영에서 404 다 →
  **아무도 글을 쓸 수 없다. 지금 유일한 하드 블로커.**

### FE — 상세 화면 하나

- 디자인 시스템 80여 종 · Ladle 스토리
- i18n `en`·`ko`·`zh`·`vi` (로케일 URL 세그먼트, `Accept-Language` 협상)
- **query 계층** — `auth`·`questions`·`answers`, 도메인별 `.api`/`.keys`/`.hooks`
- **질문 상세** `/[locale]/questions/[id]/[slug]` — SSR·canonical·hreflang·301 정규화
- 테스트: unit 267 · **integration 7(라이브 BE)** · contrast 64 · routing 11 · seo 8
- ⚠️ **목록·홈 화면이 없다.** 상세로 들어가는 입구가 없어 URL 을 직접 열어야 한다

### 인프라 — 배포까지 돈다

- PR 검증(CI) · main 병합 시 ARM 네이티브 빌드 → GHCR → SSH 배포 → 스모크
- `deploy/a1-deploy.sh` — pull → **마이그레이션 먼저** → 교체 → 헬스체크 → **실패 시 롤백**
- 상세는 [03-deployment](../40-operations/03-deployment.md)

### 경계 계약 — [`contracts/`](../../contracts/README.md)

BE·FE 가 서로를 import 하지 않으므로([ADR-0002](../50-decisions/0002-monorepo-be-fe-split.md))
같아야 할 규칙을 **데이터로 두고 양쪽 테스트가 대조**한다. 한쪽이 갈라지면 그쪽이 깨진다.

## 지금 막혀 있는 것

### 1. 공식 출처 감시를 서버에서 못 돌린다 ← **바로 다음 작업**

[감시 스크립트](../20-product/10-features/11-official-sources.md)는 로컬에서 **동작을 확인했다**
(법령 3건 + 페이지 2건, 3회 연속 안정). 그런데 서버 배치가 막혔다.

- 법제처 API 가 **호출 IP 사전 등록**을 요구해 GitHub Actions 에서는 못 돈다 → A1 cron 으로 옮김
- 그런데 `deploy/a1-watch-sources.sh` 가 **서버에 저장소 체크아웃이 있다고 가정**하는데
  A1 은 **이미지만 받아 실행**하는 서버라 소스가 없다 (`/srv/app/konnect/repo` 없음)

**선택지 둘. 아직 안 정했다.**

| | 내용 | 평가 |
| --- | --- | --- |
| **A** | BE 이미지에 `scripts/` 를 담고 `compose run --rm watch-sources` | **권장.** 서버에 git 불필요. `migrate` 와 같은 패턴 |
| B | 서버에 저장소를 클론 | 프로덕션에 git 체크아웃 + push 권한이 생긴다 — 배포 키 `command=` 제약을 역행 |

A 로 가려면 **`docker-compose.yml` 이 필요한데 저장소에 없다**(서버에만 있다).

상태 파일도 다시 봐야 한다. 지금은 git 에 커밋하는 설계인데,
**해시는 파생 데이터라** 서버 로컬 파일이면 충분하고 그 편이 git 의존을 없앤다.

### 2. 게시판 구조 — 결정 대기

게시판 = `topic`(비자·채용·거주·학업·교류) 으로 가기로 했는데 둘이 안 정해졌다.

- **글 `type` 값**: `질문·후기·정보공유·모집`(의도) vs `Question·Guide·Checklist`(형식)
- **`language` 와 `social` 을 "교류/어학"으로 합칠지**

**BE `Question` 에 `type` 필드가 없다.** 지금은 모든 글이 질문이라 게시판이 성립하지 않는다.

### 3. 저장소 밖에 있는 것

| | 어디 |
| --- | --- |
| `docker-compose.yml`, `.env` 키 목록, 서버 초기 구성 | **A1 서버 `~/docs` 볼트** |
| `~/docs/fleet/konnect-deploy.md`, `stack/edge-ops.md`, `stack/cert-ops.md` | 같음 |

저장소만 보는 사람은 **따라갈 수 없다.** [03-deployment](../40-operations/03-deployment.md)가
위치를 가리키지만 내용은 없다.

## 다음에 할 일 (권장 순서)

1. **출처 감시 서버 배치** — A 안. `docker-compose.yml` 확보가 선행
2. **게시판 구조** — `type` 결정 → BE 필드 + 계약 + 마이그레이션
3. **② 목록 화면** — 상세로 들어가는 입구. 정렬(채택·신선도)이 처음 붙는 자리
4. **OAuth** — 이게 없으면 쓰기가 영원히 불가능하다

## 알아 두면 시간을 아끼는 것들

여기까지 오면서 **돌려봐야만 드러난** 것들이다. 전부 문서에 근거가 있다.

| 함정 | 어디에 |
| --- | --- |
| `.gitignore` 가 루트 `/*` 라 **새 폴더가 조용히 빠진다** (`contracts/`·`.github/` 가 실제로 그랬다) | [03-deployment](../40-operations/03-deployment.md) |
| `proxy.ts` 가 `src/` 밖에 있으면 Next 가 **조용히 무시** → 로케일 경로 전부 404 | `FE/ARCHITECTURE.md` |
| OAuth 콜백에 로케일이 붙으면 **제공자가 거부** → matcher 에서 `auth` 제외 | [07-routes](../30-architecture/07-routes-and-indexing.md) |
| 법제처 API 는 **키 + IP 등록**. 등록 안 된 IP 는 200 과 함께 실패 본문 | [11-official-sources](../20-product/10-features/11-official-sources.md) |
| 서버 `.env` 는 여러 앱이 공유 → **`KONNECT_` prefix**. 이름이 어긋나면 실패가 아니라 "건너뜀" | [01-environments](../40-operations/01-environments.md) |
| 하이코리아는 없는 주소에 **200 으로 에러 페이지**를 준다 | [11-official-sources](../20-product/10-features/11-official-sources.md) |
| BE 로컬 실행은 `npm run dev` 가 아니라 **`start:dev`** (`dev` 는 마이그레이션까지 돌려 Postgres 를 요구) | [02-local-development](../40-operations/02-local-development.md) |

## 로컬에서 띄우기

```bash
# BE — Postgres 없이 (DB_DRIVER=memory)
cd BE && cp .env.example .env.development && npm ci && npx prisma generate
npm run start:dev        # :4000   ※ npm run dev 아님

# FE
cd FE && cp .env.example .env.local && npm ci && npm run dev   # :3000
```

Postgres 를 쓰려면 `.env.development` 에서 `DB_DRIVER=prisma` 로 바꾸고 `npm run dev`.
⚠️ Prisma `migrate dev` 는 **shadow DB** 를 만들어야 해서 롤에 `CREATEDB` 가 필요하다.

인메모리는 재시작하면 비므로, 화면을 보려면 질문을 하나 만들어야 한다
([02-local-development](../40-operations/02-local-development.md)).
