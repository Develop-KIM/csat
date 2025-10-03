const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/kiwoomService');

const getTokenStatus = async (req, res) => {
  try {
    const status = await kiwoomService.getTokenStatus();
    res.json(successResponse(status, '토큰 상태 조회 성공'));
  } catch (error) {
    console.error('토큰 상태 조회 에러:', error.message);
    res.status(500).json(errorResponse('토큰 상태 조회 실패', error.message));
  }
};

module.exports = {
  getTokenStatus,
};
