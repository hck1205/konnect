import { describe, expect, it } from 'vitest';
import { capitalize, isBlank, normalizeWhitespace, slugify, truncate } from './string';

describe('string util', () => {
  it('isBlank — 공백만 있으면 true', () => {
    expect(isBlank('   ')).toBe(true);
    expect(isBlank(' a ')).toBe(false);
  });

  it('capitalize / truncate', () => {
    expect(capitalize('hi')).toBe('Hi');
    expect(truncate('abcdef', 3)).toBe('abc…');
  });

  it('normalizeWhitespace — 연속 공백을 하나로', () => {
    expect(normalizeWhitespace('  a   b  ')).toBe('a b');
  });

  it('slugify — BE와 같은 규칙(유니코드 보존)', () => {
    expect(slugify('비자 연장 후기!')).toBe('비자-연장-후기');
    expect(slugify('  Hello   World  ')).toBe('hello-world');
  });
});
