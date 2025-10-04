const sseConfig = require('./sseService');
const tokenRefreshScheduler = require('../scheduler/tokenRefreshScheduler');
const tokenCleanupScheduler = require('../scheduler/tokenCleanupScheduler');

class SchedulerSSEService {
  constructor() {
    this.heartbeatInterval = null;
    this.init();
  }

  init() {
    tokenRefreshScheduler.on('statusChanged', (status) => {
      sseConfig.broadcast('refresh-status', status);
    });

    tokenCleanupScheduler.on('statusChanged', (status) => {
      sseConfig.broadcast('cleanup-status', status);
    });

    if (process.env.NODE_ENV !== 'test') {
      this.startHeartbeat();
    }
  }

  startHeartbeat() {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      sseConfig.sendHeartbeat();
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  getInitialData() {
    return {
      refresh: tokenRefreshScheduler.getStatus(),
      cleanup: tokenCleanupScheduler.getStatus(),
    };
  }
}

const instance = new SchedulerSSEService();

if (process.env.NODE_ENV !== 'test') {
  instance.init();
}

module.exports = new SchedulerSSEService();
