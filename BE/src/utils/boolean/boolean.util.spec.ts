import { isNil, parseBoolean } from './boolean.util';

describe('boolean util', () => {
  it('parseBoolean — 알려진 표기만 해석하고 나머지는 fallback', () => {
    expect(parseBoolean('TRUE')).toBe(true);
    expect(parseBoolean('off')).toBe(false);
    expect(parseBoolean('maybe', true)).toBe(true);
    expect(parseBoolean(undefined)).toBe(false);
  });

  it('isNil — null/undefined 만 true', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(0)).toBe(false);
  });
});
