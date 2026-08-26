import type { Story } from '@ladle/react';
import { useState } from 'react';
import { CommentComposer } from './CommentComposer';

export default { title: 'Community / CommentComposer' };

/**
 * 비로그인 사용자에게 **입력창을 보여주고 나서** 로그인을 요구하지 않는다 —
 * 다 쓴 다음 로그인하라는 것만큼 확실한 이탈 유발이 없다.
 */
export const States: Story = () => {
  const [posted, setPosted] = useState<string[]>([]);

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <div>
        <p className="mb-2 text-xs font-medium text-fg-subtle">로그인 — 최상위 댓글</p>
        <CommentComposer
          currentUser={{ nickname: '아마르' }}
          onSubmit={(body) => setPosted((p) => [...p, body])}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-fg-subtle">
          답글 — 들여쓰기 대신 &quot;{'{name}'}님에게&quot; 표기로 대상을 알린다
        </p>
        <CommentComposer
          currentUser={{ nickname: '아마르' }}
          replyingTo="Maria Santos"
          onCancel={() => {}}
          onSubmit={(body) => setPosted((p) => [...p, body])}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-fg-subtle">비로그인</p>
        <CommentComposer currentUser={null} onSubmit={() => {}} onSignIn={() => {}} />
      </div>

      {posted.length > 0 ? (
        <ul className="text-xs text-fg-subtle">
          {posted.map((p, i) => (
            <li key={i}>등록됨: {p}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
