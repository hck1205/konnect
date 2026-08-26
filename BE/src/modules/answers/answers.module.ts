import { Module } from '@nestjs/common';
import { repositoryProvider } from '../../prisma/repository.provider';
import { QuestionsModule } from '../questions';
import {
  AnswersController,
  QuestionAnswersController,
} from './answers.controller';
import { AnswersService } from './answers.service';
import {
  ANSWERS_REPOSITORY,
  type AnswersRepository,
} from './repositories/answers.repository';
import { InMemoryAnswersRepository } from './repositories/answers.memory.repository';
import { PrismaAnswersRepository } from './repositories/answers.prisma.repository';

@Module({
  // 답변 → 질문 단방향. 질문이 답변을 import 하면 순환 참조가 된다.
  imports: [QuestionsModule],
  controllers: [QuestionAnswersController, AnswersController],
  providers: [
    AnswersService,
    repositoryProvider<AnswersRepository>(
      ANSWERS_REPOSITORY,
      InMemoryAnswersRepository,
      PrismaAnswersRepository,
    ),
  ],
  exports: [AnswersService],
})
export class AnswersModule {}
