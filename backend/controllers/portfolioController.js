const { successResponse, errorResponse } = require('../utils/response');
const portfolioService = require('../services/portfolioService');

const getDepositDetail = async (req, res) => {
  try {
    const { qryTp = '3', contYn = 'N', nextKey = '' } = req.query;

    const result = await portfolioService.getDepositDetail(
      qryTp,
      contYn,
      nextKey,
    );

    res.json(successResponse(result, '예수금 조회 성공'));
  } catch (error) {
    console.error('예수금 조회 에러:', error.message);
    res.status(500).json(errorResponse('예수금 조회 실패', error.message));
  }
};

module.exports = {
  getDepositDetail,
};
