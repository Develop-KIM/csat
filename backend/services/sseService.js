class SSEService {
  constructor() {
    this.clients = new Set();
  }

  addClient(res) {
    this.clients.add(res);
  }

  removeClient(res) {
    this.clients.delete(res);
  }

  broadcast(eventName, data) {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.write(message);
      } catch (error) {
        console.error('[SSE] 전송 실패:', error.message);
        this.removeClient(client);
      }
    });
  }

  sendHeartbeat() {
    this.clients.forEach((client) => {
      try {
        client.write(': heartbeat\n\n');
      } catch (error) {
        this.removeClient(client);
      }
    });
  }
}

module.exports = new SSEService();
