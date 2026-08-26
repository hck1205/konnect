import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

/**
 * 버튼 클래스 조합.
 *
 * 색은 **semantic 토큰만** 쓴다(`bg-brand-solid` 등). primitive(`bg-teal-700`)를
 * 직접 쓰면 다크에서 뒤집히지 않는다 → docs/25-design/02-tokens.md
 *
 * variant × tone 조합은 compoundVariants 로 **명시적으로만** 정의한다.
 * 정의하지 않은 조합은 색이 비게 되는데, 그게 "이 조합은 쓰지 않는다"의 표현이다.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-medium',
    'transition-colors duration-150',
    // 포커스링은 전역 :focus-visible 이 처리한다. 여기서 지우지 않는다.
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border bg-transparent',
        subtle: '',
        ghost: 'bg-transparent',
      },
      tone: { brand: '', neutral: '', danger: '' },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    compoundVariants: [
      // ── solid — 화면당 하나. 흰(다크에선 어두운) 글자 대비를 검증했다.
      {
        variant: 'solid',
        tone: 'brand',
        class: 'bg-brand-solid text-fg-on-solid hover:bg-brand-solid-hover',
      },
      {
        variant: 'solid',
        tone: 'danger',
        class: 'bg-danger text-fg-on-solid hover:opacity-90',
      },
      {
        variant: 'solid',
        tone: 'neutral',
        class: 'bg-fg text-surface hover:opacity-90',
      },

      // ── outline — 보조 행동. 경계가 의미이므로 border-interactive 를 쓴다.
      {
        variant: 'outline',
        tone: 'brand',
        class: 'border-brand text-brand hover:bg-brand-subtle',
      },
      {
        variant: 'outline',
        tone: 'danger',
        class: 'border-danger text-danger hover:bg-danger-subtle',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        class: 'border-border-interactive text-fg hover:bg-surface-sunken',
      },

      // ── subtle — 틴트 배경. 목록 안 반복되는 행동에 적합하다.
      {
        variant: 'subtle',
        tone: 'brand',
        class: 'bg-brand-subtle text-brand-on-subtle hover:opacity-80',
      },
      {
        variant: 'subtle',
        tone: 'danger',
        class: 'bg-danger-subtle text-danger-on-subtle hover:opacity-80',
      },
      {
        variant: 'subtle',
        tone: 'neutral',
        class: 'bg-surface-sunken text-fg hover:opacity-80',
      },

      // ── ghost — 배경 없음. 아이콘 버튼·툴바용.
      {
        variant: 'ghost',
        tone: 'brand',
        class: 'text-brand hover:bg-brand-subtle',
      },
      {
        variant: 'ghost',
        tone: 'danger',
        class: 'text-danger hover:bg-danger-subtle',
      },
      {
        variant: 'ghost',
        tone: 'neutral',
        class: 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      tone: 'brand',
      size: 'md',
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
