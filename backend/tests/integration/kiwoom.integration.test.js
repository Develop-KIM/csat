const { KiwoomToken } = require('../../models');
const kiwoomService = require('../../services/kiwoomService');

describe('키움 API 통합 테스트', () => {
  beforeAll(async () => {
    await KiwoomToken.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    const { sequelize } = require('../../models');
    await sequelize.close();
  });

  describe('실제 토큰 발급', () => {
    test('실제 키움 API로 토큰 발급 성공', async () => {
      const result = await kiwoomService.getToken();

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('tokenType');
      expect(result).toHaveProperty('expiresAt');
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    }, 15000);

    test('발급된 토큰이 DB에 저장되었는지 확인', async () => {
      const tokens = await KiwoomToken.findAll({
        where: { is_active: true },
      });

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0].access_token).toBeDefined();
    });

    test('유효한 토큰 재사용 확인 (실제 API 호출 없이)', async () => {
      const firstToken = await kiwoomService.getToken();
      const secondToken = await kiwoomService.getToken();

      expect(firstToken.token).toBe(secondToken.token);
    });
  });

  describe('토큰 상태 조회', () => {
    test('토큰 상태 조회 성공', async () => {
      const status = await kiwoomService.getTokenStatus();

      expect(status).toHaveProperty('active_count');
      expect(status).toHaveProperty('recentTokens');
      expect(Array.isArray(status.recentTokens)).toBe(true);
    });
  });
});