'use client';

import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';

/**
 * 답변자 신뢰 신호.
 *
 * **국적을 상시 표시하지 않는다** — 차별의 축을 항상 노출하게 된다
 * ([ADR-0009](docs/50-decisions/0009-nationality-display-policy.md)).
 * 대신 신뢰에 실제로 더 잘 듣는 것을 보인다: **해당 경험 보유**와 체류 연차.
 */
export interface AuthorLineProps {
  nickname: string;
  /** "F-2 취득함" 같은 경험 배지 — 질문과 직접 대응하는 가장 강한 신호 */
  badges?: string[];
}

export function AuthorLine({ nickname, badges = [] }: AuthorLineProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={nickname} size="sm" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">{nickname}</span>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge} tone="brand">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
