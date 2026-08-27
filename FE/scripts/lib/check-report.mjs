/**
 * 검사 스크립트 공통 보고.
 *
 * `check:contrast` · `check:stories` · `check:routing` 이 각자
 * "실패를 모아 출력하고 종료코드를 정하는" 코드를 갖고 있었고, 출력 기호마저
 * 서로 달랐다(`✓/✖` 와 `✅/❌`). 검사가 더 늘어날 예정이라
 * ([sitemap·hreflang](../../../docs/30-architecture/07-routes-and-indexing.md))
 * 한 곳에 모은다.
 *
 * 이 모듈이 정하는 것은 **보고 형식과 종료코드**뿐이다.
 * 무엇을 검사할지는 각 스크립트가 갖는다.
 */

/** 실패 하나 — [무엇이, 왜] */
export function createReport(label) {
  const failures = [];
  return {
    /** 실패를 기록한다. 즉시 종료하지 않는다 — 한 번에 전부 보여줘야 고치기 쉽다 */
    fail(what, why) {
      failures.push([what, why]);
    },
    get failed() {
      return failures.length > 0;
    },
    /**
     * 결과를 출력하고 **프로세스를 끝낸다.**
     * 실패가 있으면 종료코드 1 — CI 가 이것만 본다.
     */
    done(passedCount, note = '') {
      if (failures.length > 0) {
        console.error(`✖ ${label} 실패 ${failures.length}건\n`);
        for (const [what, why] of failures) console.error(`  · ${what}\n      ${why}`);
        process.exit(1);
      }
      console.log(`✓ ${label} ${passedCount}건 통과${note ? ` (${note})` : ''}`);
      process.exit(0);
    },
    /** 검사를 시작조차 못 한 경우 — 전제가 안 갖춰졌다 */
    abort(reason) {
      console.error(`✖ ${reason}`);
      process.exit(1);
    },
  };
}
