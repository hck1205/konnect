import {
  capitalize,
  isBlank,
  normalizeWhitespace,
  slugify,
  truncate,
} from './string.util';

describe('string util', () => {
  it('isBlank — 공백만 있으면 true', () => {
    expect(isBlank('   ')).toBe(true);
    expect(isBlank(' a ')).toBe(false);
  });

  it('capitalize — 빈 문자열은 그대로', () => {
    expect(capitalize('hi')).toBe('Hi');
    expect(capitalize('')).toBe('');
  });

  it('truncate — max 이하는 손대지 않는다', () => {
    expect(truncate('abcdef', 3)).toBe('abc…');
    expect(truncate('ab', 3)).toBe('ab');
  });

  it('normalizeWhitespace — 연속 공백을 하나로', () => {
    expect(normalizeWhitespace('  a   b  ')).toBe('a b');
  });

  it('slugify — 유니코드 글자는 보존한다', () => {
    expect(slugify('자바스크립트 입문!')).toBe('자바스크립트-입문');
    expect(slugify('  Hello   World  ')).toBe('hello-world');
  });
});
