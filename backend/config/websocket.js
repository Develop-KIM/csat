const WEBSOCKET_CONFIG = {
  reconnectInterval: 5000,
  pingInterval: 30000,
  maxReconnectAttempts: 10,
};

const WEBSOCKET_MESSAGES = {
  LOGIN: 'LOGIN',
  PING: 'PING',
  REAL: 'REAL',
  REG: 'REG',
  REMOVE: 'REMOVE',
};

const REALTIME_TYPES = {
  EXECUTION: '02',
  BALANCE: '04',
};

const WEBSOCKET_OPTIONS = {
  handshakeTimeout: 10000,
  perMessageDeflate: false,
};

const createLoginPacket = (token) => ({
  trnm: WEBSOCKET_MESSAGES.LOGIN,
  token,
});

const createSubscribePacket = (
  groupNo = '1',
  types = ['04', '02'],
  refresh = '1',
) => ({
  trnm: WEBSOCKET_MESSAGES.REG,
  grp_no: groupNo,
  refresh,
  data: [
    {
      item: [''],
      type: types,
    },
  ],
});

const createUnsubscribePacket = (groupNo = '1') => ({
  trnm: WEBSOCKET_MESSAGES.REMOVE,
  grp_no: groupNo,
});

module.exports = {
  WEBSOCKET_CONFIG,
  WEBSOCKET_MESSAGES,
  REALTIME_TYPES,
  WEBSOCKET_OPTIONS,
  createLoginPacket,
  createSubscribePacket,
  createUnsubscribePacket,
};
