import type { Page, PageQuery } from '../../../common';
import type {
  PostType,
  QuestionRecord,
  Topic,
} from '../entities/question.entity';

export const QUESTIONS_REPOSITORY = Symbol('QUESTIONS_REPOSITORY');

export interface QuestionListFilter extends PageQuery {
  topic?: Topic;
  /** 게시판의 두 번째 축. topic 과 함께 걸리면 `topic × type` 이 된다. */
  type?: PostType;
  /** 이 태그를 **모두** 가진 질문 (AND). OR 이면 필터가 넓어져 쓸모가 없다. */
  tags?: string[];
  /**
   * 이 태그를 **하나라도** 가진 질문 (OR).
   *
   * `tags`(AND) 와 다른 축이고 함께 걸면 교집합이다 — "베트남어나 중국어로 쓰였고(OR),
   * 동시에 F-2 태그가 붙은(AND)" 같은 질의가 이것으로 성립한다.
   *
   * 왜 필요한가: 여러 값을 하나로 묶어 보는 화면은 전부 OR 이다(언어권, 관련 비자 묶음,
   * 별칭이 여럿인 태그). 지금 그런 화면은 없지만 **AND 만으로는 표현 자체가 불가능**하고,
   * 나중에 넣으면 저장소 두 곳과 DTO 를 함께 고쳐야 한다.
   * → docs/50-decisions/0008-nationality-as-tag-not-space.md 의 추기
   */
  anyTags?: string[];
  /** 정규화된 검색어. null 이면 필터 없음. */
  query?: string | null;
  /** 답변 유무 필터 — "아직 답 없는 질문"을 찾는 답변자용 */
  answered?: boolean;
  /**
   * 작성자로 거른다.
   *
   * ⚠️ **지금은 어떤 API 도 이 값을 넘기지 않는다** — `ListQuestionsDto` 에 없다.
   * 죽은 코드처럼 보이지만 계획된 `/[locale]/me`(내 질문)가 쓸 자리이고,
   * 두 드라이버에 이미 같은 의미로 구현돼 있다.
   * 지웠다가 다시 넣는 비용이 이 주석보다 크다 —
   * `POST_TYPES` 에 값 넷을 두고 하나만 생성 가능하게 한 것과 같은 판단이다.
   * → docs/30-architecture/07-routes-and-indexing.md
   */
  authorId?: string;
}

export interface QuestionsRepository {
  create(record: QuestionRecord): Promise<QuestionRecord>;
  findById(id: string): Promise<QuestionRecord | null>;
  list(filter: QuestionListFilter): Promise<Page<QuestionRecord>>;
  update(
    id: string,
    patch: Partial<QuestionRecord>,
  ): Promise<QuestionRecord | null>;
}
