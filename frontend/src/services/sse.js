export class SSEConnection {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
    this.listeners = new Map();
    this.reconnectDelay = 5000;
  }

  connect() {
    console.log("[SSE] 연결 시도:", this.url);

    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      console.log("[SSE] 연결 성공");
    };

    this.eventSource.onerror = (error) => {
      console.error("[SSE] 연결 오류:", error);
      this.close();

      setTimeout(() => {
        console.log("[SSE] 재연결 시도...");
        this.connect();
      }, this.reconnectDelay);
    };

    // 등록된 이벤트 리스너 재연결
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

  off(eventName) {
    const callback = this.listeners.get(eventName);

    if (callback && this.eventSource) {
      this.eventSource.removeEventListener(eventName, callback);
    }

    this.listeners.delete(eventName);
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
