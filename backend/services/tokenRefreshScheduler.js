const cron = require('node-cron');
const kiwoomTokenRepository = require('../repositories/kiwoomTokenRepository');
const kiwoomService = require('./kiwoomService');

class TokenRefreshScheduler {
  constructor() {
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
    const startTime = new Date();

    try {
      console.log(
        `\n[TokenRefresh] 체크 시작: ${startTime.toLocaleString('ko-KR')}`,
      );

      const currentToken = await kiwoomTokenRepository.findValidToken(0);

      if (currentToken) {
        const expiresDt = new Date(currentToken.expires_dt);
        const now = new Date();
        const minutesUntilExpiry = (expiresDt - now) / (1000 * 60);

        console.log(`[TokenRefresh] 현재 토큰 상태:`);
        console.log(
          `[TokenRefresh]   - 만료까지 남은 시간: ${minutesUntilExpiry.toFixed(0)}분`,
        );
        console.log(
          `[TokenRefresh]   - 만료 시각: ${expiresDt.toLocaleString('ko-KR')}`,
        );

        if (minutesUntilExpiry > this.REFRESH_BUFFER_MINUTES) {
          return;
        }

        console.log(
          `[TokenRefresh] 토큰 갱신 필요 (만료까지 ${this.REFRESH_BUFFER_MINUTES}분 미만)`,
        );
      }

      if (currentToken) {
        console.log('[TokenRefresh] 기존 토큰 폐기 시도');
        try {
          await kiwoomService.revokeToken(currentToken.access_token);
          console.log('[TokenRefresh] 기존 토큰 폐기 완료');
        } catch (revokeError) {
          console.warn(
            '[TokenRefresh] 기존 토큰 폐기 실패 (치명적 아님):',
            revokeError.message,
          );
        }
      }

      const newToken = await kiwoomService.getToken();

      const duration = ((new Date() - startTime) / 1000).toFixed(2);
      console.log(`[TokenRefresh] 토큰 갱신 완료 (소요시간: ${duration}초)\n`);
    } catch (error) {
      console.error('[TokenRefresh] 토큰 갱신 실패');
      console.error(`[TokenRefresh] 에러: ${error.message}`);

      if (error.response) {
        console.error(`[TokenRefresh] API 응답:`, error.response.data);
      }
    } finally {
      this.isRunning = false;
    }
  }

  start() {
    if (this.scheduler) {
      console.log('[TokenRefresh] 스케줄러 이미 실행 중');
      return;
    }

    this.scheduler = cron.schedule('0 8 * * 1-5', async () => {
      await this.refreshToken();
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('토큰 자동 갱신 스케줄러 시작');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('스케줄: 평일 오전 08:00 (월~금)');
    console.log('목표: 장 시작 전 토큰 준비 (09:00)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    setTimeout(() => {
      console.log('[TokenRefresh] 초기 토큰 체크');
      this.refreshToken();
    }, 5000);
  }

  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
      console.log('[TokenRefresh] 스케줄러 중지');
    }
  }

  async triggerManualRefresh() {
    console.log('[TokenRefresh] 수동 갱신 트리거');
    await this.refreshToken();
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
