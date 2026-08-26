/**
 * 홈 페이지 — 프레젠테이셔널 레이어(상태 없음).
 *
 * 색은 semantic 토큰(bg-surface / text-fg-muted …)만 쓴다.
 * primitive(bg-teal-700 등) 직접 사용 금지 — docs/25-design/02-tokens.md
 */
export function HomeView() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-fg">konnect</h1>
      <p className="max-w-[70ch] text-lg text-fg-muted">
        A community for foreigners living, studying, working, and travelling in
        Korea.
      </p>
      <p className="text-sm text-fg-subtle">
        {/* 한국어 원문 병기 — 브라우저 번역기가 건드리면 안 된다(사용자가 실제
            서류에서 이 글자를 찾아야 한다). lang 은 스크린리더 발음을 위해 함께 둔다.
            → docs/25-design/10-foundations/08-native-platform.md */}
        Alien Registration Card (
        <span lang="ko" translate="no">
          외국인등록증
        </span>
        )
      </p>
    </main>
  );
}
