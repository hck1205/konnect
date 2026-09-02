import { describe, expect, it } from 'vitest';
import { normalizeTag, parseTag } from './tag';

/**
 * 태그 **규칙**의 테스트. 표시 형태(`formatTagLabel`)는 컴포넌트 쪽에 있다.
 *
 * 이 둘을 한 파일에 두면 "태그를 어떻게 저장하는가" 와 "어떻게 보여주는가" 가
 * 섞인다. 저장 규칙은 BE 와 대조되는 계약이고 표시는 화면 사정이라 수명이 다르다.
 */

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
