require('dotenv').config()

const PORT = process.env.PORT || 3000
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY || null
const SESSION_KEY = process.env.SESSION_KEY || null
const { DB_NAME, DB_USERNAME, DB_PWD, DB_HOST, DB_PORT } = process.env

module.exports = { PORT, SEND_GRID_API_KEY, SESSION_KEY, DB_NAME, DB_USERNAME, DB_PWD, DB_HOST, DB_PORT }