'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, nextTheme, type Theme } from '@/lib/theme';
import { IconButton } from '@/components/primitives/IconButton';
import type { Size } from '@/types/ui';

const ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABEL: Record<Theme, string> = {
  light: 'Theme: light',
  dark: 'Theme: dark',
  system: 'Theme: follow system',
};

export interface ThemeToggleProps {
  size?: Size;
  className?: string;
}

/**
 * 라이트 / 다크 / 시스템을 순환하는 토글.
 *
 * 세 번째 상태(system)를 빼지 않는다 — OS 를 다크로 쓰면서 이 사이트만 라이트로 보고
 * 싶은 사용자와, OS 를 그대로 따르고 싶은 사용자는 서로 다른 요구다.
 *
 * 아이콘은 **현재 선택**을 보여준다(적용된 결과가 아니라). system 을 골랐는데
 * 달 아이콘이 보이면 자기가 무엇을 골랐는지 알 수 없다.
 */
export function ThemeToggle({ size = 'md', className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const Icon = ICON[theme];

  return (
    <IconButton
      icon={<Icon className="size-4" />}
      label={LABEL[theme]}
      size={size}
      className={className}
      onClick={() => setTheme(nextTheme(theme))}
    />
  );
}
