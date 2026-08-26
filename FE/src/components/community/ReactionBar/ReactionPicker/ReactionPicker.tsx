import { SmilePlus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Popover } from '@/components/overlays/Popover';
import { REACTIONS, REACTION_KINDS, type ReactionKind } from '../ReactionBar.types';

export interface ReactionPickerProps {
  mine: ReactionKind | null;
  disabled?: boolean;
  onPick: (kind: ReactionKind) => void;
}

/**
 * 리액션 고르기.
 *
 * Popover API 라 **열림 상태를 위한 JS 가 없다** — 바깥 클릭과 Esc 를 브라우저가 처리한다.
 *
 * 이모지 아래에 이름을 함께 보여준다. 고르는 시점에 뜻이 분명해야 하고,
 * 이모지 뜻은 문화권마다 다르다 — 다국적 사용자를 대상으로 하는 서비스에서 특히.
 */
export function ReactionPicker({ mine, disabled, onPick }: ReactionPickerProps) {
  const { t } = useI18n();

  return (
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
              onClick={() => onPick(kind)}
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
  );
}
