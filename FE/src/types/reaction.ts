/**
 * 리액션 종류 — **고정 어휘**다.
 *
 * 임의 이모지를 허용하지 않는다: 집계가 무의미해지고, 문화권마다 뜻이 다른
 * 이모지가 섞인다(다국적 사용자 대상에서 특히 위험하다).
 * → docs/20-product/10-features/08-reactions.md
 *
 * 이모지·라벨 매핑은 **UI 관심사**라 여기 없다(`components/community/ReactionBar`).
 * 이 파일은 서버와 주고받는 계약만 담는다.
 */
export const REACTION_KINDS = [
  'like',
  'helpful',
  'support',
  'celebrate',
  'insightful',
] as const;

export type ReactionKind = (typeof REACTION_KINDS)[number];

/** 종류별 개수 */
export type ReactionCounts = Partial<Record<ReactionKind, number>>;
