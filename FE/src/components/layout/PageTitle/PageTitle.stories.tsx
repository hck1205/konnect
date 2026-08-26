import type { Story } from '@ladle/react';
import { PageTitle } from './PageTitle';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { Button } from '@/components/primitives/Button';
import { Tag } from '@/components/data-display/Tag';
import { FreshnessIndicator } from '@/components/data-display/FreshnessIndicator';

const MONTH = 30 * 24 * 60 * 60 * 1000;
const LOADED_AT = Date.now();

export default { title: 'Layout / PageTitle' };

/** 제목은 항상 `<h1>` — 크기를 줄여야 하면 `size` 를 쓰지 레벨을 낮추지 않는다 */
export const GuidePage: Story = () => (
  <div className="max-w-3xl">
    <PageTitle
      above={
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: 'Visa & Stay' },
          ]}
        />
      }
      title="Changing from D-2 to E-7"
      description="What members went through when moving from a student visa to a work visa."
      actions={
        <>
          <Button size="sm" variant="outline" tone="neutral">
            Save
          </Button>
          <Button size="sm">Edit</Button>
        </>
      }
      meta={
        <>
          <Tag value="visa:d-2" showNamespace={false} />
          <Tag value="visa:e-7" showNamespace={false} />
          <FreshnessIndicator lastVerifiedAt={new Date(LOADED_AT - 8 * MONTH).toISOString()} />
        </>
      }
    />
  </div>
);

export const Simple: Story = () => (
  <div className="max-w-3xl">
    <PageTitle title="Questions" description="Ask the people who have been through it." />
  </div>
);
