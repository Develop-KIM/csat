const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/kiwoomService');
const tokenRefreshScheduler = require('../scheduler/tokenRefreshScheduler');
const tokenCleanupScheduler = require('../scheduler/tokenCleanupScheduler');

const getTokenStatus = async (req, res) => {
  try {
    const status = await kiwoomService.getTokenStatus();
    res.json(successResponse(status, '토큰 상태 조회 성공'));
  } catch (error) {
    console.error('토큰 상태 조회 에러:', error.message);
    res.status(500).json(errorResponse('토큰 상태 조회 실패', error.message));
  }
};

const getTokenRefreshStatus = (req, res) => {
  try {
    const status = tokenRefreshScheduler.getStatus();
    res.json(successResponse(status));
  } catch (error) {
    console.error('정리 스케줄러 상태 조회 에러:', error.message);
    res.status(500).json(errorResponse('상태 조회 실패', error.message));
  }
};

const getCleanupStatus = (req, res) => {
  try {
    const status = tokenCleanupScheduler.getStatus();
    res.json(successResponse(status));
  } catch (error) {
    console.error('정리 스케줄러 상태 조회 에러:', error.message);
    res.status(500).json(errorResponse('상태 조회 실패', error.message));
  }
};

module.exports = {
  getTokenStatus,
  getTokenRefreshStatus,
  getCleanupStatus,
};
