import type { Story } from '@ladle/react';
import { NavLink } from './NavLink';

export default { title: 'Navigation / NavLink' };

/** 현재 위치를 색·굵기만이 아니라 `aria-current="page"` 로도 알린다 */
export const Default: Story = () => (
  <nav aria-label="Example" className="flex gap-1">
    <NavLink href="#" active>
      Questions
    </NavLink>
    <NavLink href="#">Guides</NavLink>
    <NavLink href="#">Meetups</NavLink>
  </nav>
);
