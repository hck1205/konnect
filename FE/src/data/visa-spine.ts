/**
 * 비자 척추 — 페이지가 **글 0건에서도 성립하게** 하는 뼈대.
 *
 * 다른 모든 페이지 종류는 볼륨 조건에 걸린다(태그 허브는 질문 20건, 공간 승격은
 * 주간 신규 10건 × 4주, 회사 페이지는 사용자가 써야 채워진다). 척추만 조건이 없다 —
 * **법령과 고시는 우리 사용자와 무관하게 이미 존재하기 때문이다.**
 * → docs/20-product/10-features/12-official-data-pipeline.md
 *
 * ## 왜 FE 안에 있나
 *
 * FE 의 도커 빌드 컨텍스트가 `./FE` 라(.github/workflows/deploy.yml)
 * `BE/data/` 도 `contracts/` 도 **빌드 시점에 읽을 수 없다.** 그래서 여기 둔다.
 * 대신 `visa-spine.test.ts` 가 `BE/data/official-sources.json` 과 대조한다 —
 * 테스트는 저장소 전체를 볼 수 있으므로 갈라지면 그때 깨진다.
 * 이 저장소가 `contracts/` 를 다루는 방식과 같은 패턴이다.
 *
 * ## 무엇을 담고 무엇을 담지 않나
 *
 * **담는 것**: 법령이 정한 공식 명칭, 관련 태그, 어느 공식 출처가 이 자격을 다루는지.
 * 전부 **사실**이고 인용이다.
 *
 * **담지 않는 것**: 요건 설명, 점수 계산법, 신청 절차 — 그건 **해석**이다.
 * 이 제품에는 전문가가 없고, 틀린 안내는 체류자격 상실로 이어진다(R1).
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */

import type { Topic } from '@/types';

export interface VisaSpine {
  /** URL 세그먼트이자 `visa:` 태그의 값. 소문자 하이픈 표기 */
  code: string;
  /**
   * 법령이 정한 공식 명칭이다. 우리가 지은 이름이 아니다.
   * 체류자격은 출입국관리법 시행령 별표1의2, **귀화는 국적법**이 정한다 — `basis` 참조.
   * 법령은 저작권법 제7조상 보호받지 못하는 저작물이라 그대로 인용할 수 있다.
   */
  officialName: { ko: string; en: string };
  /**
   * 그 명칭의 **근거 법령**. 자격마다 다르다.
   *
   * ⚠️ 이걸 데이터로 두지 않고 화면에 한 문장으로 박았더니 **귀화까지
   * "출입국관리법 시행령 별표1의2 의 명칭" 이라고 진술**했다. 귀화는 거기에 없다 —
   * 국적법 소관이다. 사용자가 원문을 찾아갈 때 쓰는 정보라 틀리면 엉뚱한 법령으로 보낸다.
   * 해석을 쓰지 않겠다고 해 놓고 **사실을 틀리게 말하는 것**이 더 나쁘다.
   *
   * 문장이 아니라 **식별자**를 담는다 — 문구는 사전(네 로케일)이 갖는다.
   * 데이터에 ko/en 문장을 넣으면 zh·vi 판이 영어로 떨어진다.
   */
  basis: 'enforcement-decree' | 'nationality-act';
  /**
   * 제목 괄호 안에 넣을 코드. `귀화 (NATURALIZATION)` 이 되지 않게 **체류자격에만** 있다.
   * 귀화는 체류자격이 아니라 국적 취득이다.
   */
  codeLabel: string | null;
  /** 이 자격을 다루는 공식 출처의 id — `BE/data/official-sources.json` 과 대조된다 */
  sourceIds: string[];
  /** 관련 질문을 찾을 때 쓰는 태그 */
  tag: string;
  /** 이 자격 질문이 주로 사는 게시판 */
  topic: Topic;
}

/**
 * 다루는 자격.
 *
 * 순서가 곧 표시 순서이고, [우선순위 표](docs/10-domain/10-visa-immigration/01-visa-types.md)를
 * 따른다 — 비치헤드가 영주·귀화 준비자다(ADR-0007).
 *
 * `visa:e-9` 는 **일부러 뺐다.** 출처가 하나뿐이고, 도메인 문서가
 * "문제는 크나 도달 수단이 없다" 로 후순위에 뒀다. 얕은 페이지를 만들지 않는다.
 */
