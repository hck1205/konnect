/**
 * 홈 페이지 — 프레젠테이셔널 레이어(상태 없음).
 */
export function HomeView() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">konnect</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        A community for foreigners living, studying, working, and travelling in
        Korea.
      </p>
    </main>
  );
}
