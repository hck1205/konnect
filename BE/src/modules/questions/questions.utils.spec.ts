import { matchesFilter, sortNewestFirst } from './questions.utils';
import type { QuestionRecord } from './entities/question.entity';
import type { QuestionListFilter } from './repositories/questions.repository';

/**
 * 목록 필터 규칙의 계약.
 *
 * `questions.utils.ts` 가 스스로 **"여기 있는 것이 규칙의 정의"** 라고 선언한다 —
 * 인메모리 저장소가 이것을 쓰고, Prisma 저장소는 **같은 의미를 SQL 로 옮겨야 한다.**
 * 그런데 그 정의에 spec 이 없었다. 정의가 검증되지 않으면 두 드라이버가 무엇에
 * 맞춰야 하는지가 코드를 읽는 사람의 해석에 달린다.
 *
 * 특히 AND(`tags`)와 OR(`anyTags`)는 **한 글자 차이로 뒤집히고**(every ↔ some)
 * 뒤집혀도 에러가 안 난다. 결과 개수만 조용히 달라진다.
 */

const base: QuestionRecord = {
  id: '01a00000-0000-7000-8000-000000000001',
  authorId: 'u1',
  authorNickname: 'minh_t',
  title: 'Does volunteer work count toward F-2-7 points?',
  body: 'I have been volunteering at a community center for two years.',
  topic: 'residency',
  type: 'question',
  tags: ['visa:f-2', 'region:ansan'],
  acceptedAnswerId: null,
  status: 'OPEN',
  answerCount: 0,
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
};

const make = (patch: Partial<QuestionRecord> = {}): QuestionRecord => ({
  ...base,
  ...patch,
});

/**
 * 필터 헬퍼.
 *
 * `QuestionListFilter` 는 `PageQuery` 를 확장해 `limit` 이 필수다. 페이지 크기는
 * 이 함수들의 관심사가 아니므로 여기서 채운다 — 테스트마다 반복하면 진짜 검사하는
 * 조건이 잡음에 묻힌다.
 */
const f = (patch: Partial<QuestionListFilter> = {}): QuestionListFilter => ({
  limit: 20,
  ...patch,
});

describe('matchesFilter — 상태', () => {
  it('숨김 글은 목록에 나오지 않는다', () => {
    expect(matchesFilter(make({ status: 'HIDDEN' }), f({}))).toBe(false);
  });

  it('필터가 비면 공개 글은 전부 통과한다', () => {
    expect(matchesFilter(make(), f({}))).toBe(true);
  });
});

describe('matchesFilter — topic · type', () => {
  it('topic 이 다르면 걸러진다', () => {
    expect(matchesFilter(make(), f({ topic: 'housing' }))).toBe(false);
    expect(matchesFilter(make(), f({ topic: 'residency' }))).toBe(true);
  });

  it('type 이 다르면 걸러진다 — 게시판의 두 번째 축', () => {
    expect(matchesFilter(make(), f({ type: 'recruit' }))).toBe(false);
    expect(matchesFilter(make(), f({ type: 'question' }))).toBe(true);
  });

  it('topic 과 type 을 함께 걸면 교집합이다', () => {
    expect(
      matchesFilter(make(), f({ topic: 'residency', type: 'question' })),
    ).toBe(true);
    expect(
      matchesFilter(make(), f({ topic: 'residency', type: 'review' })),
    ).toBe(false);
  });
});

describe('matchesFilter — tags 는 AND', () => {
  it('전부 가져야 통과한다', () => {
    expect(matchesFilter(make(), f({ tags: ['visa:f-2'] }))).toBe(true);
    expect(
      matchesFilter(make(), f({ tags: ['visa:f-2', 'region:ansan'] })),
    ).toBe(true);
  });

  it('하나라도 없으면 걸러진다 — 여기가 OR 로 뒤집히면 결과가 조용히 넓어진다', () => {
    expect(
      matchesFilter(make(), f({ tags: ['visa:f-2', 'region:seoul'] })),
    ).toBe(false);
  });

  it('빈 배열은 필터 없음이다', () => {
    expect(matchesFilter(make(), f({ tags: [] }))).toBe(true);
  });
});

