jest.mock('../../repositories/kiwoomTokenRepository');

const kiwoomService = require('../../services/tokenService');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');

describe('KiwoomService - cleanupExpiredTokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('만료된 토큰 삭제 성공', async () => {
    const mockDeletedCount = 3;
    kiwoomTokenRepository.deleteExpiredTokens.mockResolvedValue(
      mockDeletedCount,
    );

    const result = await kiwoomService.cleanupExpiredTokens(7);

    expect(kiwoomTokenRepository.deleteExpiredTokens).toHaveBeenCalledWith(7);
    expect(result.deletedCount).toBe(3);
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  test('기본값 7일로 동작', async () => {
    kiwoomTokenRepository.deleteExpiredTokens.mockResolvedValue(0);

    await kiwoomService.cleanupExpiredTokens(7);

    expect(kiwoomTokenRepository.deleteExpiredTokens).toHaveBeenCalledWith(7);
  });

  test('삭제할 토큰이 없을 때', async () => {
    kiwoomTokenRepository.deleteExpiredTokens.mockResolvedValue(0);

    const result = await kiwoomService.cleanupExpiredTokens(7);

    expect(result.deletedCount).toBe(0);
  });

  test('에러 발생 시 예외 전파', async () => {
    const mockError = new Error('DB 연결 실패');
    kiwoomTokenRepository.deleteExpiredTokens.mockRejectedValue(mockError);

    await expect(kiwoomService.cleanupExpiredTokens(7)).rejects.toThrow(
      'DB 연결 실패',
    );
  });
});
