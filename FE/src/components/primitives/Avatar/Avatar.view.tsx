import { cn } from '@/lib/cn';
import type { Size } from '@/types/ui';

const SIZE: Record<Size, string> = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-12 text-base',
};

/**
 * 이니셜 배경색 팔레트.
 * 전부 subtle 토큰이라 그 위의 `*-on-subtle` 텍스트가 AA 를 만족한다
 * (대비는 check:contrast 가 검증하는 조합과 동일하다).
 */
export const AVATAR_TONES = [
  'bg-brand-subtle text-brand-on-subtle',
  'bg-success-subtle text-success-on-subtle',
  'bg-info-subtle text-info-on-subtle',
  'bg-warning-subtle text-warning-on-subtle',
  'bg-danger-subtle text-danger-on-subtle',
  'bg-surface-sunken text-fg-muted',
] as const;

interface AvatarViewProps {
  name: string;
  src?: string | null;
  initials: string;
  toneIndex: number;
  size: Size;
  className?: string;
}

export function AvatarView({
  name,
  src,
  initials,
  toneIndex,
  size,
  className,
}: AvatarViewProps) {
  const base = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium select-none',
    SIZE[size],
    className,
  );

  if (src) {
    return (
      // 아바타 옆에는 거의 항상 이름 텍스트가 함께 있다 → alt 를 비워
      // 스크린리더가 같은 이름을 두 번 읽지 않게 한다.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={cn(base, 'object-cover')} />
    );
  }

  return (
    <span className={cn(base, AVATAR_TONES[toneIndex])} title={name}>
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}
