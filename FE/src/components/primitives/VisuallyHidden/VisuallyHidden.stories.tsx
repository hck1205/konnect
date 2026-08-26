import type { Story } from '@ladle/react';
import { VisuallyHidden } from './VisuallyHidden';

export default { title: 'Primitives / VisuallyHidden' };

/**
 * 화면에는 없고 스크린리더에는 있다.
 *
 * 아래 두 링크는 **똑같이 보이지만** 스크린리더에는 다르게 읽힌다.
 * "Read more" 만 있는 링크 목록은 링크만 훑는 사용자에게 아무 의미가 없다.
 */
export const LinkContext: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <div>
      <p className="mb-1 text-xs font-medium text-fg-subtle">
        ❌ 링크만 훑으면 무엇에 대한 링크인지 알 수 없다
      </p>
      <a href="#" className="text-brand underline">
        Read more
      </a>
    </div>

    <div>
      <p className="mb-1 text-xs font-medium text-fg-subtle">
        ✅ 보이는 모습은 같고, 읽히는 내용만 완전하다
      </p>
      <a href="#" className="text-brand underline">
        Read more
        <VisuallyHidden> about extending a D-2 visa</VisuallyHidden>
      </a>
    </div>
  </div>
);

/** 아이콘 버튼처럼 시각적 레이블이 없을 때 접근 가능한 이름을 준다 */
export const IconLabel: Story = () => (
  <button
    type="button"
    className="rounded-md border border-border-interactive px-3 py-2 text-fg"
  >
    <span aria-hidden="true">★</span>
    <VisuallyHidden>Bookmark this question</VisuallyHidden>
  </button>
);
