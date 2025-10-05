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
    this.subscribers = new Set();
    this.reconnectInterval = null;
    this.reconnectAttempts = 0;
  }

  async connect() {
    const token = await kiwoomTokenRepository.findValidToken(10);
    if (!token) {
      throw new Error('유효한 토큰이 없습니다');
    }

    const socketUrl = `${kiwoomConfig.websocketUrl}/api/dostk/websocket`;
    this.ws = new WebSocket(socketUrl, WEBSOCKET_OPTIONS);

    return new Promise((resolve, reject) => {
      this.ws.on('open', () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('키움 WebSocket 연결 성공');

        const loginPacket = createLoginPacket(token.access_token);
        this.send(loginPacket);

        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(data);
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket 에러:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket 연결 종료');
        this.connected = false;
        this.reconnect();
      });
    });
  }

  handleMessage(data) {
    try {
      const response = JSON.parse(data);

      switch (response.trnm) {
        case WEBSOCKET_MESSAGES.LOGIN:
          this.handleLogin(response);
          break;
        case WEBSOCKET_MESSAGES.PING:
          this.send(response);
          break;
        case WEBSOCKET_MESSAGES.REAL:
          this.broadcast(response);
          break;
        default:
          console.log('알 수 없는 메시지:', response.trnm);
      }
    } catch (error) {
      console.error('WebSocket 메시지 파싱 에러:', error);
    }
  }

  handleLogin(response) {
    if (response.return_code === 0) {
      console.log('키움 WebSocket 로그인 성공');
      this.subscribeRealtimeData();
    } else {
      console.error('키움 WebSocket 로그인 실패:', response.return_msg);
    }
  }

  subscribeRealtimeData() {
    const subscribePacket = createSubscribePacket();
    this.send(subscribePacket);
  }

  send(message) {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
    }
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
    if (this.reconnectInterval) return;

    if (this.reconnectAttempts >= WEBSOCKET_CONFIG.maxReconnectAttempts) {
      console.error('최대 재연결 시도 횟수 초과');
      return;
    }

    this.reconnectInterval = setInterval(async () => {
      try {
        this.reconnectAttempts++;
        console.log(
          `WebSocket 재연결 시도 (${this.reconnectAttempts}/${WEBSOCKET_CONFIG.maxReconnectAttempts})...`,
        );
        await this.connect();
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      } catch (error) {
        console.error('재연결 실패:', error);
      }
    }, WEBSOCKET_CONFIG.reconnectInterval);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }
}

const wsManager = new KiwoomWebSocketManager();

wsManager.connect().catch((error) => {
  console.error('초기 WebSocket 연결 실패:', error);
});

module.exports = wsManager;
