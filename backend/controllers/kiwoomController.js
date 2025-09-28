const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/kiwoomService');

const createTokenData = (data) => ({
  expires_dt: data.expires_dt,
  token_type: data.token_type,
  token: data.token,
  return_code: data.return_code,
  return_msg: data.return_msg,
});

const getToken = asyncHandling(async (req, res) => {
  try {
    const tokenData = await kiwoomService.getToken();
    const formattedData = createTokenData(tokenData);

    res.json(successResponse(formattedData, '토큰 발급 성공'));
  } catch (error) {
    console.error('토큰 발급 에러:', error.response?.data || error.message);

    res
      .status(error.response?.status || 500)
      .json(
        errorResponse('토큰 발급 실패', error.response?.data || error.message),
      );
  }
});

module.exports = {
  getToken,
};
