# konnect FE (Next.js 16, App Router) — arm64 프로덕션 이미지
#
# 빌드는 GitHub Actions ARM 러너에서 수행한다. `next build`는 2~4GB를 쓰므로
# 서버(A1, 2 OCPU/12GB)에서 빌드하면 서비스가 흔들린다.
#   → ~/docs/fleet/konnect-deploy.md
#
# ⚠️ API_PROXY_TARGET 은 **빌드 시점** 변수다.
#    next.config 의 rewrites 는 `next build` 때 매니페스트로 고정되므로,
#    런타임에 환경변수를 바꿔도 프록시 대상은 바뀌지 않는다.
#    compose 서비스명(konnect-be)을 쓰면 환경이 달라져도 값이 동일해 문제없다.

# ── 1) 의존성 ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── 2) 빌드 ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

ARG API_PROXY_TARGET=http://konnect-be:4000
ENV API_PROXY_TARGET=$API_PROXY_TARGET
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── 3) 런타임 ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js 는 PORT/HOSTNAME 환경변수를 읽는다. 0.0.0.0 이어야 컨테이너 밖에서 닿는다.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone 은 필요한 node_modules 만 추려 담고 최소 server.js 를 함께 낸다.
COPY --from=builder --chown=node:node /app/.next/standalone ./
# standalone 이 자동으로 담지 않는 정적 자산을 직접 복사한다(없으면 CSS/JS 가 404).
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# 비루트 실행 — 이전 api 컨테이너가 uid 0 으로 돌던 것이 감사에서 HIGH 였다.
USER node

EXPOSE 3000

CMD ["node", "server.js"]
