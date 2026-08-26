import type { Story } from '@ladle/react';
import { Table } from './Table';
import { Tag } from '@/components/data-display/Tag';

export default { title: 'Data display / Table' };

interface VisaRow {
  code: string;
  purpose: string;
  segment: string;
  questions: number;
}

const ROWS: VisaRow[] = [
  { code: 'visa:d-2', purpose: 'Degree study', segment: 'Students', questions: 128 },
  { code: 'visa:d-4', purpose: 'Language training', segment: 'Students', questions: 74 },
  { code: 'visa:e-7', purpose: 'Specific activity', segment: 'Workers', questions: 96 },
  { code: 'visa:d-10', purpose: 'Job seeking', segment: 'Workers', questions: 41 },
];

/**
 * 네이티브 `<table>` 이다 — 스크린리더가 좌표와 헤더를 읽어 준다
 * ("3행 2열, Purpose: Specific activity"). div 그리드로는 그게 사라진다.
 *
 * 넓은 표는 자기 컨테이너 안에서만 가로 스크롤한다. 스크롤 영역에 `tabIndex={0}` 이
 * 있어 키보드로도 스크롤된다(WCAG 2.1.1).
 */
export const Default: Story = () => (
  <div className="max-w-2xl">
    <Table
      caption="Most asked-about statuses of stay"
      rows={ROWS}
      rowKey={(r) => r.code}
      columns={[
        { key: 'code', header: 'Status', render: (r) => <Tag value={r.code} showNamespace={false} /> },
        { key: 'purpose', header: 'Purpose', render: (r) => r.purpose },
        { key: 'segment', header: 'Segment', render: (r) => r.segment },
        { key: 'q', header: 'Questions', align: 'end', render: (r) => r.questions },
      ]}
    />
  </div>
);

/** 주변에 이미 제목이 있으면 caption 을 시각적으로만 숨긴다(스크린리더에는 남는다) */
export const HiddenCaption: Story = () => (
  <div className="max-w-2xl">
    <h3 className="mb-2 text-base font-semibold text-fg">Statuses of stay</h3>
    <Table
      caption="Most asked-about statuses of stay"
      hideCaption
      rows={ROWS.slice(0, 2)}
      rowKey={(r) => r.code}
      columns={[
        { key: 'code', header: 'Status', render: (r) => r.code },
        { key: 'purpose', header: 'Purpose', render: (r) => r.purpose },
      ]}
    />
  </div>
);
