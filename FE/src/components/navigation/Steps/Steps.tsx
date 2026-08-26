import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { stepStatus } from './Steps.utils';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepsProps {
  /** 이 절차가 무엇인지 */
  label: string;
  items: readonly StepItem[];
  /** 현재 단계 인덱스(0부터). items.length 면 전부 완료. */
  current: number;
  className?: string;
}

/**
 * 단계 표시(스테퍼).
 *
 * `Timeline` 과의 차이: Timeline 은 **일어난 일의 기록**(과거·미래 포함),
 * Steps 는 **지금 진행 중인 절차**의 위치다. 폼 마법사·발행 흐름에 쓴다.
 *
 * `<ol>` + 현재 단계에 `aria-current="step"`. 완료 여부를 체크 아이콘과
 * **텍스트 양쪽**으로 알린다 — 색과 아이콘만으로는 부족하다.
 */
export function Steps({ label, items, current, className }: StepsProps) {
  return (
    <ol aria-label={label} className={cn('flex flex-wrap gap-x-2 gap-y-3', className)}>
      {items.map((item, i) => {
        const status = stepStatus(i, current);
        const isLast = i === items.length - 1;

        return (
          <li
            key={item.id}
            aria-current={status === 'current' ? 'step' : undefined}
            className="flex flex-1 items-start gap-2"
          >
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                status === 'complete' && 'bg-brand-solid text-fg-on-solid',
                status === 'current' && 'bg-brand-subtle text-brand-on-subtle ring-2 ring-brand',
                status === 'upcoming' && 'bg-surface-sunken text-fg-subtle',
              )}
            >
              {status === 'complete' ? <Check className="size-3.5" /> : i + 1}
            </span>

            <span className="flex min-w-0 flex-col">
              <span
                className={cn(
                  'text-sm',
                  status === 'upcoming' ? 'text-fg-subtle' : 'font-medium text-fg',
                )}
              >
                {item.label}
                {/* 상태를 텍스트로도 남긴다 */}
                <span className="sr-only">
                  {status === 'complete'
                    ? ' (completed)'
                    : status === 'current'
                      ? ' (current step)'
                      : ' (not started)'}
                </span>
              </span>
              {item.description ? (
                <span className="text-xs text-fg-subtle">{item.description}</span>
              ) : null}
            </span>

            {!isLast ? (
              <span aria-hidden="true" className="mt-3 hidden h-px flex-1 bg-border sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
