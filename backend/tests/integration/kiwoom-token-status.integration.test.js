const request = require('supertest');
const app = require('../../app');
const { KiwoomToken } = require('../../models');

describe('키움 토큰 상태 조회 API', () => {
  beforeEach(async () => {
    await KiwoomToken.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    const { sequelize } = require('../../models');
    await sequelize.close();
  });

  test('GET /api/kiwoom/token/status - 연결됨', async () => {
    await KiwoomToken.create({
      access_token: 'test_active_token',
      token_type: 'Bearer',
      expires_dt: new Date(Date.now() + 3600000),
      return_code: '0',
      return_msg: '테스트',
      is_active: true,
    });

    const response = await request(app)
      .get('/api/kiwoom/token/status')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.is_connected).toBe(true);
  });

  test('GET /api/kiwoom/token/status - 연결 안 됨', async () => {
    const response = await request(app)
      .get('/api/kiwoom/token/status')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('토큰 상태 조회 성공');
    expect(response.body.data.is_connected).toBe(false);
  });
});
