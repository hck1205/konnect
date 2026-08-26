import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { StatusTone } from '@/types/ui';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  /** 시점 라벨 ("Before arrival", "T2") */
  marker?: ReactNode;
  description?: ReactNode;
  /** 강조가 필요한 단계(기한이 있는 단계 등) */
  tone?: StatusTone;
  /** 지나온 단계인지 */
  complete?: boolean;
}

export interface TimelineProps {
  /** 목록 이름 — 스크린리더용 */
  label: string;
  items: readonly TimelineItem[];
  className?: string;
}

const DOT_TONE: Record<StatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

/**
 * 순서가 있는 단계 표시.
 *
 * konnect 에서는 **체류 생애주기**(입국 전 → ARC → 정착 → 연장 → 전환)를 보여주는 데 쓴다.
 * 질문이 특정 사건 앞뒤에 몰리기 때문에, 사용자가 "지금 어느 단계인가"를 잡으면
 * 필요한 콘텐츠가 바로 좁혀진다.
 * → docs/10-domain/10-visa-immigration/02-lifecycle-and-events.md
 *
 * `<ol>` 이다 — 순서가 곧 의미다. 연결선은 `aria-hidden` 장식이다.
 */
export function Timeline({ label, items, className }: TimelineProps) {
  return (
    <ol aria-label={label} className={cn('relative flex flex-col', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* 세로 연결선 — 마지막 항목에는 그리지 않는다 */}
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute top-3 bottom-0 left-[5px] w-px bg-border"
              />
            ) : null}

            <span
              aria-hidden="true"
              className={cn(
                'relative mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-surface',
                item.tone
                  ? DOT_TONE[item.tone]
                  : item.complete
                    ? 'bg-brand-solid'
                    : 'bg-border-strong',
              )}
            />

            <div className="flex-1">
              {item.marker ? (
                <p className="text-xs font-medium text-fg-subtle">{item.marker}</p>
              ) : null}
              <p className={cn('text-sm', item.complete ? 'text-fg-muted' : 'text-fg font-medium')}>
                {item.title}
              </p>
              {item.description ? (
                <div className="mt-1 text-sm text-fg-muted">{item.description}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
