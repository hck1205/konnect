import { describe, expect, it } from 'vitest';
import { resolveApiBase } from './apiBase';

describe('resolveApiBase', () => {
  it('미설정/공백이면 /api 로 떨어진다', () => {
    expect(resolveApiBase()).toBe('/api');
    expect(resolveApiBase('   ')).toBe('/api');
  });

  it('끝 슬래시를 제거해 경로를 이어 붙일 수 있게 한다', () => {
    expect(resolveApiBase('https://api.konnect.app/')).toBe(
      'https://api.konnect.app',
    );
  });
});
