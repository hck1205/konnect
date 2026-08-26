import { cn } from '@/lib/cn';
import { TONE_FILL } from '@/lib/tone';
import type { Tone } from '@/types/ui';

export interface StatusDotProps {
  tone?: Tone;
  /**
   * 이 점이 뜻하는 상태. **필수** — 점만으로는 아무 의미도 전달되지 않는다.
   * 옆에 같은 뜻의 텍스트가 이미 있으면 `decorative` 를 쓴다.
   */
  label: string;
  /** 옆에 텍스트가 이미 있어 점은 장식일 때 */
  decorative?: boolean;
  className?: string;
}

/**
 * 상태 점.
 *
 * **색만으로 상태를 전달하지 않는다.** 점 자체는 색뿐이라, 접근 가능한 이름을
 * 필수로 받고 옆에 텍스트가 없으면 그 이름이 읽히게 한다.
 * 색각 이상 사용자에게 초록 점과 빨강 점은 같은 회색 점이다.
 * → docs/25-design/10-foundations/07-accessibility.md
 */
export function StatusDot({ tone = 'neutral', label, decorative, className }: StatusDotProps) {
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      title={label}
      className={cn('inline-block size-2 shrink-0 rounded-full', TONE_FILL[tone], className)}
    />
  );
}
