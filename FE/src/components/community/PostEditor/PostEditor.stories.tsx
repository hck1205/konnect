import type { Story } from '@ladle/react';
import { useState } from 'react';
import { PostEditor, type PostDraft } from './PostEditor';

export default { title: 'Community / PostEditor' };

/**
 * 작성 화면은 **가장 중요한 UX 지점**이다. 태그를 요구하면 이탈하고, 안 받으면
 * 매칭이 안 된다(태그는 P0 이고 소급 적용이 불가능하다).
 *
 * 그래서 **비슷한 질문을 작성 중에** 보여준다 — 중복을 막고 "이미 답이 있다"는
 * 즉각적 가치를 준다. 태그를 강제하는 것보다 효과가 크다.
 *
 * 미리보기는 탭이 아니라 SegmentedControl 이다 — 탭은 내비게이션이고
 * 이건 **입력 모드 선택**이다.
 */
export const Writing: Story = () => {
  const [draft, setDraft] = useState<PostDraft>({
    title: 'Can I change from D-2 to E-7 before I graduate?',
    body: 'I have an offer from a company in Seoul but my degree finishes in February.\n\nThe company wants me to start in January.',
    tags: ['visa:d-2', 'visa:e-7'],
  });

  return (
    <div className="max-w-2xl">
      <PostEditor
        value={draft}
        onChange={setDraft}
        onSubmit={() => {}}
        onCancel={() => {}}
        onSaveDraft={() => {}}
        similar={[
          { id: 's1', title: 'D-2 to E-7 while waiting for graduation', href: '#' },
          { id: 's2', title: 'Does the company need to sponsor before February?', href: '#' },
        ]}
      />
    </div>
  );
};

/** 서버 검증 결과를 필드별로 그대로 받는다 */
export const WithErrors: Story = () => {
  const [draft, setDraft] = useState<PostDraft>({ title: 'help', body: '', tags: [] });
  return (
    <div className="max-w-2xl">
      <PostEditor
        value={draft}
        onChange={setDraft}
        onSubmit={() => {}}
        errors={{
          title: 'Make the title a specific question so the right people find it.',
          tags: 'Add at least one tag.',
        }}
      />
    </div>
  );
};
