import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { TOPICS, type Topic } from '../entities/question.entity';
import {
  QUESTION_BODY_MAX,
  QUESTION_BODY_MIN,
  QUESTION_TITLE_MAX,
  QUESTION_TITLE_MIN,
} from '../questions.constants';

export class CreateQuestionDto {
  /**
   * 제목이 곧 검색어가 된다 — 최소 길이를 두는 이유다.
   * "help" 같은 제목은 검색으로 아무도 찾지 못한다.
   */
  @IsString()
  @Length(QUESTION_TITLE_MIN, QUESTION_TITLE_MAX)
  title!: string;

  @IsString()
  @Length(QUESTION_BODY_MIN, QUESTION_BODY_MAX)
  body!: string;

  @IsIn(TOPICS)
  topic!: Topic;

  /** 정규화·중복 제거·상한은 서비스가 한다 — DTO 는 모양만 본다 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
