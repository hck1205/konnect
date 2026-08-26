import type { Story } from '@ladle/react';
import { Avatar } from './Avatar';

export default { title: 'Primitives / Avatar' };

/**
 * 이미지가 없으면 이니셜로 대체한다.
 * 한글 이름은 **한 글자만** 딴다 — 두 글자를 따면 이름 일부가 그대로 노출된다.
 */
export const Fallbacks: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    {['Maria Santos', 'Amar', '아마르', 'Jean Luc Picard', 'chen', '김민지'].map(
      (name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <Avatar name={name} size="lg" />
          <span className="text-xs text-fg-subtle">{name}</span>
        </div>
      ),
    )}
  </div>
);

/** 같은 이름은 언제나 같은 색을 받는다 — 목록에서 사람을 색으로 알아볼 수 있어야 한다 */
export const StableColors: Story = () => (
  <div className="flex items-center gap-2">
    {Array.from({ length: 4 }, (_, i) => (
      <Avatar key={i} name="Maria Santos" />
    ))}
    <span className="ml-2 text-sm text-fg-muted">← 모두 같은 색</span>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <Avatar name="Maria Santos" size="sm" />
    <Avatar name="Maria Santos" size="md" />
    <Avatar name="Maria Santos" size="lg" />
  </div>
);
