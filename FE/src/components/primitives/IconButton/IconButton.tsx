import { cn } from '@/lib/cn';
import { Button } from '@/components/primitives/Button';
import type { ButtonProps } from '@/components/primitives/Button';
import type { Size } from '@/types/ui';

/** 정사각 히트 영역 — 가로 패딩을 없애고 너비를 높이에 맞춘다 */
const SQUARE: Record<Size, string> = {
  sm: 'w-8 px-0',
  md: 'w-10 px-0',
  lg: 'w-12 px-0',
};

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd'> {
  /** 아이콘 노드. 장식이므로 내부에서 `aria-hidden` 처리된다. */
  icon: React.ReactNode;
  /**
   * **필수.** 스크린리더가 읽을 이름.
   * 아이콘만으로는 의미가 전달되지 않는다 — 아이콘의 의미는 문화권마다 다르고,
   * konnect 사용자는 다양한 국적에서 온다.
   * → docs/25-design/10-foundations/06-iconography.md
   */
  label: string;
}

/**
 * 아이콘 전용 버튼.
 *
 * `Button` 을 감싸되 `label` 을 **타입으로 강제**한다. 접근 가능한 이름을 빠뜨리는 것이
 * 아이콘 버튼의 가장 흔한 사고라, 규칙을 문서가 아니라 타입에 둔다.
 */
export function IconButton({
  icon,
  label,
  size = 'md',
  tone = 'neutral',
  variant = 'ghost',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      size={size}
      tone={tone}
      variant={variant}
      aria-label={label}
      title={label}
      className={cn(SQUARE[size], className)}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </Button>
  );
}
