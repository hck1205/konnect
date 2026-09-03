import type { ReactNode } from 'react';
import type { StatusTone } from '@/types/ui';

export interface BannerProps {
  tone?: StatusTone;
  title?: ReactNode;
  children: ReactNode;
  /** 닫기 핸들러. 주면 닫기 버튼이 붙는다. **R1 고지는 닫히면 안 되므로 주지 않는다.** */
  onDismiss?: () => void;
  /**
   * 닫기 버튼의 접근 이름. `onDismiss` 를 줄 때 **함께 준다** —
   * 아이콘뿐인 버튼이라 이 문구가 유일한 단서다.
   *
   * 기본값을 두지 않는다. 두면 부르는 쪽이 아무것도 안 해도 화면이 그려지고
   * 그 화면은 모든 로케일에서 영어다.
   */
  dismissLabel?: string;
  className?: string;
}

/**
 * 콘텐츠 위험 등급 → 배너 tone.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */
export type RiskLevel = 'R1' | 'R2' | 'R3';
