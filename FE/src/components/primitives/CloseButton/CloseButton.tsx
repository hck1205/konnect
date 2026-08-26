import { X } from 'lucide-react';
import { IconButton } from '@/components/primitives/IconButton';
import type { IconButtonProps } from '@/components/primitives/IconButton';

export interface CloseButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /** 무엇을 닫는지. 화면에 닫기 버튼이 여럿일 때 구분된다. */
  label?: string;
}

/**
 * 닫기 버튼.
 *
 * Banner·Modal·Drawer·Toast 가 전부 같은 X 버튼을 갖는데, 각자 만들면
 * 아이콘 크기·레이블·hover 가 조금씩 갈라진다. 한 곳으로 모은다.
 *
 * `label` 기본값이 "Close" 지만, 한 화면에 닫기 버튼이 여럿이면
 * "Close filters" 처럼 **무엇을 닫는지** 넣는다 — 스크린리더 사용자가
 * 버튼 목록만 훑을 때 "Close" 가 세 개면 구분할 수 없다.
 */
export function CloseButton({ label = 'Close', size = 'sm', ...rest }: CloseButtonProps) {
  return <IconButton icon={<X className="size-4" />} label={label} size={size} {...rest} />;
}
