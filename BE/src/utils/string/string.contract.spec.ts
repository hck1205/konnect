import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { slugify } from './string.util';
import { TAG_NAMESPACES } from '../../modules/tags';
import { TOPICS } from '../../modules/questions/entities/question.entity';

/**
 * FE·BE 경계 계약.
 *
 * FE `src/lib/text/slug.ts` 와 이 구현은 **같은 결과를 내야 한다.**
 * 갈라지면 같은 태그가 두 표기로 저장돼 필터가 무너진다 —
 * 조용히 깨지는 종류라 주석으로는 못 막는다.
 *
 * → contracts/README.md
 */
const contracts = resolve(__dirname, '../../../../contracts');
const readJson = <T>(name: string): T =>
  JSON.parse(readFileSync(resolve(contracts, name), 'utf8')) as T;

interface SlugCase {
  input: string;
  expected: string;
}
const slugCases = readJson<{ plain: SlugCase[]; keepColon: SlugCase[] }>(
  'slug-cases.json',
);

describe('slug 계약 (contracts/slug-cases.json)', () => {
  it('케이스가 비어 있지 않다 — 파일을 못 읽어도 통과하면 안 된다', () => {
    expect(slugCases.plain.length).toBeGreaterThan(10);
    expect(slugCases.keepColon.length).toBeGreaterThan(3);
  });

  it.each(slugCases.plain)(
    'slugify($input) === $expected',
    ({ input, expected }) => {
      expect(slugify(input)).toBe(expected);
    },
  );

  it.each(slugCases.keepColon)(
    'slugify($input, {keep:":"}) === $expected',
    ({ input, expected }) => {
      expect(slugify(input, { keep: ':' })).toBe(expected);
    },
  );
});

describe('태그 네임스페이스 계약 (contracts/tag-namespaces.json)', () => {
  it('고정 어휘가 계약과 정확히 같다 (순서 무관, 누락·추가 모두 실패)', () => {
    const { namespaces } = readJson<{ namespaces: string[] }>(
      'tag-namespaces.json',
    );
    expect(namespaces.length).toBeGreaterThan(3);
    expect([...TAG_NAMESPACES].sort()).toEqual([...namespaces].sort());
  });
});

describe('주제 계약 (contracts/topics.json)', () => {
  it('주제 목록이 계약과 정확히 같다', () => {
    const { topics } = readJson<{ topics: string[] }>('topics.json');
    expect(topics.length).toBeGreaterThan(3);
    expect([...TOPICS]).toEqual(topics);
  });
});
