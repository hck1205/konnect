import { normalizeTag, normalizeTagList, parseTag } from './tags.utils';

describe('normalizeTag — FE Tag.normalizeTag 와 동일 규칙 (계약)', () => {
  it('소문자로 내리고 공백을 하이픈으로', () => {
    expect(normalizeTag('  Seoul National  ')).toBe('seoul-national');
    expect(normalizeTag('D_2')).toBe('d-2');
  });

  it('네임스페이스 구분자는 보존한다', () => {
    expect(normalizeTag('Visa:D_2')).toBe('visa:d-2');
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

  it('오타 접두사를 네임스페이스로 인정하지 않는다', () => {
    expect(parseTag('viza:d-2').namespace).toBeNull();
    expect(parseTag('foo:bar').namespace).toBeNull();
  });

  it('값이 비면 자유 태그로 떨어진다', () => {
    expect(parseTag('visa:').namespace).toBeNull();
  });

  it('구분자가 없으면 자유 태그다', () => {
    expect(parseTag('interview').namespace).toBeNull();
  });
});

describe('normalizeTagList', () => {
  it('정규화 후 중복을 제거한다', () => {
    expect(normalizeTagList(['Visa:D_2', 'visa:d-2', 'seoul'], 5)).toEqual([
      'visa:d-2',
      'seoul',
    ]);
  });

  it('빈 값과 기호만 있는 항목을 버린다', () => {
    expect(normalizeTagList(['  ', '!!!', 'seoul'], 5)).toEqual(['seoul']);
  });

  it('상한을 넘으면 앞에서부터 자른다 — 먼저 적은 것이 더 중요할 가능성이 높다', () => {
    expect(normalizeTagList(['a', 'b', 'c'], 2)).toEqual(['a', 'b']);
  });

  it('순서를 유지한다', () => {
    expect(normalizeTagList(['zebra', 'apple'], 5)).toEqual(['zebra', 'apple']);
  });

  it('빈 목록은 빈 배열', () => {
    expect(normalizeTagList([], 5)).toEqual([]);
  });
});
