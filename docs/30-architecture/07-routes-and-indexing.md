# 라우트와 색인

> **페이지 목록은 곧 색인 정책이다.** [SEO 가 유일한 유입 채널](../20-product/20-prd/08-seo-strategy.md)이므로,
> "어떤 페이지가 있는가"보다 **"그중 무엇을 색인하는가"** 가 더 중요하다.

## 원칙

1. **로케일은 URL 세그먼트**다 — `/[locale]/...` ([ADR-0005](../50-decisions/0005-multilingual-from-day-one.md))
2. **읽기는 공개, 쓰기는 인증.** 검색으로 들어온 사람이 로그인 벽에 막히면 안 된다
3. **색인하는 페이지는 소수다.** 필터·개인화·인증 페이지는 전부 `noindex` —
   조합이 폭발하는 URL 을 색인시키면 사이트 품질 평가가 깎인다
4. **크롤 경로는 sitemap 이 만든다.** [커서 페이지네이션은 크롤러가 열거하지 못한다](../20-product/20-prd/08-seo-strategy.md)

## 색인하는 페이지 — 유입 표면

이 표의 페이지만 검색에 노출된다. **여기가 트래픽의 전부다.**

| 경로 | 무엇 | Phase |
| --- | --- | --- |
| `/[locale]` | 공개 랜딩 — 서비스 소개 + 인기 질문 | 1 |
| `/[locale]/questions` | 질문 목록 (필터 없는 기본 상태만) | 1 |
| **`/[locale]/questions/[id]/[slug]`** | **질문 상세 — 검색 착지점. 가장 중요하다** | 1 |
| `/[locale]/visa/[code]` | **비자 허브** — `f-2` `f-5` `e-7` `d-10` … | 1 |
| `/[locale]/topics/[topic]` | 주제 허브 — `residency` `work` `housing` `admin` `language` | 1 |
| `/[locale]/guides` · `/guides/[slug]` | 가이드 (반복 질문이 승격된 문서) | 2 |
| `/[locale]/checklists/[slug]` | 연차별 체크리스트 | 2 |
| `/[locale]/users/[handle]` | 공개 프로필 — **답변자 신뢰의 근거**. 답변이 없는 프로필은 `noindex` | 1 |
| `/[locale]/languages` | 지원 언어 + **대기 신청** | 1 |
| `/[locale]/about` · `/safety` · `/content-policy` · `/terms` · `/privacy` | 정적 | 1 |

### 허브는 **깊을 때만** 만든다

허브를 늘리는 것은 공짜가 아니다. **색인 표면이 늘어나고, 얕은 페이지가 쌓이면
사이트 전체 품질 평가가 깎인다.** 그래서 [ADR-0008 의 승격 기준](../50-decisions/0008-nationality-as-tag-not-space.md)을
허브에도 그대로 적용한다.

> 그 축의 값 하나가 **질문 20건 이상 + 답변률 전체 평균 이상**일 때만 허브를 만들고 색인한다.
> 미만이면 **태그로만 존재**한다 — 필터는 되지만 URL 은 없다.

| 축 | 값의 수 | 각각이 깊은가 | 허브 |
| --- | ---: | --- | --- |
| **비자** | 10~15 | **깊다** — 비치헤드 그 자체 | **O** |
| **주제** | 5 | **깊다** — 넓게 묶는다 | **O** |
| 지역(시·군) | **200+** | **얕다** — 대부분 질문 한 자릿수 | **X** |
| 국적 | **190+** | **얕다** — 국적별 질문은 1~2건 | **X** |

**지역과 국적은 태그로만 둔다.** 값의 수가 많은 축은 허브가 되면
얕은 페이지를 그 수만큼 만든다 — [죽은 페이지가 쌓이는 것](../20-product/20-prd/08-seo-strategy.md)과 같은 문제다.

- 지역: 정주자에게 중요한 축이지만 **필터로 충분하다.**
  Phase 3 에서 매물·거래가 열려 지역 밀도가 실제로 생기면 그때 다시 계산한다
