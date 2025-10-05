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
    raw: {
      returnCode: data.return_code,
      returnMsg: data.return_msg,
    },
    deposit: {
      balance: data.entr,
      availableAmount: data.ord_alow_amt,
      profit: data.profa_ch,
      day1: {
        deposit: data.d1_entra,
        Amount: data.d1_slby_exct_amt,
        buyAmount: data.d1_buy_exct_amt,
        sellAmount: data.d1_sel_exct_amt,
      },
      day2: {
        deposit: data.d2_entra,
        Amount: data.d1_slby_exct_amt,
        buyAmount: data.d2_buy_exct_amt,
        sellAmount: data.d2_sel_exct_amt,
      },
    },
    pagination: {
      hasNext: response.headers['cont-yn'] === 'Y',
      nextKey: response.headers['next-key'] || null,
    },
  };
};

module.exports = {
  getDepositDetail,
};
