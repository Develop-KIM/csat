const { successResponse, errorResponse } = require('../utils/response');
const conditionService = require('../services/conditionService');

const getConditionList = async (req, res) => {
  try {
    const conditions = await conditionService.getConditionList();
    res.json(successResponse(conditions, '조건검색 목록 조회 성공'));
  } catch (error) {
    console.error('조건검색 목록 조회 에러:', error.message);
    res
      .status(500)
      .json(errorResponse('조건검색 목록 조회 실패', error.message));
  }
};

module.exports = {
  getConditionList,
};
