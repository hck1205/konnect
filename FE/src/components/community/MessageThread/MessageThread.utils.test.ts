import { describe, expect, it } from 'vitest';
import { groupMessages, looksLikeSensitiveId } from './MessageThread.utils';
import type { DirectMessage } from './MessageThread.types';

const msg = (id: string, senderId: string, createdAt: string): DirectMessage => ({
  id,
  senderId,
  body: id,
  createdAt,
});

describe('groupMessages', () => {
  it('연속된 같은 사람의 메시지를 묶는다', () => {
    const groups = groupMessages([
      msg('1', 'a', '2026-08-24T10:00:00Z'),
      msg('2', 'a', '2026-08-24T10:01:00Z'),
      msg('3', 'b', '2026-08-24T10:02:00Z'),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0].messages.map((m) => m.id)).toEqual(['1', '2']);
    expect(groups[1].senderId).toBe('b');
  });

  it('날짜가 바뀌면 같은 사람이어도 새 묶음이다', () => {
    const groups = groupMessages([
      msg('1', 'a', '2026-08-24T23:59:00Z'),
      msg('2', 'a', '2026-08-25T00:01:00Z'),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[1].date).toBe('2026-08-25');
  });

  it('빈 목록은 빈 결과', () => {
    expect(groupMessages([])).toEqual([]);
  });

  it('한 개면 묶음도 한 개', () => {
    expect(groupMessages([msg('1', 'a', '2026-08-24T10:00:00Z')])).toHaveLength(1);
  });
});

describe('looksLikeSensitiveId', () => {
  it('13자리 번호를 잡는다 (하이픈·공백 무관)', () => {
    expect(looksLikeSensitiveId('900101-1234567')).toBe(true);
    expect(looksLikeSensitiveId('900101 1234567')).toBe(true);
    expect(looksLikeSensitiveId('9001011234567')).toBe(true);
  });

  it('여권번호 형태를 잡는다', () => {
    expect(looksLikeSensitiveId('My passport is M12345678')).toBe(true);
    expect(looksLikeSensitiveId('AB1234567')).toBe(true);
  });

  it('평범한 문장을 오탐하지 않는다 — 오탐이 잦으면 경고를 무시하게 된다', () => {
    expect(looksLikeSensitiveId('I arrived in 2025 and my visa is D-2')).toBe(false);
    expect(looksLikeSensitiveId('Call me at 010')).toBe(false);
    expect(looksLikeSensitiveId('See you at 3pm')).toBe(false);
    expect(looksLikeSensitiveId('')).toBe(false);
  });

  it('짧은 숫자열은 잡지 않는다', () => {
    expect(looksLikeSensitiveId('123456')).toBe(false);
  });
});
