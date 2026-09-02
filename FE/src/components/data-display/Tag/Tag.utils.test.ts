import { describe, expect, it } from 'vitest';
import { formatTagLabel } from './Tag.utils';

/**
 * 태그의 **표시 형태** 테스트. 저장 규칙(`normalizeTag`·`parseTag`)은
 * `lib/text/tag.test.ts` 로 옮겼다 — 그쪽은 BE 와 대조되는 계약이고 여기는 화면 사정이다.
 */

describe('formatTagLabel', () => {
  it('체류자격 코드는 전부 대문자로 표시한다', () => {
    expect(formatTagLabel('visa:d-2')).toBe('D-2');
    expect(formatTagLabel('visa:e-7')).toBe('E-7');
  });

  it('그 밖의 네임스페이스는 단어별 첫 글자를 올린다', () => {
    expect(formatTagLabel('region:seoul')).toBe('Seoul');
    expect(formatTagLabel('school:seoul-national-university')).toBe(
      'Seoul National University',
    );
  });

  // 국적은 ISO 코드다 — 타이틀케이스로 올리면 `Vn` 이 된다
  it('국적 코드도 전부 대문자로 표시한다', () => {
    expect(formatTagLabel('nationality:vn')).toBe('VN');
    expect(formatTagLabel('nationality:cn')).toBe('CN');
  });

  it('자유 태그는 저장된 그대로 보여준다', () => {
    expect(formatTagLabel('interview')).toBe('interview');
    expect(formatTagLabel('비자-연장')).toBe('비자-연장');
  });

  it('입력 표기가 달라도 같은 라벨로 수렴한다', () => {
    expect(formatTagLabel('VISA:D_2')).toBe(formatTagLabel('visa:d-2'));
  });
});
