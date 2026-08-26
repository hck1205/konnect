import type { Story } from '@ladle/react';
import { FreshnessIndicator } from './FreshnessIndicator';

export default { title: 'Data display / FreshnessIndicator' };

const MONTH = 30 * 24 * 60 * 60 * 1000;
// 렌더 중 Date.now() 금지 — 모듈 로드 시 한 번만 계산한다
const LOADED_AT = Date.now();
const monthsAgo = (n: number) => new Date(LOADED_AT - n * MONTH).toISOString();

/**
 * 가이드의 **가장 큰 위험은 오래되는 것**이다 — 절차는 바뀌는데 문서는 그대로 남는다.
 * 그래서 최신성은 숨은 메타데이터가 아니라 항상 보이는 상태여야 한다.
 *
 * 등급 기준은 `Banner.freshnessToTone`(테스트됨)을 재사용한다 —
 * 배너와 배지가 다른 기준을 쓰면 같은 문서가 두 상태로 보인다.
 */
export const Stages: Story = () => (
  <div className="flex flex-col items-start gap-3">
    <FreshnessIndicator lastVerifiedAt={monthsAgo(1)} />
    <FreshnessIndicator lastVerifiedAt={monthsAgo(8)} />
    <FreshnessIndicator lastVerifiedAt={monthsAgo(20)} />
  </div>
);