describe('matchesFilter — anyTags 는 OR', () => {
  it('하나만 가져도 통과한다', () => {
    expect(
      matchesFilter(make(), f({ anyTags: ['visa:f-2', 'visa:f-5'] })),
    ).toBe(true);
  });

  it('하나도 없으면 걸러진다', () => {
    expect(
      matchesFilter(make(), f({ anyTags: ['visa:e-7', 'visa:d-10'] })),
    ).toBe(false);
  });

  it('빈 배열은 필터 없음이다', () => {
    expect(matchesFilter(make(), f({ anyTags: [] }))).toBe(true);
  });
});

describe('matchesFilter — AND 와 OR 를 함께 걸면 교집합이다', () => {
  it('둘 다 만족해야 통과한다', () => {
    // f-2 또는 f-5 중 하나를 가지고(OR), 동시에 안산 태그가 있어야(AND) 한다
    expect(
      matchesFilter(
        make(),
        f({
          anyTags: ['visa:f-2', 'visa:f-5'],
          tags: ['region:ansan'],
        }),
      ),
    ).toBe(true);
  });

  it('OR 는 맞는데 AND 가 틀리면 걸러진다', () => {
    expect(
      matchesFilter(
        make(),
        f({
          anyTags: ['visa:f-2', 'visa:f-5'],
          tags: ['region:seoul'],
        }),
      ),
    ).toBe(false);
  });

  it('AND 는 맞는데 OR 가 틀리면 걸러진다', () => {
    expect(
      matchesFilter(
        make(),
        f({
          anyTags: ['visa:e-7'],
          tags: ['region:ansan'],
        }),
      ),
    ).toBe(false);
  });
});

describe('matchesFilter — answered · authorId · query', () => {
  it('answered 는 답변 유무를 정확히 가른다', () => {
    expect(
      matchesFilter(make({ answerCount: 0 }), f({ answered: false })),
    ).toBe(true);
    expect(matchesFilter(make({ answerCount: 0 }), f({ answered: true }))).toBe(
      false,
    );
    expect(matchesFilter(make({ answerCount: 3 }), f({ answered: true }))).toBe(
      true,
    );
  });

  it('answered 를 주지 않으면 둘 다 통과한다 — false 와 undefined 는 다르다', () => {
    expect(matchesFilter(make({ answerCount: 0 }), f({}))).toBe(true);
    expect(matchesFilter(make({ answerCount: 3 }), f({}))).toBe(true);
  });

  it('authorId 로 거른다', () => {
    expect(matchesFilter(make(), f({ authorId: 'u1' }))).toBe(true);
    expect(matchesFilter(make(), f({ authorId: 'u2' }))).toBe(false);
  });

  it('검색어는 제목·본문·태그를 대소문자 없이 훑는다', () => {
    expect(matchesFilter(make(), f({ query: 'VOLUNTEER' }))).toBe(true);
    expect(matchesFilter(make(), f({ query: 'community center' }))).toBe(true);
    expect(matchesFilter(make(), f({ query: 'ansan' }))).toBe(true);
    expect(matchesFilter(make(), f({ query: 'nonexistent' }))).toBe(false);
  });
});

describe('sortNewestFirst', () => {
  /**
   * id 가 UUIDv7(시간정렬)이라 **id 역순 = 최신순**이다.
   * createdAt 문자열로 정렬하지 않는 이유: 같은 밀리초의 두 글 순서가 불안정해지고,
   * 그러면 키셋 페이지네이션이 항목을 건너뛰거나 반복한다.
   */
  it('id 역순으로 정렬한다', () => {
    const a = make({ id: '01a00000-0000-7000-8000-00000000000a' });
    const b = make({ id: '01a00000-0000-7000-8000-00000000000b' });
    const c = make({ id: '01a00000-0000-7000-8000-00000000000c' });

    expect(sortNewestFirst([a, c, b]).map((r) => r.id)).toEqual([
      c.id,
      b.id,
      a.id,
    ]);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const a = make({ id: '01a00000-0000-7000-8000-00000000000a' });
    const b = make({ id: '01a00000-0000-7000-8000-00000000000b' });
    const input = [a, b];
    sortNewestFirst(input);
    expect(input.map((r) => r.id)).toEqual([a.id, b.id]);
  });

  it('createdAt 이 같아도 순서가 안정적이다', () => {
    const same = '2026-08-30T00:00:00.000Z';
    const a = make({
      id: '01a00000-0000-7000-8000-00000000000a',
      createdAt: same,
    });
    const b = make({
      id: '01a00000-0000-7000-8000-00000000000b',
      createdAt: same,
    });
    expect(sortNewestFirst([a, b]).map((r) => r.id)).toEqual([b.id, a.id]);
  });
});
