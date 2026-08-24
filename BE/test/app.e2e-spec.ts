import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { applyGlobalHarness } from '../src/app.setup';
import type { ApiResponse } from '../src/common';

/**
 * 부팅 스모크 e2e — 전역 하네스(응답 봉투)와 헬스체크가 살아 있는지만 본다.
 * DB_DRIVER 미설정이라 인메모리로 뜬다(Postgres 불필요).
 */
describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = applyGlobalHarness(moduleFixture.createNestApplication());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / — 응답이 { data, timestamp } 봉투로 감싸진다', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    const body = res.body as ApiResponse<string>;
    expect(body.data).toBe('konnect API');
    expect(typeof body.timestamp).toBe('string');
  });

  it('GET /health — status ok', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    const body = res.body as ApiResponse<{ status: string }>;
    expect(body.data.status).toBe('ok');
  });
});
