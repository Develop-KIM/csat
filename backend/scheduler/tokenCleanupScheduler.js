const cron = require('node-cron');
const kiwoomService = require('../services/kiwoomService');
const dayjs = require('dayjs');
const EventEmitter = require('events');

class TokenCleanupScheduler extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.scheduler = null;
    this.DAYS_AFTER_EXPIRY = 7;
  }

  async cleanupTokens() {
    if (this.isRunning) {
      console.log('[TokenCleanup] 이미 실행 중, 스킵');
      return;
    }

    this.isRunning = true;
    this.emit('statusChanged', this.getStatus());

    const startTime = new Date();

    try {
      console.log(
        `\n[TokenCleanup] 정리 시작: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      );

      const result = await kiwoomService.cleanupExpiredTokens(
        this.DAYS_AFTER_EXPIRY,
      );
    } catch (error) {
      console.error('[TokenCleanup] 토큰 정리 실패');
      console.error(`[TokenCleanup] 에러: ${error.message}`);
    } finally {
      const duration = ((new Date() - startTime) / 1000).toFixed(2);
      const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      console.log(
        `[TokenCleanup] 종료 시간: ${endTime} (소요: ${duration}초)\n`,
      );
      this.isRunning = false;
      this.emit('statusChanged', this.getStatus());
    }
  }

  start() {
    if (this.scheduler) {
      return;
    }

    this.scheduler = cron.schedule('0 0 * * 6', async () => {
      await this.cleanupTokens();
    });

    this.emit('statusChanged', this.getStatus());

    setTimeout(() => {
      this.cleanupTokens();
    }, 5000);
  }

  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
      console.log('[TokenCleanup] 스케줄러 중지');
      this.emit('statusChanged', this.getStatus());
    }
  }

  getStatus() {
    return {
      isRunning: this.scheduler !== null,
      isCleaning: this.isRunning,
      daysAfterExpiry: this.DAYS_AFTER_EXPIRY,
    };
  }
}

module.exports = new TokenCleanupScheduler();
