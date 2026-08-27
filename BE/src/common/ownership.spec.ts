import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { assertOwned } from './ownership';

const record = { id: 'q1', authorId: 'me' };

describe('assertOwned', () => {
  it('본인 것이면 그대로 돌려준다', () => {
    expect(assertOwned(record, 'me', 'Question')).toBe(record);
  });

  it('없으면 404', () => {
    expect(() => assertOwned(null, 'me', 'Question')).toThrow(
      NotFoundException,
    );
    expect(() => assertOwned(undefined, 'me', 'Question')).toThrow(
      NotFoundException,
    );
  });

  it('남의 것이면 403 — 404 로 뭉개지 않는다', () => {
    expect(() => assertOwned(record, 'other', 'Question')).toThrow(
      ForbiddenException,
    );
  });

  it('없음이 소유 확인보다 먼저다 — null 에 authorId 를 읽으면 터진다', () => {
    expect(() => assertOwned(null, 'other', 'Answer')).toThrow(
      NotFoundException,
    );
  });

  it('메시지에 엔티티 이름이 들어간다', () => {
    expect(() => assertOwned(null, 'me', 'Answer')).toThrow('Answer not found');
    expect(() => assertOwned(record, 'other', 'Answer')).toThrow(
      'Only the author can modify this answer',
    );
  });
});
