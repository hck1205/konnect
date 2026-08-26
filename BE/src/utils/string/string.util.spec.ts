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

  /**
   * slug 는 **BE 와 FE 가 같은 규칙**이어야 한다.
   * BE 가 만든 slug 로 FE 가 링크를 만들고, FE 가 만든 앵커를 BE 가 저장한다 —
   * 갈라지면 링크가 죽는다.
   *
   * 아래 케이스는 `FE/src/lib/text/slug.test.ts` 와 **의도적으로 같다.**
   * 한쪽만 고치면 여기서 깨진다.
   */
  describe('slugify — FE 와 동일 규칙 (계약)', () => {
    it('소문자로 내리고 공백·언더스코어를 하이픈으로', () => {
      expect(slugify('  Before You Apply  ')).toBe('before-you-apply');
      expect(slugify('D_2 visa')).toBe('d-2-visa');
    });

    it('유니코드 글자를 보존한다', () => {
      expect(slugify('비자 연장 절차')).toBe('비자-연장-절차');
      expect(slugify('한국어 입문!')).toBe('한국어-입문');
    });

    it('기호를 제거하고 하이픈을 정리한다', () => {
      expect(slugify('What now?!')).toBe('what-now');
      expect(slugify('--a---b--')).toBe('a-b');
    });

    it('전부 걸러지면 빈 문자열', () => {
      expect(slugify('!!!')).toBe('');
    });
  });
});
