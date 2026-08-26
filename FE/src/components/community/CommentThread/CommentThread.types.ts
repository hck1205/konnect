import type { ReactionCounts, ReactionKind } from '@/components/community/ReactionBar';

export interface CommentAuthor {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  /** 삭제된 댓글. 답글이 달려 있으면 **지우지 않고 자리를 남긴다**(맥락이 사라진다). */
  deleted?: boolean;
  /** 부모 댓글 id. 최상위면 null. **한 단계만** 허용한다. */
  parentId: string | null;
  reactions: ReactionCounts;
  myReaction: ReactionKind | null;
}

export interface CommentNode extends Comment {
  replies: Comment[];
}
