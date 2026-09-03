import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '@/components/primitives/Button';
import { Checkbox } from '@/components/forms/Checkbox';
import { Fieldset } from '@/components/forms/Fieldset';

export default { title: 'Overlays / Drawer' };

/**
 * `Modal` 과 **같은 `<dialog>`** 를 쓴다 — 다른 건 위치와 크기뿐이라
 * `useDialogElement` 훅을 그대로 재사용한다.
 *
 * 내용이 길고 스크롤이 필요할 때 쓴다. 짧은 확인은 `Modal` 이 맞다.
 */
export const FilterPanel: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open filters
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        closeLabel="Close"
        title="Filter questions"
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
              Reset
            </Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Fieldset legend="Status of stay">
            <Checkbox label="D-2 (Student)" defaultChecked />
            <Checkbox label="D-4 (General trainee)" />
            <Checkbox label="E-7 (Specific activity)" />
            <Checkbox label="F-2 (Residence)" />
          </Fieldset>
          <Fieldset legend="Region">
            <Checkbox label="Seoul" />
            <Checkbox label="Gyeonggi" />
            <Checkbox label="Busan" />
          </Fieldset>
        </div>
      </Drawer>
    </>
  );
};

/** 논리 방향이라 RTL 로케일이 추가되면 자동으로 뒤집힌다 */
export const FromStart: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from start side
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} closeLabel="Close" title="Navigation" side="start">
        <p className="text-fg-muted">모바일 네비게이션 등에 쓴다.</p>
      </Drawer>
    </>
  );
};
