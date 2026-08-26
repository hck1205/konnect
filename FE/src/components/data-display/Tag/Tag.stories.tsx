import type { Story } from '@ladle/react';
import { Tag } from './Tag';

export default { title: 'Data display / Tag' };

/** 저장은 정규화된 소문자, **표시할 때만** 사람이 읽는 형태로 올린다 */
export const DisplayRules: Story = () => (
  <div className="flex flex-col gap-3 text-sm">
    {[
      'visa:d-2',
      'visa:e-7',
      'region:seoul',
      'school:seoul-national-university',
      'topic:housing',
      'interview',
      '비자-연장',
    ].map((raw) => (
      <div key={raw} className="flex items-center gap-3">
        <code className="w-64 text-fg-subtle">{raw}</code>
        <Tag value={raw} />
      </div>
    ))}
  </div>
);

/** 목록에서 맥락이 분명하면 네임스페이스 접두사를 끈다 */
export const WithoutNamespace: Story = () => (
  <div className="flex flex-wrap gap-1.5">
    <Tag value="visa:d-2" showNamespace={false} />
    <Tag value="region:seoul" showNamespace={false} />
    <Tag value="interview" showNamespace={false} />
  </div>
);

export const Removable: Story = () => (
  <div className="flex flex-wrap gap-1.5">
    <Tag value="visa:d-2" onRemove={() => {}} />
    <Tag value="region:busan" onRemove={() => {}} />
  </div>
);
