import { IsString, Length } from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @Length(20, 20_000)
  body!: string;
}
