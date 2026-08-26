import { describe, expect, it } from 'vitest';
import { freshnessToTone, riskToTone } from './Banner.utils';

describe('riskToTone', () => {
  it('R1 은 danger, R2 는 warning', () => {
    expect(riskToTone('R1')).toBe('danger');
    expect(riskToTone('R2')).toBe('warning');
  });

  it('R3 는 배너를 띄우지 않는다 — 모든 글에 배너가 붙으면 아무도 안 읽는다', () => {
    expect(riskToTone('R3')).toBeNull();
  });
});

describe('freshnessToTone', () => {
  it('6개월 미만은 신선', () => {
    expect(freshnessToTone(0)).toBe('success');
    expect(freshnessToTone(5)).toBe('success');
  });

  it('6~12개월은 주의', () => {
    expect(freshnessToTone(6)).toBe('warning');
    expect(freshnessToTone(11)).toBe('warning');
  });

  it('12개월 이상은 위험', () => {
    expect(freshnessToTone(12)).toBe('danger');
    expect(freshnessToTone(36)).toBe('danger');
  });
});
