const axios = require('axios');

class DiscordNotification {
  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  }

  async send(message, color = 0x00ff00) {
    if (!this.webhookUrl) {
      throw new Error('Discord 웹훅 URL이 설정되지 않음');
    }

    try {
      await axios.post(this.webhookUrl, {
        embeds: [
          {
            title: message.title,
            description: message.description,
            color: color,
            timestamp: new Date().toISOString(),
            fields: message.fields || [],
          },
        ],
      });
    } catch (error) {
      console.error(
        `[Discord] 알림 전송 실패 (title: ${message.title || 'N/A'}, description: ${message.description || 'N/A'}):`,
        error.message,
      );
    }
  }

  async notifySchedulerStart(schedulerName) {
    await this.send(
      {
        title: '스케줄러 시작',
        description: `${schedulerName}이(가) 시작되었습니다.`,
      },
      0x3498db,
    );
  }

  async notifySchedulerComplete(schedulerName, duration) {
    await this.send(
      {
        title: '스케줄러 완료',
        description: `${schedulerName}이(가) 완료되었습니다.`,
        fields: [
          {
            name: '소요 시간',
            value: `${duration}초`,
            inline: true,
          },
        ],
      },
      0x2ecc71,
    );
  }

  async notifySchedulerError(schedulerName, error) {
    await this.send(
      {
        title: '스케줄러 오류',
        description: `${schedulerName}에서 오류가 발생했습니다.`,
        fields: [
          {
            name: '에러 메시지',
            value: error.message || '알 수 없는 오류',
            inline: false,
          },
        ],
      },
      0xe74c3c,
    );
  }
}

module.exports = new DiscordNotification();
