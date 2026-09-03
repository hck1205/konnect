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

TAG="${1:-}"

# SSH 로 호출될 때는 authorized_keys 의 command= 제약 때문에 클라이언트가 보낸
# 문자열이 통째로 인자가 된다. 보내는 쪽이 `export TAG=abc; ...` 형태로 보내면
# 첫 단어인 `export` 가 태그로 잡혀 엉뚱한 이미지를 받으려다 실패한다(실제로 겪음).
# 보내는 쪽(deploy.yml)은 태그만 보내도록 고쳤지만, 여기서도 한 번 더 건진다 —
# 배포 경로는 한쪽만 믿고 두지 않는다.
if [ "$TAG" = "export" ] || [ -z "$TAG" ]; then
  EXTRACTED="$(printf '%s' "${SSH_ORIGINAL_COMMAND:-$*}" \
    | grep -oE 'TAG=[A-Za-z0-9._-]+' | head -1 | cut -d= -f2)"
  if [ -n "$EXTRACTED" ]; then
    echo "(태그를 인자 대신 TAG= 형식에서 추출했다: $EXTRACTED)"
    TAG="$EXTRACTED"
  fi
fi

[ -n "$TAG" ] || { echo "사용법: deploy.sh <이미지태그>"; exit 2; }

# 태그 형식을 앞단에서 검증한다.
#
# 이 스크립트는 authorized_keys 의 command= 로 강제 실행되며, 인자는 배포 키를
# 가진 쪽이 보낸 값이다. 셸의 변수 치환은 확장된 값 안의 ; 나 | 를 다시
# 해석하지 않으므로 명령 주입은 일어나지 않는다(실제로 `x; id` 로 확인함 —
# id 는 실행되지 않고 태그가 "x;" 가 됐다).
#
# 그래도 검증하는 이유는 **실패 지점을 앞으로 당기기 위해서**다. 검증이 없으면
# 잘못된 태그가 pull 단계까지 내려가 docker 의 "invalid reference format" 같은
# 맥락 없는 에러로 죽는다. 여기서 걸러야 무엇이 잘못됐는지 바로 보인다.
case "$TAG" in
  *[!A-Za-z0-9._-]* | "" | -* | .* )
    echo "!!! 태그 형식이 잘못됐다: '$TAG'"
    echo "    영숫자와 . _ - 만 쓸 수 있고, - 나 . 로 시작할 수 없다."
    exit 2
    ;;
esac

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
#
# ⚠️ 예전에는 /en 하나만 봤다. 그런데 홈은 BE 를 부르지 않는다(주제·자격 목록이
# FE 안의 데이터다). 그래서 BE 가 완전히 죽어 있어도 "deploy done" 이 찍혔고,
# 그 시점에는 되돌릴 수 없는 prisma migrate deploy 가 이미 끝나 있었다.
#
# 실제로 그 구멍으로 장애가 하나 지나갔다: compose 를 서버에 설치하지 않아
# /en/questions 가 500 이던 것을 스모크가 /en 만 봐서 잡지 못했고,
# 목록 화면이 배포된 시점부터 계속 죽어 있었다.
#
# 이제 세 층을 각각 본다:
#   /en             FE 가 뜬다
#   /api/health     FE -> BE 배선 (Next rewrite -> konnect-be:4000)
#   /en/questions   FE -> BE -> DB 까지. 이게 실제 사용자 경로다
echo "--- 헬스체크"

probe() {
  docker exec konnect-fe node -e \
    "fetch('http://127.0.0.1:3000$1').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
    2>/dev/null
}

ok=0
for i in $(seq 1 20); do
  if probe /en && probe /api/health && probe /en/questions; then
    ok=1; break
  fi
  sleep 3
done

if [ "$ok" -eq 1 ]; then
  echo "    /en - /api/health - /en/questions 모두 200"
else
  # 어느 층에서 끊겼는지 남긴다 — 없으면 원인 추적이 처음부터 시작된다
  echo "!!! 층별 결과:"
  for p in /en /api/health /en/questions; do
    if probe "$p"; then echo "!!!   $p  OK"; else echo "!!!   $p  실패"; fi
  done
fi

if [ "$ok" -ne 1 ]; then
  echo "!!! 헬스체크 실패 — 롤백한다"
  if [ -n "$PREV" ]; then
    PREV_TAG="${PREV##*:}"
    export BE_IMAGE="ghcr.io/$OWNER/konnect-be:$PREV_TAG"
    export FE_IMAGE="ghcr.io/$OWNER/konnect-fe:$PREV_TAG"
    # ⚠️ 예전에는 `|| true` 뒤에 무조건 "되돌렸다" 를 찍었다. 롤백 자체가
    # 실패해도 운영자는 SSH 로그의 그 줄을 읽고 사이트가 살아 있다고 믿는다 —
    # 실패를 성공으로 보고하는 것이라, 롤백이 없는 것보다 나쁘다.
    if $COMPOSE up -d --wait; then
      if probe /en && probe /api/health && probe /en/questions; then
        echo "!!! $PREV_TAG 로 되돌렸고 응답을 확인했다."
      else
        echo "!!! $PREV_TAG 로 컨테이너는 떴지만 응답이 없다. 사이트가 죽어 있다."
        echo "!!! 즉시 사람이 확인해야 한다."
      fi
    else
      echo "!!! 롤백 자체가 실패했다. 사이트가 죽어 있을 가능성이 높다."
      echo "!!! 즉시 사람이 확인해야 한다."
    fi
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
