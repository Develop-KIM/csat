const axios = require('axios');
const kiwoomConfig = require('../config/kiwoom');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const {
  toTokenResponse,
  toTokenStatusResponse,
} = require('../utils/tokenFormatter');

const createToken = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  if (kiwoomConfig.proxyAgent) {
    config.httpAgent = kiwoomConfig.proxyAgent;
    config.httpsAgent = kiwoomConfig.proxyAgent;
  }

  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/oauth2/token`,
    {
      grant_type: 'client_credentials',
      appkey: kiwoomConfig.apiKey,
      secretkey: kiwoomConfig.apiSecret,
    },
    config
  );
  console.log('키움 API 응답:', response.data);
  return response.data;
};

const getToken = async () => {
  const validToken = await kiwoomTokenRepository.findValidToken(10);

  if (validToken) {
    return toTokenResponse(validToken);
  }

  await kiwoomTokenRepository.deactivateAll();

  const newCreateToken = await createToken();

  const savedToken = await kiwoomTokenRepository.create(newCreateToken);

  const result = toTokenResponse(savedToken);

  return result;
};

const getTokenStatus = async () => {
  const activeCount = await kiwoomTokenRepository.countActive();
  const allTokens = await kiwoomTokenRepository.findAll({ limit: 10 });

  return {
    active_count: activeCount,
    recentTokens: allTokens.map(toTokenStatusResponse),
  };
};

module.exports = {
  getToken,
  getTokenStatus,
};
