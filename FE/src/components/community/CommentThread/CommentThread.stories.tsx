import type { Story } from '@ladle/react';
import { useState } from 'react';
import { CommentThread } from './CommentThread';
import { toggleReaction } from '@/components/community/ReactionBar';
import type { Comment } from './CommentThread.types';

export default { title: 'Community / CommentThread' };

const LOADED_AT = Date.now();
const ago = (h: number) => new Date(LOADED_AT - h * 3600_000).toISOString();

const INITIAL: Comment[] = [
  {
    id: 'c1',
    parentId: null,
    author: { id: 'u1', nickname: 'Maria Santos' },
    body: 'I did this last year. The office asked for the graduation certificate, but a friend at another school was not asked for it.',
    createdAt: ago(30),
    reactions: { helpful: 4, like: 1 },
    myReaction: null,
  },
  {
    id: 'c2',
    parentId: 'c1',
    author: { id: 'u2', nickname: '아마르' },
    body: 'Which office was that? Mine is in Gyeonggi.',
    createdAt: ago(28),
    reactions: {},
    myReaction: null,
  },
  {
    id: 'c3',
    // 답글의 답글 — buildCommentTree 가 한 단계로 접는다
    parentId: 'c2',
    author: { id: 'u1', nickname: 'Maria Santos' },
    body: 'Seoul. Gyeonggi may be different — worth calling first.',
    createdAt: ago(27),
    reactions: { helpful: 2 },
    myReaction: 'helpful',
  },
  {
    id: 'c4',
    parentId: null,
    author: { id: 'u3', nickname: 'Chen' },
    body: 'This comment was removed but its replies still need context.',
    createdAt: ago(10),
    deleted: true,
    reactions: {},
    myReaction: null,
  },
];

/**
 * **대대댓글이 없다.** `c3` 은 답글(`c2`)에 달린 답글인데 원 댓글의 답글로 접혔다 —
 * 깊이가 깊어지면 모바일에서 들여쓰기만으로 화면이 없어진다.
 * 누구에게 답하는지는 들여쓰기가 아니라 **"{name}님에게" 표기**로 알린다.
 *
 * 삭제된 댓글(`c4`)은 **자리를 남긴다** — 답글의 맥락이 사라지지 않게.
 */
export const SignedIn: Story = () => {
  const [comments, setComments] = useState<Comment[]>(INITIAL);
  const me = { id: 'u2', nickname: '아마르' };

  return (
    <div className="max-w-2xl">
      <CommentThread
        comments={comments}
        currentUser={me}
        onSubmit={(body, parentId) =>
          setComments((prev) => [
            ...prev,
            {
              id: `new-${prev.length}`,
              parentId,
              author: me,
              body,
              createdAt: new Date().toISOString(),
              reactions: {},
              myReaction: null,
            },
          ])
        }
        onReact={(comment, kind) =>
          setComments((prev) =>
            prev.map((c) => {
              if (c.id !== comment.id) return c;
              const next = toggleReaction(c.reactions, c.myReaction, kind);
              return { ...c, reactions: next.counts, myReaction: next.mine };
            }),
          )
        }
        onDelete={(comment) =>
          setComments((prev) =>
            prev.map((c) => (c.id === comment.id ? { ...c, deleted: true } : c)),
          )
        }
        onReport={() => {}}
      />
    </div>
  );
};

/** 비로그인 — 읽기는 공개, 작성 전에 안내를 먼저 보여준다 */
export const SignedOut: Story = () => (
  <div className="max-w-2xl">
    <CommentThread comments={INITIAL} currentUser={null} onSubmit={() => {}} onSignIn={() => {}} />
  </div>
);

export const Empty: Story = () => (
  <div className="max-w-2xl">
    <CommentThread
      comments={[]}
      currentUser={{ id: 'u2', nickname: '아마르' }}
      onSubmit={() => {}}
    />
  </div>
);
