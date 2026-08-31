# 현재 상태

> **갱신: 2026-08-31.** 세션이 바뀌어도 여기부터 읽으면 이어받을 수 있게 쓴다.
> 결정의 *근거*는 여기 적지 않는다 — [ADR](../50-decisions/)과 [PRD](../20-product/20-prd/)가 갖는다.
> 이 문서는 **무엇이 되어 있고 무엇이 막혀 있는가**만 답한다.

## 한눈에

| | |
| --- | --- |
| 커밋 | 42 (2026-08-24 ~ 08-31) |
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
- **질문 목록** `/[locale]/questions` — 주제 필터(6개) · 커서 페이지네이션 · 빈 상태.
  **색인은 필터 없는 기본 판만**이고 `?topic=`·`?cursor=` 가 붙으면 `noindex, follow` +
  canonical 은 기본 URL 을 가리킨다([07-routes](../30-architecture/07-routes-and-indexing.md))
- 홈 네비에서 **죽은 링크를 걷어냈다.** `/guides` 는 Phase 2(반복 질문이 승격된 문서),
  `/meetups` 는 색인 라우트 표에 아직 없다 — 사전 키는 남겨 뒀으니 화면이 생기면 한 줄만 되돌린다

### 인프라 — 배포까지 돈다

- PR 검증(CI) · main 병합 시 ARM 네이티브 빌드 → GHCR → SSH 배포 → 스모크
- `deploy/a1-deploy.sh` — pull → **마이그레이션 먼저** → 교체 → 헬스체크 → **실패 시 롤백**
- 상세는 [03-deployment](../40-operations/03-deployment.md)

### 경계 계약 — [`contracts/`](../../contracts/README.md)

BE·FE 가 서로를 import 하지 않으므로([ADR-0002](../50-decisions/0002-monorepo-be-fe-split.md))
같아야 할 규칙을 **데이터로 두고 양쪽 테스트가 대조**한다. 한쪽이 갈라지면 그쪽이 깨진다.

## 지금 막혀 있는 것

### 1. 출처 감시 — 저장소 작업은 끝났고 **서버 설치만 남았다**

**A 안으로 갔다.** 구현하다 보니 문서가 몰랐던 벽이 하나 더 있었다:
BE 이미지의 **빌드 컨텍스트가 `BE/`** 라([deploy.yml](../../.github/workflows/deploy.yml))
저장소 루트의 `contracts/` 는 **애초에 이미지에 담을 수가 없다.**

그런데 `official-sources.json` 은 애초에 계약이 아니었다 —
[contracts/README](../../contracts/README.md) 의 표에 없고, 읽는 코드는 감시 스크립트
하나뿐이며 FE 는 손대지 않는다. 그래서 BE 소유로 옮겼다.

저장소 쪽은 전부 됐다:

- `contracts/official-sources.json` → `BE/data/official-sources.json`
- `BE/Dockerfile` 이 `scripts/`·`data/` 를 담고 `/app/var` 를 `node` 소유로 만든다
- `deploy/a1-watch-sources.sh` 에서 git 체크아웃·commit·push 를 걷어냈다
  (체크아웃이 사라지면서 `gh issue create` 에 `--repo` 가 필요해졌다 — cwd 로 저장소를
  추론할 수 없다)
- `deploy/docker-compose.yml` 을 **저장소로 가져오고** `watch-sources` 서비스를 넣었다
- 상태 파일은 git 에서 뺐다 → named volume `konnect-source-state`

**남은 것은 서버 반영뿐이다.** 프로덕션 변경이라 아직 하지 않았다 —
compose 설치 · cron 스크립트 설치 · 첫 실행 확인이 필요하다.
→ [03-deployment](../40-operations/03-deployment.md)

⚠️ **이미지 빌드는 검증하지 못했다.** 로컬에 docker 가 없다. `COPY scripts`/`COPY data`
가 실제로 붙는지는 다음 배포에서 처음 확인된다.

### 2. 게시판 구조 — 정해졌다

**게시판 = `topic` × `type`.** 두 미결을 다음과 같이 닫았다.

**글 `type` 은 의도로 자른다** — `question · review · share · recruit`.
형식(Guide·Checklist)을 택하지 않은 이유는 이 제품에 **전문가가 없기** 때문이다.
권위 있는 안내 형식을 열면 틀린 해석이 "가이드"라는 이름을 달고 쌓인다 —
[출처 감시](../20-product/10-features/11-official-sources.md)가 해석을 거부하는 것과 같은 이유다.

