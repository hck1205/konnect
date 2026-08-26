import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from 'lucide-react';
import type { StatusTone, Tone } from '@/types/ui';

/**
 * tone → 표현 매핑. **이 매핑의 단일 출처다.**
 *
 * Badge·Banner·Toast·StatusDot·Timeline 이 각자 `Record<Tone, string>` 을 갖고
 * 있었다. 새 tone 을 추가하거나 색 규칙을 바꿀 때 다섯 곳을 찾아 고쳐야 했고,
 * 실제로 조금씩 달랐다(어떤 곳은 `-subtle`, 어떤 곳은 실선 색).
 *
 * 세 가지 표현을 구분한다:
 * - `TONE_TEXT`   : 텍스트·아이콘 색 (배경 없음)
 * - `TONE_SUBTLE` : 틴트 배경 + 그 위 글자
 * - `TONE_SOLID`  : 채움 배경 + 그 위 글자
 *
 * 어느 조합이 WCAG 를 만족하는지는 `npm run check:contrast` 가 검증한다.
 */

export const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-fg-muted',
  brand: 'text-brand',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
};

export const TONE_SUBTLE: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-fg-muted',
  brand: 'bg-brand-subtle text-brand-on-subtle',
  success: 'bg-success-subtle text-success-on-subtle',
  warning: 'bg-warning-subtle text-warning-on-subtle',
  danger: 'bg-danger-subtle text-danger-on-subtle',
  info: 'bg-info-subtle text-info-on-subtle',
};

/** 배경으로 쓰는 실선 색 — 점·막대처럼 글자가 올라가지 않는 곳에만 */
export const TONE_FILL: Record<Tone, string> = {
  neutral: 'bg-fg-subtle',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

/**
 * 상태별 고정 아이콘.
 *
 * **색만으로 상태를 구분하지 않기 위한 것**이다 — 색각 이상 사용자에게
 * 초록과 빨강은 같은 회색이다. 그래서 아이콘도 한 곳에서 고정한다:
 * 화면마다 다른 아이콘을 쓰면 학습된 의미가 깨진다.
 * → docs/25-design/10-foundations/06-iconography.md
 */
export const TONE_ICON: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertOctagon,
  info: Info,
};
