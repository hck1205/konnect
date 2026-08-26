import type { MessageKey } from '@/lib/i18n';

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

export interface ReportReasonDef {
  value: ReportReason;
  labelKey: MessageKey;
  /** 어떤 경우인지 예를 드는 보조 설명. 판단이 헷갈리는 사유에만 붙인다. */
  hintKey?: MessageKey;
  track: ReportTrack;
}

/** 화면 순서 = 긴급한 것부터. 급한 사용자가 아래로 스크롤하지 않아도 된다. */
export const REPORT_REASONS: readonly ReportReasonDef[] = [
  { value: 'scam', labelKey: 'report.reason.scam', hintKey: 'report.reason.scamHint', track: 'urgent' },
  {
    value: 'personal-info',
    labelKey: 'report.reason.personalInfo',
    hintKey: 'report.reason.personalInfoHint',
    track: 'urgent',
  },
  { value: 'harassment', labelKey: 'report.reason.harassment', track: 'urgent' },
  { value: 'illegal', labelKey: 'report.reason.illegal', track: 'normal' },
  { value: 'spam', labelKey: 'report.reason.spam', track: 'normal' },
  { value: 'other', labelKey: 'report.reason.other', track: 'normal' },
];

export interface ReportSubmission {
  reason: ReportReason;
  detail: string;
  track: ReportTrack;
}