⚠️ **값이 있다고 만들 수 있는 것은 아니다.** 생성은 `question` 만 받는다
(`CREATABLE_POST_TYPES`). 후기·모집은 각자의 작성 폼과 화면이 생겨야 성립하는데,
지금 열면 **읽을 화면이 없는 글**이 쌓인다. 네 값을 미리 둔 것은 나중에
enum 마이그레이션을 한 번 더 하지 않기 위해서다. 필터는 네 값을 다 받는다.

**`language` 와 `social` 은 합치지 않는다.** [ADR-0007](../50-decisions/0007-settlement-intent-as-primary-axis.md)의
비치헤드가 영주·귀화 준비자라, 그들에게 한국어는 취미가 아니라 **요건**이다 —
TOPIK 과 사회통합프로그램(KIIP)이 F-2-7 점수와 F-5 요건에 직접 들어간다.
교류(사람 만나기)와 어학(점수 따기)은 그 사용자에게 완전히 다른 목적이다.
`topic` 은 6개 그대로이고 변경 비용은 0이었다.

`type` 은 수정으로 바꿀 수 없다. 종류가 바뀌면 질문에 붙어 있던 채택·답변 수가
갈 곳을 잃는다. `UpdateQuestionDto` 에 없는 것은 누락이 아니다.

### 3. 저장소 밖에 있는 것

| | 어디 |
| --- | --- |
| `.env` **값** (키 목록은 `.env.example` 에 있다), 서버 초기 구성 | **A1 서버 `~/docs` 볼트** |
| `~/docs/fleet/konnect-deploy.md`, `stack/edge-ops.md`, `stack/cert-ops.md` | 같음 |

`docker-compose.yml` 은 [`deploy/docker-compose.yml`](../../deploy/docker-compose.yml) 로
들어왔다. 다만 **저장소가 단일 출처이고 서버는 사본**이라, 고친 뒤 손으로 설치해야 반영된다.

저장소만 보는 사람은 **따라갈 수 없다.** [03-deployment](../40-operations/03-deployment.md)가
위치를 가리키지만 내용은 없다.

## 다음에 할 일 (권장 순서)

1. ~~출처 감시 서버 설치~~ — **끝났다.** cron `0 9 * * *` 등록, 1·2차 실행 확인
2. ~~목록 화면~~ — **끝났다.** `check:routing` 11건 · `check:seo` 7건 통과
3. **OAuth** — 없으면 쓰기가 영원히 불가능하다. 이제 읽는 길은 다 뚫렸으므로 이게 유일한 하드 블로커다
4. **허브 페이지** — `/visa/[code]`·`/topics/[topic]`. 필터 URL 을 색인하지 않기로 했으므로
   **SEO 유입은 여기가 만든다.** 다만 [승격 기준](../50-decisions/0008-nationality-as-tag-not-space.md)
   (질문 20건 이상 + 답변률 평균 이상)을 넘는 값이 아직 없다

## 알아 두면 시간을 아끼는 것들

여기까지 오면서 **돌려봐야만 드러난** 것들이다. 전부 문서에 근거가 있다.

| 함정 | 어디에 |
| --- | --- |
| `.gitignore` 가 루트 `/*` 라 **새 폴더가 조용히 빠진다** (`contracts/`·`.github/` 가 실제로 그랬다) | [03-deployment](../40-operations/03-deployment.md) |
| `proxy.ts` 가 `src/` 밖에 있으면 Next 가 **조용히 무시** → 로케일 경로 전부 404 | `FE/ARCHITECTURE.md` |
| OAuth 콜백에 로케일이 붙으면 **제공자가 거부** → matcher 에서 `auth` 제외 | [07-routes](../30-architecture/07-routes-and-indexing.md) |
| 법제처 API 는 **키 + IP 등록**. 등록 안 된 IP 는 200 과 함께 실패 본문 | [11-official-sources](../20-product/10-features/11-official-sources.md) |
| 서버 `.env` 는 여러 앱이 공유 → **`KONNECT_` prefix**. 이름이 어긋나면 실패가 아니라 "건너뜀" | [01-environments](../40-operations/01-environments.md) |
| BE 이미지의 **빌드 컨텍스트가 `BE/`** 라 저장소 루트(`contracts/`)의 파일은 이미지에 못 담는다 | [11-official-sources](../20-product/10-features/11-official-sources.md) |
| 볼륨을 `/app/data` 에 걸면 **이미지 안의 레지스트리가 가려진다** — 읽기·쓰기 경로를 나눈다 | 같음 |
| `deploy/` 의 파일은 **배포로 안 간다**(이미지만 간다). 고치면 손으로 설치해야 한다 | [03-deployment](../40-operations/03-deployment.md) |
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
