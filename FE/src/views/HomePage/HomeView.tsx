import { BookOpen, MessageCircleQuestion, Users } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { Button } from '@/components/primitives/Button';

const NAV = [
  { href: '/questions', label: 'Questions', icon: <MessageCircleQuestion className="size-4" /> },
  { href: '/guides', label: 'Guides', icon: <BookOpen className="size-4" /> },
  { href: '/meetups', label: 'Meetups', icon: <Users className="size-4" /> },
];

/**
 * 홈 페이지 — 프레젠테이셔널 레이어(상태 없음).
 *
 * 색은 semantic 토큰(bg-surface / text-fg-muted …)만 쓴다.
 * primitive(bg-teal-700 등) 직접 사용 금지 — docs/25-design/02-tokens.md
 */
export function HomeView() {
  return (
    <>
      <SkipLink />
      <PageHeader nav={NAV} currentPath="/" actions={<Button size="sm">Sign in</Button>} />

      {/* tabIndex={-1} 이라야 SkipLink 로 포커스가 실제로 옮겨진다 */}
      <Container as="main" id="main-content" tabIndex={-1} width="prose" className="flex-1 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-fg">konnect</h1>
        <p className="mt-4 max-w-[70ch] text-lg text-fg-muted">
          A community for foreigners living, studying, working, and travelling in
          Korea.
        </p>
        <p className="mt-2 text-sm text-fg-subtle">
          {/* 한국어 원문 병기 — 브라우저 번역기가 건드리면 안 된다(사용자가 실제
              서류에서 이 글자를 찾아야 한다). lang 은 스크린리더 발음을 위해 함께 둔다.
              → docs/25-design/10-foundations/08-native-platform.md */}
          Alien Registration Card (
          <span lang="ko" translate="no">
            외국인등록증
          </span>
          ), visas, housing, language — ask the people who have been through it.
        </p>
      </Container>
    </>
  );
}