- 국적: 답이 진짜 국적별인 것(아포스티유·본국 서류)은
  **`/topics/documents` 한 페이지 안의 국적별 섹션**으로 둔다.
  **깊은 페이지 하나가 얕은 페이지 190개보다 낫다**

### 허브 페이지가 SEO 의 핵심이다

`/[locale]/questions?tags=visa:f-2&region=ansan` 같은 **필터 URL 은 색인하지 않는다** —
조합이 무한하고 각각이 얕다. 대신 **허브 페이지가 그 역할을 대신한다**:

```
/en/visa/f-2          ← 색인. F-2 설명 + 대표 질문 + 관련 허브 링크
/en/questions?tags=…  ← noindex. 같은 목록이지만 사용자 도구다
```

허브는 **사람이 관리하는 소수**이고, 내부 링크로 상세 페이지에 깊이를 만든다.
`canonical` 은 항상 허브 또는 상세의 정규 URL 을 가리킨다.

### 상세 URL 에 slug 를 붙인다

id 는 UUIDv7 이라 사람도 검색엔진도 읽을 수 없다.

```
/en/questions/019...c3/does-volunteer-work-count-toward-f-2-7-points
```

- slug 없이 들어오면 **정규 URL 로 308**
- slug 가 틀려도 id 로 찾아 **정규 URL 로 308** (제목이 수정되면 slug 가 바뀐다)
- **308 이지 301 이 아니다.** `permanentRedirect` 가 내는 코드이고 메서드를 보존한다 —
  색인 이전 효과는 301 과 같다. 문서가 301 이라고 적어 두면 응답을 확인한 사람이
  "코드가 문서와 다르다" 로 읽는다
- `canonical` 은 항상 현재 정규 URL

### `routes.ts` 는 `src/app` 과 **대조된다**

경로 문자열은 `FE/src/lib/routes.ts` 하나가 갖는다. 그런데 그 파일은 `src/app` 을
참조하지 않으므로, **없는 라우트를 가리키는 헬퍼를 만들어도 타입체크·린트·빌드·
단위 테스트가 전부 통과한다.**

실제로 그렇게 됐다 — `routes.ask` 가 없는 `/[locale]/ask` 를 가리켰고, 척추
페이지의 유일한 행동 유도가 거기로 갔다. 질문이 아직 세 건뿐이라 **48판 중
대부분이 그 분기를 그리는데도** 아무것도 잡지 못했다. 같은 저장소가 홈 네비에서
이미 한 번(`guides`·`meetups`) 걷어낸 실수다.

`routes.contract.test.ts` 가 `src/app` 을 훑어 대조한다. 여기서 나오는 규칙:

- **page 를 먼저 만들고, 그 다음에 헬퍼를 추가한다.** 순서가 반대면 화면이
  헬퍼를 믿고 링크를 건다
- 분기를 가진 헬퍼는 **분기마다** 표본을 넣는다 — 한쪽만 죽을 수 있다
- 헬퍼가 늘면 표본도 는다. 타입(`Record<keyof typeof routes, …>`)과 런타임
  양쪽에서 강제한다 — 빠뜨리면 검사가 조용히 좁아진다

## 색인하지 않는 페이지

### 인증 필요

| 경로 | 무엇 | Phase |
| --- | --- | --- |
| `/[locale]/me` | **내 진행 상태** — 영주권 점수·만료 D-day. 리텐션 엔진 | 1 |
| `/[locale]/me/saved` · `/following` · `/answers` | 내 활동 | 1 |
| `/[locale]/onboarding` | 3문항 (비자·연차·지역) | 1 |
| `/[locale]/ask` | 질문 작성 | 1 |
| `/[locale]/questions/[id]/edit` | 수정 | 1 |
| `/[locale]/notifications` | 알림 | 2 |
| `/[locale]/settings` · `/profile` · `/language` · `/notifications` · `/account` | 설정 | 1 |
| `/[locale]/messages` · `/messages/[id]` | **1:1 쪽지** — [안전장치 7종 전제](../50-decisions/0004-direct-messages-with-safety-gates.md) | 3 |

### 도구·상태 페이지

