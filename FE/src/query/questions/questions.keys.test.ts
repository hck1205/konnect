import { describe, expect, it } from 'vitest';
import { questionKeys } from './questions.keys';

/**
 * 키가 **계층**을 이루는지 본다.
 *
 * 이게 깨지면 `invalidateQueries({ queryKey: questionKeys.all })` 이 하위를
 * 못 지운다 — 답변을 달아도 화면이 그대로인 버그가 된다.
 */
describe('questionKeys', () => {
  it('모든 키가 all 로 시작한다 — 위에서 한 번에 지울 수 있어야 한다', () => {
    const keys = [
      questionKeys.lists(),
      questionKeys.list({ topic: 'visa' }),
      questionKeys.details(),
      questionKeys.detail('q1'),
      questionKeys.answers('q1'),
    ];
    for (const key of keys) {
      expect(key.slice(0, questionKeys.all.length)).toEqual([...questionKeys.all]);
    }
  });

  it('답변 키는 그 질문의 상세 아래에 있다 — 질문을 지우면 답변도 지워진다', () => {
    const detail = questionKeys.detail('q1');
    expect(questionKeys.answers('q1').slice(0, detail.length)).toEqual([...detail]);
  });

  it('필터가 다르면 다른 키다', () => {
    expect(questionKeys.list({ topic: 'visa' })).not.toEqual(
      questionKeys.list({ topic: 'housing' }),
    );
  });

  it('필터를 안 주면 빈 객체로 수렴한다 — undefined 와 {} 가 다른 캐시가 되면 안 된다', () => {
    expect(questionKeys.list()).toEqual(questionKeys.list({}, {}));
  });

  it('질문이 다르면 답변 키도 다르다', () => {
    expect(questionKeys.answers('q1')).not.toEqual(questionKeys.answers('q2'));
  });
});
