#!/usr/bin/env bash
# konnect 배포 (A1 서버에서 실행). GitHub Actions 가 SSH 로 호출하고,
# 필요하면 서버에서 수동 실행도 된다.
#
#   ./a1-deploy.sh <이미지태그>
#
# 서버 설치 위치: /srv/app/konnect/deploy.sh
#   sudo install -m 755 deploy/a1-deploy.sh /srv/app/konnect/deploy.sh
#
# 배포 로직을 워크플로가 아니라 서버 스크립트에 두는 이유:
#   1) 실패 시 서버에서 그대로 재시도·수동 개입이 가능해야 한다.
#   2) 배포 SSH 키에 command= 제약을 걸려면 단일 진입점이 필요하다.
#      (구 배포키는 제약이 없어 서버 전체 셸 접근이 가능했다 — 반복하지 않는다)
set -euo pipefail

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH

TAG="${1:?사용법: deploy.sh <이미지태그>}"
DIR=/srv/app/konnect
COMPOSE="docker compose -f $DIR/docker-compose.yml"
OWNER=hck1205

cd "$DIR"

[ -f .env ] || { echo "!!! $DIR/.env 가 없다. .env.example 을 복사해 값을 채워라."; exit 1; }

echo "=== deploy start: $TAG ==="

# 롤백 지점: 지금 돌고 있는 이미지를 먼저 기록한다.
PREV="$(docker inspect konnect-be --format '{{.Config.Image}}' 2>/dev/null || echo '')"
echo "현재 이미지: ${PREV:-(없음 — 최초 배포)}"

export BE_IMAGE="ghcr.io/$OWNER/konnect-be:$TAG"
export FE_IMAGE="ghcr.io/$OWNER/konnect-fe:$TAG"

echo "--- 이미지 받기"
$COMPOSE pull

# 마이그레이션은 컨테이너 교체 **전에** 돌린다. 순서가 반대면 새 코드가 옛 스키마를
# 보는 구간이 생긴다. profiles=tools 라 up 에는 섞이지 않는다.
echo "--- 스키마 마이그레이션"
$COMPOSE run --rm migrate

echo "--- 컨테이너 교체"
$COMPOSE up -d --wait

# --wait 는 컨테이너가 살아 있는지만 본다. 실제 응답까지 확인한다.
echo "--- 헬스체크"
ok=0
for i in $(seq 1 20); do
  if docker exec konnect-fe node -e \
      "fetch('http://127.0.0.1:3000/en').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    ok=1; break
  fi
  sleep 3
done

if [ "$ok" -ne 1 ]; then
  echo "!!! 헬스체크 실패 — 롤백한다"
  if [ -n "$PREV" ]; then
    PREV_TAG="${PREV##*:}"
    export BE_IMAGE="ghcr.io/$OWNER/konnect-be:$PREV_TAG"
    export FE_IMAGE="ghcr.io/$OWNER/konnect-fe:$PREV_TAG"
    $COMPOSE up -d --wait || true
    echo "!!! $PREV_TAG 로 되돌렸다."
    echo "!!! 주의: 스키마 마이그레이션은 되돌아가지 않는다. 수동 확인이 필요하다."
  else
    echo "!!! 최초 배포라 되돌릴 지점이 없다. 컨테이너를 내린다."
    $COMPOSE down || true
  fi
  exit 1
fi

echo "--- 배포된 이미지"
docker inspect konnect-be konnect-fe --format '{{.Name}}: {{.Config.Image}}' 2>/dev/null || true

echo "=== deploy done: $TAG ==="
