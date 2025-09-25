const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`백엔드 실행 포트 ${PORT}`);
	console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
	console.log(`시작 시간: ${new Date().toLocaleString()}`);
});
