import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ProseProps {
  children: ReactNode;
  className?: string;
}

/**
 * 사용자가 쓴 본문(질문·답변·가이드)의 타이포그래피 컨테이너.
 *
 * 본문 안의 요소는 우리가 컴포넌트로 감쌀 수 없다 — 서버에서 온 HTML 이거나
 * 마크다운 렌더 결과다. 그래서 **자식 셀렉터로** 스타일을 준다.
 *
 * `@tailwindcss/typography` 를 쓰지 않는 이유: 그 플러그인은 자체 색 스케일을 갖는데,
 * 우리 semantic 토큰과 이중 관리가 된다(특히 다크 모드에서 어긋난다).
 * 필요한 요소만 우리 토큰으로 직접 정의하는 편이 작고 정확하다.
 *
 * 읽기 폭은 `Container width="prose"` 가 맡는다.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'text-base text-fg',
        // 문단 — 전역 text-wrap:pretty 가 이미 적용되어 있다
        '[&_p]:my-4',
        // 제목 — 앵커 이동 시 헤더에 가리지 않게 globals.css 가 scroll-margin 을 준다
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold',
        // 목록 — ::marker 색은 전역에서 이미 fg-subtle 이다
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6',
        '[&_li]:my-1',
        // 링크 — 색만이 아니라 밑줄로도 구분한다
        '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2',
        // 인용 — 개인 경험 블록에 쓴다
        '[&_blockquote]:my-4 [&_blockquote]:border-s-2 [&_blockquote]:border-border-strong [&_blockquote]:ps-4 [&_blockquote]:text-fg-muted',
        // 코드
        '[&_code]:rounded-sm [&_code]:bg-surface-sunken [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]',
        '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-sunken [&_pre]:p-3',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        // 이미지·표가 본문 폭을 넘지 않게
        '[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-md',
        '[&_hr]:my-8 [&_hr]:border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}
