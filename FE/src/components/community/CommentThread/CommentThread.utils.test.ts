import { describe, expect, it } from 'vitest';
import { buildCommentTree, canHardDelete, countComments } from './CommentThread.utils';
import type { Comment } from './CommentThread.types';

const make = (id: string, parentId: string | null, extra: Partial<Comment> = {}): Comment => ({
  id,
  parentId,
  author: { id: `u-${id}`, nickname: `User ${id}` },
  body: `body ${id}`,
  createdAt: '2026-08-24T12:00:00Z',
  reactions: {},
  myReaction: null,
  ...extra,
});

describe('buildCommentTree', () => {
  it('최상위와 답글을 나눈다', () => {
    const tree = buildCommentTree([make('a', null), make('b', 'a'), make('c', null)]);
    expect(tree.map((n) => n.id)).toEqual(['a', 'c']);
    expect(tree[0].replies.map((r) => r.id)).toEqual(['b']);
  });

  it('대대댓글을 한 단계로 접는다 — 깊이가 깊어지면 모바일에서 화면이 없어진다', () => {
    const tree = buildCommentTree([
      make('a', null),
      make('b', 'a'),
      make('c', 'b'), // 답글의 답글
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].replies.map((r) => r.id)).toEqual(['b', 'c']);
  });

  it('부모를 못 찾은 답글도 사라지지 않는다 — 최상위로 올린다', () => {
    const tree = buildCommentTree([make('orphan', 'gone')]);
    expect(tree.map((n) => n.id)).toEqual(['orphan']);
  });

  it('순환 참조가 있어도 무한 루프에 빠지지 않는다', () => {
    const tree = buildCommentTree([make('x', 'y'), make('y', 'x')]);
    expect(tree).toHaveLength(2);
  });

  it('시간순(입력 순서)을 유지한다', () => {
    const tree = buildCommentTree([make('a', null), make('b1', 'a'), make('b2', 'a')]);
    expect(tree[0].replies.map((r) => r.id)).toEqual(['b1', 'b2']);
  });

  it('빈 목록은 빈 트리', () => {
    expect(buildCommentTree([])).toEqual([]);
  });
});

describe('countComments', () => {
  it('삭제된 것은 세지 않는다', () => {
    expect(countComments([make('a', null), make('b', null, { deleted: true })])).toBe(1);
  });
});

describe('canHardDelete', () => {
  it('답글이 없으면 완전히 지울 수 있다', () => {
    const a = make('a', null);
    expect(canHardDelete(a, [a])).toBe(true);
  });

  it('답글이 있으면 자리를 남겨야 한다 — 답글의 맥락이 사라진다', () => {
    const a = make('a', null);
    const b = make('b', 'a');
    expect(canHardDelete(a, [a, b])).toBe(false);
  });
});
