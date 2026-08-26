import type { Story } from '@ladle/react';
import { AvatarGroup } from './AvatarGroup';

export default { title: 'Data display / AvatarGroup' };

const NAMES = ['Maria Santos', 'Amar', '아마르', 'Jean Luc', 'chen', '김민지', 'Ana'];

/** 접힌 인원수는 **텍스트로** 남긴다 — 숫자만으로는 무슨 숫자인지 알 수 없다 */
export const Overflow: Story = () => (
  <div className="flex flex-col gap-4">
    <AvatarGroup names={NAMES.slice(0, 3)} label="Answered by" />
    <AvatarGroup names={NAMES} label="Answered by" />
    <AvatarGroup names={NAMES} label="Attending" size="md" max={5} />
  </div>
);
