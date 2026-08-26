import { useI18n } from '@/lib/i18n';
import { Banner } from '@/components/feedback/Banner';

export interface SafetyNoticeProps {
  /** `alert` 로 띄울지 — 위험 신호를 감지했을 때만 */
  urgent?: boolean;
  className?: string;
}

/**
 * 쪽지 안전 고지.
 *
 * **`onDismiss` 를 받지 않는다.** 닫을 수 있으면 사용자가 첫 대화에서 닫고
 * 다시는 보지 않는데, 사기는 보통 **몇 번 대화가 오간 뒤에** 시작된다.
 * 그 시점에 고지가 화면에 있어야 한다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md 출시 조건 1
 *
 * 별도 컴포넌트로 뺀 이유: 대화 상단과 입력 위(위험 감지 시) 두 곳에서 쓰이고,
 * **문구가 한 곳에서만 관리되어야** 하기 때문이다.
 */
export function SafetyNotice({ urgent, className }: SafetyNoticeProps) {
  const { t } = useI18n();
  return (
    <Banner tone={urgent ? 'danger' : 'warning'} className={className}>
      {t('message.safety')}
    </Banner>
  );
}
