const cron = require('node-cron');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const kiwoomService = require('../services/kiwoomService');
const EventEmitter = require('events');

class TokenRefreshScheduler extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.scheduler = null;
    this.REFRESH_BUFFER_MINUTES = 30;
  }

  async refreshToken() {
    if (this.isRunning) {
      console.log('[TokenRefresh] 이미 실행 중, 스킵');
      return;
    }

    this.isRunning = true;
    this.emit('statusChanged', this.getStatus()); // 상태 변경 이벤트

    const startTime = new Date();

    try {
      console.log(
        `\n[TokenRefresh] 체크 시작: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      );

      const currentToken = await kiwoomTokenRepository.findValidToken(0);

      if (currentToken) {
        const expiresDt = new Date(currentToken.expires_dt);
        const now = new Date();
        const minutesUntilExpiry = (expiresDt - now) / (1000 * 60);

        if (minutesUntilExpiry > this.REFRESH_BUFFER_MINUTES) {
          return;
        }

        try {
          await kiwoomService.revokeToken(currentToken.access_token);
        } catch (revokeError) {
          console.warn(
            '[TokenRefresh] 기존 토큰 폐기 실패 (치명적 아님):',
            revokeError.message,
          );
        }
      }

      const newToken = await kiwoomService.ensureValidToken();
    } catch (error) {
      console.error('[TokenRefresh] 토큰 갱신 실패');
      console.error(`[TokenRefresh] 에러: ${error.message}`);
      if (error.response) {
        console.error(`[TokenRefresh] API 응답:`, error.response.data);
      }
    } finally {
      const duration = ((new Date() - startTime) / 1000).toFixed(2);
      const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      console.log(
        `[TokenRefresh] 종료 시간: ${endTime} (소요: ${duration}초)\n`,
      );
      this.isRunning = false;
      this.emit('statusChanged', this.getStatus()); // 상태 변경 이벤트
    }
  }

  start() {
    if (this.scheduler) {
      return;
    }

    this.scheduler = cron.schedule('0 8 * * 1-5', async () => {
      await this.refreshToken();
    });

    this.emit('statusChanged', this.getStatus());

    setTimeout(() => {
      this.refreshToken();
    }, 5000);
  }

  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
      console.log('[TokenRefresh] 스케줄러 중지');
      this.emit('statusChanged', this.getStatus());
    }
  }

  getStatus() {
    return {
      isRunning: this.scheduler !== null,
      isRefreshing: this.isRunning,
      bufferMinutes: this.REFRESH_BUFFER_MINUTES,
    };
  }
}

module.exports = new TokenRefreshScheduler();
