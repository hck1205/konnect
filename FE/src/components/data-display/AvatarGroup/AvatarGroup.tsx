import { cn } from '@/lib/cn';
import { Avatar } from '@/components/primitives/Avatar';
import type { Size } from '@/types/ui';

export interface AvatarGroupProps {
  names: readonly string[];
  /** 이 개수까지만 보여주고 나머지는 "+N" 으로 접는다 */
  max?: number;
  size?: Size;
  /** 이 그룹이 무엇인지 ("Answered by") */
  label: string;
  className?: string;
}

const OVERLAP: Record<Size, string> = {
  sm: '-ms-1.5',
  md: '-ms-2',
  lg: '-ms-3',
};

/**
 * 겹쳐 놓은 아바타 묶음.
 *
 * `<ul>` 이다 — 사람 목록이지 장식이 아니다. 스크린리더가 "3개 항목 목록"으로 읽는다.
 * 접힌 인원수는 **텍스트로** 남긴다("+5 more") — 숫자만 보여주고 끝내면
 * 그게 무슨 숫자인지 알 수 없다.
 */
export function AvatarGroup({
  names,
  max = 4,
  size = 'sm',
  label,
  className,
}: AvatarGroupProps) {
  const shown = names.slice(0, max);
  const hidden = names.length - shown.length;

  return (
    <ul aria-label={label} className={cn('flex items-center', className)}>
      {shown.map((name, i) => (
        <li key={`${name}-${i}`} className={cn(i > 0 && OVERLAP[size])}>
          {/* ring 으로 아바타 사이 경계를 만든다 — 겹쳤을 때 구분된다 */}
          <Avatar name={name} size={size} className="ring-2 ring-surface" />
        </li>
      ))}
      {hidden > 0 ? (
        <li className={cn(OVERLAP[size], 'ps-3')}>
          <span className="text-xs text-fg-muted">+{hidden} more</span>
        </li>
      ) : null}
    </ul>
  );
}
