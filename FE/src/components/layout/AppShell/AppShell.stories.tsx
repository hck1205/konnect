import type { Story } from '@ladle/react';
import { BookOpen, MessageCircleQuestion, Users } from 'lucide-react';
import { AppShell } from './AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageTitle } from '@/components/layout/PageTitle';
import { Footer } from '@/components/layout/Footer';
import { TableOfContents } from '@/components/navigation/TableOfContents';
import { Prose } from '@/components/data-display/Prose';
import { Banner } from '@/components/feedback/Banner';
import { Button } from '@/components/primitives/Button';

export default { title: 'Layout / AppShell' };

const NAV = [
  { href: '/questions', label: 'Questions', icon: <MessageCircleQuestion className="size-4" /> },
  { href: '/guides', label: 'Guides', icon: <BookOpen className="size-4" /> },
  { href: '/meetups', label: 'Meetups', icon: <Users className="size-4" /> },
];

/**
 * SkipLink + `id="main-content"` + `tabIndex={-1}` 은 **셋이 함께 있어야** 동작한다.
 * 화면마다 이 배선을 반복하면 어딘가에서 하나를 빠뜨린다. AppShell 이 고정한다.
 *
 * **Tab 키를 눌러 보세요** — 좌측 상단에 "Skip to content" 가 나타난다.
 */
export const GuideWithSidebar: Story = () => (
  <div className="-m-6">
    <AppShell
      header={<PageHeader nav={NAV} currentPath="/guides" actions={<Button size="sm">Sign in</Button>} />}
      footer={<Footer disclaimer="konnect is a community, not a legal or immigration service." />}
      aside={
        <TableOfContents
          activeId="before-you-apply"
          entries={[
            { id: 'before-you-apply', label: 'Before you apply', level: 2 },
            { id: 'documents', label: 'Documents', level: 3 },
            { id: 'at-the-office', label: 'At the office', level: 2 },
          ]}
        />
      }
    >
      <PageTitle
        title="Changing from D-2 to E-7"
        description="What members went through when moving from a student visa to a work visa."
      />
      <Banner tone="danger" className="mt-6" title="This is not legal advice">
        Immigration rules change and depend on your situation. Confirm with the
        immigration office or your school before you act.
      </Banner>
      <Prose className="mt-6">
        <h2 id="before-you-apply">Before you apply</h2>
        <p>
          Requirements differ by office and by year. Always confirm with your
          international office.
        </p>
        <h3 id="documents">Documents</h3>
        <p>Members reported very different lists depending on the office.</p>
        <h2 id="at-the-office">At the office</h2>
        <p>Book early — appointment slots fill up.</p>
      </Prose>
    </AppShell>
  </div>
);

export const WithoutSidebar: Story = () => (
  <div className="-m-6">
    <AppShell header={<PageHeader nav={NAV} currentPath="/questions" />} width="content">
      <PageTitle title="Questions" description="Ask the people who have been through it." />
    </AppShell>
  </div>
);
