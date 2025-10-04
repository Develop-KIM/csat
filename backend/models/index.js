const { Sequelize } = require('sequelize');
const { Pool } = require('pg');

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../config/database')[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: false,
  },
);

const pool = new Pool(dbConfig);

const KiwoomToken = require('./KiwoomToken')(sequelize);

async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('DB 연결 실패:', error);
    throw error;
  }
}

async function closeDB() {
  try {
    await sequelize.close();
    await pool.end();
  } catch (error) {
    console.error('DB 연결 종료 실패:', error);
  }
}

module.exports = {
  sequelize,
  pool,
  initDB,
  closeDB,
  KiwoomToken,
};
