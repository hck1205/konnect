import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../../prisma/prisma.service';
import { clampLimit, newId, type Page } from '../../../common';
import { parseTag } from '../../tags';
import type { QuestionRecord } from '../entities/question.entity';
import type {
  QuestionListFilter,
  QuestionsRepository,
} from './questions.repository';
import {
  toPrismaPostType,
  toPrismaTopic,
  toQuestionRecord,
} from './questions.mapper';

const INCLUDE = {
  author: { select: { nickname: true } },
  // 입력 순서를 지켜 읽는다 — 조인 결과의 순서는 보장되지 않는다
  tags: { include: { tag: true }, orderBy: { position: 'asc' } },
} as const;

/**
 * Prisma 질문 저장소.
 *
 * 인메모리 구현이 계약의 정의이고, 필터·정렬 의미는 `questions.utils` 의
 * 순수 함수와 그 테스트가 기준이다. 여기서는 그 의미를 SQL 로 옮긴다.
 *
 * **두 구현이 같은 e2e 를 통과해야 한다** — `DB_DRIVER` 만 바꿔 같은 테스트를 돌린다.
 */
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(record: QuestionRecord): Promise<QuestionRecord> {
    // 태그는 트랜잭션 안에서 함께 처리해야 질문만 만들어지고 태그가 빠지는
    // 중간 상태가 남지 않는다
    const row = await this.prisma.$transaction(async (tx) => {
      const tagIds = await upsertTags(tx, record.tags);

      return tx.question.create({
        data: {
          id: record.id,
          authorId: record.authorId,
          title: record.title,
          body: record.body,
          topic: toPrismaTopic(record.topic),
          type: toPrismaPostType(record.type),
          status: record.status,
          acceptedAnswerId: record.acceptedAnswerId,
          answerCount: record.answerCount,
          tags: { create: tagIds },
        },
        include: INCLUDE,
      });
    });

    return toQuestionRecord(row);
  }

  async findById(id: string): Promise<QuestionRecord | null> {
    const row = await this.prisma.question.findUnique({
      where: { id },
      include: INCLUDE,
    });
    return row ? toQuestionRecord(row) : null;
  }

  async list(filter: QuestionListFilter): Promise<Page<QuestionRecord>> {
    const limit = clampLimit(filter.limit);

    const where: Prisma.QuestionWhereInput = {
      status: 'OPEN',
      ...(filter.topic && { topic: toPrismaTopic(filter.topic) }),
      ...(filter.type && { type: toPrismaPostType(filter.type) }),
      ...(filter.authorId && { authorId: filter.authorId }),
      ...(filter.answered !== undefined && {
        answerCount: filter.answered ? { gt: 0 } : 0,
      }),
      // 태그는 AND — 각 태그마다 조건을 하나씩 건다.
      // `some` 을 하나로 묶으면 OR 이 되어 태그를 더할수록 결과가 넓어진다.
      ...(filter.tags?.length && {
        AND: filter.tags.map((raw) => ({
          tags: { some: { tag: { raw } } },
        })),
      }),
      // anyTags 는 OR — `some` 안에 `in` 을 쓰면 "이 중 하나라도" 가 된다.
      // 위의 AND 처럼 조건을 쪼개면 안 된다(그러면 전부 가진 것만 남는다).
      ...(filter.anyTags?.length && {
        tags: { some: { tag: { raw: { in: filter.anyTags } } } },
      }),
      ...(filter.query && {
        OR: [
          { title: { contains: filter.query, mode: 'insensitive' } },
          { body: { contains: filter.query, mode: 'insensitive' } },
        ],
      }),
    };

    // id 가 UUIDv7 이라 **id 역순 = 최신순**이다.
    // 커서보다 작은 id 를 가져오면 그게 "그 다음 페이지"다.
    const rows = await this.prisma.question.findMany({
      where: filter.cursor ? { ...where, id: { lt: filter.cursor } } : where,
      orderBy: { id: 'desc' },
      // limit + 1 로 다음 페이지 유무를 판단한다(count 쿼리 없음)
      take: limit + 1,
      include: INCLUDE,
    });

    const items = rows.slice(0, limit).map((r) => toQuestionRecord(r));
    const hasMore = rows.length > limit;

    return {
      items,
      nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
    };
  }

  async update(
    id: string,
    patch: Partial<QuestionRecord>,
  ): Promise<QuestionRecord | null> {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) return null;

    const row = await this.prisma.$transaction(async (tx) => {
      if (patch.tags) {
        // 태그는 통째로 교체한다 — 부분 갱신은 어떤 태그가 빠졌는지 계산해야 하고
        // 그 계산이 틀리면 유령 태그가 남는다
        await tx.questionTag.deleteMany({ where: { questionId: id } });
        const tagIds = await upsertTags(tx, patch.tags);
        await tx.questionTag.createMany({
          data: tagIds.map((t) => ({ questionId: id, ...t })),
        });
      }

      return tx.question.update({
        where: { id },
        data: {
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.body !== undefined && { body: patch.body }),
          ...(patch.topic !== undefined && {
            topic: toPrismaTopic(patch.topic),
          }),
          ...(patch.type !== undefined && {
            type: toPrismaPostType(patch.type),
          }),
          ...(patch.status !== undefined && { status: patch.status }),
          ...(patch.acceptedAnswerId !== undefined && {
            acceptedAnswerId: patch.acceptedAnswerId,
          }),
          ...(patch.answerCount !== undefined && {
            answerCount: patch.answerCount,
          }),
        },
        include: INCLUDE,
      });
    });

    return toQuestionRecord(row);
  }
}

/** 트랜잭션 클라이언트 — `$transaction` 콜백이 받는 타입 */
type TxClient = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

/**
 * 태그를 없으면 만들고 있으면 잇는다(upsert), 입력 순서와 함께.
 *
 * create 와 update 가 **같은 코드를 각자** 갖고 있었다 — 한쪽만 고치면
 * 새 글과 수정한 글의 태그 처리가 갈라진다(가장 늦게 발견되는 종류다).
 */
async function upsertTags(
  tx: TxClient,
  tags: readonly string[],
): Promise<{ tagId: string; position: number }[]> {
  return Promise.all(
    tags.map(async (raw, position) => {
      const parsed = parseTag(raw);
      const tag = await tx.tag.upsert({
        where: { raw: parsed.raw },
        update: {},
        create: {
          id: newId(),
          namespace: parsed.namespace,
          value: parsed.value,
          raw: parsed.raw,
        },
      });
      return { tagId: tag.id, position };
    }),
  );
}
