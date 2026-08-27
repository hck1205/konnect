import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { TOPICS, type Topic } from '../entities/question.entity';
import {
  QUESTION_BODY_MAX,
  QUESTION_BODY_MIN,
  QUESTION_TITLE_MAX,
  QUESTION_TITLE_MIN,
} from '../questions.constants';

/** 전부 선택 — 보낸 것만 바꾼다 */
export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  @Length(QUESTION_TITLE_MIN, QUESTION_TITLE_MAX)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(QUESTION_BODY_MIN, QUESTION_BODY_MAX)
  body?: string;

  @IsOptional()
  @IsIn(TOPICS)
  topic?: Topic;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
