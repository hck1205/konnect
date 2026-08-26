import { REACTION_KINDS, type ReactionCounts, type ReactionKind } from '@/types';

/** 전체 리액션 수 */
export function totalReactions(counts: ReactionCounts): number {
  return REACTION_KINDS.reduce((sum, kind) => sum + (counts[kind] ?? 0), 0);
}

/**
 * 개수가 1 이상인 종류만, **많은 순**으로.
 *
 * 0인 종류를 회색으로 늘어놓으면 실제로 눌린 것이 무엇인지 안 보인다.
 * 동수일 때는 `REACTION_KINDS` 순서를 지켜 **화면이 흔들리지 않게** 한다
 * (정렬이 불안정하면 리렌더마다 순서가 바뀐다).
 */
export function activeReactions(counts: ReactionCounts): ReactionKind[] {
  return REACTION_KINDS.filter((kind) => (counts[kind] ?? 0) > 0).sort((a, b) => {
    const diff = (counts[b] ?? 0) - (counts[a] ?? 0);
    if (diff !== 0) return diff;
    return REACTION_KINDS.indexOf(a) - REACTION_KINDS.indexOf(b);
  });
}

/**
 * 내 리액션을 토글한 결과.
 *
 * 규칙: **한 사람이 하나만** 고른다(LinkedIn 과 같다). 다른 것을 누르면 갈아탄다.
 * 여러 개를 허용하면 "이 답이 도움이 됐나"를 세는 의미가 흐려진다.
 *
 * 낙관적 업데이트에 그대로 쓸 수 있도록 순수 함수로 둔다.
 */
export function toggleReaction(
  counts: ReactionCounts,
  mine: ReactionKind | null,
  next: ReactionKind,
): { counts: ReactionCounts; mine: ReactionKind | null } {
  const updated: ReactionCounts = { ...counts };

  if (mine) updated[mine] = Math.max((updated[mine] ?? 0) - 1, 0);

  // 같은 것을 다시 누르면 취소
  if (mine === next) return { counts: updated, mine: null };

  updated[next] = (updated[next] ?? 0) + 1;
  return { counts: updated, mine: next };
}
