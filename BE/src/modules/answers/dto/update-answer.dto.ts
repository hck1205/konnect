import { IsString, Length } from 'class-validator';
import { ANSWER_BODY_MAX, ANSWER_BODY_MIN } from '../answers.constants';

export class UpdateAnswerDto {
  @IsString()
  @Length(ANSWER_BODY_MIN, ANSWER_BODY_MAX)
  body!: string;
}
