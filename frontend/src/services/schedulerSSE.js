import { SSEConnection } from "./sse";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export class SchedulerSSE {
  constructor() {
    this.connection = null;
    this.callbacks = {
      onRefreshStatus: null,
      onCleanupStatus: null,
    };
  }

  connect({ onRefreshStatus, onCleanupStatus }) {
    const url = `${API_BASE_URL}/kiwoom/scheduler/status/stream`;

    this.callbacks.onRefreshStatus = onRefreshStatus;
    this.callbacks.onCleanupStatus = onCleanupStatus;

    this.connection = new SSEConnection(url);

    this.connection.on("refresh-status", (event) => {
      const data = JSON.parse(event.data);
      if (this.callbacks.onRefreshStatus) {
        this.callbacks.onRefreshStatus(data);
      }
    });

    this.connection.on("cleanup-status", (event) => {
      const data = JSON.parse(event.data);
      if (this.callbacks.onCleanupStatus) {
        this.callbacks.onCleanupStatus(data);
      }
    });

    this.connection.connect();
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }
}
