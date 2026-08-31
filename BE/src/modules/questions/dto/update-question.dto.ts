import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { TOPICS, type Topic } from '../entities/question.entity';
import {
  QUESTION_BODY_MAX,
  QUESTION_BODY_MIN,
  QUESTION_TITLE_MAX,
  QUESTION_TITLE_MIN,
} from '../questions.constants';

/**
 * 전부 선택 — 보낸 것만 바꾼다.
 *
 * **`type` 은 일부러 없다.** 빠뜨린 것이 아니다.
 * 지금 만들 수 있는 종류는 `question` 하나뿐인데 수정으로 종류를 바꿀 수 있으면
 * **읽을 화면이 없는 글**이 생긴다. 게다가 질문에는 채택된 답변과 답변 수가
 * 붙어 있어서, 후기로 바꾸는 순간 그 데이터가 갈 곳을 잃는다.
 * 나머지 종류의 작성 폼이 생길 때 함께 다시 볼 항목이다.
 */
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
