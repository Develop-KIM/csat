const app = require('./app');
const { initDB } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT;

async function startServer() {
  try {
    await initDB();

    app.listen(PORT, () => {
      console.log(`백엔드 실행 포트 ${PORT}`);
      console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
      console.log(`시작 시간: ${new Date().toLocaleString()}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();