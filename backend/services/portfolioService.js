const axios = require('axios');
const kiwoomConfig = require('../config/kiwoom');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');

const getRequestConfig = async (apiId, contYn = 'N', nextKey = '') => {
  const token = await kiwoomTokenRepository.findValidToken(10);

  if (!token) {
    throw new Error('유효한 토큰이 없습니다');
  }

  const config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      authorization: `Bearer ${token.access_token}`,
      'cont-yn': contYn,
      'next-key': nextKey,
      'api-id': apiId,
    },
  };

  if (kiwoomConfig.proxyAgent) {
    config.httpAgent = kiwoomConfig.proxyAgent;
    config.httpsAgent = kiwoomConfig.proxyAgent;
  }

  return config;
};

const getDepositDetail = async (qryTp = '3', contYn = 'N', nextKey = '') => {
  const config = await getRequestConfig('kt00001', contYn, nextKey);

  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/api/dostk/acnt`,
    {
      qry_tp: qryTp,
    },
    config,
  );

  const data = response.data;

  return {
    balance: data.entr,
    orderAvailable: data.ord_alow_amt,
    profit: data.profa_ch,
  };
};

const getAccountBalance = async (
  qryTp = '1',
  dmstStexTp = 'KRX',
  contYn = 'N',
  nextKey = '',
) => {
  const config = await getRequestConfig('kt00018', contYn, nextKey);

  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/api/dostk/acnt`,
    {
      qry_tp: qryTp,
      dmst_stex_tp: dmstStexTp,
    },
    config,
  );

  const data = response.data;

  return {
    totalPurchaseAmount: data.tot_pur_amt,
    totalEvaluationAmount: data.tot_evlt_amt,
    totalProfitLoss: data.tot_evlt_pl,
    totalProfitRate: data.tot_prft_rt,
    stocks:
      data.acnt_evlt_remn_indv_tot?.map((stock) => ({
        stockCode: stock.stk_cd,
        stockName: stock.stk_nm,
        evaluationProfit: stock.evltv_prft,
        profitRate: stock.prft_rt,
        purchasePrice: stock.pur_pric,
        currentPrice: stock.cur_prc,
        predictedClosingPrice: stock.pred_close_pric,
        quantity: stock.rmnd_qty,
        tradableQuantity: stock.trde_able_qty,
        purchaseAmount: stock.pur_amt,
        evaluationAmount: stock.evlt_amt,
        possessionRate: stock.poss_rt,
      })) || [],
  };
};

const getDashboardData = async () => {
  try {
    const [deposit, accountBalance] = await Promise.all([
      getDepositDetail('3'),
      getAccountBalance('1', 'KRX'),
    ]);

    return {
      deposit: {
        balance: deposit.balance,
        orderAvailable: deposit.orderAvailable,
        profit: deposit.profit,
      },
      portfolio: {
        totalPurchaseAmount: accountBalance.totalPurchaseAmount,
        totalEvaluationAmount: accountBalance.totalEvaluationAmount,
        totalProfitLoss: accountBalance.totalProfitLoss,
        totalProfitRate: accountBalance.totalProfitRate,
        totalAssetAmount: accountBalance.totalAssetAmount,
        stocks: accountBalance.stocks,
      },
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('대시보드 데이터 조회 실패:', error);
    throw error;
  }
};

module.exports = {
  getDepositDetail,
  getAccountBalance,
  getDashboardData,
};
