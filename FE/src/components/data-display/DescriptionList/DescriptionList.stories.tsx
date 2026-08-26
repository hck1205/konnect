import type { Story } from '@ladle/react';
import { DescriptionList } from './DescriptionList';
import { Badge } from '@/components/primitives/Badge';
import { Tag } from '@/components/data-display/Tag';

export default { title: 'Data display / DescriptionList' };

/**
 * `<dl>/<dt>/<dd>` 의미 구조를 유지한 채 Grid 로 정렬한다.
 * 스크린리더가 "용어–정의" 쌍으로 읽어 준다.
 */
export const QuestionMeta: Story = () => (
  <div className="max-w-md rounded-lg border border-border p-4">
    <DescriptionList
      items={[
        { term: 'Status of stay', description: <Tag value="visa:d-2" showNamespace={false} /> },
        { term: 'Region', description: <Tag value="region:seoul" showNamespace={false} /> },
        { term: 'Last verified', description: <Badge tone="warning">8 months ago</Badge> },
        {
          term: 'Document',
          description: (
            <>
              Alien Registration Card (
              <span lang="ko" translate="no">
                외국인등록증
              </span>
              )
            </>
          ),
        },
      ]}
    />
  </div>
);
