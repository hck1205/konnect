import type { StatusTone } from '@/types/ui';
import type { RiskLevel } from './Banner.types';

/**
 * 위험 등급 → tone 매핑.
 *
 * R3 는 배너를 띄우지 않는다(null). 모든 글에 배너가 붙으면 아무도 안 읽는다 —
 * R1 배너가 실제로 눈에 띄어야 정책이 작동한다.
 */
export function riskToTone(level: RiskLevel): StatusTone | null {
  if (level === 'R1') return 'danger';
  if (level === 'R2') return 'warning';
  return null;
}

/**
 * 최신성(마지막 확인일) → tone.
 *
 * 가이드의 가장 큰 위험은 절차가 바뀌었는데 문서가 그대로 남는 것이다.
 * → docs/20-product/10-features/03-guides-wiki.md
 */
export function freshnessToTone(monthsSinceVerified: number): StatusTone {
  if (monthsSinceVerified < 6) return 'success';
  if (monthsSinceVerified < 12) return 'warning';
  return 'danger';
}
