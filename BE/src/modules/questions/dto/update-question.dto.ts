import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { TOPICS, type Topic } from '../entities/question.entity';

/** 전부 선택 — 보낸 것만 바꾼다 */
export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  @Length(10, 200)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 20_000)
  body?: string;

  @IsOptional()
  @IsIn(TOPICS)
  topic?: Topic;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
