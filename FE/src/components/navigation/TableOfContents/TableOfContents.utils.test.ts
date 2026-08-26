import { describe, expect, it } from 'vitest';
import { toAnchorId, uniqueAnchors } from './TableOfContents.utils';

describe('toAnchorId', () => {
  it('공백을 하이픈으로 바꾸고 소문자로 내린다', () => {
    expect(toAnchorId('Before you apply')).toBe('before-you-apply');
  });

  it('한국어 제목을 보존한다 — 비우면 모든 앵커가 충돌한다', () => {
    expect(toAnchorId('비자 연장 절차')).toBe('비자-연장-절차');
  });

  it('기호를 제거하고 하이픈을 정리한다', () => {
    expect(toAnchorId('What now?!')).toBe('what-now');
    expect(toAnchorId('  --A -- B--  ')).toBe('a-b');
  });
});

describe('uniqueAnchors', () => {
  it('중복 제목에 번호를 붙인다', () => {
    expect(uniqueAnchors(['Summary', 'Details', 'Summary'])).toEqual([
      'summary',
      'details',
      'summary-2',
    ]);
  });

  it('전부 걸러진 제목도 id 를 갖는다', () => {
    expect(uniqueAnchors(['!!!', '???'])).toEqual(['section', 'section-2']);
  });
});
