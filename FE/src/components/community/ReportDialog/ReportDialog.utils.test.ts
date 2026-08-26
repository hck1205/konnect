import { describe, expect, it } from 'vitest';
import { trackFor, urgentReasons } from './ReportDialog.utils';

describe('trackFor', () => {
  it('사기와 개인정보 노출은 긴급 — 피해가 진행 중일 수 있다', () => {
    expect(trackFor('scam')).toBe('urgent');
    expect(trackFor('personal-info')).toBe('urgent');
    expect(trackFor('harassment')).toBe('urgent');
  });

  it('스팸·광고는 일반', () => {
    expect(trackFor('spam')).toBe('normal');
    expect(trackFor('other')).toBe('normal');
  });

  it('모르는 사유는 일반으로 떨어진다 — 던지지 않는다', () => {
    expect(trackFor('made-up' as never)).toBe('normal');
  });
});

describe('urgentReasons', () => {
  it('긴급 사유만 돌려준다', () => {
    expect(urgentReasons()).toEqual(['scam', 'personal-info', 'harassment']);
  });
});
