const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

const setSSEHeaders = (res) => {
  Object.entries(SSE_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

const isSSEActive = (res) => {
  return !res.writableEnded && !res.destroyed;
};

const sendSSEMessage = (res, data, event = null) => {
  if (!isSSEActive(res)) {
    console.warn('SSE 연결이 이미 종료되어 메시지를 전송할 수 없습니다.');
    return false;
  }

  try {
    const message = event
      ? `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
      : `data: ${JSON.stringify(data)}\n\n`;

    res.write(message);
    return true;
  } catch (error) {
    console.error('SSE 메시지 전송 실패:', error);
    return false;
  }
};

const setupHeartbeat = (res, intervalMs = 30000) => {
  const heartbeatInterval = setInterval(() => {
    if (!isSSEActive(res)) {
      clearInterval(heartbeatInterval);
      return;
    }
    res.write(': heartbeat\n\n');
  }, intervalMs);

  return heartbeatInterval;
};

const setupSSECleanup = (req, res, cleanupCallback) => {
  const cleanup = () => {
    if (cleanupCallback) {
      cleanupCallback();
    }
  };

  req.on('close', cleanup);
  res.on('error', (error) => {
    console.error('SSE 응답 에러:', error);
    cleanup();
  });
};

module.exports = {
  SSE_HEADERS,
  setSSEHeaders,
  isSSEActive,
  sendSSEMessage,
  setupHeartbeat,
  setupSSECleanup,
};
