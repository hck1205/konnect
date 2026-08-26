import { Transform } from 'class-transformer';
import { IsBooleanString, IsIn, IsOptional, IsString } from 'class-validator';
import { TOPICS, type Topic } from '../entities/question.entity';

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

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  tags?: string[];

  /** 검색어. 트림 후 비면 필터 없음으로 수렴한다 */
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBooleanString()
  answered?: string;
}
