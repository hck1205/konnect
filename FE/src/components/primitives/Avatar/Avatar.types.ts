import type { Size } from '@/types/ui';

export interface AvatarProps {
  /** 표시 이름. 이미지가 없을 때 이니셜과 색의 근거가 된다. */
  name: string;
  src?: string | null;
  size?: Size;
  className?: string;
}
