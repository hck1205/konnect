import { describe, expect, it } from 'vitest';
import { slugify, uniqueSlugs } from './slug';

describe('slugify', () => {
  it('소문자로 내리고 공백·언더스코어를 하이픈으로', () => {
    expect(slugify('  Before You Apply  ')).toBe('before-you-apply');
    expect(slugify('D_2 visa')).toBe('d-2-visa');
  });

  it('유니코드 글자를 보존한다 — 비우면 앵커가 전부 충돌하고 태그가 사라진다', () => {
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

  it('keep 으로 지정한 문자는 남긴다 — 태그의 네임스페이스 구분자', () => {
    expect(slugify('Visa:D_2', { keep: ':' })).toBe('visa:d-2');
    expect(slugify('Visa:D_2')).toBe('visad-2');
  });
});

describe('uniqueSlugs', () => {
  it('중복에 번호를 붙인다', () => {
    expect(uniqueSlugs(['Summary', 'Details', 'Summary'])).toEqual([
      'summary',
      'details',
      'summary-2',
    ]);
  });

  it('전부 걸러진 라벨도 id 를 갖는다', () => {
    expect(uniqueSlugs(['!!!', '???'])).toEqual(['section', 'section-2']);
  });
});
