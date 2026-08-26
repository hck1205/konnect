'use client';

import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/primitives/Badge';
import { RelativeTime, monthsBetween } from '@/components/data-display/RelativeTime';
import { freshnessToTone } from '@/components/feedback/Banner';
import { useHydrated } from '@/hooks';
import type { StatusTone } from '@/types/ui';

const ICON: Record<StatusTone, typeof Clock> = {
  success: CheckCircle2,
  warning: Clock,
  danger: AlertTriangle,
  info: Clock,
};

export interface FreshnessIndicatorProps {
  /** 마지막으로 "아직 유효함"이 확인된 시각 */
  lastVerifiedAt: string | Date;
  className?: string;
}

/**
 * 콘텐츠 최신성 표시.
 *
 * 가이드의 **가장 큰 위험은 오래되는 것**이다 — 절차는 바뀌는데 문서는 그대로 남는다.
 * 그래서 최신성은 숨은 메타데이터가 아니라 화면에 항상 보이는 상태여야 한다.
 * → docs/20-product/10-features/03-guides-wiki.md
 *
 * 등급 매핑은 `Banner.freshnessToTone`(테스트됨)을 재사용한다 —
 * 배너와 배지가 서로 다른 기준을 쓰면 같은 문서가 두 가지 상태로 보인다.
 */
export function FreshnessIndicator({
  lastVerifiedAt,
  className,
}: FreshnessIndicatorProps) {
  const hydrated = useHydrated();
  // 서버·첫 렌더에서는 "지금"을 알 수 없다 → 중립으로 두고 하이드레이션 후 판정한다
  const months = hydrated ? monthsBetween(lastVerifiedAt, new Date()) : 0;
  const tone = freshnessToTone(months);
  const Icon = ICON[tone];

  return (
    <Badge tone={tone} icon={<Icon className="size-3" />} className={className}>
      Verified <RelativeTime value={lastVerifiedAt} />
    </Badge>
  );
}
