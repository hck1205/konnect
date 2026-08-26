import type { MessageKey } from '@/lib/i18n';
import { REACTION_KINDS, type ReactionKind } from '@/types';

/**
 * 리액션의 **표현** — 이모지와 번역 키.
 *
 * 종류 자체(`ReactionKind`)는 서버와의 계약이라 `types/reaction` 이 소유한다.
 * 여기는 그걸 화면에 어떻게 보여줄지만 안다.
 */
export interface ReactionMeta {
  emoji: string;
  labelKey: MessageKey;
}

export const REACTIONS: Record<ReactionKind, ReactionMeta> = {
  like: { emoji: '\u{1F44D}', labelKey: 'reaction.like' },
  helpful: { emoji: '\u{1F4A1}', labelKey: 'reaction.helpful' },
  support: { emoji: '\u{1F91D}', labelKey: 'reaction.support' },
  celebrate: { emoji: '\u{1F389}', labelKey: 'reaction.celebrate' },
  insightful: { emoji: '\u{1F440}', labelKey: 'reaction.insightful' },
};

export { REACTION_KINDS };
export type { ReactionKind, ReactionCounts } from '@/types';
