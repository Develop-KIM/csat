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

  return {
    data: response.data,
    headers: {
      'next-key': response.headers['next-key'],
      'cont-yn': response.headers['cont-yn'],
      'api-id': response.headers['api-id'],
    },
  };
};

module.exports = {
  getDepositDetail,
};
