import { sortAnswers, visibleAnswers } from './answers.utils';
import type { AnswerRecord } from './entities/answer.entity';

const make = (id: string, extra: Partial<AnswerRecord> = {}): AnswerRecord => ({
  id,
  questionId: 'q1',
  authorId: 'u1',
  authorNickname: 'User',
  body: `body ${id}`,
  status: 'OPEN',
  createdAt: '2026-08-24T12:00:00Z',
  updatedAt: '2026-08-24T12:00:00Z',
  ...extra,
});

describe('sortAnswers', () => {
  it('채택된 답변이 맨 위로 온다', () => {
    const sorted = sortAnswers([make('a'), make('b'), make('c')], 'c');
    expect(sorted.map((a) => a.id)).toEqual(['c', 'a', 'b']);
  });

  it('채택이 없으면 오래된 순 — 답변은 대화가 아니라 후보다', () => {
    const sorted = sortAnswers([make('c'), make('a'), make('b')], null);
    expect(sorted.map((a) => a.id)).toEqual(['a', 'b', 'c']);
  });

  it('채택 id 가 목록에 없어도 안전하다', () => {
    const sorted = sortAnswers([make('a'), make('b')], 'gone');
    expect(sorted.map((a) => a.id)).toEqual(['a', 'b']);
  });

  it('원본을 변형하지 않는다', () => {
    const original = [make('b'), make('a')];
    sortAnswers(original, null);
    expect(original.map((a) => a.id)).toEqual(['b', 'a']);
  });

  it('빈 목록도 안전하다', () => {
    expect(sortAnswers([], null)).toEqual([]);
  });
});

describe('visibleAnswers', () => {
  it('숨김 답변은 기본적으로 안 보인다', () => {
    const list = [make('a'), make('b', { status: 'HIDDEN' })];
    expect(visibleAnswers(list).map((a) => a.id)).toEqual(['a']);
  });

  it('작성자에게는 자기 숨김 답변이 보인다 — 아니면 되살릴 방법이 없다', () => {
    const list = [make('b', { status: 'HIDDEN', authorId: 'me' })];
    expect(visibleAnswers(list, 'me').map((a) => a.id)).toEqual(['b']);
  });

  it('남의 숨김 답변은 보이지 않는다', () => {
    const list = [make('b', { status: 'HIDDEN', authorId: 'other' })];
    expect(visibleAnswers(list, 'me')).toEqual([]);
  });
});
