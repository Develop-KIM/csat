require('dotenv').config();

const environment = {
  development: 'https://mockapi.kiwoom.com',
  production: 'https://api.kiwoom.com',
  test: 'https://mockapi.kiwoom.com',
};

const websocketEnvironment = {
  development: 'wss://mockapi.kiwoom.com:10000',
  production: 'wss://api.kiwoom.com:10000',
  test: 'wss://mockapi.kiwoom.com:10000',
};

const shouldUseProxy = () => {
  return ['development', 'test'].includes(process.env.NODE_ENV);
};

const getProxyAgent = () => {
  if (shouldUseProxy()) {
    const { SocksProxyAgent } = require('socks-proxy-agent');
    return new SocksProxyAgent('socks5://127.0.0.1:8080');
  }
  return null;
};

const getApiCredentials = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    return {
      apiKey: process.env.KIWOOM_API_KEY,
      apiSecret: process.env.KIWOOM_API_SECRET,
    };
  }

  return {
    apiKey: process.env.KIWOOM_MOCK_API_KEY,
    apiSecret: process.env.KIWOOM_MOCK_API_SECRET,
  };
};

const credentials = getApiCredentials();

module.exports = {
  apiKey: credentials.apiKey,
  apiSecret: credentials.apiSecret,
  baseUrl: environment[process.env.NODE_ENV],
  websocketUrl: websocketEnvironment[process.env.NODE_ENV],
  proxyAgent: getProxyAgent(),
};
