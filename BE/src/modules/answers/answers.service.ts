import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { newId } from '../../common';
import type { RequestUser } from '../auth';
import { QuestionsService } from '../questions/questions.service';
import type { AnswerRecord } from './entities/answer.entity';
import {
  ANSWERS_REPOSITORY,
  type AnswersRepository,
} from './repositories/answers.repository';
import { sortAnswers, visibleAnswers } from './answers.utils';
import type { CreateAnswerDto } from './dto/create-answer.dto';
import type { UpdateAnswerDto } from './dto/update-answer.dto';

/**
 * 답변 서비스.
 *
 * `QuestionsService` 에 **한 방향으로만** 의존한다(답변 → 질문).
 * 질문이 답변을 import 하면 순환 참조가 되므로, 채택 시 답변 소유 검증은
 * 여기서 하고 질문 소유 검증은 QuestionsService 가 한다.
 */
@Injectable()
export class AnswersService {
  constructor(
    @Inject(ANSWERS_REPOSITORY)
    private readonly repository: AnswersRepository,
    private readonly questions: QuestionsService,
  ) {}

  async create(
    questionId: string,
    dto: CreateAnswerDto,
    user: RequestUser,
  ): Promise<AnswerRecord> {
    // 존재·공개 여부를 질문 서비스가 판정한다(숨김 글에는 답변할 수 없다)
    const question = await this.questions.findOne(questionId, user);
    if (question.status === 'HIDDEN') {
      throw new BadRequestException('Cannot answer a hidden question');
    }

    const now = new Date().toISOString();
    const record = await this.repository.create({
      id: newId(),
      questionId,
      authorId: user.id,
      authorNickname: user.nickname,
      body: dto.body,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    });

    await this.questions.adjustAnswerCount(questionId, 1);
    return record;
  }

  /**
   * 한 질문의 답변 목록.
   *
   * 채택 답변을 맨 위로 올리려면 질문의 `acceptedAnswerId` 가 필요하다 —
   * 그래서 질문을 함께 읽는다.
   */
  async listByQuestion(
    questionId: string,
    user?: RequestUser,
  ): Promise<AnswerRecord[]> {
    const question = await this.questions.findOne(questionId, user);
    const all = await this.repository.listByQuestion(questionId);
    return sortAnswers(
      visibleAnswers(all, user?.id),
      question.acceptedAnswerId,
    );
  }

  async update(
    id: string,
    dto: UpdateAnswerDto,
    user: RequestUser,
  ): Promise<AnswerRecord> {
    await this.requireOwned(id, user);
    const updated = await this.repository.update(id, { body: dto.body });
    if (!updated) throw new NotFoundException('Answer not found');
    return updated;
  }

  /**
   * 숨김 처리 — 질문과 같은 이유로 물리 삭제하지 않는다.
   *
   * 채택된 답변을 숨기면 **채택도 함께 해제한다.** 그러지 않으면 질문 상세에
   * "채택됨" 표시만 남고 내용이 없는 상태가 된다.
   */
  async hide(id: string, user: RequestUser): Promise<AnswerRecord> {
    const record = await this.requireOwned(id, user);

    const updated = await this.repository.update(id, { status: 'HIDDEN' });
    if (!updated) throw new NotFoundException('Answer not found');

    await this.questions.adjustAnswerCount(record.questionId, -1);

    const question = await this.questions.findOne(record.questionId, user);
    if (question.acceptedAnswerId === id) {
      // 질문 작성자가 아닐 수 있으므로 질문 소유자 권한으로 해제한다
      await this.questions.acceptAnswer(record.questionId, null, {
        id: question.authorId,
        nickname: question.authorNickname,
      });
    }
    return updated;
  }

  /**
   * 채택.
   *
   * 답변이 **그 질문의 것인지** 여기서 확인한다 — 다른 질문의 답변 id 를 보내면
   * 질문 상세에 존재하지 않는 답변이 채택된 것으로 남는다.
   */
  async accept(questionId: string, answerId: string, user: RequestUser) {
    const answer = await this.repository.findById(answerId);
    if (!answer || answer.questionId !== questionId) {
      throw new NotFoundException('Answer not found for this question');
    }
    if (answer.status !== 'OPEN') {
      throw new BadRequestException('Cannot accept a hidden answer');
    }
    return this.questions.acceptAnswer(questionId, answerId, user);
  }

  /** 채택 해제 — 질문 작성자만 */
  unaccept(questionId: string, user: RequestUser) {
    return this.questions.acceptAnswer(questionId, null, user);
  }

  private async requireOwned(
    id: string,
    user: RequestUser,
  ): Promise<AnswerRecord> {
    const record = await this.repository.findById(id);
    if (!record) throw new NotFoundException('Answer not found');
    if (record.authorId !== user.id) {
      throw new ForbiddenException('Only the author can modify this answer');
    }
    return record;
  }
}
