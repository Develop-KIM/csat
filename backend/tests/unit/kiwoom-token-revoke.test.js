jest.mock('axios');
jest.mock('../../repositories/kiwoomTokenRepository');

const axios = require('axios');
const kiwoomService = require('../../services/tokenService');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');

describe('토큰 폐기 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('revokeToken', () => {
    test('토큰 폐기 성공', async () => {
      const mockToken = 'test_token_123';
      const mockDbToken = {
        id: 'uuid-123',
        access_token: mockToken,
        is_active: true,
      };

      axios.post.mockResolvedValue({
        data: {
          return_code: '0',
          return_msg: '정상적으로 처리되었습니다',
        },
      });

      kiwoomTokenRepository.findByAccessToken.mockResolvedValue(mockDbToken);
      kiwoomTokenRepository.deactivateToken.mockResolvedValue(undefined);

      const result = await kiwoomService.revokeToken(mockToken);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oauth2/revoke'),
        expect.objectContaining({
          token: mockToken,
        }),
        expect.any(Object),
      );

      expect(kiwoomTokenRepository.findByAccessToken).toHaveBeenCalledWith(
        mockToken,
      );
      expect(kiwoomTokenRepository.deactivateToken).toHaveBeenCalledWith(
        mockDbToken.id,
      );
      expect(result.return_code).toBe('0');
    });

    test('DB에 없는 토큰 폐기 시도', async () => {
      const mockToken = 'unknown_token';

      axios.post.mockResolvedValue({
        data: {
          return_code: '0',
          return_msg: '정상적으로 처리되었습니다',
        },
      });

      kiwoomTokenRepository.findByAccessToken.mockResolvedValue(null);

      const result = await kiwoomService.revokeToken(mockToken);

      expect(kiwoomTokenRepository.deactivateToken).not.toHaveBeenCalled();
      expect(result.return_code).toBe('0');
    });

    test('토큰 폐기 실패', async () => {
      const mockToken = 'test_token_123';

      axios.post.mockRejectedValue(new Error('키움 API 요청 실패'));

      await expect(kiwoomService.revokeToken(mockToken)).rejects.toThrow();
      expect(kiwoomTokenRepository.deactivateToken).not.toHaveBeenCalled();
    });
  });
});
