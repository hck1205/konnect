import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 전역 Prisma 모듈. AppModule에 한 번만 import 하면 PrismaService를 어디서나 주입할 수 있다.
 * 각 도메인 모듈의 저장소 팩토리가 DB_DRIVER='prisma'일 때 PrismaService를 주입해
 * Prisma 저장소를 조립한다.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
