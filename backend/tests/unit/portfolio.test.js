jest.mock('axios');
jest.mock('../../repositories/kiwoomTokenRepository');
jest.mock('../../config/kiwoom', () => ({
  baseUrl: 'https://mockapi.kiwoom.com',
  proxyAgent: null,
}));

const portfolioService = require('../../services/portfolioService');
const kiwoomTokenRepository = require('../../repositories/kiwoomTokenRepository');

const axios = require('axios');

describe('PortfolioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDepositDetail', () => {
    test('예수금 조회 성공', async () => {
      const mockToken = {
        access_token: 'test-token',
      };
      const mockResponse = {
        data: {
          entr: '1000000',
          ord_alow_amt: '500000',
          profa_ch: '100000',
        },
      };

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockResponse);

      const result = await portfolioService.getDepositDetail();

      expect(result).toEqual({
        balance: '1000000',
        orderAvailable: '500000',
        profit: '100000',
      });
      expect(axios.post).toHaveBeenCalledWith(
        'https://mockapi.kiwoom.com/api/dostk/acnt',
        { qry_tp: '3' },
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-id': 'kt00001',
            authorization: 'Bearer test-token',
          }),
        }),
      );
    });

    test('유효한 토큰이 없으면 에러 발생', async () => {
      kiwoomTokenRepository.findValidToken.mockResolvedValue(null);

      await expect(portfolioService.getDepositDetail()).rejects.toThrow(
        '유효한 토큰이 없습니다',
      );
    });
  });

  describe('getAccountBalance', () => {
    test('계좌평가잔고 조회 성공', async () => {
      const mockToken = {
        access_token: 'test-token',
      };
      const mockResponse = {
        data: {
          tot_pur_amt: '17598258',
          tot_evlt_amt: '25789890',
          tot_evlt_pl: '8138825',
          tot_prft_rt: '46.25',
          acnt_evlt_remn_indv_tot: [
            {
              stk_cd: 'A005930',
              stk_nm: '삼성전자',
              evltv_prft: '-196888',
              prft_rt: '-52.71',
              pur_pric: '124500',
              cur_prc: '59000',
              pred_close_pric: '45400',
              rmnd_qty: '3',
              trde_able_qty: '3',
              pur_amt: '373500',
              evlt_amt: '177000',
              poss_rt: '2.12',
            },
          ],
        },
      };

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockResponse);

      const result = await portfolioService.getAccountBalance();

      expect(result).toEqual({
        totalPurchaseAmount: '17598258',
        totalEvaluationAmount: '25789890',
        totalProfitLoss: '8138825',
        totalProfitRate: '46.25',
        stocks: [
          {
            stockCode: 'A005930',
            stockName: '삼성전자',
            evaluationProfit: '-196888',
            profitRate: '-52.71',
            purchasePrice: '124500',
            currentPrice: '59000',
            predictedClosingPrice: '45400',
            quantity: '3',
            tradableQuantity: '3',
            purchaseAmount: '373500',
            evaluationAmount: '177000',
            possessionRate: '2.12',
          },
        ],
      });
    });

    test('보유 종목이 없을 때 빈 배열 반환', async () => {
      const mockToken = { access_token: 'test-token' };
      const mockResponse = {
        data: {
          tot_pur_amt: '0',
          tot_evlt_amt: '0',
          tot_evlt_pl: '0',
          tot_prft_rt: '0',
          acnt_evlt_remn_indv_tot: null,
        },
      };

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockResolvedValue(mockResponse);

      const result = await portfolioService.getAccountBalance();

      expect(result.stocks).toEqual([]);
    });
  });

  describe('getDashboardData', () => {
    test('대시보드 데이터 통합 조회 성공', async () => {
      const mockToken = { access_token: 'test-token' };
      const mockDepositResponse = {
        data: {
          entr: '1000000',
          ord_alow_amt: '500000',
          profa_ch: '100000',
        },
      };
      const mockBalanceResponse = {
        data: {
          tot_pur_amt: '17598258',
          tot_evlt_amt: '25789890',
          tot_evlt_pl: '8138825',
          tot_prft_rt: '46.25',
          acnt_evlt_remn_indv_tot: [],
        },
      };

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post
        .mockResolvedValueOnce(mockDepositResponse)
        .mockResolvedValueOnce(mockBalanceResponse);

      const result = await portfolioService.getDashboardData();

      expect(result).toMatchObject({
        deposit: {
          balance: '1000000',
          orderAvailable: '500000',
          profit: '100000',
        },
        portfolio: {
          totalPurchaseAmount: '17598258',
          totalEvaluationAmount: '25789890',
          totalProfitLoss: '8138825',
          totalProfitRate: '46.25',
        },
      });
      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('API 호출 실패 시 에러 전파', async () => {
      const mockToken = { access_token: 'test-token' };
      const mockError = new Error('키움 API 오류');

      kiwoomTokenRepository.findValidToken.mockResolvedValue(mockToken);
      axios.post.mockRejectedValue(mockError);

      await expect(portfolioService.getDashboardData()).rejects.toThrow(
        '키움 API 오류',
      );
    });
  });
});
