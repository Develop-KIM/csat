const WebSocket = require('ws');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const kiwoomConfig = require('../config/kiwoom');
const {
  WEBSOCKET_CONFIG,
  WEBSOCKET_MESSAGES,
  WEBSOCKET_OPTIONS,
  createLoginPacket,
  createSubscribePacket,
} = require('../config/websocket');

class KiwoomWebSocketManager {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.authenticated = false;
    this.subscribers = new Set();
    this.reconnectInterval = null;
    this.reconnectAttempts = 0;
    this.pendingRequests = new Map();

    this.messageHandlers = {
      [WEBSOCKET_MESSAGES.LOGIN]: (response) => this.handleLogin(response),
      [WEBSOCKET_MESSAGES.PING]: (response) => this.send(response),
      [WEBSOCKET_MESSAGES.REG]: (response) => this.handleRegister(response),
      [WEBSOCKET_MESSAGES.REAL]: (response) => this.broadcast(response),
      [WEBSOCKET_MESSAGES.REMOVE]: (response) =>
        console.log('구독 해제 응답:', response),
      [WEBSOCKET_MESSAGES.CNSRLST]: (response) =>
        this.handleConditionList(response),
      default: (response) =>
        console.log('알 수 없는 메시지 타입:', response.trnm, response),
    };
  }

  async connect() {
    const token = await kiwoomTokenRepository.findValidToken(10);
    const hasToken = !!token;
    hasToken ||
      (() => {
        throw new Error('유효한 토큰이 없습니다');
      })();

    const socketUrl = `${kiwoomConfig.websocketUrl}/api/dostk/websocket`;
    this.ws = new WebSocket(socketUrl, WEBSOCKET_OPTIONS);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket 연결 타임아웃'));
        this.ws?.close();
      }, 15000);

      this.ws.on('open', () => {
        clearTimeout(timeout);
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('키움 WebSocket 연결 성공');
        this.send(createLoginPacket(token.access_token));
        resolve();
      });

      this.ws.on('message', (data) => this.handleMessage(data));

      this.ws.on('error', (error) => {
        clearTimeout(timeout);
        console.error('WebSocket 에러:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        clearTimeout(timeout);
        console.log('WebSocket 연결 종료');
        this.connected = false;
        this.authenticated = false;
        this.reconnect();
      });
    });
  }

  handleMessage(data) {
    try {
      const response = JSON.parse(data);
      const isPing = response.trnm === WEBSOCKET_MESSAGES.PING;
      isPing || console.log('실시간 시세 서버 응답 수신:', response);

      const handler =
        this.messageHandlers[response.trnm] || this.messageHandlers.default;
      handler(response);
    } catch (error) {
      console.error('WebSocket 메시지 파싱 에러:', error);
    }
  }

  handleLogin(response) {
    const handlers = {
      0: () => {
        console.log('키움 WebSocket 로그인 성공');
        this.authenticated = true;
        setTimeout(() => this.subscribeRealtimeData(), 1000);
      },
      default: () => {
        console.error('로그인 실패:', response.return_msg);
        this.authenticated = false;
        this.disconnect();
      },
    };

    const handler = handlers[response.return_code] || handlers.default;
    handler();
  }

  handleRegister(response) {
    const handlers = {
      0: () => console.log('실시간 데이터 구독 성공'),
      default: () =>
        console.error('실시간 데이터 구독 실패:', response.return_msg),
    };

    const handler = handlers[response.return_code] || handlers.default;
    handler();
  }

  handleConditionList(response) {
    const handlers = {
      0: () => {
        console.log('조건검색 목록 조회 성공');
        const resolver = this.pendingRequests.get(WEBSOCKET_MESSAGES.CNSRLST);
        resolver?.resolve(response.data);
        this.pendingRequests.delete(WEBSOCKET_MESSAGES.CNSRLST);
      },
      default: () => {
        console.error('조건검색 목록 조회 실패:', response.return_msg);
        const resolver = this.pendingRequests.get(WEBSOCKET_MESSAGES.CNSRLST);
        resolver?.reject(new Error(response.return_msg));
        this.pendingRequests.delete(WEBSOCKET_MESSAGES.CNSRLST);
      },
    };

    const handler = handlers[response.return_code] || handlers.default;
    handler();
  }

  requestConditionList() {
    return new Promise((resolve, reject) => {
      const isReady = this.ws && this.connected && this.authenticated;
      isReady || reject(new Error('WebSocket이 준비되지 않았습니다'));

      isReady &&
        (() => {
          this.pendingRequests.set(WEBSOCKET_MESSAGES.CNSRLST, {
            resolve,
            reject,
          });
          this.send({ trnm: WEBSOCKET_MESSAGES.CNSRLST });

          setTimeout(() => {
            const pending = this.pendingRequests.get(
              WEBSOCKET_MESSAGES.CNSRLST,
            );
            pending &&
              (() => {
                this.pendingRequests.delete(WEBSOCKET_MESSAGES.CNSRLST);
                reject(new Error('조건검색 목록 조회 타임아웃'));
              })();
          }, 10000);
        })();
    });
  }

  subscribeRealtimeData() {
    const authenticated = this.authenticated;
    authenticated ||
      console.warn('인증되지 않은 상태에서 구독을 시도했습니다.');
    authenticated &&
      (() => {
        console.log('실시간 데이터 구독 요청 전송');
        this.send(createSubscribePacket());
      })();
  }

  send(message) {
    const canSend = this.ws && this.connected;
    canSend &&
      (() => {
        this.ws.send(JSON.stringify(message));
        const isPing = message.trnm === WEBSOCKET_MESSAGES.PING;
        isPing || console.log('메시지 전송:', message);
      })();
    canSend ||
      console.warn('WebSocket 연결이 없어 메시지를 전송할 수 없습니다.');
  }

  broadcast(data) {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(data);
      } catch (error) {
        console.error('구독자 알림 에러:', error);
      }
    });
  }

  addSubscriber(callback) {
    this.subscribers.add(callback);
  }

  removeSubscriber(callback) {
    this.subscribers.delete(callback);
  }

  reconnect() {
    const alreadyReconnecting = !!this.reconnectInterval;
    const maxAttemptsReached =
      this.reconnectAttempts >= WEBSOCKET_CONFIG.maxReconnectAttempts;

    alreadyReconnecting && (() => {})();
    alreadyReconnecting ||
      (maxAttemptsReached && console.error('최대 재연결 시도 횟수 초과'));
    alreadyReconnecting || maxAttemptsReached || this.startReconnectInterval();
  }

  startReconnectInterval() {
    this.reconnectInterval = setInterval(async () => {
      try {
        this.reconnectAttempts++;
        console.log(
          `WebSocket 재연결 시도 (${this.reconnectAttempts}/${WEBSOCKET_CONFIG.maxReconnectAttempts})`,
        );
        await this.connect();
        this.clearReconnectInterval();
      } catch (error) {
        console.error('재연결 실패:', error);
        const maxReached =
          this.reconnectAttempts >= WEBSOCKET_CONFIG.maxReconnectAttempts;
        maxReached && this.clearReconnectInterval();
      }
    }, WEBSOCKET_CONFIG.reconnectInterval);
  }

  clearReconnectInterval() {
    clearInterval(this.reconnectInterval);
    this.reconnectInterval = null;
  }

  disconnect() {
    this.ws && this.closeWebSocket();
    this.reconnectInterval && this.clearReconnectInterval();
  }

  closeWebSocket() {
    this.ws.close();
    this.ws = null;
    this.connected = false;
    this.authenticated = false;
  }
}

const wsManager = new KiwoomWebSocketManager();

wsManager.connect().catch((error) => {
  console.error('초기 WebSocket 연결 실패:', error);
  wsManager.reconnect();
});

module.exports = wsManager;
