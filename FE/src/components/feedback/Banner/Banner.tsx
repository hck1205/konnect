import { cn } from '@/lib/cn';
import { TONE_ICON, TONE_SUBTLE } from '@/lib/tone';
import { CloseButton } from '@/components/primitives/CloseButton';
import type { BannerProps } from './Banner.types';

/**
 * 상태 배너 — 고지·경고·안내.
 *
 * konnect 에서 이 컴포넌트의 주 용도는 **R1 콘텐츠 고지**다
 * (비자·주거·취업처럼 틀린 정보가 실제 피해로 이어지는 영역).
 * 그래서 페이지 하단이 아니라 **본문 가까이** 배치하는 것을 전제로 만들었다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * 색과 아이콘 매핑은 `lib/tone` 이 단일 출처다 — 화면마다 다른 아이콘을 쓰면
 * 학습된 의미가 깨진다.
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
        TONE_SUBTLE[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />

      <div className="flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && 'mt-1')}>{children}</div>
      </div>

      {onDismiss ? (
        <CloseButton label="Dismiss" onClick={onDismiss} className="-mr-1 shrink-0" />
      ) : null}
    </div>
  );
}
