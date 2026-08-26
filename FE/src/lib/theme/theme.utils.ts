import { THEMES, type ResolvedTheme, type Theme } from './theme.constants';

/** 저장된 값이 우리가 아는 테마인지. 손상된 localStorage 값을 걸러낸다. */
export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

/**
 * 선택값 + 시스템 선호 → 실제 적용값.
 *
 * 순수 함수로 뺀 이유: "system 일 때만 시스템 선호를 본다"가 이 기능의 전부인데,
 * 그걸 컴포넌트 안에 두면 테스트하려고 matchMedia 를 흉내 내야 한다.
 */
export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme === 'system') return prefersDark ? 'dark' : 'light';
  return theme;
}

/** 다음 테마 — 토글 버튼이 순환시키는 순서 (light → dark → system → light) */
export function nextTheme(current: Theme): Theme {
  if (current === 'light') return 'dark';
  if (current === 'dark') return 'system';
  return 'light';
}
