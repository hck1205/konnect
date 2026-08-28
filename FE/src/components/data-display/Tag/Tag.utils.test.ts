import { describe, expect, it } from 'vitest';
import { formatTagLabel, normalizeTag, parseTag } from './Tag.utils';

describe('normalizeTag', () => {
  it('소문자로 내리고 공백을 하이픈으로 바꾼다', () => {
    expect(normalizeTag('  Seoul National  ')).toBe('seoul-national');
    expect(normalizeTag('D_2')).toBe('d-2');
  });

  it('네임스페이스 구분자는 보존한다', () => {
    expect(normalizeTag('Visa: D-2')).toBe('visa:-d-2');
  });

  it('한글 자유 태그를 지우지 않는다', () => {
    expect(normalizeTag('비자 연장')).toBe('비자-연장');
  });

  it('연속 하이픈과 양끝 하이픈을 정리한다', () => {
    expect(normalizeTag('--a---b--')).toBe('a-b');
  });
});

describe('parseTag', () => {
  it('알려진 네임스페이스를 분리한다', () => {
    expect(parseTag('visa:d-2')).toEqual({
      namespace: 'visa',
      value: 'd-2',
      raw: 'visa:d-2',
    });
  });

  it('알려지지 않은 접두사는 자유 태그로 취급한다 — 오타가 네임스페이스가 되면 안 된다', () => {
    expect(parseTag('viza:d-2').namespace).toBeNull();
    expect(parseTag('foo:bar').namespace).toBeNull();
  });

  it('값이 비면 자유 태그로 떨어진다', () => {
    expect(parseTag('visa:').namespace).toBeNull();
  });

  it('구분자가 없으면 자유 태그다', () => {
    expect(parseTag('interview')).toEqual({
      namespace: null,
      value: 'interview',
      raw: 'interview',
    });
  });
});

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
