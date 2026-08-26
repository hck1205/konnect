import type { Story } from '@ladle/react';
import { Code } from './Code';

export default { title: 'Primitives / Code' };

/** `translate="no"` 가 기본 — 코드가 브라우저 번역기에 번역되면 쓸 수 없다 */
export const Inline: Story = () => (
  <p className="text-sm text-fg">
    태그는 <Code>visa:d-2</Code> 형태로 저장되고 <Code>D-2</Code> 로 표시된다.
  </p>
);

/** 한국어 원문에는 `korean` 을 준다 — `lang="ko"` 가 붙어 스크린리더 발음이 맞는다 */
export const Korean: Story = () => (
  <p className="text-sm text-fg">
    서류 이름은 <Code korean>외국인등록증</Code> 입니다. 이 글자를 그대로 복사해
    검색하세요.
  </p>
);

export const Block: Story = () => (
  <div className="max-w-md">
    <Code block>{`GET /questions?limit=20&cursor=<lastId>
→ { data: { items: [...], nextCursor }, timestamp }`}</Code>
  </div>
);
