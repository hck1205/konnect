import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { REACTIONS, type ReactionKind } from '../ReactionBar.types';

export interface ReactionChipProps {
  kind: ReactionKind;
  count: number;
  /** 내가 누른 것인지 — `aria-pressed` 로도 반영된다 */
  mine: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

/**
 * 이미 눌린 리액션 하나 — 누르면 바로 토글된다.
 *
 * 이모지 옆에 **번역된 이름**이 `sr-only` 로 붙는다. 이모지만으로는 의미가
 * 전달되지 않고, 스크린리더는 이모지를 제조사별로 다르게 읽는다.
 * → docs/20-product/10-features/08-reactions.md
 */
export function ReactionChip({ kind, count, mine, disabled, onToggle }: ReactionChipProps) {
  const { t, formatNumber } = useI18n();
  const name = t(REACTIONS[kind].labelKey);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={mine}
      onClick={onToggle}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors duration-150',
        mine
          ? 'border-brand bg-brand-subtle text-brand-on-subtle'
          : 'border-border text-fg-muted hover:border-border-strong',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <span aria-hidden="true">{REACTIONS[kind].emoji}</span>
      <span className="tabular-nums">{formatNumber(count)}</span>
      <span className="sr-only">
        {name}
        {mine ? ` — ${t('reaction.byYou', { name })}` : ''}
      </span>
    </button>
  );
}
