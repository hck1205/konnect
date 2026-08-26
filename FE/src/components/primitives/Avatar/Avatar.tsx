import { AVATAR_TONES, AvatarView } from './Avatar.view';
import { toColorIndex, toInitials } from './Avatar.utils';
import type { AvatarProps } from './Avatar.types';

/**
 * 사용자 아바타.
 *
 * 이미지가 없으면 이니셜 + 이름에서 파생한 안정적인 색으로 대체한다
 * (같은 사람은 언제나 같은 색이라 목록에서 사람을 알아볼 수 있다).
 *
 * business/view 를 나눈 이유: 이니셜·색 계산이 **테스트 가능한 순수 로직**이라
 * 마크업과 분리해 둔다.
 */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <AvatarView
      name={name}
      src={src}
      initials={toInitials(name)}
      toneIndex={toColorIndex(name, AVATAR_TONES.length)}
      size={size}
      className={className}
    />
  );
}
