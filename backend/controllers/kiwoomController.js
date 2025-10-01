const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/kiwoomService');
const { toTokenResponse } = require('../utils/tokenFormatter');

const getToken = async (req, res) => {
  try {
    const token = await kiwoomService.getToken();

    res.json(successResponse(token, '토큰 조회 성공'));
  } catch (error) {
    console.error('토큰 조회 에러:', error.response?.data || error.message);

    res
      .status(error.response?.status || 500)
      .json(
        errorResponse('토큰 조회 실패', error.response?.data || error.message),
      );
  }
};

module.exports = {
  getToken,
};
