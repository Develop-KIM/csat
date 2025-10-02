const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/kiwoomService');

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

const revokeToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json(errorResponse('토큰이 필요합니다'));
    }

    const result = await kiwoomService.revokeToken(token);
    res.json(successResponse(result, '토큰 폐기 성공'));
  } catch (error) {
    console.error('토큰 폐기 에러:', error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(errorResponse('토큰 폐기 실패', error.response?.data || error.message));
  }
};

module.exports = {
  getToken,
  revokeToken,
};
