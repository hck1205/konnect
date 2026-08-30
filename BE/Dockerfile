# konnect BE (NestJS + Prisma) — arm64 프로덕션 이미지
#
# 빌드는 GitHub Actions ARM 러너에서 수행한다. 서버(A1, 2 OCPU)에서 빌드하지 않는다.
#   → ~/docs/fleet/konnect-deploy.md
#
# Debian slim을 쓴다(Alpine 아님). Prisma 쿼리 엔진은 musl 환경에서 OpenSSL 관련
# 문제가 잦아, 이미지 크기보다 예측 가능성을 택했다.

# ── 1) 빌드 ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder

# Prisma 엔진이 OpenSSL을 요구한다. slim 이미지에는 기본 포함되지 않는다.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 레이어를 소스와 분리해 캐시 적중률을 높인다.
COPY package.json package-lock.json ./
RUN npm ci

# Prisma 클라이언트는 스키마에서 생성되므로 스키마를 먼저 넣는다.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ── 2) 런타임 ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# 프로덕션 의존성만 설치한다.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 생성된 Prisma 클라이언트와 엔진을 빌더에서 가져온다.
# (런타임 스테이지에는 prisma CLI가 없으므로 여기서 다시 generate 할 수 없다)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 배포 시 `prisma migrate deploy`를 일회성 컨테이너로 실행하기 위해 CLI를 포함한다.
# 이게 없으면 마이그레이션을 돌릴 방법이 없다(러너는 방화벽 때문에 DB에 못 붙는다).
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 비루트로 실행한다. 이전 api 컨테이너가 uid 0으로 돌던 것이 보안 감사에서
# HIGH로 지적됐다 — 같은 실수를 반복하지 않는다.
USER node

EXPOSE 4000

# NestJS의 app.listen(port)는 모든 인터페이스에 바인딩되므로 컨테이너 간 통신이 된다.
CMD ["node", "dist/main"]