| 경로 | 왜 noindex 인가 |
| --- | --- |
| `/[locale]/search` | 검색 결과는 색인 대상이 아니다 (검색 결과의 검색 결과) |
| `/[locale]/questions?…` | 필터 조합 폭발 |
| `/[locale]/login` · `/login/error` | 진입점이 아니다 |
| `/[locale]/404` · `/500` | |

### 운영

| 경로 | 무엇 |
| --- | --- |
| `/[locale]/admin/reports` | 신고 큐 — [모더레이션](../20-product/10-features/07-moderation-and-reporting.md) |
| `/[locale]/admin/tags` | 고정 어휘 관리 |

## ⚠️ 로케일이 붙으면 안 되는 경로

`src/proxy.ts` 의 matcher 가 제외한다.

| 경로 | 이유 |
| --- | --- |
| **`/auth/callback/[provider]`** | **OAuth 콜백은 기계 간 요청**이고 제공자에 등록한 redirect URI 와 **정확히** 같아야 한다. `/en/auth/callback/google` 로 리다이렉트되면 **로그인이 통째로 깨진다** |
| `/api/*` | BE 프록시 |
| `/sitemap.xml` · `/sitemap-[locale].xml` · `/robots.txt` | 크롤러용 |
| `/_next/*`, 확장자 있는 경로 | 정적 자산 |

`npm run check:routing` 이 이것을 검사한다 — matcher 에서 `auth` 를 빼면 실패한다.

## sitemap 구조

커서 페이지네이션이라 **목록을 크롤 경로로 쓸 수 없다.** sitemap 이 유일한 열거 수단이다.

```
/sitemap.xml              ← 인덱스
  /sitemap-en.xml         ← 언어별 (상세 + 허브 + 정적)
  /sitemap-ko.xml
  /sitemap-vi.xml
  /sitemap-zh.xml
```

각 URL 에 `hreflang` 로 다른 언어 판을 상호 참조한다 —
없으면 **중복 콘텐츠로 묶여 한 언어만 남는다**.

## 홈이 둘로 나뉜다

설계 캔버스의 "홈 = 내 진행 상태"는 실제로 **`/[locale]/me`** 다.

| 경로 | 누구에게 | 색인 |
| --- | --- | --- |
| `/[locale]` | **비로그인** — 서비스 소개 + 인기 질문 | **O** |
| `/[locale]/me` | 로그인 — 진행 상태·D-day | X |

**같은 URL 이 사람마다 다른 내용을 보이면 색인이 뭉개진다.**
로그인 사용자가 루트로 오면 `/me` 로 보낸다.

## Phase 별로 열리는 것

| Phase | 열리는 라우트 | 조건 |
| --- | --- | --- |
| **1** | 상세·목록·허브·프로필·설정·`/me`·온보딩·작성 | **OAuth 가 전제** |
| **2** | 가이드·체크리스트·알림 | 콘텐츠가 쌓인 뒤 |
| **3** | `/messages` (쪽지) | [안전장치 7종 + 신고 처리 인력](../20-product/20-prd/07-monetization.md) |
| **3** | `/[locale]/jobs` · `/housing` | **[출입국관리법 알선 조항 법률 검토](../20-product/20-prd/09-content-pillars.md)** |
| **3** | `/[locale]/market` (귀국 처분) | 지역 밀도 + 분쟁 처리 |

**리스팅(공고·매물·중고)은 `noindex` 다** — 팔리면 사라져서 죽은 페이지가 된다.

## 요약

| | 수 |
| --- | ---: |
| 색인하는 페이지 유형 | **10** |
| 인증 필요 | 13 |
| 도구·운영·시스템 | 11 |
| Phase 1 에 필요한 것 | **약 20** |

**색인 표면은 10종뿐이고, 그중 실제 트래픽은 `questions/[id]/[slug]` 와 허브 2종(비자·주제)에 몰린다.**
나머지는 그 둘을 받치는 구조다.

지역·국적 허브를 뺀 이유는 위 **"허브는 깊을 때만 만든다"** 에 있다 —
승격 기준을 세워 두고 라우트 목록에서 그것을 거치지 않았던 것이 이번에 드러났다.
