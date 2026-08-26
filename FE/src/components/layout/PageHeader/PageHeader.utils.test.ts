import { describe, expect, it } from 'vitest';
import { isNavActive } from './PageHeader.utils';

describe('isNavActive', () => {
  it('루트는 완전 일치일 때만 활성 — 모든 경로에 걸리면 안 된다', () => {
    expect(isNavActive('/', '/')).toBe(true);
    expect(isNavActive('/', '/questions')).toBe(false);
  });

  it('하위 경로에서도 상위 항목이 활성이다', () => {
    expect(isNavActive('/boards', '/boards')).toBe(true);
    expect(isNavActive('/boards', '/boards/free')).toBe(true);
  });

  it('접두사만 같고 경계가 다르면 활성이 아니다', () => {
    expect(isNavActive('/board', '/boards')).toBe(false);
  });

  it('경로를 모르면 아무것도 활성이 아니다', () => {
    expect(isNavActive('/boards', undefined)).toBe(false);
  });
});
