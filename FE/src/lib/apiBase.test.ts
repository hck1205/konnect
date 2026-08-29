import { describe, expect, it } from 'vitest';
import { resolveApiBase, resolveServerApiBase } from './apiBase';

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

describe('resolveServerApiBase', () => {
  it('공개 base 가 절대 주소면 그대로 쓴다', () => {
    expect(
      resolveServerApiBase({ NEXT_PUBLIC_API_BASE_URL: 'https://api.konnect.app/' }),
    ).toBe('https://api.konnect.app');
  });

  it('공개 base 가 /api 면 서버 전용 주소로 간다 — 서버엔 rewrites 가 없다', () => {
    expect(
      resolveServerApiBase({ API_INTERNAL_URL: 'http://be:4000/' }),
    ).toBe('http://be:4000');
  });

  it('아무것도 없으면 로컬 BE', () => {
    expect(resolveServerApiBase({})).toBe('http://localhost:4000');
  });

  it('상대 경로를 서버 base 로 돌려주지 않는다 — 그러면 SSR 이 통째로 실패한다', () => {
    for (const env of [{}, { NEXT_PUBLIC_API_BASE_URL: '/api' }, { API_INTERNAL_URL: '' }]) {
      expect(resolveServerApiBase(env)).toMatch(/^https?:\/\//);
    }
  });
});
