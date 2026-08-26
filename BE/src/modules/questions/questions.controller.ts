import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../common';
import { CurrentUser, type RequestUser } from '../auth';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ListQuestionsDto } from './dto/list-questions.dto';

/**
 * 질문 API.
 *
 * **Read 는 공개, Write 는 인증 + 작성자 본인**이다.
 * 검색으로 들어온 사용자가 로그인 벽에 막히면 안 된다 — 유입이 주 채널이다.
 * → docs/30-architecture/03-api-conventions.md
 *
 * 공개 라우트에도 토큰이 있으면 해석된다(가드가 처리) — 그래서 목록·상세에서
 * 로그인 사용자에게 자기 숨김 글을 보여줄 수 있다.
 */
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  @Public()
  @Get()
  list(@Query() query: ListQuestionsDto) {
    return this.questions.list(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: RequestUser) {
    return this.questions.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateQuestionDto, @CurrentUser() user: RequestUser) {
    return this.questions.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.questions.update(id, dto, user);
  }

  /** 물리 삭제가 아니라 숨김이다 — 링크와 답변의 맥락을 남긴다 */
  @Delete(':id')
  hide(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.questions.hide(id, user);
  }
}
