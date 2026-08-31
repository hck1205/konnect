#!/usr/bin/env bash
# 공식 출처 감시 (A1 서버에서 cron 으로 실행).
#
#   설치: sudo install -m 755 deploy/a1-watch-sources.sh /srv/app/konnect/watch-sources.sh
#   크론: 0 9 * * *  /srv/app/konnect/watch-sources.sh   # 09:00 KST
#
#   ⚠️ A1 의 시간대는 **Asia/Seoul** 이다(UTC 아님). 그래서 시각을 그대로 적는다.
#      예전 주석이 `0 0` 이었는데 그건 UTC 서버를 가정한 것이라 이 서버에서는 자정에 돈다.
#
# **왜 GitHub Actions 가 아니라 서버인가**
#   법제처 OPEN API 는 호출하는 **IP 를 사전 등록**해야 한다("정확한 서버장비의
#   IP주소 및 도메인주소를 등록해 주세요"). Actions 러너의 IP 는 매번 바뀌고
#   대역이 수천 개라 등록이 불가능하다. A1 은 고정 IP 라 한 번 등록이면 끝난다.
#
# **왜 저장소 체크아웃이 없나**
#   A1 은 **이미지만 받아 실행하는 서버**다 — 소스도 git 도 없다. 예전 판은
#   $DIR/repo 에서 git fetch/checkout 하고 상태 파일을 commit·push 했는데,
#   그러려면 프로덕션에 저장소와 **push 권한**이 생긴다. 배포 키에 command= 제약을
#   걸어 셸조차 막아 둔 방향과 정반대다.
#
#   지금은 감시 스크립트가 BE 이미지 안에 있고(BE/Dockerfile), 기준선은 named
#   volume 에 둔다. 해시는 파생 데이터라 git 에 있을 이유가 없었다.
#   → docs/20-product/10-features/11-official-sources.md
set -euo pipefail

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH

DIR=/srv/app/konnect
COMPOSE="docker compose -f $DIR/docker-compose.yml"
REPO=hck1205/konnect

cd "$DIR"

# KONNECT_LAW_API_KEY 는 .env 에 있다(권한 600). **여기서 source 하지 않는다** —
# compose 가 같은 디렉터리의 .env 를 알아서 읽고, 그래야 키가 이 셸의 환경변수로
# 새지 않는다. 키가 없으면 법령 3건만 건너뛰고 페이지 감시는 계속 돈다.
[ -f .env ] || { echo "!!! $DIR/.env 가 없다. 감시는 키 없이도 돌지만 구성이 잘못됐다."; exit 1; }

# 어떤 이미지로 도나 — **돌고 있는 konnect-be 와 같은 것**을 쓴다.
#
# compose 의 기본값은 `:latest` 인데 이 서버에서 그 태그는 **낡은 것을 가리킨다.**
# a1-deploy.sh 가 BE_IMAGE 에 커밋 SHA 태그를 넣어 pull 하므로, 서버는 `:latest` 를
# 처음 한 번 받은 뒤로 다시 받은 적이 없다. 실제로 첫 실행이 11시간 전 이미지를 잡아
# `Cannot find module '/app/scripts/watch-sources.mjs'` 로 죽었다 — 그 이미지에는
# 감시 스크립트가 아직 없었다.
#
# 돌고 있는 컨테이너에서 가져오면 감시가 **지금 서비스 중인 코드와 같은 것**을 쓴다.
BE_IMAGE="$(docker inspect konnect-be --format '{{.Config.Image}}' 2>/dev/null || true)"
if [ -n "$BE_IMAGE" ]; then
  export BE_IMAGE
  echo "이미지: $BE_IMAGE (konnect-be 와 동일)"
else
  # 여기서 멈추지 않는다. 앱이 내려가 있다고 감시까지 멈출 이유는 없다.
  # 다만 `:latest` 가 낡았을 수 있으므로 그 사실을 로그에 남긴다.
  echo "!!! konnect-be 가 돌고 있지 않다 — compose 기본값(:latest)으로 진행한다."
  echo "!!! 이 서버의 :latest 는 갱신되지 않으므로 낡았을 수 있다."
fi

LOG=$(mktemp)
trap 'rm -f "$LOG"' EXIT

# profiles=tools 라 `up -d` 에는 섞이지 않는다. migrate 와 같은 패턴이다.
# pipefail 이 켜져 있으므로 $? 는 tee 가 아니라 node 의 종료코드를 준다.
set +e
$COMPOSE run --rm watch-sources | tee "$LOG"
EXIT=$?
set -e

CHANGES=$(grep -c '⚠' "$LOG" || true)

# 변경이 있으면 이슈로 남긴다 — "봤다/안 봤다"가 추적되어야 한다.
#
# --repo 를 명시하는 이유: gh 는 보통 **현재 디렉터리의 git 저장소**에서 대상을
# 추론하는데 이 서버에는 체크아웃이 없다. 없으면 "not a git repository" 로 죽는다.
#
# gh 가 없거나 토큰이 없으면 로그만 남기고 넘어간다(감시 자체는 성공이다).
if [ "$CHANGES" != "0" ] && command -v gh >/dev/null 2>&1; then
  gh issue create \
    --repo "$REPO" \
    --title "공식 출처 변경 감지 — $(date +%F)" \
    --label sources \
    --body "$(printf '공식 문서가 바뀌었다. **자동으로 글을 고치지 않는다** — 사람이 확인해야 한다.\n\n```\n%s\n```\n\n### 확인할 것\n- [ ] 원문에서 무엇이 바뀌었는지 확인\n- [ ] 영향받는 태그의 질문·답변을 "확인 필요"로 표시\n\n> 전문가가 없으므로 **해석을 새로 쓰지 않는다.** 출처 링크와 변경 사실만 갱신한다.' "$(cat "$LOG")")" \
    || echo "!!! 이슈 생성 실패 (감시는 성공)"
fi

# 변경은 정상이다. 수집 실패만 비정상으로 알린다 —
# 그래야 cron 메일이 "바뀜"이 아니라 "못 가져옴"에만 온다.
exit "$EXIT"
