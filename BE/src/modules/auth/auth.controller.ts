import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Public } from '../../common';
import { APP_CONFIG, type AppConfigGetter } from '../../config';
import { AuthService } from './auth.service';
import { TestLoginDto } from './dto/test-login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import type { RequestUser } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(APP_CONFIG) private readonly getConfig: AppConfigGetter,
  ) {}

  /**
   * ⚠️ **테스트 전용 로그인.** 운영에서는 404 다.
   *
   * 404 로 막는 이유(403 이 아니라): 존재 여부 자체를 알리지 않는다.
   * 설정 실수로 운영에 배포돼도 이 라우트는 **없는 것과 같다.**
   */
  @Public()
  @Post('login')
  login(@Body() dto: TestLoginDto) {
    if (this.getConfig().nodeEnv === 'production')
      throw new NotFoundException();
    return this.auth.testLogin(dto.nickname);
  }

  /** 현재 로그인 사용자. 토큰 유효성 확인에도 쓴다. */
  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return user;
  }
}
