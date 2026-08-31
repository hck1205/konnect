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

# 공식 출처 감시(scripts/watch-sources.mjs)와 그 입력인 레지스트리.
#
# **dist 에 들어가지 않는다** — 생 .mjs 를 node 가 직접 실행하므로 tsc 의 산출물이
# 아니다. 이걸 빠뜨리면 서버에서 `compose run watch-sources` 가 "모듈 없음"으로 죽는다.
#
# 레지스트리가 contracts/ 가 아니라 BE/data/ 에 있는 이유: 이 이미지의 빌드
# 컨텍스트는 `BE/` 라(.github/workflows/deploy.yml) 저장소 루트의 파일은
# 애초에 COPY 할 수가 없다.
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data

# 감시 상태 파일의 **쓰기** 위치.
#
# /app/data 에 볼륨을 걸면 그 위의 레지스트리가 가려지므로, 읽기(레지스트리)와
# 쓰기(상태)를 다른 디렉터리로 나눈다. KONNECT_SOURCE_STATE 로 여기를 가리킨다.
# 비루트로 돌기 때문에 소유권을 미리 넘긴다 — named volume 은 최초 생성 시
# 이 디렉터리의 소유권을 그대로 물려받는다(bind mount 는 아니다).
RUN mkdir -p /app/var && chown node:node /app/var

# 비루트로 실행한다. 이전 api 컨테이너가 uid 0으로 돌던 것이 보안 감사에서
# HIGH로 지적됐다 — 같은 실수를 반복하지 않는다.
USER node

EXPOSE 4000

# NestJS의 app.listen(port)는 모든 인터페이스에 바인딩되므로 컨테이너 간 통신이 된다.
CMD ["node", "dist/main"]
