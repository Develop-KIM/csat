const portfolioService = require('./portfolioService');
const wsManager = require('./webSocket');
const { REALTIME_TYPES } = require('../config/websocket');
const { sendSSEMessage } = require('../config/sse');

class PortfolioStreamService {
  async sendInitialData(res) {
    try {
      const data = await portfolioService.getDashboardData();
      sendSSEMessage(res, data);
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      sendSSEMessage(res, { error: '초기 데이터 로드 실패' });
    }
  }

  createRealtimeHandler(res) {
    return async (wsData) => {
      if (wsData.trnm !== 'REAL' || !wsData.data) return;

      const hasExecution = wsData.data.some(
        (item) => item.type === REALTIME_TYPES.EXECUTION,
      );
      if (hasExecution) {
        await this.handleExecution(res);
      }

      const balanceData = wsData.data.filter(
        (item) => item.type === REALTIME_TYPES.BALANCE,
      );
      if (balanceData.length > 0) {
        this.handleBalanceUpdate(res, balanceData);
      }
    };
  }

  async handleExecution(res) {
    console.log('체결 발생 - 예수금 갱신');
    try {
      const deposit = await portfolioService.getDepositDetail('3');
      sendSSEMessage(res, {
        type: 'deposit_update',
        deposit,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('예수금 갱신 실패:', error);
    }
  }

  handleBalanceUpdate(res, balanceData) {
    const stocks = balanceData.map((item) => ({
      stockCode: item.values['9001'],
      stockName: item.values['302'],
      evaluationProfit: item.values['10'],
      profitRate: item.values['8019'],
      purchasePrice: item.values['307'],
      currentPrice: item.values['27'] || item.values['28'],
      quantity: item.values['930'],
      tradableQuantity: item.values['931'],
      purchaseAmount: item.values['932'],
      evaluationAmount: item.values['933'],
      possessionRate: item.values['950'],
    }));

    sendSSEMessage(res, {
      type: 'stock_update',
      stocks,
      updatedAt: new Date().toISOString(),
    });
  }

  subscribe(handler) {
    wsManager.addSubscriber(handler);
  }

  unsubscribe(handler) {
    wsManager.removeSubscriber(handler);
  }

  // SSE 스트림 설정 (연결 관리 로직 포함)
  async setupStream(req, res, heartbeatInterval) {
    const realtimeHandler = this.createRealtimeHandler(res);
    this.subscribe(realtimeHandler);

    // 정리 함수
    const cleanup = () => {
      clearInterval(heartbeatInterval);
      this.unsubscribe(realtimeHandler);
      console.log('대시보드 스트림 연결 종료');
    };

    // 이벤트 리스너 등록
    req.on('close', cleanup);
    res.on('error', (error) => {
      console.error('SSE 응답 에러:', error);
      cleanup();
    });

    return { realtimeHandler, cleanup };
  }
}

module.exports = new PortfolioStreamService();
