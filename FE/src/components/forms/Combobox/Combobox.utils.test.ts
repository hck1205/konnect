import { describe, expect, it } from 'vitest';
import { filterOptions, labelFor, type ComboboxOption } from './Combobox.utils';

const SCHOOLS: ComboboxOption[] = [
  { value: 'snu', label: 'Seoul National University', keywords: ['서울대학교', '서울대'] },
  { value: 'yonsei', label: 'Yonsei University', keywords: ['연세대학교'] },
  { value: 'hufs', label: 'Hankuk University of Foreign Studies', keywords: ['한국외대'] },
];

describe('filterOptions', () => {
  it('빈 질의는 전체를 돌려준다', () => {
    expect(filterOptions(SCHOOLS, '')).toHaveLength(3);
    expect(filterOptions(SCHOOLS, '   ')).toHaveLength(3);
  });

  it('대소문자를 무시한 부분 일치', () => {
    expect(filterOptions(SCHOOLS, 'yonsei').map((o) => o.value)).toEqual(['yonsei']);
    expect(filterOptions(SCHOOLS, 'UNIVERSITY')).toHaveLength(3);
  });

  it('한국어 키워드로도 찾아진다 — 사용자가 두 언어를 섞어 쓴다', () => {
    expect(filterOptions(SCHOOLS, '서울대').map((o) => o.value)).toEqual(['snu']);
    expect(filterOptions(SCHOOLS, '한국외대').map((o) => o.value)).toEqual(['hufs']);
  });

  it('앞에서부터 일치하는 것을 위로 올린다', () => {
    const result = filterOptions(SCHOOLS, 'hankuk');
    expect(result[0].value).toBe('hufs');
  });

  it('limit 을 넘지 않는다', () => {
    expect(filterOptions(SCHOOLS, '', 2)).toHaveLength(2);
  });

  it('일치가 없으면 빈 배열', () => {
    expect(filterOptions(SCHOOLS, 'zzz')).toEqual([]);
  });
});

describe('labelFor', () => {
  it('값에 해당하는 라벨을 찾는다', () => {
    expect(labelFor(SCHOOLS, 'snu')).toBe('Seoul National University');
  });

  it('목록에 없으면 값을 그대로 — 삭제된 항목이 저장돼 있을 수 있다', () => {
    expect(labelFor(SCHOOLS, 'gone')).toBe('gone');
  });
});
