# 환경 분리

## 환경

| 환경 | NODE_ENV | DB | 용도 |
| --- | --- | --- | --- |
| 로컬 (DB 없음) | development | `DB_DRIVER=memory` | 빠른 개발·테스트 |
| 로컬 (DB 있음) | development | `DB_DRIVER=prisma` | 실제 쿼리 검증 |
| 테스트 | test | 인메모리 (강제) | CI — **DB 없이 그린이어야 한다** |
| 운영 | production | Postgres | |

## 환경변수 로딩 순서 (BE)

먼저 채워진 값이 이긴다:

1. 이미 설정된 `process.env` (OS/배포 플랫폼) — 항상 최우선
2. `.env.${NODE_ENV}`
3. `.env`

`.env*`는 gitignore 대상이고, **`.env.example`만 커밋**한다.

## 시크릿 원칙

- 시크릿은 **저장소에 절대 넣지 않는다.** 루트 `.gitignore`가 `**/.env`, `*.pem`, `*.key`,
  `credentials.json` 등을 구조적으로 막고 있다
- 운영 시크릿은 배포 플랫폼의 환경변수로 주입한다
- `.env.example`에는 **키와 설명만**, 값은 더미로 둔다

## 변수 목록

- BE: [`BE/.env.example`](../../BE/.env.example)
- FE: [`FE/.env.example`](../../FE/.env.example)

### 특이사항이 있는 변수

**`API_PROXY_TARGET`은 빌드 시점 값이다** (Next 의 rewrites 가 빌드에 고정된다).
런타임에 주입해도 반영되지 않으므로 배포 파이프라인에서 설정해야 한다.

**`KONNECT_LAW_API_KEY` 는 IP 에 묶인다.** 법제처 OPEN API 는 키뿐 아니라 **호출하는
서버의 IP 가 사전 등록**되어 있어야 한다 — 그래서 이 키는 **A1 서버 전용**이고
GitHub Actions 나 다른 기계에 넣어도 동작하지 않는다
([공식 출처 감시](../20-product/10-features/11-official-sources.md)).
비워 두면 법령 감시만 꺼지고 나머지는 돈다.
이름의 `KONNECT_` prefix 는 **운영 서버 `.env` 를 여러 앱이 공유**하기 때문이다.

**`KONNECT_SOURCE_STATE` 는 서버에서만 쓴다.** 감시 기준선의 **쓰기** 경로다.
레지스트리는 이미지 안 `/app/data` 에 있어서 거기에 볼륨을 걸면 레지스트리가 가려진다 —
그래서 읽기와 쓰기를 다른 디렉터리로 나눈다(`/app/var`). 로컬에서는 비워 두면
`BE/data/source-state.json` 으로 떨어진다.
