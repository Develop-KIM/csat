const { Sequelize } = require('sequelize')
const { Pool } = require('pg')

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
    logging: false
  }
)

const pool = new Pool(dbConfig)

const KiwoomToken = require('./KiwoomToken')(sequelize);

async function initDB() {
  try {
    await sequelize.authenticate()
    console.log('DB 연결 성공')

    await sequelize.sync({ alter: true })
    console.log('테이블 동기화')
  } catch (error) {
    console.error('DB 연결 실패:', error)
    throw error
  }
}

module.exports = {
  sequelize,
  pool,
  initDB,
  KiwoomToken,
}