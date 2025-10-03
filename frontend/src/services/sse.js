export class SSEConnection {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.listeners = new Map();
    this.reconnectDelay = 5000;
  }

  connect() {
    console.log("[SSE] 연결 시도");

    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      console.log("[SSE] 연결 성공");
    };

    this.eventSource.onerror = (error) => {
      console.error("[SSE] 연결 오류:", error);
      this.close();

      setTimeout(() => {
        console.log("[SSE] 재연결 시도");
        this.connect();
      }, this.reconnectDelay);
    };

    this.listeners.forEach((callback, eventName) => {
      this.eventSource.addEventListener(eventName, callback);
    });
  }

  on(eventName, callback) {
    this.listeners.set(eventName, callback);

    if (this.eventSource) {
      this.eventSource.addEventListener(eventName, callback);
    }
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
