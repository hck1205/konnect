'use client';

import { SmilePlus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Popover } from '@/components/overlays/Popover';
import { activeReactions, totalReactions } from './ReactionBar.utils';
import {
  REACTIONS,
  REACTION_KINDS,
  type ReactionCounts,
  type ReactionKind,
} from './ReactionBar.types';

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
 * 이모지 공감 표시.
 *
 * 종류는 **고정 어휘**다 — 임의 이모지를 허용하면 집계가 무의미해지고,
 * 문화권마다 뜻이 다른 이모지가 섞인다(다국적 사용자에게 특히 위험하다).
 *
 * 이모지 옆에 **번역된 이름**이 함께 읽힌다. 이모지만으로는 의미가 전달되지 않고,
 * 스크린리더는 이모지를 제조사별로 다르게 읽는다.
 *
 * 한 사람이 하나만 고른다(→ `toggleReaction`). 고르는 UI 는 Popover 라
 * **열림 상태 JS 가 없다**.
 */
export function ReactionBar({
  counts,
  mine,
  onToggle,
  disabled,
  className,
}: ReactionBarProps) {
  const { t, formatNumber } = useI18n();
  const active = activeReactions(counts);
  const total = totalReactions(counts);

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {/* 이미 눌린 종류 — 누르면 바로 토글된다 */}
      {active.map((kind) => {
        const isMine = mine === kind;
        const name = t(REACTIONS[kind].labelKey);
        return (
          <button
            key={kind}
            type="button"
            disabled={disabled}
            aria-pressed={isMine}
            onClick={() => onToggle(kind)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors duration-150',
              isMine
                ? 'border-brand bg-brand-subtle text-brand-on-subtle'
                : 'border-border text-fg-muted hover:border-border-strong',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <span aria-hidden="true">{REACTIONS[kind].emoji}</span>
            <span className="tabular-nums">{formatNumber(counts[kind] ?? 0)}</span>
            {/* 이모지 대신 읽힐 이름 */}
            <span className="sr-only">
              {name}
              {isMine ? ` — ${t('reaction.byYou', { name })}` : ''}
            </span>
          </button>
        );
      })}

      {/* 고르기 — Popover API */}
      <Popover
        className="w-auto"
        trigger={(p) => (
          <button
            {...p}
            type="button"
            disabled={disabled}
            aria-label={t('reaction.add')}
            className={cn(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-border text-fg-subtle',
              'hover:border-border-strong hover:text-fg',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <SmilePlus className="size-3.5" aria-hidden="true" />
          </button>
        )}
      >
        <div className="flex gap-0.5">
          {REACTION_KINDS.map((kind) => {
            const name = t(REACTIONS[kind].labelKey);
            return (
              <button
                key={kind}
                type="button"
                onClick={() => onToggle(kind)}
                aria-pressed={mine === kind}
                title={name}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-0.5 rounded-md px-2 py-1.5 hover:bg-surface-sunken',
                  mine === kind && 'bg-brand-subtle',
                )}
              >
                <span aria-hidden="true" className="text-lg">
                  {REACTIONS[kind].emoji}
                </span>
                <span className="text-[10px] text-fg-muted">{name}</span>
              </button>
            );
          })}
        </div>
      </Popover>

      {total > 0 ? (
        <span className="ms-1 text-xs text-fg-subtle">
          {t('reaction.count', { count: total })}
        </span>
      ) : null}
    </div>
  );
}
