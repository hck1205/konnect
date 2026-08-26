'use client';

import { useId, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TooltipTriggerProps {
  popoverTarget: string;
  popoverTargetAction: 'toggle';
  style: CSSProperties;
  'aria-describedby': string;
}

export interface TooltipProps {
  /** 툴팁 내용. **필수 정보를 여기에 두지 않는다** — 아래 주의 참고. */
  content: ReactNode;
  trigger: (props: TooltipTriggerProps) => ReactElement;
  className?: string;
}

const toAnchorName = (id: string) => `--tip-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

/**
 * 툴팁 — Popover API 기반(`popover="hint"` 대신 `auto` 를 쓴다).
 *
 * ⚠️ **필수 정보를 툴팁에 두지 않는다.**
 * 툴팁은 터치 기기에서 hover 가 없어 열기 어렵고, 화면 확대 시 잘리며,
 * 인지 부담을 늘린다. 꼭 필요한 설명은 `Field` 의 `description` 처럼 **항상 보이는 곳**에 둔다.
 * 툴팁은 "있으면 좋은 부연"에만 쓴다.
 * → docs/25-design/10-foundations/07-accessibility.md
 *
 * 트리거는 `aria-describedby` 로 툴팁을 가리키므로 스크린리더가 함께 읽는다.
 * hover 뿐 아니라 **클릭·키보드로도 열린다**(Popover API 가 처리) — hover 전용 툴팁은
 * 터치·키보드 사용자에게 존재하지 않는 것과 같다.
 */
export function Tooltip({ content, trigger, className }: TooltipProps) {
  const id = useId();
  const anchorName = toAnchorName(id);

  return (
    <>
      {trigger({
        popoverTarget: id,
        popoverTargetAction: 'toggle',
        'aria-describedby': id,
        style: { anchorName } as CSSProperties,
      })}
      <div
        id={id}
        popover="auto"
        role="tooltip"
        style={{ positionAnchor: anchorName } as CSSProperties}
        className={cn(
          'popover-anchored max-w-64 rounded-md border border-border bg-surface-overlay px-2.5 py-1.5 text-xs text-fg shadow-e2',
          className,
        )}
      >
        {content}
      </div>
    </>
  );
}
