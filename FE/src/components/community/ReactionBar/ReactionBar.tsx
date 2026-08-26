'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { ReactionChip } from './ReactionChip';
import { ReactionPicker } from './ReactionPicker';
import { activeReactions, totalReactions } from './ReactionBar.utils';
import type { ReactionCounts, ReactionKind } from './ReactionBar.types';

export interface ReactionBarProps {
  counts: ReactionCounts;
  /** 내가 누른 리액션. 없으면 null. */
  mine: ReactionKind | null;
  onToggle: (kind: ReactionKind) => void;
  /** 비로그인이면 누를 수 없다(읽기는 공개다) */
  disabled?: boolean;
  className?: string;
}

/**
 * 이모지 공감 표시 — 조립만 한다.
 *
 * 두 가지 UI 가 한 줄에 있다: **이미 눌린 것**(`ReactionChip`)과
 * **고르기**(`ReactionPicker`). 성격이 달라 나눴다 —
 * 칩은 목록 렌더고 피커는 오버레이다.
 *
 * 종류는 고정 어휘다. 임의 이모지를 허용하면 집계가 무의미해지고,
 * 문화권마다 뜻이 다른 이모지가 섞인다.
 * → docs/20-product/10-features/08-reactions.md
 */
export function ReactionBar({ counts, mine, onToggle, disabled, className }: ReactionBarProps) {
  const { t } = useI18n();
  const active = activeReactions(counts);
  const total = totalReactions(counts);

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {active.map((kind) => (
        <ReactionChip
          key={kind}
          kind={kind}
          count={counts[kind] ?? 0}
          mine={mine === kind}
          disabled={disabled}
          onToggle={() => onToggle(kind)}
        />
      ))}

      <ReactionPicker mine={mine} disabled={disabled} onPick={onToggle} />

      {total > 0 ? (
        <span className="ms-1 text-xs text-fg-subtle">
          {t('reaction.count', { count: total })}
        </span>
      ) : null}
    </div>
  );
}
