'use client';

import { useI18n } from '@/lib/i18n';
import { Banner } from '@/components/feedback/Banner';

/**
 * 신선도 고지.
 *
 * **비자 정보에서 "언제 기준인지 모르는 답"은 없는 것만 못하다.** 제도는 자주
 * 바뀌는데 답변은 몇 년씩 남는다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * 세 가지가 의도다:
 *
 * 1. `onDismiss` 를 주지 않는다 — **R1 고지는 닫히면 안 된다**(Banner 규약)
 * 2. **상대 시각이 아니라 절대 날짜**를 쓴다. "3주 전"보다 "2026년 8월 5일"이
 *    낡음을 독자가 직접 판단하게 해 준다. 그리고 상대 시각은 "지금"이 필요해
 *    SSR 과 클라이언트가 어긋난다(`RelativeTime` 이 하이드레이션 후에야 판정하는 이유)
 * 3. 배너를 직접 만들지 않는다 — tone·아이콘 매핑이 화면마다 달라지면
 *    학습된 의미가 깨진다
 */
export function FreshnessNotice({ updatedAt }: { updatedAt: string }) {
  const { t, formatDate } = useI18n();

  return (
    <Banner
      tone="warning"
      title={t('question.freshness', { when: formatDate(updatedAt) })}
    >
      {t('question.freshnessWarning')}
    </Banner>
  );
}
