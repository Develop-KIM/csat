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

  const validateSuccessResponse = (response) => {
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('expires_dt');
    expect(response.body.data).toHaveProperty('token_type');
    expect(response.body.data).toHaveProperty('return_code');
    expect(response.body.data).toHaveProperty('return_msg');
  };

  const validateErrorResponse = (response) => {
    expect(response.body).toHaveProperty('error');
  };

  test('토큰 발급 성공 테스트', async () => {
    const response = await makeTokenRequest();

    validateCommonStructure(response);

    const isSuccess = response.body.success === true;
    const isFailure = response.body.success === false;

    isSuccess && validateSuccessResponse(response);

    isFailure && validateErrorResponse(response);
  }, 10000);
});
