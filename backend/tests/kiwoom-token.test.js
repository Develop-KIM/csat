const request = require('supertest');
const app = require('../app');
const { KiwoomToken } = require('../models');

describe('키움 토큰 발급 테스트', () => {
  beforeEach(async () => {
    await KiwoomToken.destroy({ where: {}, truncate: true });
  });

  const validateCommonStructure = (response) => {
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  };

  test('토큰 발급 성공 테스트', async () => {
    const response = await request(app)
      .post('/api/kiwoom/token') 
      .expect('Content-Type', /json/);

    validateCommonStructure(response);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('expiresAt');
    expect(response.body.data).toHaveProperty('tokenType');
    expect(response.body.data).toHaveProperty('returnCode');
    expect(response.body.data).toHaveProperty('returnMsg');

    const savedToken = await KiwoomToken.findOne({
      where: { is_active: true }
    });
    
    expect(savedToken).not.toBeNull();
    expect(savedToken.access_token).toBe(response.body.data.token);
    expect(savedToken.is_active).toBe(true);
  }, 10000);

  test('같은 토큰 재사용 확인', async () => {
    const firstResponse = await request(app)
      .post('/api/kiwoom/token')
      .expect(200);

    const firstToken = firstResponse.body.data.token;

    const secondResponse = await request(app)
      .post('/api/kiwoom/token')
      .expect(200);

    const secondToken = secondResponse.body.data.token;
    expect(firstToken).toBe(secondToken);

    const activeTokenCount = await KiwoomToken.count({
      where: { is_active: true }
    });
    expect(activeTokenCount).toBe(1);
  }, 10000);

  test('토큰 발급 실패 테스트', async () => {
    const originalKey = process.env.KIWOOM_API_KEY;
    const originalSecret = process.env.KIWOOM_API_SECRET;
    
    process.env.KIWOOM_API_KEY = 'invalid_key';
    process.env.KIWOOM_API_SECRET = 'invalid_secret';

    delete require.cache[require.resolve('../config/kiwoom')];
    
    const response = await request(app)
      .post('/api/kiwoom/token')
      .expect('Content-Type', /json/);

    validateCommonStructure(response);

    expect(response.status).not.toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');

    // const count = await KiwoomToken.count();
    // expect(count).toBe(0);

    process.env.KIWOOM_API_KEY = originalKey;
    process.env.KIWOOM_API_SECRET = originalSecret;
    delete require.cache[require.resolve('../config/kiwoom')];
  }, 10000);
});