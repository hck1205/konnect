'use client';

import { Badge } from '@/components/primitives/Badge';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import { time } from '@/utils';
import { freshnessToTone } from '@/components/feedback/Banner';
import { useHydrated } from '@/hooks';
import { TONE_ICON } from '@/lib/tone';

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

  /**
   * ⚠️ 예전에는 하이드레이션 전 `months = 0` 으로 접었다. 주석은 "중립" 이라고
   * 적었지만 `freshnessToTone(0)` 은 **`success`(초록 · 확인됨)** 다.
   *
   * 그 결과 **5년 된 문서가 서버 렌더와 첫 페인트에서 초록 "확인됨" 으로 보인다.**
   * 그리고 JS 없는 사용자와 크롤러에게는 **그게 최종 상태다.**
   * 이 제품의 R1 리스크가 정보가 오래되는 것인데, 모르는 것을 가장 안심시키는
   * 값으로 채우고 있었다.
   *
   * 모를 때는 `neutral` 이다 — 초록도 빨강도 아닌, 판정 전이라는 뜻.
   */
  const months = hydrated ? time.monthsBetween(lastVerifiedAt, new Date()) : null;
  // 아이콘도 tone 매핑을 따른다 — 화면마다 다르면 학습된 의미가 깨진다.
  // 판정 전에는 **아이콘도 없다** — 상태 아이콘 셋은 전부 판정을 뜻하기 때문이다.
  const Icon = months === null ? null : TONE_ICON[freshnessToTone(months)];

  return (
    <Badge
      tone={months === null ? 'neutral' : freshnessToTone(months)}
      icon={Icon ? <Icon className="size-3" /> : undefined}
      className={className}
    >
      Verified <RelativeTime value={lastVerifiedAt} />
    </Badge>
  );
}
