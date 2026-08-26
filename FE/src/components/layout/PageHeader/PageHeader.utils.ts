/**
 * 현재 경로가 이 네비 항목에 해당하는지.
 *
 * 완전 일치만 보면 `/boards/free` 에서 `/boards` 탭이 꺼진다.
 * 접두사만 보면 `/` 가 모든 경로에 걸린다 — 루트는 예외로 둔다.
 */
export function isNavActive(href: string, currentPath: string | undefined): boolean {
  if (!currentPath) return false;
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
