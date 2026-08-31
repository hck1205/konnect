import { describe, expect, it } from 'vitest';
import { buildListParams } from './questions.api';

/**
 * 쿼리 문자열 조립.
 *
 * ⚠️ 여기가 조용히 틀리기 쉬운 자리다 — 배열을 axios 기본 직렬화에 맡기면
 * `tags[]=a&tags[]=b` 로 나가고 BE 는 `tags` 를 읽으므로 **필터가 빠진 채로**
 * 200 이 돌아온다. 에러가 안 나서 눈치채기 어렵다.
 */
describe('buildListParams', () => {
  it('아무것도 없으면 빈 객체다', () => {
    expect(buildListParams()).toEqual({});
  });

  it('태그는 **쉼표로 잇는다** — 배열로 두면 BE 가 못 읽는다', () => {
    expect(buildListParams({ tags: ['visa:f-2', 'region:ansan'] })).toEqual({
      tags: 'visa:f-2,region:ansan',
    });
  });

  it('answered 는 문자열이다 — BE 가 IsBooleanString 으로 받는다', () => {
    expect(buildListParams({ answered: true })).toEqual({ answered: 'true' });
    expect(buildListParams({ answered: false })).toEqual({ answered: 'false' });
  });

  it('빈 배열·빈 문자열은 아예 보내지 않는다 — 필터 없음과 같아야 한다', () => {
    expect(buildListParams({ tags: [], q: '   ' })).toEqual({});
  });

  it('검색어는 트림한다', () => {
    expect(buildListParams({ q: '  F-2 점수  ' })).toEqual({ q: 'F-2 점수' });
  });

  it('커서와 limit 은 문자열로 나간다', () => {
    expect(buildListParams({}, { cursor: 'abc', limit: 20 })).toEqual({
      cursor: 'abc',
      limit: '20',
    });
  });

  it('limit 0 을 생략하지 않는다 — 0 은 값이다', () => {
    expect(buildListParams({}, { limit: 0 })).toEqual({ limit: '0' });
  });

  it('필터와 페이지를 함께 보낸다', () => {
    expect(
      buildListParams({ topic: 'residency', tags: ['visa:f-2'] }, { limit: 10 }),
    ).toEqual({ topic: 'residency', tags: 'visa:f-2', limit: '10' });
  });

  /**
   * 게시판은 topic × type 이다. 이 줄이 빠지면 화면은 필터를 건 것처럼 보이는데
   * 요청에는 안 실려서 **전체 목록이 그대로 나온다** — 조용히 틀리는 종류다.
   */
  it('type 을 함께 보낸다 — 게시판의 두 번째 축', () => {
    expect(buildListParams({ topic: 'residency', type: 'question' })).toEqual({
      topic: 'residency',
      type: 'question',
    });
  });

  it('type 만 걸어도 실린다', () => {
    expect(buildListParams({ type: 'recruit' })).toEqual({ type: 'recruit' });
  });

  /**
   * AND 와 OR 는 **다른 키**로 나간다. 하나로 합치면 서버가 어느 쪽인지 알 수 없고,
   * 합치는 순간 "F-2 또는 F-5 이면서 안산" 같은 질의가 표현 불가능해진다.
   */
  it('anyTags 는 tags 와 별개 키로 실린다', () => {
    expect(
      buildListParams({ tags: ['region:ansan'], anyTags: ['visa:f-2', 'visa:f-5'] }),
    ).toEqual({ tags: 'region:ansan', anyTags: 'visa:f-2,visa:f-5' });
  });

  it('anyTags 가 비면 아예 실리지 않는다', () => {
    expect(buildListParams({ anyTags: [] })).toEqual({});
  });
});
