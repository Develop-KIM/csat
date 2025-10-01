const { Sequelize } = require('sequelize')
const { Pool } = require('pg')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
)

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

async function initDB() {
  try {
    await sequelize.authenticate()
    console.log('DB 연결 성공')

    await sequelize.sync({ alter: true })
    console.log('테이블 동기화')
  } catch (error) {
    console.error('DB 연결 실패:', error)
  }
}

module.exports = {
  sequelize,
  pool,
  initDB
}