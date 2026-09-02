import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOPICS } from '@/types';
import { TAG_NAMESPACES } from '@/types/tag';
import {
  OFFICIAL_SOURCES,
  VISA_SPINES,
  findSource,
  findVisaSpine,
  sourcesForTopic,
  spineTitle,
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
  sources: { id: string; kind: string; title: string; url: string; applies_to: string[] }[];
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

  /**
   * **url 도 원본과 같아야 한다.**
   *
   * 이 파일 머리말이 스스로 두 가지 실패를 이름 붙여 놓았다 — "옛 이름" 과
   * "죽은 링크". 그런데 검사는 title 만 대조하고 url 은 모양(`https://`, 키 누출)만
   * 봤다. 그래서 **죽은 링크 쪽이 무방비였다** — 법제처가 주소를 바꾸면 감시기가
   * 원본을 고치고, 화면은 옛 주소를 계속 링크한다.
   *
   * 이 영역에서 죽은 링크는 단순한 404 가 아니다. 페이지가 하는 일이
   * "해석하지 않고 원문으로 보낸다" 하나뿐이라, 링크가 죽으면 페이지가 하는 일이
   * 남지 않는다. → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
   */
  it('url 이 원본과 같다 — 이 페이지가 하는 일은 원문으로 보내는 것뿐이다', () => {
    for (const s of OFFICIAL_SOURCES) {
      expect(s.url, `${s.id} 의 링크가 원본과 다르다`).toBe(byId.get(s.id)!.url);
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

  /**
   * 역방향. 정방향("척추가 주장하는 출처가 원본에도 있나")만 보면
   * **원본이 '이 출처는 이 자격에도 걸린다' 고 해도 페이지는 조용히 덜 보여준다.**
   * 사용자는 자기 자격에 걸리는 공식 문서 하나를 못 본 채 페이지를 떠나고,
   * 화면에는 그런 흔적이 없다 — 없는 것은 보이지 않는다.
   */
  it('원본이 이 자격에 걸린다고 한 출처를 척추가 빠뜨리지 않았다', () => {
    const spineByTag = new Map(VISA_SPINES.map((s) => [s.tag, s]));
    for (const origin of registry.sources) {
      for (const tag of origin.applies_to) {
        const spine = spineByTag.get(tag);
        if (!spine) continue; // 척추가 없는 자격 — 바로 아래에서 따로 본다
        expect(
          spine.sourceIds,
          `원본은 ${origin.id} 가 ${tag} 에 걸린다는데 척추가 안 싣는다`,
        ).toContain(origin.id);
      }
    }
  });

  /**
   * 위에서 건너뛴 자격을 **이름으로 못 박는다.**
   *
   * 그냥 `continue` 만 두면 원본에 새 자격이 들어와도 검사가 조용히 좁아진다 —
   * "전부 검사했다" 처럼 보이는데 실제로는 지나친다. 지금 비어 있는 것은
   * `visa:e-9` 하나뿐이고, **의도된 제외다**(출처가 하나뿐이라 얕은 페이지가 된다).
   * 새 자격이 원본에 생기면 여기서 걸려 "척추를 만들지, 제외를 적을지" 를 묻는다.
   */
  it('척추가 없는 자격은 e-9 뿐이다 — 새 자격이 들어오면 여기서 걸린다', () => {
    const covered = new Set(VISA_SPINES.map((s) => s.tag));
    const uncovered = [
      ...new Set(registry.sources.flatMap((s) => s.applies_to)),
    ]
      .filter((tag) => !covered.has(tag))
      .sort();
    expect(uncovered).toEqual(['visa:e-9']);
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

describe('sourcesForTopic', () => {
  /**
   * **이게 이 함수의 진짜 불변식이다.** 척추를 훑으며 모으면 자격마다 순서가
   * 달라져 같은 문서가 페이지마다 다른 자리에 온다. 법령 목록은 위치로 기억하는
   * 종류라 순서가 흔들리면 읽는 사람이 "이걸 아까 봤나" 를 판단할 수 없다.
   */
  it('선언 순서를 지킨다 — 어떤 주제에서도 자리가 같다', () => {
    const order = OFFICIAL_SOURCES.map((s) => s.id);
    for (const topic of TOPICS) {
      const got = sourcesForTopic(topic).map((s) => s.id);
      expect(got, `${topic} 의 출처 순서`).toEqual(order.filter((id) => got.includes(id)));
    }
  });

  it('중복을 내지 않는다 — 여러 자격이 같은 출처를 참조한다', () => {
    for (const topic of TOPICS) {
      const ids = sourcesForTopic(topic).map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('그 주제 척추들의 출처를 하나도 빠뜨리지 않는다', () => {
    for (const topic of TOPICS) {
      const expected = new Set(
        VISA_SPINES.filter((s) => s.topic === topic).flatMap((s) => s.sourceIds),
      );
      expect(new Set(sourcesForTopic(topic).map((s) => s.id))).toEqual(expected);
    }
  });

  it('척추가 없는 주제는 빈 배열 — 절을 통째로 감추는 분기가 여기 걸린다', () => {
    // 출처 0건이면 화면이 "링크하고 인용합니다" 를 빈 목록 위에 띄우게 된다
    const empty = TOPICS.filter((t) => sourcesForTopic(t).length === 0);
    expect(empty.length).toBeGreaterThan(0);
  });
});

describe('spineTitle', () => {
  it('체류자격은 코드를 괄호에 붙인다', () => {
    expect(spineTitle(findVisaSpine('f-5')!, 'ko')).toBe('영주 (F-5)');
    expect(spineTitle(findVisaSpine('f-5')!, 'en')).toBe('Permanent Residence (F-5)');
  });

  /**
   * 귀화는 체류자격이 아니라 국적 취득이라 `codeLabel` 이 없다.
   * 코드를 그냥 대문자로 올리면 `NATURALIZATION` 이라는 이름이 나온다.
   */
  it('귀화는 코드를 붙이지 않는다', () => {
    expect(spineTitle(findVisaSpine('naturalization')!, 'ko')).toBe('귀화');
    expect(spineTitle(findVisaSpine('naturalization')!, 'en')).not.toMatch(/[(]/);
  });

  /** 공식 명칭의 중국어·베트남어 번역은 없다 — 지어내지 않고 영어로 떨어뜨린다 */
  it('zh·vi 는 영어 명칭으로 떨어진다', () => {
    const f5 = findVisaSpine('f-5')!;
    expect(spineTitle(f5, 'zh')).toBe(spineTitle(f5, 'en'));
    expect(spineTitle(f5, 'vi')).toBe(spineTitle(f5, 'en'));
  });
});
