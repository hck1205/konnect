import type { Story } from '@ladle/react';
import { Heading } from './Heading';

export default { title: 'Primitives / Heading' };

/**
 * **레벨과 크기가 분리되어 있다.**
 *
 * 가장 흔한 접근성 사고가 "작게 보이고 싶어서 h2 대신 h4 를 쓰는 것"이다.
 * 스크린리더 사용자는 제목 레벨로 문서를 훑기 때문에 레벨을 건너뛰면 목차가 망가진다.
 */
export const SizesAreIndependentOfLevel: Story = () => (
  <div className="flex flex-col gap-4">
    <div>
      <p className="text-xs text-fg-subtle">level=1 size=xl (페이지 제목)</p>
      <Heading level={1} size="xl">
        Changing from D-2 to E-7
      </Heading>
    </div>
    <div>
      <p className="text-xs text-fg-subtle">level=2 size=lg</p>
      <Heading level={2} size="lg">
        Before you apply
      </Heading>
    </div>
    <div>
      <p className="text-xs text-fg-subtle">
        level=2 size=xs — **구조는 h2, 보기엔 작게**. 레벨을 낮추지 않는다.
      </p>
      <Heading level={2} size="xs">
        Documents people were asked for
      </Heading>
    </div>
  </div>
);
