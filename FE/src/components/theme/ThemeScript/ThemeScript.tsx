import { DARK_CLASS, THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * FOUC 방지용 blocking 스크립트.
 *
 * React 하이드레이션 **전에** `.dark` 클래스를 붙여야 한다. 그러지 않으면
 * 첫 페인트가 라이트로 나갔다가 하이드레이션 후 다크로 바뀌어 화면이 번쩍인다
 * (다크 모드를 쓰는 사용자에게는 매 페이지 이동마다 흰 섬광이 된다).
 *
 * 그래서 이건 **동기 인라인 스크립트**여야 한다. `next/script` 의 afterInteractive 나
 * useEffect 로는 늦는다.
 *
 * `<html>` 에는 `suppressHydrationWarning` 이 필요하다 — 이 스크립트가 서버 마크업에
 * 없던 클래스를 붙이기 때문이다.
 */
export function ThemeScript() {
  // 키와 클래스명을 상수에서 주입한다 — store 와 갈라지면 첫 페인트가 어긋난다
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle(${JSON.stringify(DARK_CLASS)},d)}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
