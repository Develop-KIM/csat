import { SSEConnection } from "./sse";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export class PortfolioSSE {
  constructor() {
    this.connection = null;
    this.callbacks = {
      onInitialData: null,
      onDepositUpdate: null,
      onStockUpdate: null,
      onError: null,
    };
  }

  createMessageHandlers() {
    return new Map([
      ["deposit_update", (data) => this.callbacks.onDepositUpdate?.(data)],
      ["stock_update", (data) => this.callbacks.onStockUpdate?.(data)],
    ]);
  }

  handleInitialData(data) {
    const hasFullData = data.deposit && data.portfolio;
    hasFullData && this.callbacks.onInitialData?.(data);
  }

  handleTypedMessage(data, handlers) {
    const handler = handlers.get(data.type);
    handler?.(data);
  }

  handleMessage(data) {
    const handlers = this.createMessageHandlers();
    const hasType = Boolean(data.type);

    hasType && this.handleTypedMessage(data, handlers);
    hasType || this.handleInitialData(data);
  }

  handleError(data) {
    const hasError = Boolean(data.error);
    hasError && this.callbacks.onError?.(data.error);
    return hasError;
  }

  parseAndHandle(event) {
    try {
      const data = JSON.parse(event.data);
      const errorHandled = this.handleError(data);
      errorHandled || this.handleMessage(data);
    } catch (error) {
      console.error("[Portfolio SSE] 메시지 파싱 에러:", error);
      this.callbacks.onError?.("데이터 파싱 실패");
    }
  }

  connect({ onInitialData, onDepositUpdate, onStockUpdate, onError }) {
    const url = `${API_BASE_URL}/portfolio/dashboard/stream`;

    Object.assign(this.callbacks, {
      onInitialData,
      onDepositUpdate,
      onStockUpdate,
      onError,
    });

    this.connection = new SSEConnection(url);
    this.connection.on("message", (event) => this.parseAndHandle(event));
    this.connection.connect();
  }

  disconnect() {
    this.connection?.close();
    this.connection = null;
  }
}
