import { NavLink } from '@/components/navigation/NavLink';
import { isNavActive } from '../PageHeader.utils';
import type { NavItem } from '../PageHeader.types';

export interface HeaderNavProps {
  items: readonly NavItem[];
  currentPath?: string;
  /** 세로 배치(모바일 팝오버 안) */
  vertical?: boolean;
}

/**
 * 네비게이션 링크 목록.
 *
 * 데스크톱(가로)과 모바일 팝오버(세로)가 **같은 목록을 다르게 배치**할 뿐이라
 * 한 컴포넌트로 둔다. 두 벌로 두면 항목을 추가할 때 한쪽을 빠뜨린다.
 *
 * `<nav aria-label>` 은 호출부가 감싼다 — 같은 페이지에 `<nav>` 가 둘이면
 * 스크린리더가 구분할 이름이 필요한데, 그 이름은 배치가 아니라 맥락이 정한다.
 */
export function HeaderNav({ items, currentPath, vertical }: HeaderNavProps) {
  return (
    <div className={vertical ? 'flex flex-col' : 'flex items-center gap-1'}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          active={isNavActive(item.href, currentPath)}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
