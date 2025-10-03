const SSE_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers':
    'Content-Type, Cache-Control, X-Accel-Buffering',
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

module.exports = {
  setSSEHeaders,
};
