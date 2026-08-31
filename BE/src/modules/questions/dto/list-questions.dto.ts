import { Transform } from 'class-transformer';
import { IsBooleanString, IsIn, IsOptional, IsString } from 'class-validator';
import {
  POST_TYPES,
  TOPICS,
  type PostType,
  type Topic,
} from '../entities/question.entity';

/**
 * 목록 쿼리.
 *
 * 쿼리 스트링은 전부 문자열로 오므로 `@Transform` 으로 형을 맞춘다.
 * `tags` 는 `?tags=visa:d-2&tags=region:seoul` 도 `?tags=a,b` 도 받는다 —
 * 클라이언트마다 직렬화가 달라서 한쪽만 지원하면 조용히 필터가 빠진다.
 */
export class ListQuestionsDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @IsOptional()
  @IsIn(TOPICS)
  topic?: Topic;

  /**
   * 필터는 `POST_TYPES` 전체를 받는다 — 생성과 달리 좁히지 않는다.
   * 아직 못 만드는 종류로 걸러도 빈 목록이 나올 뿐 틀린 결과는 아니고,
   * 작성 폼이 열릴 때 여기를 또 고치지 않아도 된다.
   */
  @IsOptional()
  @IsIn(POST_TYPES)
  type?: PostType;

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  tags?: string[];

  /** 이 중 **하나라도** 가진 질문 (OR). `tags`(AND) 와 함께 걸면 교집합이다. */
  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  anyTags?: string[];

  /** 검색어. 트림 후 비면 필터 없음으로 수렴한다 */
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBooleanString()
  answered?: string;
}
