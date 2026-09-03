import { describe, expect, it } from 'vitest';
import { DISPLAY_TIME_ZONE, formatDate } from './format';

/**
 * 날짜 표시가 **어느 시간대 기준인지**를 못 박는다.
 *
 * ⚠️ 예전에는 `timeZone` 을 지정하지 않아 실행 환경의 시간대로 갔다.
 * 두 가지가 동시에 깨졌다:
 *
 * 1. **SSR 과 클라이언트가 다른 날짜를 그린다.** 서버 컨테이너는 UTC,
 *    사용자 브라우저는 KST 라 15:00Z 이후 값은 **하루가 다르다.**
 *    React 하이드레이션 불일치와 함께 사용자 눈앞에서 날짜가 바뀐다.
 * 2. 그리고 애초에 **틀린 날짜다.** 이 제품이 다루는 것은 체류기간·신고기한·
 *    개정일 같은 한국 행정 날짜다. 베트남에 있는 사용자가 알아야 하는 것은
 *    자기 지역으로 환산한 값이 아니라 **한국 기준 날짜**다.
 *
 * 이 테스트는 `TZ` 환경변수를 바꿔 돌려도 결과가 같아야 한다는 것을 고정한다.
 */
describe('formatDate 시간대', () => {
  // 2026-08-31 15:30Z = 한국 시간 2026-09-01 00:30 → **날짜가 하루 다르다**
  const ACROSS_MIDNIGHT_KST = '2026-08-31T15:30:00.000Z';

  it('한국 기준으로 표시한다', () => {
    expect(DISPLAY_TIME_ZONE).toBe('Asia/Seoul');
  });

  /**
   * 이 값이 함정의 핵심이다 — UTC 로는 8월 31일, 한국으로는 9월 1일이다.
   * 시간대를 못 박지 않으면 서버(UTC)와 브라우저(KST)가 **다른 날짜**를 그린다.
   */
  it('자정을 넘는 값이 한국 날짜로 나온다', () => {
    const en = formatDate(ACROSS_MIDNIGHT_KST, 'en', { dateStyle: 'short' });
    // 9월 1일이어야 한다(8월 31일이면 UTC 로 새고 있다)
    expect(en).toMatch(/9\/1|1\/9|2026-09-01/);
    expect(en).not.toMatch(/8\/31|31\/8/);
  });

  it('로케일이 달라도 같은 날짜를 가리킨다', () => {
    const iso = (l: 'en' | 'ko' | 'zh' | 'vi') =>
      formatDate(ACROSS_MIDNIGHT_KST, l, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    // 표기는 로케일마다 다르지만 **날짜 숫자**는 같아야 한다
    for (const l of ['en', 'ko', 'zh', 'vi'] as const) {
      expect(iso(l)).toMatch(/(^|\D)09(\D|$)/);
      expect(iso(l)).toMatch(/(^|\D)01(\D|$)/);
    }
  });

  it('부르는 쪽이 시간대를 명시하면 존중한다 — 못 박는 것이 강제는 아니다', () => {
    const utc = formatDate(ACROSS_MIDNIGHT_KST, 'en', {
      dateStyle: 'short',
      timeZone: 'UTC',
    });
    expect(utc).toMatch(/8\/31|31\/8|2026-08-31/);
  });

  it('잘못된 값은 빈 문자열 — 시간대와 무관하다', () => {
    expect(formatDate('nope', 'ko')).toBe('');
  });
});
