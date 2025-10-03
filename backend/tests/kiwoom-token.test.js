const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const { KiwoomToken } = require('../models');

jest.mock('axios');

describe('키움 토큰 발급 테스트', () => {
  beforeEach(async () => {
    await KiwoomToken.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();

    const futureDate = new Date(Date.now() + 86400 * 1000);
    const formattedDate = futureDate
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);

    axios.post.mockResolvedValue({
      data: {
        token: 'mock_token_12345',
        token_type: 'Bearer',
        expires_dt: formattedDate,
        return_code: '0',
        return_msg: '정상처리되었습니다',
      },
    });
  });

  const validateCommonStructure = (response) => {
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
  };

  test('토큰 발급 성공 테스트', async () => {
    const response = await request(app).post('/api/kiwoom/token').expect(200);

    validateCommonStructure(response);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('access_token');
    expect(response.body.data.access_token).toBe('mock_token_12345');
  });

  test('같은 토큰 재사용 확인', async () => {
    const firstResponse = await request(app)
      .post('/api/kiwoom/token')
      .expect(200);

    console.log('첫 번째 응답', firstResponse.body);
    const firstToken = firstResponse.body.data.access_token;

    const secondResponse = await request(app)
      .post('/api/kiwoom/token')
      .expect(200);

    console.log('두 번째 응답', secondResponse.body);
    const secondToken = secondResponse.body.data.access_token;

    expect(firstToken).toBe(secondToken);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test('토큰 발급 실패 테스트', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: '인증 실패' },
      },
    });

    const response = await request(app).post('/api/kiwoom/token').expect(401);

    validateCommonStructure(response);
    expect(response.body.success).toBe(false);
  });
});
