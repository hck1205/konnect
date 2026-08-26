import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '../../common';
import { CurrentUser, type RequestUser } from '../auth';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

/**
 * 질문에 딸린 답변 API.
 *
 * 경로를 `/questions/:questionId/answers` 로 두는 이유: 답변은 **질문 없이
 * 존재하지 않는다**. 최상위 `/answers` 로 두면 목록 조회에 항상 questionId 를
 * 쿼리로 받아야 하고, 그 관계가 URL 에서 사라진다.
 *
 * 단건 수정·삭제는 `/answers/:id`(별도 컨트롤러) — 질문 id 없이도 식별되기 때문이다.
 */
@Controller('questions/:questionId/answers')
export class QuestionAnswersController {
  constructor(private readonly answers: AnswersService) {}

  @Public()
  @Get()
  list(
    @Param('questionId') questionId: string,
    @CurrentUser() user?: RequestUser,
  ) {
    return this.answers.listByQuestion(questionId, user);
  }

  @Post()
  create(
    @Param('questionId') questionId: string,
    @Body() dto: CreateAnswerDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.answers.create(questionId, dto, user);
  }

  /** 채택 — 질문 작성자만. 답변이 그 질문의 것인지도 확인한다. */
  @Post(':answerId/accept')
  accept(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.answers.accept(questionId, answerId, user);
  }

  @Delete('accepted')
  unaccept(
    @Param('questionId') questionId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.answers.unaccept(questionId, user);
  }
}

/** 답변 단건 조작 — 질문 id 없이 식별된다 */
@Controller('answers')
export class AnswersController {
  constructor(private readonly answers: AnswersService) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnswerDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.answers.update(id, dto, user);
  }

  @Delete(':id')
  hide(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.answers.hide(id, user);
  }
}
