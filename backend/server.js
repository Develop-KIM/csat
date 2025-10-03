const app = require('./app');
const { initDB } = require('./models');
const tokenRefreshScheduler = require('./services/tokenRefreshScheduler');
require('dotenv/config');
const PORT = process.env.PORT;

async function startServer() {
  try {
    await initDB();

    tokenRefreshScheduler.start();

    const server = app.listen(PORT, () => {
      console.log(`백엔드 실행 포트 ${PORT}`);
      console.log(`환경: ${process.env.NODE_ENV}`);
      console.log(`시작 시간: ${new Date().toLocaleString()}`);
      console.log(`API 문서: http://localhost:${PORT}/api/docs`);
    });

    const shutdown = (signal) => {
      console.log(`\n ${signal} 수신, 서버 종료 중`);
      tokenRefreshScheduler.stop();
      server.close(() => {
        console.log('서버 종료 완료');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();
