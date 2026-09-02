import type { Story } from '@ladle/react';
import { BookOpen, MessageCircleQuestion, Users } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Button } from '@/components/primitives/Button';
import { Avatar } from '@/components/primitives/Avatar';
import { Menu, MenuItem, MenuSeparator } from '@/components/overlays/Menu';
import { Container } from '@/components/layout/Container';

export default { title: 'Layout / PageHeader' };

const NAV = [
  { href: '/questions', label: 'Questions', icon: <MessageCircleQuestion className="size-4" /> },
  { href: '/guides', label: 'Guides', icon: <BookOpen className="size-4" /> },
  { href: '/meetups', label: 'Meetups', icon: <Users className="size-4" /> },
];

/** 창을 좁히면 네비가 팝오버로 접힌다 — Popover API 라 열림 상태 JS 가 없다 */
export const SignedOut: Story = () => (
  <div className="-m-6">
    <PageHeader
      homeHref="/en"
      homeLabel="konnect — home"
      navLabel="Main navigation"
      nav={NAV}
      currentPath="/questions"
      actions={<Button size="sm">Sign in</Button>}
    />
    <Container width="wide" className="py-8">
      <p className="text-sm text-fg-muted">
        헤더는 sticky 이고 <code>--header-h</code> 를 세팅한다 — 앵커로 이동했을 때
        제목이 헤더에 가리지 않게 하는 <code>scroll-margin</code> 이 이 값을 쓴다.
      </p>
    </Container>
  </div>
);

export const SignedIn: Story = () => (
  <div className="-m-6">
    <PageHeader
      homeHref="/en"
      homeLabel="konnect — home"
      navLabel="Main navigation"
      nav={NAV}
      currentPath="/guides/visa/d-2"
      actions={
        <Menu
          trigger={(p) => (
            <button {...p} type="button" aria-label="Account menu" className="cursor-pointer">
              <Avatar name="Maria Santos" size="sm" />
            </button>
          )}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>My questions</MenuItem>
          <MenuSeparator />
          <MenuItem>Sign out</MenuItem>
        </Menu>
      }
    />
    <Container width="wide" className="py-8">
      <p className="text-sm text-fg-muted">
        현재 경로가 <code>/guides/visa/d-2</code> 라 상위 항목인 Guides 가 활성이다.
      </p>
    </Container>
  </div>
);
