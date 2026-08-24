import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common';

/**
 * 헬스체크 엔드포인트. 배포/로드밸런서 상태 확인용.
 */
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
