# 배포

> **구현 완료 (2026-08-31).** 첫 배포가 실제로 성공했고 서비스가 뜬 상태다.
> 서버 쪽 상세(호스트 베이스라인·백업·방화벽)는 A1 서버의 `~/docs` 볼트에 있다 —
> `~/docs/fleet/konnect-deploy.md`, `~/docs/stack/edge-ops.md`, `~/docs/stack/cert-ops.md`.

## 결정된 구성

```
브라우저 → nginx(443, A1) ─┬─ /api/*  → konnect-be:4000   (접두사 제거)
                            └─ 그 외    → konnect-fe:3000
```

FE와 BE는 **독립 이미지**로 배포하되 **같은 오리진**으로 서빙한다
([ADR-0002](../50-decisions/0002-monorepo-be-fe-split.md)). 따라서 CORS가 필요 없고,
[인증 문서](../30-architecture/05-authentication.md)의 "로그인 시작 오리진과 콜백
오리진이 같아야 한다"는 제약도 자동으로 만족된다.

| 단위 | 산출물 | 배치 |
|---|---|---|
| FE | `ghcr.io/hck1205/konnect-fe:<sha>` | A1 컨테이너, mem_limit 768m |
| BE | `ghcr.io/hck1205/konnect-be:<sha>` | A1 컨테이너, mem_limit 768m |
| DB | PostgreSQL 16 | **기존 컨테이너 공유**, `konnect` DB·롤 분리 |

관리형 DB 대신 기존 컨테이너를 공유한다 — OCI 프리티어 12GB 박스에 DB를 두 벌
띄울 이유가 없다. 앱마다 롤과 DB는 분리해 권한 사고를 격리한다.

## 파이프라인

`main` 병합 → **ARM 러너에서 네이티브 빌드** → GHCR → SSH 배포 → 스모크 테스트.

- `.github/workflows/ci.yml` — PR 검증 (BE/FE 병렬)
- `.github/workflows/deploy.yml` — 빌드·푸시·배포·스모크
- `deploy/a1-deploy.sh` — 서버 측 실행체 (`/srv/app/konnect/deploy.sh` 로 설치)

**서버에서 빌드하지 않는다.** `next build`는 2~4GB를 쓴다. 2 OCPU 프로덕션 박스에서
빌드하면 서비스가 흔들린다. A1은 pull과 실행만 한다.

**ARM 네이티브 빌드**를 쓴다. A1이 aarch64라 QEMU 크로스빌드는 수 배 느리다.
공개 저장소는 `ubuntu-24.04-arm` 러너가 무료다.

## 배포 순서 (`deploy.sh`가 강제한다)

1. `docker compose pull`
2. **`prisma migrate deploy`** — 컨테이너 교체 **전에**. 순서가 반대면 새 코드가
   옛 스키마를 보는 구간이 생긴다. `profiles: ["tools"]`로 `up`에 섞이지 않게 분리.
3. `docker compose up -d --wait`
4. **실응답 헬스체크** — `--wait`는 컨테이너 생존만 본다. 실제 HTTP 200까지 확인한다.
5. 실패 시 **이전 태그로 롤백**. 이미지는 커밋 SHA로 태그하므로 되돌릴 지점이 항상 있다.
   ⚠️ 롤백해도 **스키마는 되돌아가지 않는다** — 스크립트가 경고를 남긴다.

## 겪은 함정 (재발 방지)

**`API_PROXY_TARGET`은 빌드 시점 변수다.** `next.config`의 rewrites는 `next build`
때 매니페스트로 고정되어 런타임 주입이 반영되지 않는다. compose 서비스명
(`konnect-be`)을 기본값으로 박아 환경이 달라져도 값이 같게 했다.

**standalone은 `public/`과 `.next/static`을 자동으로 담지 않는다.** Dockerfile에서
명시적으로 복사한다. 빠뜨리면 CSS/JS가 404가 되어 화면이 깨진다.

**`.gitignore`가 `.github/`를 삼키고 있었다.** 루트를 `/*`로 무시하고 화이트리스트만
추적하는 구조라 워크플로가 조용히 제외됐다. 그대로 뒀으면 CI/CD가 안 도는데 이유를
모르는 상태가 됐을 것이다. `contracts/`가 같은 이유로 누락된 전례가 있다.
**루트에 새 디렉토리를 추가할 때는 `.gitignore` 화이트리스트도 함께 확인할 것.**

**배포 태그가 `export`로 들어갔다.** `appleboy/ssh-action`의 `envs:`는 명령 앞에
`export TAG=...;`를 붙이는데, 배포 키의 `command=` 제약 때문에 그 문자열 전체가
스크립트 인자가 되어 첫 단어가 태그로 잡혔다. 지금은 태그만 보내고, 받는 쪽에서도
`TAG=` 형식을 한 번 더 추출한다.

**CI에 넣을 수 없는 검사가 있다.** `check:routing`은 FE 기동이 필요해 빌드 후 띄워서
돌리고, `check:seo`는 실데이터가 필요해 배포 후 스모크로 뺐다. `check:stories`는
Ladle + playwright가 필요해 로컬 전용이다.

## 보안

- 두 이미지 모두 **비루트(`USER node`, uid 1000)** 로 실행한다.
- 배포 SSH 키에 `authorized_keys`의 **`command=` 제약**을 걸어 배포 스크립트만
  실행되게 한다. 셸·포트포워딩·PTY 모두 차단. 실측으로 확인했다.
- `.env`는 커밋하지 않는다. 서버의 `/srv/app/konnect/.env`(권한 600)에 둔다.
  **이 파일은 백업에 없다** — 자격증명은 별도 보관이 필수다.

## 현재 상태 (2026-08-31)

접속: `https://134.185.112.123` — **인증서가 self-signed라 브라우저 경고가 뜬다.**
HTTPS 자체는 정상이며(80→443 301, TLS1.2/1.3만 허용) 경고는 신뢰 문제다.
도메인 확정 후 Let's Encrypt + Cloudflare + HSTS로 교체할 계획이다.

검증됨: 로케일 협상(`/` → 307), 4개 언어 200 + `<html lang>` 정확,
`/api/questions` 200, 마이그레이션 테이블 7개, 메모리 FE 37MB / BE 36MB.

## 남은 것

- **도메인 확정** — 정식 인증서·Cloudflare·HSTS·호스트명 라우팅의 공통 병목
- rate limit — 실트래픽 기준선이 생긴 뒤 설정 (봇만 있을 때 정하면 실사용자가 503)
- 이미지/첨부 저장소 — OCI Object Storage 도입 시점
- BE 이미지 905MB 감량 — prisma CLI 포함 대가(마이그레이션 실행용)

## 운영 환경변수

`.env.production`은 **커밋하지 않는다.** 목록은 [01-environments.md](./01-environments.md) 참고.
