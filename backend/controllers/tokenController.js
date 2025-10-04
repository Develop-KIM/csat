const { successResponse, errorResponse } = require('../utils/response');
const kiwoomService = require('../services/tokenService');
const tokenRefreshScheduler = require('../scheduler/tokenRefreshScheduler');
const tokenCleanupScheduler = require('../scheduler/tokenCleanupScheduler');
const { setSSEHeaders } = require('../config/sse');

const sseConfig = require('../services/sseService');
const schedulerSSEService = require('../services/schedulerSSEService');

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

const streamSchedulerStatus = (req, res) => {
  console.log('[SSE] 클라이언트 연결 요청');

  setSSEHeaders(res);

  const initialData = schedulerSSEService.getInitialData();
  res.write(
    `event: refresh-status\ndata: ${JSON.stringify(initialData.refresh)}\n\n`,
  );
  res.write(
    `event: cleanup-status\ndata: ${JSON.stringify(initialData.cleanup)}\n\n`,
  );

  sseConfig.addClient(res);

  req.on('close', () => {
    sseConfig.removeClient(res);
  });
};

module.exports = {
  getTokenStatus,
  getTokenRefreshStatus,
  getCleanupStatus,
  streamSchedulerStatus,
};
