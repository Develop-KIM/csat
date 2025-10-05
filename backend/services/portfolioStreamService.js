const portfolioService = require('./portfolioService');
const wsManager = require('./webSocket');
const { REALTIME_TYPES } = require('../config/websocket');

class PortfolioStreamService {
  async sendInitialData(res) {
    try {
      const data = await portfolioService.getDashboardData();
      this.sendSSEMessage(res, data);
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      this.sendSSEMessage(res, { error: '초기 데이터 로드 실패' });
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
      this.sendSSEMessage(res, {
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

    this.sendSSEMessage(res, {
      type: 'stock_update',
      stocks,
      updatedAt: new Date().toISOString(),
    });
  }

  sendSSEMessage(res, data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  subscribe(handler) {
    wsManager.addSubscriber(handler);
  }

  unsubscribe(handler) {
    wsManager.removeSubscriber(handler);
  }
}

module.exports = new PortfolioStreamService();
