# 배포

> **미정.** 아직 결정하지 않았다. 이 문서는 결정할 때 고려할 것을 적어 둔 자리다.

## 배포 단위

FE와 BE는 **독립 배포**한다 ([ADR-0002](../50-decisions/0002-monorepo-be-fe-split.md)).

| 단위 | 산출물 | 특성 |
| --- | --- | --- |
| FE | Next.js 빌드 | SSR 필요 (정적 호스팅 불가) |
| BE | `dist/` + node | 상태 없음, 수평 확장 가능 |
| DB | PostgreSQL | 관리형이 유력 |

## 결정해야 할 것

1. **호스팅** — FE와 BE를 같은 곳에 둘 것인가?
   같은 오리진으로 서빙하려면 프록시 구성이 필요하다.
2. **도메인 구성** — `konnect.app` + `api.konnect.app` 분리 vs `/api` 경로 프록시.
   [인증 문서](../30-architecture/05-authentication.md)의 OAuth state 제약 때문에
   **로그인 시작 오리진과 콜백 오리진이 같아야 한다**. 이 제약이 도메인 구성을 결정한다.
3. **마이그레이션 실행 시점** — 배포 전에 `npm run db:deploy`
4. **이미지/첨부 저장소** — 오브젝트 스토리지 필요 시점

## 배포 순서 (구성이 정해지면)

```bash
# BE
npm ci && npm run build && npm run db:deploy && npm run start:prod

# FE  (API_PROXY_TARGET 을 빌드 시점에 설정)
npm ci && npm run build && npm run start
```

## 운영 환경변수

`.env.production` 파일은 **커밋하지 않는다.** 배포 플랫폼에 직접 주입한다.
목록은 [01-environments.md](./01-environments.md) 참고.
