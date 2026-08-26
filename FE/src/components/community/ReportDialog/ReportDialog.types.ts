import type { MessageKey } from '@/lib/i18n';

import type { ReportReason, ReportTrack } from '@/types';

export type { ReportReason, ReportTrack, ReportSubmission } from '@/types';

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

