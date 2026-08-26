import { Module } from '@nestjs/common';
import { repositoryProvider } from '../../prisma/repository.provider';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import {
  QUESTIONS_REPOSITORY,
  type QuestionsRepository,
} from './repositories/questions.repository';
import { InMemoryQuestionsRepository } from './repositories/questions.memory.repository';
import { PrismaQuestionsRepository } from './repositories/questions.prisma.repository';

@Module({
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    // 제네릭을 **인터페이스로 명시**한다 — 생략하면 인메모리 구현에서 추론되어
    // 두 구현의 private 필드까지 같아야 하는 잘못된 제약이 걸린다
    repositoryProvider<QuestionsRepository>(
      QUESTIONS_REPOSITORY,
      InMemoryQuestionsRepository,
      PrismaQuestionsRepository,
    ),
  ],
  // AnswersModule 이 QuestionsService 를 쓴다(답변 → 질문 단방향)
  exports: [QuestionsService],
})
export class QuestionsModule {}
