const kiwoomService = require('../services/kiwoomService');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const axios = require('axios');

jest.mock('axios');
jest.mock('../repositories/kiwoomTokenRepository');

describe('토큰 생성 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureValidToken', () => {
    test('유효한 토큰이 있으면 재사용', async () => {
      const mockToken = {
        id: 'uuid-123',
        access_token: 'existing_token',
        expires_dt: new Date(Date.now() + 3600000),
        is_active: true,
      };

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);

      const result = await kiwoomService.ensureValidToken();

      expect(result).toEqual(mockToken);
      expect(kiwoomTokenRepository.findValidToken).toHaveBeenCalledWith(10);
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('유효한 토큰이 없으면 새로 생성', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(null);

      const futureDate = new Date(Date.now() + 86400 * 1000);
      const formattedDate = futureDate
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14);

      axios.post.mockResolvedValue({
        data: {
          token: 'new_token_123',
          token_type: 'Bearer',
          expires_dt: formattedDate,
          return_code: '0',
          return_msg: '정상처리되었습니다',
        },
      });

      const mockCreatedToken = {
        id: 'uuid-456',
        access_token: 'new_token_123',
        token_type: 'Bearer',
        expires_dt: futureDate,
        is_active: true,
      };

      kiwoomTokenRepository.create.mockResolvedValue(mockCreatedToken);

      const result = await kiwoomService.getOrCreateToken();

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(kiwoomTokenRepository.create).toHaveBeenCalled();
      expect(result.access_token).toBe('new_token_123');
    });

    test('토큰 생성 실패 시 에러 발생', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(null);

      axios.post.mockRejectedValue(new Error('키움 API 오류'));

      await expect(kiwoomService.getOrCreateToken()).rejects.toThrow(
        '키움 API 오류',
      );
    });
  });
});
