import { REPORT_REASONS, type ReportReason, type ReportTrack } from './ReportDialog.types';

/**
 * 사유 → 처리 트랙.
 *
 * 클라이언트가 정한 트랙은 **참고값이다** — 서버가 다시 판정해야 한다.
 * 여기서 계산하는 이유는 사용자에게 "먼저 검토됩니다"를 즉시 보여주기 위해서다.
 */
export function trackFor(reason: ReportReason): ReportTrack {
  return REPORT_REASONS.find((r) => r.value === reason)?.track ?? 'normal';
}

/** 긴급 트랙인 사유 목록 — 화면에서 위쪽에 배치한다 */
export function urgentReasons(): ReportReason[] {
  return REPORT_REASONS.filter((r) => r.track === 'urgent').map((r) => r.value);
}
