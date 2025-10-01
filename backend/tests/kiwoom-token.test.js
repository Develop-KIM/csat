const request = require('supertest');
const app = require('../app');

describe('키움 토큰 발급 테스트', () => {
  const makeTokenRequest = () => {
    return request(app)
      .post('/api/kiwoom/token')
      .expect('Content-Type', /json/);
  };

  const validateCommonStructure = (response) => {
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  };

  test('토큰 발급 성공 테스트', async () => {
    const response = await makeTokenRequest();

    validateCommonStructure(response);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('expires_dt');
    expect(response.body.data).toHaveProperty('token_type');
    expect(response.body.data).toHaveProperty('return_code');
    expect(response.body.data).toHaveProperty('return_msg');
  }, 10000);

  test('토큰 발급 실패 테스트', async () => {
    const originalKey = process.env.KIWOOM_API_KEY;
    const originalSecret = process.env.KIWOOM_API_SECRET;
    
    process.env.KIWOOM_API_KEY = 'invalid_key';
    process.env.KIWOOM_API_SECRET = 'invalid_secret';

    delete require.cache[require.resolve('../config/kiwoom')];
    
    const response = await makeTokenRequest();

    validateCommonStructure(response);

    expect(response.status).not.toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');

    process.env.KIWOOM_API_KEY = originalKey;
    process.env.KIWOOM_API_SECRET = originalSecret;
    delete require.cache[require.resolve('../config/kiwoom')];
  }, 10000);

  test('네트워크 에러 처리 테스트', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'invalid';

    delete require.cache[require.resolve('../config/kiwoom')];

    const response = await makeTokenRequest();

    validateCommonStructure(response);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');

    process.env.NODE_ENV = originalEnv;
    delete require.cache[require.resolve('../config/kiwoom')];
  }, 10000);
});