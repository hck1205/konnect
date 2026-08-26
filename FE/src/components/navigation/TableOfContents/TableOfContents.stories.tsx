import type { Story } from '@ladle/react';
import { TableOfContents } from './TableOfContents';
import { uniqueAnchors } from './TableOfContents.utils';
import type { TocEntry } from './TableOfContents.utils';

export default { title: 'Navigation / TableOfContents' };

const HEADINGS: [string, 2 | 3][] = [
  ['Before you apply', 2],
  ['Documents people were asked for', 3],
  ['Proof of funds', 3],
  ['At the office', 2],
  ['비자 연장 절차', 2],
  ['Summary', 3],
];

const ids = uniqueAnchors(HEADINGS.map(([label]) => label));
const ENTRIES: TocEntry[] = HEADINGS.map(([label, level], i) => ({
  id: ids[i],
  label,
  level,
}));

/**
 * 긴 가이드에서 필요하다 — 사용자는 문서를 처음부터 읽지 않고
 * **자기 상황에 해당하는 절만** 찾는다.
 *
 * 앵커 id 는 `utils/string.slugify` 와 **같은 규칙**으로 만든다.
 * 규칙이 갈라지면 링크가 죽는다. 한국어 제목도 보존된다.
 */
export const Default: Story = () => (
  <div className="max-w-xs">
    <TableOfContents entries={ENTRIES} activeId={ENTRIES[3].id} />
    <p className="mt-4 text-xs text-fg-subtle">
      생성된 id: {ENTRIES.map((e) => e.id).join(', ')}
    </p>
  </div>
);
