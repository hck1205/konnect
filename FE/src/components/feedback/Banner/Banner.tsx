import { AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StatusTone } from '@/types/ui';
import type { BannerProps } from './Banner.types';

const TONE_CLASS: Record<StatusTone, string> = {
  success: 'bg-success-subtle text-success-on-subtle',
  warning: 'bg-warning-subtle text-warning-on-subtle',
  danger: 'bg-danger-subtle text-danger-on-subtle',
  info: 'bg-info-subtle text-info-on-subtle',
};

/**
 * tone 별 고정 아이콘.
 * 색만으로 상태를 구분하지 않기 위한 것이다 — 색각 이상 사용자에게 색은 정보가 아니다.
 * → docs/25-design/10-foundations/06-iconography.md
 */
const TONE_ICON: Record<StatusTone, typeof Info> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertOctagon,
  info: Info,
};

/**
 * 상태 배너 — 고지·경고·안내.
 *
 * konnect 에서 이 컴포넌트의 주 용도는 **R1 콘텐츠 고지**다
 * (비자·주거·취업처럼 틀린 정보가 실제 피해로 이어지는 영역).
 * 그래서 페이지 하단이 아니라 **본문 가까이** 배치하는 것을 전제로 만들었다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * `role`: danger/warning 은 `alert`, 나머지는 `status`.
 * 정적으로 렌더된 고지에 `alert` 를 남발하면 스크린리더가 페이지 진입마다 끼어든다.
 */
export function Banner({
  tone = 'info',
  title,
  children,
  onDismiss,
  className,
}: BannerProps) {
  const Icon = TONE_ICON[tone];

  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-lg px-4 py-3 text-sm',
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

      <div className="flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && 'mt-1')}>{children}</div>
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 cursor-pointer rounded-sm p-1 opacity-70 hover:opacity-100"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
