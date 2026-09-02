import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOPICS } from '@/types';
import { TAG_NAMESPACES } from '@/components/data-display/Tag';
import {
  OFFICIAL_SOURCES,
  VISA_SPINES,
  findSource,
  findVisaSpine,
} from './visa-spine';

/**
 * 척추 데이터가 원본과 갈라지지 않는지 본다.
 *
 * `visa-spine.ts` 는 `BE/data/official-sources.json` 의 부분 사본이다.
 * FE 의 도커 빌드 컨텍스트가 `./FE` 라 그 파일을 빌드 시점에 읽을 수 없어서
 * 사본을 두는데, **사본은 조용히 갈라진다.** 원본에서 출처를 지우거나 이름을
 * 바꿔도 화면은 옛 이름과 죽은 링크를 계속 보여준다.
 *
 * 테스트는 저장소 전체를 볼 수 있으므로 여기서 대조한다 —
 * 이 저장소가 `contracts/` 를 다루는 방식과 같다.
 */

const registry = JSON.parse(
  readFileSync(
    resolve(__dirname, '../../../BE/data/official-sources.json'),
    'utf8',
  ),
) as {
  sources: { id: string; kind: string; title: string; applies_to: string[] }[];
};

const byId = new Map(registry.sources.map((s) => [s.id, s]));

describe('출처 사본이 원본과 같다', () => {
  it('원본을 실제로 읽었다 — 파일을 못 읽어도 통과하면 안 된다', () => {
    expect(registry.sources.length).toBeGreaterThan(3);
  });

  it('사본의 모든 출처가 원본에 있다', () => {
    for (const s of OFFICIAL_SOURCES) {
      expect(byId.has(s.id)).toBe(true);
    }
  });

  it('제목과 종류가 원본과 같다', () => {
    for (const s of OFFICIAL_SOURCES) {
      const origin = byId.get(s.id)!;
      expect(s.title).toBe(origin.title);
      expect(s.kind).toBe(origin.kind);
    }
  });

  it('원본에 있는 출처를 하나도 빠뜨리지 않았다', () => {
    expect([...OFFICIAL_SOURCES].map((s) => s.id).sort()).toEqual(
      registry.sources.map((s) => s.id).sort(),
    );
  });

  /**
   * 법제처 API 응답의 링크 필드에는 요청에 쓴 인증키(OC)가 그대로 박혀서 온다.
   * 실측으로 확인했다 — 그 링크를 사본에 옮기면 키가 화면으로 새어 나간다.
   */
  it('URL 에 인증키가 섞이지 않았다', () => {
    for (const s of OFFICIAL_SOURCES) {
      expect(s.url).not.toMatch(/[?&]OC=/i);
      expect(s.url).toMatch(/^https:\/\//);
    }
  });
});

describe('척추가 실재하는 것만 가리킨다', () => {
  it('척추가 비어 있지 않다', () => {
    expect(VISA_SPINES.length).toBeGreaterThan(3);
  });

  it('모든 sourceIds 가 실재하는 출처다 — 죽은 참조가 없다', () => {
    for (const spine of VISA_SPINES) {
      expect(spine.sourceIds.length).toBeGreaterThan(0);
      for (const id of spine.sourceIds) {
        expect(findSource(id), `${spine.code} → ${id}`).toBeDefined();
      }
    }
  });

  /**
   * 척추가 "이 출처가 이 자격을 다룬다" 고 주장하는데 원본의 `applies_to` 에
   * 그 태그가 없으면 **거짓말이다.** 사용자는 그 링크를 눌러 자기 자격과
   * 무관한 문서를 받는다.
   */
  it('원본의 applies_to 가 실제로 그 자격을 포함한다', () => {
    for (const spine of VISA_SPINES) {
      for (const id of spine.sourceIds) {
        expect(
          byId.get(id)!.applies_to,
          `${id} 가 ${spine.tag} 를 다룬다고 했는데 원본에 없다`,
        ).toContain(spine.tag);
      }
    }
  });

  it('태그가 고정 어휘 네임스페이스를 쓴다', () => {
    for (const spine of VISA_SPINES) {
      const [namespace] = spine.tag.split(':');
      expect(TAG_NAMESPACES as readonly string[]).toContain(namespace);
      expect(spine.tag).toBe(`visa:${spine.code}`);
    }
  });

  it('topic 이 계약된 어휘 안에 있다', () => {
    for (const spine of VISA_SPINES) {
      expect(TOPICS as readonly string[]).toContain(spine.topic);
    }
  });

  it('code 가 중복되지 않는다 — URL 이 겹치면 한쪽이 사라진다', () => {
    const codes = VISA_SPINES.map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('code 가 URL 에 그대로 쓸 수 있는 모양이다', () => {
    for (const spine of VISA_SPINES) {
      expect(spine.code).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('findVisaSpine', () => {
  it('있는 코드를 찾는다', () => {
    expect(findVisaSpine('f-2')?.officialName.ko).toBe('거주');
  });

  it('모르는 코드는 undefined — 404 분기가 여기서 갈린다', () => {
    expect(findVisaSpine('x-9')).toBeUndefined();
    expect(findVisaSpine('F-2')).toBeUndefined();
  });
});
