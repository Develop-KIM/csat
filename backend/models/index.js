const { Sequelize } = require('sequelize')
const { Pool } = require('pg')
const dbConfig = require('../config/database')
require('dotenv').config()

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: false
  }
)

// 추후 시계열 연결이 필요할 경우를 대비해 pg Pool도 설정
const pool = new Pool(dbConfig)

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
  initDB
}