import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import type { Tone } from '@/types/ui';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-sunken text-fg-muted',
        brand: 'bg-brand-subtle text-brand-on-subtle',
        success: 'bg-success-subtle text-success-on-subtle',
        warning: 'bg-warning-subtle text-warning-on-subtle',
        danger: 'bg-danger-subtle text-danger-on-subtle',
        info: 'bg-info-subtle text-info-on-subtle',
      } satisfies Record<Tone, string>,
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps {
  tone?: Tone;
  /** 앞에 붙는 아이콘. **색만으로 상태를 구분하지 않기 위해** 상태 배지에는 권장한다. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * 짧은 상태/분류 라벨.
 *
 * 상태를 나타낼 때는 색과 함께 아이콘이나 명확한 텍스트를 둔다 —
 * 색각 이상 사용자에게 색은 정보가 아니다.
 * → docs/25-design/10-foundations/07-accessibility.md
 */
export function Badge({ tone, icon, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
