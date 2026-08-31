import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assertOwned, newId, type Page } from '../../common';
import { string as stringUtil } from '../../utils';
import { MAX_TAGS_PER_POST, normalizeTagList } from '../tags';
import type { RequestUser } from '../auth';
import type { QuestionRecord } from './entities/question.entity';
import {
  QUESTIONS_REPOSITORY,
  type QuestionsRepository,
} from './repositories/questions.repository';
import type { CreateQuestionDto } from './dto/create-question.dto';
import type { UpdateQuestionDto } from './dto/update-question.dto';
import type { ListQuestionsDto } from './dto/list-questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly repository: QuestionsRepository,
  ) {}

  async create(
    dto: CreateQuestionDto,
    user: RequestUser,
  ): Promise<QuestionRecord> {
    const now = new Date().toISOString();
    return this.repository.create({
      id: newId(),
      authorId: user.id,
      authorNickname: user.nickname,
      title: dto.title.trim(),
      body: dto.body,
      topic: dto.topic,
      // 생략하면 질문이다 — 이 필드가 생기기 전과 같게 동작한다
      type: dto.type ?? 'question',
      tags: normalizeTagList(dto.tags ?? [], MAX_TAGS_PER_POST),
      acceptedAnswerId: null,
      status: 'OPEN',
      answerCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  list(dto: ListQuestionsDto): Promise<Page<QuestionRecord>> {
    return this.repository.list({
      cursor: dto.cursor,
      limit: dto.limit ?? 20,
      topic: dto.topic,
      type: dto.type,
      // 필터 태그도 저장 형태로 정규화한다 — 'D-2' 로 검색해도 찾아져야 한다
      tags: normalizeTagList(dto.tags ?? [], MAX_TAGS_PER_POST),
      anyTags: normalizeTagList(dto.anyTags ?? [], MAX_TAGS_PER_POST),
      query: stringUtil.normalizeQuery(dto.q),
      answered:
        dto.answered === undefined ? undefined : dto.answered === 'true',
    });
  }

  /**
   * 상세.
   *
   * 숨김 글은 **작성자에게만** 보인다. 완전히 404 로 막으면 작성자가 자기 글을
   * 되살릴 방법이 없고, 누구에게나 보이면 숨김의 의미가 없다.
   */
  async findOne(id: string, user?: RequestUser): Promise<QuestionRecord> {
    const record = await this.repository.findById(id);
    if (!record) throw new NotFoundException('Question not found');
    if (record.status === 'HIDDEN' && record.authorId !== user?.id) {
      throw new NotFoundException('Question not found');
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateQuestionDto,
    user: RequestUser,
  ): Promise<QuestionRecord> {
    const record = await this.requireOwned(id, user);

    const updated = await this.repository.update(id, {
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.body !== undefined && { body: dto.body }),
      ...(dto.topic !== undefined && { topic: dto.topic }),
      ...(dto.tags !== undefined && {
        tags: normalizeTagList(dto.tags, MAX_TAGS_PER_POST),
      }),
    });
    return updated ?? record;
  }

  /**
   * 숨김 처리.
   *
   * **물리 삭제하지 않는다.** 답변이 달린 질문을 지우면 링크가 죽고 그 답변들이
   * 무엇에 대한 답인지 알 수 없게 된다. 검색 유입이 주 채널이라 죽은 링크는 손실이다.
   * → docs/20-product/10-features/02-qna.md
   */
  async hide(id: string, user: RequestUser): Promise<QuestionRecord> {
    await this.requireOwned(id, user);
    const updated = await this.repository.update(id, { status: 'HIDDEN' });
    if (!updated) throw new NotFoundException('Question not found');
    return updated;
  }

  /**
   * 답변 채택 — **사용자 요청 경로**다.
   *
   * 답변 소유 검증은 호출부(AnswersService)가 하고, 여기서는 **질문 소유권**만 본다.
   * 두 모듈이 서로를 import 하면 순환 참조가 되므로 경계를 이렇게 나눈다.
   */
  async acceptAnswer(
    questionId: string,
    answerId: string | null,
    user: RequestUser,
  ): Promise<QuestionRecord> {
    const record = await this.requireOwned(questionId, user);
    if (record.status === 'HIDDEN') {
      throw new BadRequestException(
        'Cannot accept an answer on a hidden question',
      );
    }
    const updated = await this.repository.update(questionId, {
      acceptedAnswerId: answerId,
    });
    return updated ?? record;
  }

  /**
   * 채택 해제 — **시스템 경로**다(사용자 요청이 아니다).
   *
   * 채택된 답변이 숨겨지면 채택도 풀려야 하는데, 그 답변을 숨긴 사람은
   * 질문 작성자가 아닐 수 있다. 예전에는 질문 작성자 **행세를 하는 객체를 만들어**
   * `acceptAnswer` 를 불렀다 — 권한 검사를 통과시키려고 사용자를 위조한 셈이라,
   * 나중에 권한 규칙이 바뀌면 이 우회로가 조용히 규칙을 벗어난다.
   *
   * 시스템 연산은 **사용자용 권한 경로를 재사용하지 않는다.** 권한 검사가 없는
   * 별도 메서드로 두면 "누가 부를 수 있는가"가 이름에서 드러난다.
   */
  async clearAcceptedAnswer(questionId: string): Promise<void> {
    await this.repository.update(questionId, { acceptedAnswerId: null });
  }

  /** 답변 수 증감 — AnswersService 가 호출한다 */
  async adjustAnswerCount(questionId: string, delta: number): Promise<void> {
    const record = await this.repository.findById(questionId);
    if (!record) return;
    await this.repository.update(questionId, {
      answerCount: Math.max(record.answerCount + delta, 0),
    });
  }

  /** 존재 + 소유 확인. 없으면 404, 남의 것이면 403. */
  /** 존재 + 소유 확인 — 규칙은 `common/assertOwned` 하나뿐이다 */
  private async requireOwned(
    id: string,
    user: RequestUser,
  ): Promise<QuestionRecord> {
    return assertOwned(await this.repository.findById(id), user.id, 'Question');
  }
}
