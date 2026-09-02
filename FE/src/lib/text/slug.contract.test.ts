import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { slugify } from './slug';
import { TAG_NAMESPACES } from '@/types/tag';
import { POST_TYPES, TOPICS } from '@/types';

/**
 * FE·BE 경계 계약.
 *
 * 두 프로젝트는 서로를 import 하지 않으므로([ADR-0002]) 같은 규칙을 각자 구현한다.
 * 지금까지는 주석으로만 "같아야 한다"고 적혀 있었고, 갈라져도 아무것도 알려주지 않았다.
 * `contracts/` 의 데이터를 양쪽이 각자 대조한다 — 한쪽이 갈라지면 그쪽이 깨진다.
 *
 * → contracts/README.md
 */
const contracts = resolve(__dirname, '../../../../contracts');
const readJson = (name: string): unknown =>
  JSON.parse(readFileSync(resolve(contracts, name), 'utf8'));

interface SlugCase {
  input: string;
  expected: string;
}
const slugCases = readJson('slug-cases.json') as {
  plain: SlugCase[];
  keepColon: SlugCase[];
};

describe('slug 계약 (contracts/slug-cases.json)', () => {
  it('케이스가 비어 있지 않다 — 파일을 못 읽어도 통과하면 안 된다', () => {
    expect(slugCases.plain.length).toBeGreaterThan(10);
    expect(slugCases.keepColon.length).toBeGreaterThan(3);
  });

  it.each(slugCases.plain)('slugify($input) === $expected', ({ input, expected }) => {
    expect(slugify(input)).toBe(expected);
  });

  it.each(slugCases.keepColon)(
    'slugify($input, {keep:":"}) === $expected',
    ({ input, expected }) => {
      expect(slugify(input, { keep: ':' })).toBe(expected);
    },
  );
});

describe('태그 네임스페이스 계약 (contracts/tag-namespaces.json)', () => {
  it('고정 어휘가 계약과 정확히 같다 (순서 무관, 누락·추가 모두 실패)', () => {
    const { namespaces } = readJson('tag-namespaces.json') as { namespaces: string[] };
    expect(namespaces.length).toBeGreaterThan(3);
    expect([...TAG_NAMESPACES].sort()).toEqual([...namespaces].sort());
  });
});

describe('주제 계약 (contracts/topics.json)', () => {
  it('주제 목록이 계약과 정확히 같다', () => {
    const { topics } = readJson('topics.json') as { topics: string[] };
    expect(topics.length).toBeGreaterThan(3);
    // 순서까지 같아야 한다 — 목록 필터의 표시 순서가 여기서 나온다
    expect([...TOPICS]).toEqual(topics);
  });
});

describe('글 종류 계약 (contracts/post-types.json)', () => {
  it('종류 목록이 계약과 정확히 같다', () => {
    const { types } = readJson('post-types.json') as { types: string[] };
    expect(types.length).toBeGreaterThan(1);
    // 순서까지 같아야 한다 — 게시판 필터의 표시 순서가 여기서 나온다
    expect([...POST_TYPES]).toEqual(types);
  });
});

/**
 * 계약 **폴더 자체**의 계약.
 *
 * 지금까지 각 테스트가 아는 파일만 열어 봤다. 그래서 새 계약 파일을 추가하고
 * 한쪽 테스트에만 붙이면 **다른 쪽은 그 파일이 있는지도 모른 채 초록**이었다.
 * contracts/README 가 표로 관리하는 목록과 실제 파일이 갈라지는 것도 못 잡았다.
 *
 * 여기서 **파일 목록 자체**를 못박는다 — 추가·삭제·이름 변경이 양쪽에서 동시에 깨진다.
 */
describe('계약 폴더 (contracts/)', () => {
  it('계약 파일 목록이 정확히 이것뿐이다 — 새 파일은 양쪽 테스트에 함께 붙인다', () => {
    const files = readdirSync(contracts)
      .filter((f) => f.endsWith('.json'))
      .sort();
    // official-sources.json 은 여기 없다 — 계약이 아니라 BE 의 입력이라
    // BE/data/ 로 옮겼다(ADR 없이 옮긴 것이 아니라 12-official-data-pipeline 에 근거가 있다)
    expect(files).toEqual([
      'post-types.json',
      'slug-cases.json',
      'tag-namespaces.json',
      'topics.json',
    ]);
  });
});
