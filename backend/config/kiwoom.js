require('dotenv').config();

const environment = {
  development: 'https://mockapi.kiwoom.com',
  production: 'https://api.kiwoom.com',
  test: 'https://mockapi.kiwoom.com',
};

module.exports = {
  apiKey: process.env.KIWOOM_API_KEY,
  apiSecret: process.env.KIWOOM_API_SECRET,
  baseUrl: environment[process.env.NODE_ENV],
};