export const VISA_SPINES: readonly VisaSpine[] = [
  {
    code: 'f-5',
    officialName: { ko: '영주', en: 'Permanent Residence' },
    basis: 'enforcement-decree',
    codeLabel: 'F-5',
    sourceIds: [
      'immigration-act-enforcement-decree',
      'immigration-act',
      'hikorea-visa-guide',
      'immigration-notices',
    ],
    tag: 'visa:f-5',
    topic: 'residency',
  },
  {
    code: 'f-2',
    officialName: { ko: '거주', en: 'Residence' },
    basis: 'enforcement-decree',
    codeLabel: 'F-2',
    sourceIds: [
      'immigration-act-enforcement-decree',
      'immigration-act',
      'hikorea-visa-guide',
      'immigration-notices',
    ],
    tag: 'visa:f-2',
    topic: 'residency',
  },
  {
    code: 'naturalization',
    officialName: { ko: '귀화', en: 'Naturalization' },
    basis: 'nationality-act',
    codeLabel: null,
    // 체류자격이 아니라 국적 취득이다 — 근거 법령이 국적법으로 다르다
    sourceIds: ['nationality-act', 'immigration-notices'],
    tag: 'visa:naturalization',
    topic: 'residency',
  },
  {
    code: 'e-7',
    officialName: { ko: '특정활동', en: 'Specific Activities' },
    basis: 'enforcement-decree',
    codeLabel: 'E-7',
    sourceIds: [
      'immigration-act-enforcement-decree',
      'immigration-act',
      'hikorea-visa-guide',
      'immigration-notices',
    ],
    tag: 'visa:e-7',
    topic: 'work',
  },
  {
    code: 'd-10',
    officialName: { ko: '구직', en: 'Job Seeking' },
    basis: 'enforcement-decree',
    codeLabel: 'D-10',
    sourceIds: [
      'immigration-act-enforcement-decree',
      'hikorea-visa-guide',
      'immigration-notices',
    ],
    tag: 'visa:d-10',
    topic: 'work',
  },
  {
    code: 'd-2',
    officialName: { ko: '유학', en: 'Study Abroad' },
    basis: 'enforcement-decree',
    codeLabel: 'D-2',
    sourceIds: [
      'immigration-act-enforcement-decree',
      'immigration-act',
      'hikorea-visa-guide',
      'immigration-notices',
    ],
    tag: 'visa:d-2',
    topic: 'residency',
  },
] as const;

export const findVisaSpine = (code: string): VisaSpine | undefined =>
  VISA_SPINES.find((s) => s.code === code);

/**
 * 공식 출처의 표시 정보.
 *
 * `BE/data/official-sources.json` 의 부분 사본이다. 위와 같은 이유로 여기 있고,
 * 같은 테스트가 대조한다. **URL 은 사람이 열 수 있는 공개 주소**여야 한다 —
 * 법제처 API 응답의 링크에는 우리 인증키가 박혀 있어 그대로 쓰면 새어 나간다.
 * → docs/20-product/10-features/12-official-data-pipeline.md
 */
export interface OfficialSourceRef {
  id: string;
  title: string;
  url: string;
  /** `statute` 는 전문 인용 가능, `notice`·`guide` 는 링크 + 최소 인용만 */
  kind: 'statute' | 'guide' | 'notice';
}

export const OFFICIAL_SOURCES: readonly OfficialSourceRef[] = [
  {
    id: 'immigration-act-enforcement-decree',
    title: '출입국관리법 시행령',
    url: 'https://www.law.go.kr/법령/출입국관리법시행령',
    kind: 'statute',
  },
  {
    id: 'immigration-act',
    title: '출입국관리법',
    url: 'https://www.law.go.kr/법령/출입국관리법',
    kind: 'statute',
  },
  {
    id: 'nationality-act',
    title: '국적법',
    url: 'https://www.law.go.kr/법령/국적법',
    kind: 'statute',
  },
  {
    id: 'hikorea-visa-guide',
    title: '하이코리아 — 공지사항',
    url: 'https://www.hikorea.go.kr/board/BoardNtcListR.pt?BBS_SEQ=1&BBS_GB_CD=BS10',
    kind: 'notice',
  },
  {
    id: 'immigration-notices',
    title: '출입국·외국인정책본부 공지사항',
    url: 'https://www.immigration.go.kr/immigration/1516/subview.do',
    kind: 'notice',
  },
] as const;

export const findSource = (id: string): OfficialSourceRef | undefined =>
  OFFICIAL_SOURCES.find((s) => s.id === id);
