/**
 * 컴포넌트 전반이 공유하는 UI 타입.
 * 개별 컴포넌트에만 쓰이는 타입은 그 폴더의 `{Name}.types.ts` 에 둔다.
 */

/** 컴포넌트 크기 단계. 세 단계 이상으로 늘리지 않는다 — 늘어나면 조합이 폭발한다. */
export type Size = 'sm' | 'md' | 'lg';

/**
 * 의미 색상(tone). 디자인 토큰의 상태 색과 1:1 대응한다.
 * → docs/25-design/02-tokens.md
 */
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

/** 상태를 나타내는 tone 만 (neutral/brand 제외) — Banner 등 상태 전용 컴포넌트가 쓴다 */
export type StatusTone = Extract<Tone, 'success' | 'warning' | 'danger' | 'info'>;
