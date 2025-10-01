const axios = require('axios');
const kiwoomConfig = require('../config/kiwoom');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const { toTokenResponse, toTokenStatusResponse } = require('../utils/tokenFormatter');

const createToken = async () => {
  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/oauth2/token`,
    {
      grant_type: 'client_credentials',
      appkey: kiwoomConfig.apiKey,
      secretkey: kiwoomConfig.apiSecret,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );

  return response.data;
};

const getToken = async () => {
  const validToken = await kiwoomTokenRepository.findValidToken(10);
  
  if (validToken) {
    console.log('기존 토큰 사용');
    return toTokenResponse(validToken);
  }

  console.log('새 토큰 발급');

  await kiwoomTokenRepository.deactivateAll();

  const newCreateToken = await createToken();

  const savedToken = await kiwoomTokenRepository.create(newCreateToken);
  
  return toTokenResponse(savedToken);
};

const getTokenStatus = async () => {
  const activeCount = await kiwoomTokenRepository.countActive();
  const allTokens = await kiwoomTokenRepository.findAll({ limit: 10 });
  
  return {
    active_count: activeCount,
    recentTokens: allTokens.map(toTokenStatusResponse)
  };
};

module.exports = {
  getToken,
  getTokenStatus,
};