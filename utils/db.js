const { Sequelize } = require('sequelize');
const config = require('../utils/config')
// Set up Postgresql connection to AWS
const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PWD, {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    logging: false
})

module.exports = { sequelize }