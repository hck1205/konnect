import type { MessageKey } from '@/lib/i18n';

/**
 * 리액션 종류 — **고정 어휘**다.
 *
 * 임의 이모지를 허용하지 않는 이유: 집계가 무의미해지고(같은 뜻의 이모지가
 * 수십 개다), 모더레이션 대상이 늘어나며, 문화권마다 뜻이 다른 이모지가 섞인다.
 * 다국적 사용자를 대상으로 하는 서비스에서 특히 위험하다.
 *
 * 각 리액션에는 **번역된 이름**이 붙는다 — 이모지만으로는 의미가 전달되지 않는다.
 */
export const REACTION_KINDS = [
  'like',
  'helpful',
  'support',
  'celebrate',
  'insightful',
] as const;

export type ReactionKind = (typeof REACTION_KINDS)[number];

export interface ReactionMeta {
  emoji: string;
  labelKey: MessageKey;
}

export const REACTIONS: Record<ReactionKind, ReactionMeta> = {
  like: { emoji: '👍', labelKey: 'reaction.like' },
  helpful: { emoji: '💡', labelKey: 'reaction.helpful' },
  support: { emoji: '🤝', labelKey: 'reaction.support' },
  celebrate: { emoji: '🎉', labelKey: 'reaction.celebrate' },
  insightful: { emoji: '👀', labelKey: 'reaction.insightful' },
};

/** 종류별 개수 */
export type ReactionCounts = Partial<Record<ReactionKind, number>>;
