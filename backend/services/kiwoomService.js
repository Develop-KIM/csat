const axios = require('axios');
const kiwoomConfig = require('../config/kiwoom');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');

const getRequestConfig = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  if (kiwoomConfig.proxyAgent) {
    config.httpAgent = kiwoomConfig.proxyAgent;
    config.httpsAgent = kiwoomConfig.proxyAgent;
  }

  return config;
};

const createToken = async () => {
  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/oauth2/token`,
    {
      grant_type: 'client_credentials',
      appkey: kiwoomConfig.apiKey,
      secretkey: kiwoomConfig.apiSecret,
    },
    getRequestConfig(),
  );
  console.log(response.data);
  return response.data;
};

const ensureValidToken = async () => {
  const validToken = await kiwoomTokenRepository.findValidToken(10);

  if (validToken) {
    return validToken;
  }

  const newCreateToken = await createToken();
  return await kiwoomTokenRepository.create(newCreateToken);
};

const revokeToken = async (token) => {
  const response = await axios.post(
    `${kiwoomConfig.baseUrl}/oauth2/revoke`,
    {
      appkey: kiwoomConfig.apiKey,
      secretkey: kiwoomConfig.apiSecret,
      token: token,
    },
    getRequestConfig(),
  );

  const dbToken = await kiwoomTokenRepository.findByAccessToken(token);
  if (dbToken) {
    await kiwoomTokenRepository.deactivateToken(dbToken.id);
  }

  return response.data;
};

const getTokenStatus = async () => {
  const activeToken = await kiwoomTokenRepository.findValidToken(0);

  return {
    is_connected: Boolean(activeToken),
  };
};

module.exports = {
  ensureValidToken,
  revokeToken,
  getTokenStatus,
};
