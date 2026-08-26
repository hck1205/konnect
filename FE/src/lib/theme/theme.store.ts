import {
  DARK_CLASS,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from './theme.constants';
import { isTheme, resolveTheme } from './theme.utils';

/**
 * 테마 외부 스토어.
 *
 * Provider 를 두지 않는 이유: 테마는 트리 어디서나 읽히지만 **거의 바뀌지 않는다**.
 * Context 로 감싸면 값이 바뀔 때 하위 전체가 리렌더된다. `useSyncExternalStore` 로
 * 구독하면 실제로 테마를 읽는 컴포넌트만 갱신된다.
 *
 * 또한 React 밖(인라인 ThemeScript)에서 이미 DOM 에 적용된 상태를 그대로 이어받는다.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

/** 서버 렌더 시점에는 DOM 이 없다 — 라이트를 기본값으로 둔다(스크립트가 곧 교정한다) */
let snapshot: { theme: Theme; resolved: ResolvedTheme } = {
  theme: 'system',
  resolved: 'light',
};

function readStoredTheme(): Theme {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(raw) ? raw : 'system';
  } catch {
    // 스토리지가 막힌 브라우저 — 시스템 설정으로 수렴
    return 'system';
  }
}

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** DOM 에 반영 — `.dark` 클래스가 globals.css 의 light-dark() 전환을 켠다 */
function applyToDocument(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle(DARK_CLASS, resolved === 'dark');
}

function emit() {
  for (const l of listeners) l();
}

function recompute() {
  const theme = readStoredTheme();
  const resolved = resolveTheme(theme, prefersDark());
  // 스냅샷은 **불변 객체로 교체**한다. useSyncExternalStore 가 참조 동일성으로 비교한다.
  if (snapshot.theme !== theme || snapshot.resolved !== resolved) {
    snapshot = { theme, resolved };
  }
  applyToDocument(resolved);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  // 첫 구독 시 DOM 의 실제 상태를 읽어 스냅샷을 맞춘다(ThemeScript 가 먼저 적용해 둔 값)
  recompute();

  // system 을 고른 사용자를 위해 OS 설정 변경도 따라간다
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onMediaChange = () => {
    recompute();
    emit();
  };
  media.addEventListener('change', onMediaChange);

  // 다른 탭에서 테마를 바꾸면 여기도 따라간다
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    recompute();
    emit();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener('change', onMediaChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function getSnapshot() {
  return snapshot;
}

/** SSR 스냅샷 — 서버에서는 항상 같은 값을 돌려줘야 한다(하이드레이션 불일치 방지) */
export function getServerSnapshot() {
  return snapshot;
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 스토리지 불가 — 이번 탭에서만 유지된다
  }
  const resolved = resolveTheme(theme, prefersDark());
  snapshot = { theme, resolved };
  applyToDocument(resolved);
  emit();
}
