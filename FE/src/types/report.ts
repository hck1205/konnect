/** 신고 사유 코드 — 서버와 공유하는 계약이다 */
export type ReportReason =
  | 'scam'
  | 'personal-info'
  | 'harassment'
  | 'illegal'
  | 'spam'
  | 'other';

/**
 * 처리 트랙.
 *
 * **긴급**은 피해가 진행 중일 수 있는 것 — 사기와 개인정보 노출이다.
 * 일반 신고와 같은 큐에 두면 묻힌다.
 * → docs/20-product/10-features/07-moderation-and-reporting.md
 */
export type ReportTrack = 'urgent' | 'normal';

export interface ReportSubmission {
  reason: ReportReason;
  detail: string;
  track: ReportTrack;
}
