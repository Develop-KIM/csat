const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { swaggerUi, swaggerDocument } = require('./swagger/swagger');
require('dotenv').config();

global.asyncHandling = require('express-async-handler');
global.dayjs = require('dayjs');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use('/api', require('./routes'));

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || '서버 오류가 발생했습니다.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
