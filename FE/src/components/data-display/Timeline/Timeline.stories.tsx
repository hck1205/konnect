import type { Story } from '@ladle/react';
import { Timeline } from './Timeline';

export default { title: 'Data display / Timeline' };

/**
 * konnect 의 주 용도 — **체류 생애주기**.
 * 질문은 특정 사건 앞뒤에 몰리므로, "지금 어느 단계인가"를 잡으면 콘텐츠가 좁혀진다.
 * → docs/10-domain/10-visa-immigration/02-lifecycle-and-events.md
 */
export const StayLifecycle: Story = () => (
  <div className="max-w-lg">
    <Timeline
      label="Stay lifecycle"
      items={[
        {
          id: 't0',
          marker: 'T0 · Before arrival',
          title: 'Offer accepted, visa application',
          description: 'What documents, how long it takes, proof of funds.',
          complete: true,
        },
        {
          id: 't1',
          marker: 'T1 · Just before',
          title: 'Flights and first accommodation',
          complete: true,
        },
        {
          id: 't2',
          marker: 'T2 · Right after arrival',
          title: 'Foreign resident registration',
          description: 'There is a legal deadline here — confirm the current rule.',
          tone: 'danger',
        },
        {
          id: 't3',
          marker: 'T3 · Settling in',
          title: 'Bank, phone, insurance, housing',
          description: 'These are each other’s prerequisites — order matters.',
        },
        {
          id: 't5',
          marker: 'T5 · Before expiry',
          title: 'Extension or change of status',
        },
      ]}
    />
  </div>
);
