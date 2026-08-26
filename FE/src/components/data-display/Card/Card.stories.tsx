import type { Story } from '@ladle/react';
import { Card, CardFooter, CardHeader, CardTitle } from './Card';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';
import { Tag } from '@/components/data-display/Tag';

export default { title: 'Data display / Card' };

/** 실제 질문 목록 항목을 조립해 본다 — foundation 위에서 컴포넌트가 맞물리는지 확인 */
export const QuestionCard: Story = () => (
  <div className="flex max-w-xl flex-col gap-3">
    <Card href="#">
      <CardHeader>
        <CardTitle>Can I change from D-2 to E-7 before I graduate?</CardTitle>
        <Badge tone="success">Answered</Badge>
      </CardHeader>
      <p className="text-sm text-fg-muted">
        I have an offer from a company in Seoul but my degree finishes in February…
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag value="visa:d-2" showNamespace={false} />
        <Tag value="visa:e-7" showNamespace={false} />
        <Tag value="region:seoul" showNamespace={false} />
      </div>
      <CardFooter>
        <Avatar name="Maria Santos" size="sm" />
        <span>Maria Santos</span>
        <span aria-hidden="true">·</span>
        <span>3 answers</span>
      </CardFooter>
    </Card>
  </div>
);

export const Plain: Story = () => (
  <div className="max-w-xl">
    <Card>
      <CardTitle>Not a link</CardTitle>
      <p className="mt-2 text-sm text-fg-muted">
        카드 안에 링크나 버튼을 넣어야 한다면 카드 전체를 링크로 만들지 않는다 —
        중첩 인터랙티브 요소는 키보드·스크린리더에서 깨진다.
      </p>
    </Card>
  </div>
);
