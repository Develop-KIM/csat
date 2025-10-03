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

const streamSchedulerStatus = (req, res) => {
  console.log('[SSE] 클라이언트 연결 요청 받음');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Expose-Headers',
    'Content-Type, Cache-Control, X-Accel-Buffering',
  );

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const refreshStatus = tokenRefreshScheduler.getStatus();
  const cleanupStatus = tokenCleanupScheduler.getStatus();

  console.log('[SSE] Refresh 상태:', refreshStatus);
  console.log('[SSE] Cleanup 상태:', cleanupStatus);

  const refreshData = `event: refresh-status\ndata: ${JSON.stringify(refreshStatus)}\n\n`;
  const cleanupData = `event: cleanup-status\ndata: ${JSON.stringify(cleanupStatus)}\n\n`;

  console.log('[SSE] 전송할 refresh 데이터:', refreshData);
  console.log('[SSE] 전송할 cleanup 데이터:', cleanupData);

  res.write(refreshData);
  res.write(cleanupData);

  console.log('[SSE] 초기 데이터 전송 완료');

  const refreshListener = (status) => {
    console.log('[SSE] Refresh 상태 변경:', status);
    res.write(`event: refresh-status\ndata: ${JSON.stringify(status)}\n\n`);
  };

  const cleanupListener = (status) => {
    console.log('[SSE] Cleanup 상태 변경:', status);
    res.write(`event: cleanup-status\ndata: ${JSON.stringify(status)}\n\n`);
  };

  tokenRefreshScheduler.on('statusChanged', refreshListener);
  tokenCleanupScheduler.on('statusChanged', cleanupListener);

  const heartbeat = setInterval(() => {
    console.log('[SSE] Heartbeat 전송');
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    console.log('[SSE] 클라이언트 연결 종료');
    clearInterval(heartbeat);
    tokenRefreshScheduler.off('statusChanged', refreshListener);
    tokenCleanupScheduler.off('statusChanged', cleanupListener);
    res.end();
  });
};

module.exports = {
  getTokenStatus,
  getTokenRefreshStatus,
  getCleanupStatus,
  streamSchedulerStatus,
};
