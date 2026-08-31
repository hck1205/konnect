import { Test, type TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { applyGlobalHarness } from '../src/app.setup';
import type { ApiResponse } from '../src/common';
import { resetDatabase } from './e2e.utils';

/**
 * Q&A e2e — **권한 규칙이 서버에서 강제되는지**가 핵심이다.
 * FE 의 버튼 숨김은 UX 일 뿐 보안이 아니다.
 *
 * DB_DRIVER 미설정이라 인메모리로 뜬다(Postgres 불필요).
 */
describe('Q&A (e2e)', () => {
  let app: INestApplication<App>;
  let http: App;

  const login = async (nickname: string) => {
    const res = await request(http)
      .post('/auth/login')
      .send({ nickname })
      .expect(201);
    const body = res.body as ApiResponse<{
      token: string;
      user: { id: string };
    }>;
    return body.data;
  };

  const createQuestion = async (token: string, overrides: object = {}) => {
    const res = await request(http)
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Can I change from D-2 to E-7 before I graduate?',
        body: 'I have an offer from a company in Seoul but my degree finishes in February.',
        topic: 'residency',
        tags: ['Visa:D_2', 'visa:d-2', 'region:seoul'],
        ...overrides,
      })
      .expect(201);
    return (res.body as ApiResponse<{ id: string; tags: string[] }>).data;
  };

  const createAnswer = async (token: string, questionId: string) => {
    const res = await request(http)
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: 'I went through this last year. The office asked for the certificate.',
      })
      .expect(201);
    return (res.body as ApiResponse<{ id: string }>).data;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = applyGlobalHarness(moduleFixture.createNestApplication());
    await app.init();
    http = app.getHttpServer();

    // 인메모리는 앱마다 새로 비지만 DB 는 남는다 — 두 드라이버의 전제를 맞춘다
    await resetDatabase(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('인증', () => {
    it('테스트 로그인이 토큰과 사용자를 준다', async () => {
      const { token, user } = await login('Maria');
      expect(typeof token).toBe('string');
      expect(user.id).toBeTruthy();
    });

    it('토큰 없이 /auth/me 는 401', async () => {
      await request(http).get('/auth/me').expect(401);
    });

    it('깨진 토큰은 401', async () => {
      await request(http)
        .get('/auth/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });

  describe('작성 권한 — Read 공개, Write 인증', () => {
    it('비회원은 목록을 볼 수 있다 (검색 유입이 벽에 막히면 안 된다)', async () => {
      await request(http).get('/questions').expect(200);
    });

    it('비회원은 질문을 쓸 수 없다', async () => {
      await request(http)
        .post('/questions')
        .send({
          title: 'x'.repeat(20),
          body: 'y'.repeat(30),
          topic: 'residency',
        })
        .expect(401);
    });

    it('제목이 너무 짧으면 400 — 제목이 곧 검색어다', async () => {
      const { token } = await login('Maria');
      await request(http)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'help', body: 'y'.repeat(30), topic: 'residency' })
        .expect(400);
    });

    it('모르는 주제는 400', async () => {
      const { token } = await login('Maria');
      await request(http)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'x'.repeat(20), body: 'y'.repeat(30), topic: 'weather' })
        .expect(400);
    });
  });

  describe('글 종류(type) — 게시판의 두 번째 축', () => {
    it('생략하면 question 이다 — 이 필드가 생기기 전과 같게 동작한다', async () => {
      const { token } = await login('Maria');
      const question = await createQuestion(token);

      const res = await request(http)
        .get(`/questions/${question.id}`)
        .expect(200);
      expect((res.body as ApiResponse<{ type: string }>).data.type).toBe(
        'question',
      );
    });

    it('아직 작성 폼이 없는 종류는 400 — 값이 있다고 만들 수 있는 것은 아니다', async () => {
      const { token } = await login('Maria');
      await request(http)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'x'.repeat(20),
          body: 'y'.repeat(30),
          topic: 'residency',
          type: 'review',
        })
        .expect(400);
    });

    it('모르는 종류는 400', async () => {
      const { token } = await login('Maria');
      await request(http)
        .post('/questions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'x'.repeat(20),
          body: 'y'.repeat(30),
          topic: 'residency',
          type: 'rant',
        })
        .expect(400);
    });

    it('type 으로 목록을 거른다 — topic 과 함께 걸면 topic × type 이다', async () => {
      const { token } = await login('Maria');
      await createQuestion(token);

      const hit = await request(http)
        .get('/questions?topic=residency&type=question')
        .expect(200);
      expect(
        (hit.body as ApiResponse<{ items: unknown[] }>).data.items.length,
      ).toBe(1);

      // 아직 아무도 못 만드는 종류라 비어야 한다 — 필터는 전체 어휘를 받는다
      const miss = await request(http)
        .get('/questions?topic=residency&type=recruit')
        .expect(200);
      expect(
        (miss.body as ApiResponse<{ items: unknown[] }>).data.items.length,
      ).toBe(0);
    });

    it('anyTags 는 OR 다 — 두 드라이버가 같은 의미를 내야 한다', async () => {
      const { token } = await login('Maria');
      // 기본 질문은 visa:d-2 · region:seoul 을 가진다
      await createQuestion(token);

      // 하나라도 맞으면 나온다
      const hit = await request(http)
        .get('/questions?anyTags=visa:d-2,visa:f-5')
        .expect(200);
      expect(
        (hit.body as ApiResponse<{ items: unknown[] }>).data.items.length,
      ).toBe(1);

      // 하나도 없으면 안 나온다
      const miss = await request(http)
        .get('/questions?anyTags=visa:f-5,visa:e-7')
        .expect(200);
      expect(
        (miss.body as ApiResponse<{ items: unknown[] }>).data.items.length,
      ).toBe(0);

      // AND 와 함께 걸면 교집합이다 — OR 는 맞는데 AND 가 틀리면 안 나온다
      const both = await request(http)
        .get('/questions?anyTags=visa:d-2,visa:f-5&tags=region:busan')
        .expect(200);
      expect(
        (both.body as ApiResponse<{ items: unknown[] }>).data.items.length,
      ).toBe(0);
    });

    it('수정으로 종류를 바꿀 수 없다 — 읽을 화면이 없는 글이 생긴다', async () => {
      const { token } = await login('Maria');
      const question = await createQuestion(token);

      // whitelist 가 모르는 필드를 조용히 버리므로, 200 이되 값은 그대로여야 한다
      await request(http)
        .patch(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'recruit' })
        .expect(200);

      const res = await request(http)
        .get(`/questions/${question.id}`)
        .expect(200);
      expect((res.body as ApiResponse<{ type: string }>).data.type).toBe(
        'question',
      );
    });
  });

  describe('태그 정규화', () => {
    it('저장 시 정규화하고 중복을 제거한다', async () => {
      const { token } = await login('Maria');
      const question = await createQuestion(token);
      // 'Visa:D_2' 와 'visa:d-2' 는 같은 태그다
      expect(question.tags).toEqual(['visa:d-2', 'region:seoul']);
    });

    it('정규화 전 표기로 검색해도 찾아진다', async () => {
      const { token } = await login('Maria');
      await createQuestion(token);

      const res = await request(http)
        .get('/questions?tags=Visa:D_2')
        .expect(200);
      const body = res.body as ApiResponse<{ items: unknown[] }>;
      expect(body.data.items).toHaveLength(1);
    });

    it('태그는 AND 로 걸린다 — OR 이면 태그를 더할수록 넓어진다', async () => {
      const { token } = await login('Maria');
      await createQuestion(token, { tags: ['visa:d-2'] });

      const both = await request(http)
        .get('/questions?tags=visa:d-2,region:seoul')
        .expect(200);
      expect(
        (both.body as ApiResponse<{ items: unknown[] }>).data.items,
      ).toHaveLength(0);
    });
  });

  describe('수정·숨김 소유권', () => {
    it('남의 질문은 수정할 수 없다', async () => {
      const owner = await login('Maria');
      const other = await login('Chen');
      const question = await createQuestion(owner.token);

      await request(http)
        .patch(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${other.token}`)
        .send({ title: 'x'.repeat(20) })
        .expect(403);
    });

    it('숨긴 질문은 목록에서 빠지고 남에게는 404 다', async () => {
      const owner = await login('Maria');
      const other = await login('Chen');
      const question = await createQuestion(owner.token);

      await request(http)
        .delete(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      const list = await request(http).get('/questions').expect(200);
      expect(
        (list.body as ApiResponse<{ items: unknown[] }>).data.items,
      ).toHaveLength(0);

      await request(http)
        .get(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${other.token}`)
        .expect(404);
    });

    it('작성자에게는 자기 숨김 글이 보인다 — 아니면 되살릴 방법이 없다', async () => {
      const owner = await login('Maria');
      const question = await createQuestion(owner.token);

      await request(http)
        .delete(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      await request(http)
        .get(`/questions/${question.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
    });
  });

  describe('답변과 채택', () => {
    it('답변을 달면 질문의 answerCount 가 오른다', async () => {
      const asker = await login('Maria');
      const helper = await login('Chen');
      const question = await createQuestion(asker.token);
      await createAnswer(helper.token, question.id);

      const res = await request(http)
        .get(`/questions/${question.id}`)
        .expect(200);
      expect(
        (res.body as ApiResponse<{ answerCount: number }>).data.answerCount,
      ).toBe(1);
    });

    it('자기 질문에 자기가 답할 수 있다 — 스스로 해결한 뒤 남기는 것은 좋은 콘텐츠다', async () => {
      const asker = await login('Maria');
      const question = await createQuestion(asker.token);
      await createAnswer(asker.token, question.id);
    });

    it('질문 작성자만 채택할 수 있다', async () => {
      const asker = await login('Maria');
      const helper = await login('Chen');
      const question = await createQuestion(asker.token);
      const answer = await createAnswer(helper.token, question.id);

      await request(http)
        .post(`/questions/${question.id}/answers/${answer.id}/accept`)
        .set('Authorization', `Bearer ${helper.token}`)
        .expect(403);

      await request(http)
        .post(`/questions/${question.id}/answers/${answer.id}/accept`)
        .set('Authorization', `Bearer ${asker.token}`)
        .expect(201);
    });

    it('다른 질문의 답변은 채택할 수 없다', async () => {
      const asker = await login('Maria');
      const q1 = await createQuestion(asker.token);
      const q2 = await createQuestion(asker.token);
      const answerOnQ2 = await createAnswer(asker.token, q2.id);

      await request(http)
        .post(`/questions/${q1.id}/answers/${answerOnQ2.id}/accept`)
        .set('Authorization', `Bearer ${asker.token}`)
        .expect(404);
    });

    it('채택된 답변이 목록 맨 위로 온다', async () => {
      const asker = await login('Maria');
      const helper = await login('Chen');
      const question = await createQuestion(asker.token);
      const first = await createAnswer(helper.token, question.id);
      const second = await createAnswer(helper.token, question.id);

      await request(http)
        .post(`/questions/${question.id}/answers/${second.id}/accept`)
        .set('Authorization', `Bearer ${asker.token}`)
        .expect(201);

      const res = await request(http)
        .get(`/questions/${question.id}/answers`)
        .expect(200);
      const items = (res.body as ApiResponse<{ id: string }[]>).data;
      expect(items.map((a) => a.id)).toEqual([second.id, first.id]);
    });

    it('채택된 답변을 숨기면 채택도 함께 해제된다', async () => {
      const asker = await login('Maria');
      const helper = await login('Chen');
      const question = await createQuestion(asker.token);
      const answer = await createAnswer(helper.token, question.id);

      await request(http)
        .post(`/questions/${question.id}/answers/${answer.id}/accept`)
        .set('Authorization', `Bearer ${asker.token}`)
        .expect(201);

      await request(http)
        .delete(`/answers/${answer.id}`)
        .set('Authorization', `Bearer ${helper.token}`)
        .expect(200);

      const res = await request(http)
        .get(`/questions/${question.id}`)
        .expect(200);
      const data = (
        res.body as ApiResponse<{
          acceptedAnswerId: string | null;
          answerCount: number;
        }>
      ).data;
      expect(data.acceptedAnswerId).toBeNull();
      expect(data.answerCount).toBe(0);
    });
  });

  describe('목록 필터와 커서 페이지네이션', () => {
    it('답변 유무로 거를 수 있다', async () => {
      const asker = await login('Maria');
      const answered = await createQuestion(asker.token);
      await createQuestion(asker.token);
      await createAnswer(asker.token, answered.id);

      const res = await request(http)
        .get('/questions?answered=false')
        .expect(200);
      const items = (res.body as ApiResponse<{ items: { id: string }[] }>).data
        .items;
      expect(items).toHaveLength(1);
      expect(items[0].id).not.toBe(answered.id);
    });

    it('빈 검색어는 필터 없음으로 수렴한다 — 0건이 되면 안 된다', async () => {
      const asker = await login('Maria');
      await createQuestion(asker.token);

      const res = await request(http).get('/questions?q=%20%20').expect(200);
      expect(
        (res.body as ApiResponse<{ items: unknown[] }>).data.items,
      ).toHaveLength(1);
    });

    it('커서로 다음 페이지를 이어받고 중복이 없다', async () => {
      const asker = await login('Maria');
      for (let i = 0; i < 3; i++) await createQuestion(asker.token);

      const first = await request(http).get('/questions?limit=2').expect(200);
      const firstBody = (
        first.body as ApiResponse<{
          items: { id: string }[];
          nextCursor: string | null;
        }>
      ).data;
      expect(firstBody.items).toHaveLength(2);
      expect(firstBody.nextCursor).toBeTruthy();

      const second = await request(http)
        .get(`/questions?limit=2&cursor=${firstBody.nextCursor}`)
        .expect(200);
      const secondBody = (
        second.body as ApiResponse<{
          items: { id: string }[];
          nextCursor: string | null;
        }>
      ).data;
      expect(secondBody.items).toHaveLength(1);
      expect(secondBody.nextCursor).toBeNull();

      const ids = [...firstBody.items, ...secondBody.items].map((i) => i.id);
      expect(new Set(ids).size).toBe(3);
    });
  });
});
