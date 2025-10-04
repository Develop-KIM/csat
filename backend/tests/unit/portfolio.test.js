const portfolioService = require('../../services/portfolioService');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');
const axios = require('axios');

jest.mock('../../repositories/kiwoomTokenRepository');
jest.mock('axios');

describe('portfolioService 유닛 테스트', () => {
  const mockToken = {
    access_token: 'mock_token_12345',
    expires_dt: new Date(Date.now() + 86400000),
  };

  const mockDepositResponse = {
    data: {
      entr: '000000000017534',
      ord_alow_amt: '000000000085341',
      profa_ch: '000000000032193',
      return_code: 0,
      return_msg: '조회가 완료되었습니다.',
    },
    headers: {
      'next-key': '',
      'cont-yn': 'N',
      'api-id': 'kt00001',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDepositDetail', () => {
    it('예수금조회 성공', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockDepositResponse);

      const result = await portfolioService.getDepositDetail();

      expect(kiwoomTokenRepository.findValidToken).toHaveBeenCalledWith(10);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/dostk/acnt'),
        { qry_tp: '3' },
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: `Bearer ${mockToken.access_token}`,
            'api-id': 'kt00001',
            'cont-yn': 'N',
            'next-key': '',
          }),
        }),
      );
      expect(result.data.entr).toBe('000000000017534');
      expect(result.headers['cont-yn']).toBe('N');
    });

    it('연속조회 파라미터 전달', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockDepositResponse);

      await portfolioService.getDepositDetail('3', 'Y', 'next_key_123');

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            'cont-yn': 'Y',
            'next-key': 'next_key_123',
          }),
        }),
      );
    });

    it('유효한 토큰이 없을 때 에러 발생', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(null);

      await expect(portfolioService.getDepositDetail()).rejects.toThrow(
        '유효한 토큰이 없습니다',
      );
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('API 호출 실패 시 에러 전파', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(new Error('Network error'));

      await expect(portfolioService.getDepositDetail()).rejects.toThrow(
        'Network error',
      );
    });

    it('응답 헤더 정상 반환', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockDepositResponse);

      const result = await portfolioService.getDepositDetail();

      expect(result.headers).toEqual({
        'next-key': '',
        'cont-yn': 'N',
        'api-id': 'kt00001',
      });
    });
  });
});
