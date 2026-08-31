import {
  Prisma,
  type ContentStatus,
  type PostType as PrismaPostType,
  type Topic as PrismaTopic,
} from '@prisma/client';
import type {
  PostType,
  QuestionRecord,
  Topic,
} from '../entities/question.entity';

/**
 * 도메인 ↔ Prisma 변환.
 *
 * 도메인은 소문자 문자열(`'visa'`)을, DB 는 enum(`VISA`)을 쓴다.
 * 이 경계를 한 파일에 모으는 이유: 변환이 흩어지면 한쪽만 바뀌어
 * "저장은 됐는데 조회가 안 되는" 종류의 버그가 난다.
 */

/** Prisma 가 돌려주는 질문 + 태그 조인 결과 */
export type QuestionWithTags = Prisma.QuestionGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

export const toPrismaTopic = (topic: Topic): PrismaTopic =>
  topic.toUpperCase() as PrismaTopic;

export const toDomainTopic = (topic: PrismaTopic): Topic =>
  topic.toLowerCase() as Topic;

export const toPrismaPostType = (type: PostType): PrismaPostType =>
  type.toUpperCase() as PrismaPostType;

export const toDomainPostType = (type: PrismaPostType): PostType =>
  type.toLowerCase() as PostType;

export const toPrismaStatus = (status: 'OPEN' | 'HIDDEN'): ContentStatus =>
  status;

export function toQuestionRecord(
  row: QuestionWithTags & { author: { nickname: string } },
): QuestionRecord {
  return {
    id: row.id,
    authorId: row.authorId,
    authorNickname: row.author.nickname,
    title: row.title,
    body: row.body,
    topic: toDomainTopic(row.topic),
    type: toDomainPostType(row.type),
    // 입력 순서를 지킨다 — 인메모리 구현과 **같은 계약**이어야 한다.
    // 정렬해 버리면 "먼저 적은 태그가 앞"이라는 의미가 사라진다.
    // (조회 시 position 으로 정렬해서 가져오므로 여기서는 그대로 쓴다)
    tags: row.tags.map((t) => t.tag.raw),
    acceptedAnswerId: row.acceptedAnswerId,
    status: row.status,
    answerCount: row.answerCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
