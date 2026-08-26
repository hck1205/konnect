import type { ReactNode } from 'react';
import type { StatusTone } from '@/types/ui';

export interface BannerProps {
  tone?: StatusTone;
  title?: ReactNode;
  children: ReactNode;
  /** 닫기 핸들러. 주면 닫기 버튼이 붙는다. **R1 고지는 닫히면 안 되므로 주지 않는다.** */
  onDismiss?: () => void;
  className?: string;
}

/**
 * 콘텐츠 위험 등급 → 배너 tone.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */
export type RiskLevel = 'R1' | 'R2' | 'R3';
