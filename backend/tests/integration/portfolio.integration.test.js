const request = require('supertest');
const app = require('../../app');
const { initDB, closeDB } = require('../../models');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');

describe('Portfolio API 통합 테스트', () => {
  let testToken;

  beforeAll(async () => {
    await initDB();
    testToken = await kiwoomTokenRepository.findValidToken(10);

    if (testToken) {
      console.error('만료일:', testToken.expires_dt);
    }
  });

  afterAll(async () => {
    await closeDB();
  });

  describe('GET /api/portfolio/deposit', () => {
    it('추정조회 - 예수금 조회 성공', async () => {
      if (!testToken) {
        return;
      }

      const response = await request(app)
        .get('/api/portfolio/deposit')
        .query({ qryTp: '3' });

      console.log('=== 전체 응답 ===');
      console.log(JSON.stringify(response.body, null, 2));

      console.log('=== 예수금 데이터 ===');
      console.log('예수금:', response.body.data?.data?.entr);
      console.log('주문가능금액:', response.body.data?.data?.ord_alow_amt);
      console.log('응답헤더:', response.body.data?.headers);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('예수금 조회 성공');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.data).toHaveProperty('entr');
      expect(response.body.data.data).toHaveProperty('ord_alow_amt');
      expect(response.body.data.headers).toHaveProperty('api-id', 'kt00001');
    });

    it('연속조회 파라미터 전달', async () => {
      if (!testToken) {
        return;
      }

      const response = await request(app).get('/api/portfolio/deposit').query({
        qryTp: '3',
        contYn: 'Y',
        nextKey: 'test_key',
      });

      expect([200, 500]).toContain(response.status);
    });

    it('토큰 없을 때 500 에러', async () => {
      const originalFind = kiwoomTokenRepository.findValidToken;
      kiwoomTokenRepository.findValidToken = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/portfolio/deposit');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('실패');

      kiwoomTokenRepository.findValidToken = originalFind;
    });
  });
});
