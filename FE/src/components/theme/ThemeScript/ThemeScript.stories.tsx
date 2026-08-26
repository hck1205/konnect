import type { Story } from '@ladle/react';
import { ThemeScript } from './ThemeScript';

export default { title: 'Theme / ThemeScript' };

/**
 * 렌더 결과가 없는 컴포넌트다 — `<script>` 하나를 내보낸다.
 *
 * 왜 필요한가: React 하이드레이션 **전에** `.dark` 를 붙이지 않으면 첫 페인트가
 * 라이트로 나갔다가 다크로 바뀌어 화면이 번쩍인다. 다크를 쓰는 사용자에게는
 * 페이지 이동마다 흰 섬광이 된다.
 *
 * `next/script` 의 afterInteractive 나 useEffect 로는 늦다 — **동기 인라인 스크립트**여야 한다.
 */
export const WhatItRenders: Story = () => (
  <div className="max-w-2xl text-sm text-fg-muted">
    <p className="mb-3">
      아래는 실제로 문서에 삽입되는 스크립트다(스토리에서도 동작한다):
    </p>
    <ThemeScript />
    <pre className="overflow-x-auto rounded-md bg-surface-sunken p-3 font-mono text-xs">
      {`(function(){try{
  var t = localStorage.getItem("konnect:theme");
  var d = t === "dark" || ((!t || t === "system") &&
          matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", d)
}catch(e){}})()`}
    </pre>
    <p className="mt-3">
      키와 클래스명은 상수에서 주입한다 — store 와 갈라지면 첫 페인트가 어긋난다.
    </p>
  </div>
);
