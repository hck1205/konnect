import { extractBearer } from './jwt-auth.guard';

describe('extractBearer', () => {
  it('Bearer 토큰을 꺼낸다', () => {
    expect(extractBearer('Bearer abc.def.ghi')).toBe('abc.def.ghi');
  });

  it('스킴 대소문자를 가리지 않는다', () => {
    expect(extractBearer('bearer abc')).toBe('abc');
    expect(extractBearer('BEARER abc')).toBe('abc');
  });

  it('헤더가 없거나 형식이 다르면 null', () => {
    expect(extractBearer(undefined)).toBeNull();
    expect(extractBearer('')).toBeNull();
    expect(extractBearer('Basic abc')).toBeNull();
    expect(extractBearer('Bearer')).toBeNull();
    expect(extractBearer('Bearer ')).toBeNull();
  });
});
