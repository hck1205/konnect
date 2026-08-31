import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import {
  CREATABLE_POST_TYPES,
  TOPICS,
  type PostType,
  type Topic,
} from '../entities/question.entity';
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

  /**
   * 생략하면 `question` 이다 — 이 필드가 생기기 전과 같게 동작한다.
   *
   * `POST_TYPES` 전체가 아니라 `CREATABLE_POST_TYPES` 로 좁히는 이유:
   * enum 에 값이 있다고 만들 수 있는 것은 아니다. 후기·모집은 각자의 작성 폼과
   * 화면이 생겨야 성립하는데, 지금 받아 주면 **읽을 화면이 없는 글**이 쌓인다.
   */
  @IsOptional()
  @IsIn(CREATABLE_POST_TYPES)
  type?: PostType;

  /** 정규화·중복 제거·상한은 서비스가 한다 — DTO 는 모양만 본다 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
