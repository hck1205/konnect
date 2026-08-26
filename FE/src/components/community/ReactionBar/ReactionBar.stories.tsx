import type { Story } from '@ladle/react';
import { useState } from 'react';
import { ReactionBar } from './ReactionBar';
import { toggleReaction } from './ReactionBar.utils';
import type { ReactionCounts, ReactionKind } from './ReactionBar.types';

export default { title: 'Community / ReactionBar' };

/**
 * 종류는 **고정 어휘**다 — 임의 이모지를 허용하면 집계가 무의미해지고,
 * 문화권마다 뜻이 다른 이모지가 섞인다(다국적 사용자에게 특히 위험하다).
 *
 * 이모지 옆에 **번역된 이름**이 함께 읽힌다(sr-only).
 * 한 사람이 **하나만** 고른다 — 다른 것을 누르면 갈아탄다.
 */
export const Interactive: Story = () => {
  const [counts, setCounts] = useState<ReactionCounts>({ like: 12, helpful: 5, support: 1 });
  const [mine, setMine] = useState<ReactionKind | null>('like');

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <ReactionBar
        counts={counts}
        mine={mine}
        onToggle={(kind) => {
          const next = toggleReaction(counts, mine, kind);
          setCounts(next.counts);
          setMine(next.mine);
        }}
      />
      <p className="text-xs text-fg-subtle">
        내 리액션: {mine ?? '(없음)'} — 같은 것을 다시 누르면 취소된다
      </p>
    </div>
  );
};

/** 아직 아무도 누르지 않았으면 고르기 버튼만 보인다 */
export const Empty: Story = () => (
  <ReactionBar counts={{}} mine={null} onToggle={() => {}} />
);

/** 비로그인 — 읽기는 공개, 누르기는 막힌다 */
export const SignedOut: Story = () => (
  <ReactionBar counts={{ like: 3, insightful: 2 }} mine={null} disabled onToggle={() => {}} />
);
