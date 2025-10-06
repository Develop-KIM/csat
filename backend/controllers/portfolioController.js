const { successResponse, errorResponse } = require('../utils/response');
const portfolioService = require('../services/portfolioService');
const portfolioStreamService = require('../services/portfolioStreamService');
const { setSSEHeaders, setupHeartbeat } = require('../config/sse');

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

const getAccountBalance = async (req, res) => {
  try {
    const {
      qryTp = '1',
      dmstStexTp = 'KRX',
      contYn = 'N',
      nextKey = '',
    } = req.query;
    const result = await portfolioService.getAccountBalance(
      qryTp,
      dmstStexTp,
      contYn,
      nextKey,
    );
    res.json(successResponse(result, '계좌평가잔고내역 조회 성공'));
  } catch (error) {
    console.error('계좌평가잔고내역 조회 에러:', error.message);
    res
      .status(500)
      .json(errorResponse('계좌평가잔고내역 조회 실패', error.message));
  }
};

const getDashboard = async (req, res) => {
  try {
    const result = await portfolioService.getDashboardData();
    res.json(successResponse(result, '대시보드 조회 성공'));
  } catch (error) {
    console.error('대시보드 조회 에러:', error.message);
    res.status(500).json(errorResponse('대시보드 조회 실패', error.message));
  }
};

const streamDashboard = async (req, res) => {
  setSSEHeaders(res);

  await portfolioStreamService.sendInitialData(res);

  const heartbeatInterval = setupHeartbeat(res);

  await portfolioStreamService.setupStream(req, res, heartbeatInterval);
};

module.exports = {
  getDepositDetail,
  getAccountBalance,
  getDashboard,
  streamDashboard,
};
