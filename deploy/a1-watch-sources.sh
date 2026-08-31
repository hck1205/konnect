#!/usr/bin/env bash
# 공식 출처 감시 (A1 서버에서 cron 으로 실행).
#
#   설치: sudo install -m 755 deploy/a1-watch-sources.sh /srv/app/konnect/watch-sources.sh
#   크론: 0 0 * * *  /srv/app/konnect/watch-sources.sh   # 09:00 KST
#
# **왜 GitHub Actions 가 아니라 서버인가**
#   법제처 OPEN API 는 호출하는 **IP 를 사전 등록**해야 한다("정확한 서버장비의
#   IP주소 및 도메인주소를 등록해 주세요"). Actions 러너의 IP 는 매번 바뀌고
#   대역이 수천 개라 등록이 불가능하다. A1 은 고정 IP 라 한 번 등록이면 끝난다.
#   → docs/20-product/10-features/11-official-sources.md
set -euo pipefail

DIR=/srv/app/konnect
REPO="$DIR/repo"          # 저장소 체크아웃 위치
STATE_BRANCH=main

# LAW_API_KEY 는 .env 에 둔다(권한 600). 없으면 법령은 건너뛰고 페이지 감시만 돈다.
[ -f "$DIR/.env" ] && set -a && . "$DIR/.env" && set +a

cd "$REPO"
git fetch --quiet origin "$STATE_BRANCH"
git checkout --quiet "$STATE_BRANCH"
git reset --hard --quiet "origin/$STATE_BRANCH"

LOG=$(mktemp)
trap 'rm -f "$LOG"' EXIT

set +e
node BE/scripts/watch-sources.mjs | tee "$LOG"
EXIT=$?
set -e

CHANGES=$(grep -c '⚠' "$LOG" || true)

# 상태 파일은 **변경 여부의 기준선**이다. 커밋하지 않으면 매일 "최초 기록"이 된다.
if ! git diff --quiet -- BE/data/source-state.json; then
  git add BE/data/source-state.json
  git -c user.name=konnect-source-watcher \
      -c user.email=noreply@konnect \
      commit --quiet -m "chore(sources): 감시 상태 갱신 [skip ci]"
  git push --quiet origin "$STATE_BRANCH"
  echo "상태 파일 갱신됨"
fi

# 변경이 있으면 이슈로 남긴다 — "봤다/안 봤다"가 추적되어야 한다.
# gh 가 없거나 토큰이 없으면 로그만 남기고 넘어간다(감시 자체는 성공이다).
if [ "$CHANGES" != "0" ] && command -v gh >/dev/null 2>&1; then
  gh issue create \
    --title "공식 출처 변경 감지 — $(date +%F)" \
    --label sources \
    --body "$(printf '공식 문서가 바뀌었다. **자동으로 글을 고치지 않는다** — 사람이 확인해야 한다.\n\n```\n%s\n```\n\n### 확인할 것\n- [ ] 원문에서 무엇이 바뀌었는지 확인\n- [ ] 영향받는 태그의 질문·답변을 "확인 필요"로 표시\n\n> 전문가가 없으므로 **해석을 새로 쓰지 않는다.** 출처 링크와 변경 사실만 갱신한다.' "$(cat "$LOG")")" \
    || echo "!!! 이슈 생성 실패 (감시는 성공)"
fi

# 변경은 정상이다. 수집 실패만 비정상으로 알린다 —
# 그래야 cron 메일이 "바뀜"이 아니라 "못 가져옴"에만 온다.
exit "$EXIT"
