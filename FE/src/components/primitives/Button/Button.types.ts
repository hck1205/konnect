import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Size } from '@/types/ui';

/** 버튼의 시각적 강도. 한 화면에 solid 는 하나(주요 행동)만 두는 것을 원칙으로 한다. */
export type ButtonVariant = 'solid' | 'outline' | 'subtle' | 'ghost';

/** 버튼이 쓰는 tone. 전체 Tone 중 버튼에 의미가 있는 것만 추린다. */
export type ButtonTone = 'brand' | 'neutral' | 'danger';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: Size;
  /** 진행 중 표시. 스피너를 띄우고 클릭을 막는다(aria-busy 도 함께 세팅). */
  loading?: boolean;
  /** 로딩 중 스크린리더에 읽힐 문구 */
  loadingLabel?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}
