/** 사용자가 고를 수 있는 값. `system` 은 OS 설정을 따른다는 뜻이다. */
export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

/** 실제로 화면에 적용되는 값 — `system` 이 해석된 결과 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * localStorage 키. **ThemeScript 의 인라인 스크립트와 반드시 같아야 한다** —
 * 갈라지면 첫 페인트는 라이트, 하이드레이션 후 다크가 되어 화면이 번쩍인다.
 */
export const THEME_STORAGE_KEY = 'konnect:theme';

/** 다크를 켜는 클래스. globals.css 의 `.dark` 셀렉터와 같아야 한다. */
export const DARK_CLASS = 'dark';
