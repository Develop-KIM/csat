const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`백엔드 실행 포트 ${PORT}`);
});