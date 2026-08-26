import type { Comment, CommentNode } from './CommentThread.types';

/**
 * 평평한 댓글 목록 → 한 단계 트리.
 *
 * **대대댓글을 만들지 않는다.** 답글의 답글은 원 댓글의 답글로 접어 넣는다
 * (`parentId` 가 답글을 가리키면 그 답글의 부모로 올린다).
 *
 * 이유: 깊이가 깊어지면 모바일에서 들여쓰기만으로 화면이 없어지고, 읽는 순서가
 * 무너진다. 누구에게 답하는지는 들여쓰기가 아니라 **"{name}님에게" 표기**로 알린다.
 * → docs/20-product/10-features/02-qna.md
 *
 * 시간순을 유지한다(먼저 쓴 것이 위). 답글도 마찬가지다.
 */
export function buildCommentTree(comments: readonly Comment[]): CommentNode[] {
  const byId = new Map(comments.map((c) => [c.id, c]));

  /** 부모를 최상위까지 끌어올린다 — 한 단계 초과를 접는다 */
  const rootIdOf = (comment: Comment): string | null => {
    let parentId = comment.parentId;
    const guard = new Set<string>([comment.id]);
    while (parentId) {
      // 순환 참조 방어 — 데이터가 손상돼도 무한 루프에 빠지지 않는다
      if (guard.has(parentId)) return null;
      guard.add(parentId);
      const parent = byId.get(parentId);
      if (!parent) return null; // 부모가 없으면(삭제·미로드) 최상위로 취급
      if (parent.parentId === null) return parent.id;
      parentId = parent.parentId;
    }
    return null;
  };

  const nodes = new Map<string, CommentNode>();
  for (const c of comments) {
    if (c.parentId === null) nodes.set(c.id, { ...c, replies: [] });
  }

  for (const c of comments) {
    if (c.parentId === null) continue;
    const rootId = rootIdOf(c);
    const root = rootId ? nodes.get(rootId) : undefined;
    if (root) root.replies.push(c);
    // 부모를 못 찾은 답글은 최상위로 올린다 — 사라지게 두지 않는다
    else nodes.set(c.id, { ...c, replies: [] });
  }

  return [...nodes.values()];
}

/** 삭제된 것을 포함한 전체 개수 — 화면의 "댓글 N개"에 쓴다 */
export function countComments(comments: readonly Comment[]): number {
  return comments.filter((c) => !c.deleted).length;
}

/**
 * 답글이 달린 댓글은 삭제해도 자리를 남긴다.
 * 통째로 지우면 답글들이 무엇에 대한 답인지 알 수 없게 된다.
 */
export function canHardDelete(
  comment: Comment,
  all: readonly Comment[],
): boolean {
  return !all.some((c) => c.parentId === comment.id);
}
