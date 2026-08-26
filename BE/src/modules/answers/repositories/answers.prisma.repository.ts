import type { PrismaService } from '../../../prisma/prisma.service';
import type { AnswerRecord } from '../entities/answer.entity';
import type { AnswersRepository } from './answers.repository';

type Row = {
  id: string;
  questionId: string;
  authorId: string;
  body: string;
  status: 'OPEN' | 'HIDDEN';
  createdAt: Date;
  updatedAt: Date;
  author: { nickname: string };
};

const INCLUDE = { author: { select: { nickname: true } } } as const;

const toRecord = (row: Row): AnswerRecord => ({
  id: row.id,
  questionId: row.questionId,
  authorId: row.authorId,
  authorNickname: row.author.nickname,
  body: row.body,
  status: row.status,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

/**
 * Prisma 답변 저장소.
 *
 * 정렬은 하지 않는다 — 채택 우선 정렬은 질문의 `acceptedAnswerId` 가 필요해서
 * 서비스가 `answers.utils.sortAnswers` 로 한다. 저장소는 **가져오기만** 한다.
 */
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(record: AnswerRecord): Promise<AnswerRecord> {
    const row = await this.prisma.answer.create({
      data: {
        id: record.id,
        questionId: record.questionId,
        authorId: record.authorId,
        body: record.body,
        status: record.status,
      },
      include: INCLUDE,
    });
    return toRecord(row);
  }

  async findById(id: string): Promise<AnswerRecord | null> {
    const row = await this.prisma.answer.findUnique({
      where: { id },
      include: INCLUDE,
    });
    return row ? toRecord(row) : null;
  }

  async listByQuestion(questionId: string): Promise<AnswerRecord[]> {
    const rows = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: { id: 'asc' },
      include: INCLUDE,
    });
    return rows.map(toRecord);
  }

  async update(
    id: string,
    patch: Partial<AnswerRecord>,
  ): Promise<AnswerRecord | null> {
    const existing = await this.prisma.answer.findUnique({ where: { id } });
    if (!existing) return null;

    const row = await this.prisma.answer.update({
      where: { id },
      data: {
        ...(patch.body !== undefined && { body: patch.body }),
        ...(patch.status !== undefined && { status: patch.status }),
      },
      include: INCLUDE,
    });
    return toRecord(row);
  }
}
