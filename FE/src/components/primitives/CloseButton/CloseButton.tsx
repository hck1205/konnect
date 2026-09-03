import { X } from 'lucide-react';
import { IconButton } from '@/components/primitives/IconButton';
import type { IconButtonProps } from '@/components/primitives/IconButton';

export interface CloseButtonProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /**
   * 무엇을 닫는지. **필수다** — 기본값을 두면 부르는 쪽이 아무것도 안 해도
   * 화면이 그려지고, 그 화면은 모든 로케일에서 영어가 된다.
   */
  label: string;
}

/**
 * 닫기 버튼.
 *
 * Banner·Modal·Drawer·Toast 가 전부 같은 X 버튼을 갖는데, 각자 만들면
 * 아이콘 크기·레이블·hover 가 조금씩 갈라진다. 한 곳으로 모은다.
 *
 * `label` 은 필수다. 한 화면에 닫기 버튼이 여럿이면 **무엇을 닫는지** 넣는다 —
 * 스크린리더 사용자가 버튼 목록만 훑을 때 같은 이름이 세 개면 구분할 수 없다.
 */
/**
 * `label` 에 기본값을 두지 않는다.
 *
 * 기본값이 있으면 부르는 쪽이 아무것도 안 해도 화면이 그려지고,
 * **그 화면은 모든 로케일에서 영어다.** 기본값을 없애면 타입체크가
 * 부르는 쪽에 번역을 요구한다 — `AppShell` 의 `asideLabel` 과 같은 규칙이다.
 */
export function CloseButton({ label, size = 'sm', ...rest }: CloseButtonProps) {
  return <IconButton icon={<X className="size-4" />} label={label} size={size} {...rest} />;
}
