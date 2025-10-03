const kiwoomService = require('../../services/kiwoomService');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');

jest.mock('../../repositories/kiwoomTokenRepository');

describe('토큰 상태 조회', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('활성 토큰이 있을 때', async () => {
    const mockActiveToken = {
      id: 'uuid-123',
      access_token: 'active_token',
      expires_dt: new Date(Date.now() + 3600000),
      is_active: true,
    };

    kiwoomTokenRepository.findValidToken.mockResolvedValue(mockActiveToken);

    const result = await kiwoomService.getTokenStatus();

    expect(result.is_connected).toBe(true);
  });

  test('활성 토큰이 없을 때', async () => {
    kiwoomTokenRepository.findValidToken.mockResolvedValue(null);

    const result = await kiwoomService.getTokenStatus();

    expect(result.is_connected).toBe(false);
  });
});
