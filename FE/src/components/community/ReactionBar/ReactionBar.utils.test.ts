import { describe, expect, it } from 'vitest';
import { activeReactions, toggleReaction, totalReactions } from './ReactionBar.utils';

describe('totalReactions', () => {
  it('모든 종류를 더한다', () => {
    expect(totalReactions({ like: 3, helpful: 2 })).toBe(5);
    expect(totalReactions({})).toBe(0);
  });
});

describe('activeReactions', () => {
  it('0인 종류는 빼고 많은 순으로', () => {
    expect(activeReactions({ like: 1, helpful: 5, support: 0 })).toEqual(['helpful', 'like']);
  });

  it('동수면 고정 순서를 지킨다 — 정렬이 불안정하면 화면이 흔들린다', () => {
    expect(activeReactions({ celebrate: 2, like: 2, helpful: 2 })).toEqual([
      'like',
      'helpful',
      'celebrate',
    ]);
  });

  it('아무것도 없으면 빈 배열', () => {
    expect(activeReactions({})).toEqual([]);
  });
});

describe('toggleReaction', () => {
  it('처음 누르면 추가된다', () => {
    expect(toggleReaction({ like: 2 }, null, 'like')).toEqual({
      counts: { like: 3 },
      mine: 'like',
    });
  });

  it('같은 것을 다시 누르면 취소된다', () => {
    expect(toggleReaction({ like: 3 }, 'like', 'like')).toEqual({
      counts: { like: 2 },
      mine: null,
    });
  });

  it('다른 것을 누르면 갈아탄다 — 한 사람이 하나만 고른다', () => {
    expect(toggleReaction({ like: 3, helpful: 1 }, 'like', 'helpful')).toEqual({
      counts: { like: 2, helpful: 2 },
      mine: 'helpful',
    });
  });

  it('개수가 음수로 내려가지 않는다', () => {
    expect(toggleReaction({}, 'like', 'like').counts.like).toBe(0);
  });

  it('원본을 변형하지 않는다', () => {
    const original = { like: 2 };
    toggleReaction(original, null, 'like');
    expect(original).toEqual({ like: 2 });
  });
});
